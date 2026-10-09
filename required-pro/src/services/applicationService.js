const STORAGE_KEY = 'northstar-application-draft'

function safeJsonParse(value) {
  try {
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export async function saveDraft(application) {
  if (!application) {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    data: {
      ...application,
      personal: {
        ...application.personal,
        profilePhoto: application.personal?.profilePhoto || '',
      },
    },
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return payload
  } catch {
    throw new Error('Unable to save your draft on this device.')
  }
}

export async function getDraft() {
  const rawDraft = safeJsonParse(window.localStorage.getItem(STORAGE_KEY))
  return rawDraft && rawDraft.data ? rawDraft : null
}

export async function clearDraft() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

export async function submitApplication(application) {
  if (!application) throw new Error('We could not submit your application. Please try again.')

  let response
  try {
    response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application),
    })
  } catch {
    throw new Error('Unable to submit your application. Please check that the application server is running and try again.')
  }

  let result
  try {
    result = await response.json()
  } catch {
    throw new Error('The application server returned an invalid response. Please try again.')
  }

  if (!response.ok) {
    throw new Error(result.error || 'We could not submit your application. Please try again.')
  }

  await clearDraft()
  return result
}