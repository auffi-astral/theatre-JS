import studio from '@theatre/studio'
import { getProject } from '@theatre/core'

export default defineNuxtPlugin(() => {
  try {
    // Only initialize on client-side
    if (process.client) {
      // Always initialize studio and show UI
      studio.initialize()

      // Create and return the project
      const project = getProject('My Theatre Project')

      return {
        provide: {
          theatreProject: project
        }
      }
    }
  } catch (error) {
    console.warn('Theatre.js initialization skipped:', error)
  }

  // Return null project if initialization fails or during SSR
  return {
    provide: {
      theatreProject: null
    }
  }
})