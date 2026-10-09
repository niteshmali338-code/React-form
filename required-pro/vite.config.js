import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createApplicationHandler } from './server.js'

const applicationApi = {
  name: 'application-api',
  configureServer(viteServer) {
    const apiHandler = createApplicationHandler()
    viteServer.middlewares.use((request, response, next) => {
      if (request.url?.split('?')[0] !== '/api/applications') {
        next()
        return
      }

      apiHandler(request, response)
    })
    viteServer.httpServer?.once('close', apiHandler.close)
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), applicationApi],
})
