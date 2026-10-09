import { createServer } from 'node:http'
import { Buffer } from 'node:buffer'
import { once } from 'node:events'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import { randomUUID } from 'node:crypto'
import process from 'node:process'

const defaultDatabasePath = fileURLToPath(new URL('./data/applications.sqlite', import.meta.url))
const databasePath = process.env.DATABASE_PATH
  ? resolve(process.env.DATABASE_PATH)
  : defaultDatabasePath
const maxRequestSize = 10 * 1024 * 1024

class RequestError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}

function isApplication(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && ['personal', 'contact', 'address'].every(
      (section) => value[section] !== null
        && typeof value[section] === 'object'
        && !Array.isArray(value[section]),
    )
    && ['education', 'experience'].every(
      (section) => Array.isArray(value[section])
        && value[section].every((record) => record !== null && typeof record === 'object' && !Array.isArray(record)),
    )
}

async function readJsonBody(request) {
  const chunks = []
  let size = 0

  for await (const chunk of request) {
    size += chunk.length
    if (size > maxRequestSize) {
      throw new RequestError(413, 'Application data is too large.')
    }
    chunks.push(chunk)
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new RequestError(400, 'Request body must contain valid JSON.')
  }
}

function respond(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(payload))
}

export function createApplicationHandler() {
  mkdirSync(dirname(databasePath), { recursive: true })

  const database = new DatabaseSync(databasePath)
  database.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      submitted_at TEXT NOT NULL,
      data_json TEXT NOT NULL
    )
  `)

  const insertApplication = database.prepare(
    'INSERT INTO applications (id, submitted_at, data_json) VALUES (?, ?, ?)',
  )

  const handler = async (request, response) => {
    if (request.method !== 'POST' || request.url?.split('?')[0] !== '/api/applications') {
      respond(response, 404, { error: 'Not found.' })
      return
    }

    try {
      const application = await readJsonBody(request)
      if (!isApplication(application)) {
        throw new RequestError(400, 'Application data is incomplete or invalid.')
      }

      const applicationId = `APP-${randomUUID()}`
      const submittedAt = new Date().toISOString()
      insertApplication.run(applicationId, submittedAt, JSON.stringify(application))

      respond(response, 201, { success: true, applicationId, submittedAt })
    } catch (error) {
      if (error instanceof RequestError) {
        respond(response, error.statusCode, { error: error.message })
        return
      }

      console.error('Unable to save application to SQLite.', error)
      respond(response, 500, { error: 'Unable to save your application. Please try again.' })
    }
  }

  handler.close = () => database.close()
  return handler
}

export async function startApplicationServer(port = Number(process.env.API_PORT || process.env.PORT || 3001)) {
  const handler = createApplicationHandler()
  const server = createServer(handler)
  server.on('error', (error) => {
    console.error('Application API server failed.', error)
  })
  server.on('close', handler.close)

  try {
    server.listen(port, '127.0.0.1')
    await once(server, 'listening')
  } catch (error) {
    handler.close()
    throw error
  }

  console.log(`Application API listening on http://127.0.0.1:${port}`)
  return server
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startApplicationServer().catch((error) => {
    console.error('Application API server failed to start.', error)
    process.exitCode = 1
  })
}
