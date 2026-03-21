import { startTransition as reactStartTransition } from 'react'

export const startTransition = (callback: React.TransitionFunction): void => {
  if (process.env.HANZO_GUI_TARGET !== 'web') {
    // Pass-through function
    callback()
  } else {
    // Proxy to react.startTransition
    reactStartTransition(callback)
  }
}
