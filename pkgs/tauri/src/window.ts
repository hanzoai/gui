import { useEffect, useState } from 'react'
import { isTauri } from './isTauri'

// Window controls for a frameless Tauri window (`decorations: false`). Each call
// dynamically imports the Tauri API so a web bundle never hard-links it, and
// no-ops off-Tauri. This is the native bridge that lets a hanzogui titlebar
// drive the real OS window.

async function currentWindow() {
  if (!isTauri()) return null
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  return getCurrentWindow()
}

export const windowControls = {
  minimize: async () => (await currentWindow())?.minimize(),
  toggleMaximize: async () => (await currentWindow())?.toggleMaximize(),
  close: async () => (await currentWindow())?.close(),
  hide: async () => (await currentWindow())?.hide(),
  startDragging: async () => (await currentWindow())?.startDragging(),
  isMaximized: async () => (await currentWindow())?.isMaximized() ?? false,
  setFullscreen: async (v: boolean) => (await currentWindow())?.setFullscreen(v),
}

/**
 * React hook exposing the window controls plus live maximized state. Bind these
 * to a hanzogui titlebar — see {@link TitleBar}.
 */
export function useWindowControls() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    if (!isTauri()) return
    let unlisten: (() => void) | undefined
    let active = true
    ;(async () => {
      const win = await currentWindow()
      if (!win || !active) return
      setIsMaximized(await win.isMaximized())
      unlisten = await win.onResized(async () => {
        setIsMaximized(await win.isMaximized())
      })
    })()
    return () => {
      active = false
      unlisten?.()
    }
  }, [])

  return { ...windowControls, isMaximized }
}
