export function submitApplication(application) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (!application) reject(new Error('We could not submit your application. Please try again.'))
      else resolve({ success: true, applicationId: `APP-${Date.now()}` })
    }, 1200)
  })
}