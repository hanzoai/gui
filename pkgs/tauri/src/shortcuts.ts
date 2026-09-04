import { useEffect } from 'react'
import { isTauri } from './isTauri.ts'

// Global (OS-wide) shortcuts via @tauri-apps/plugin-global-shortcut. Off-Tauri
// these no-op, so a component can register e.g. ⌘K to summon a CommandPalette
// and the same code degrades to an in-page key handler on the web.

export async function registerShortcut(
  accelerator: string,
  handler: () => void
): Promise<void> {
  if (!isTauri()) return
  const { register } = await import('@tauri-apps/plugin-global-shortcut')
  await register(accelerator, (event) => {
    if (event.state === 'Pressed') handler()
  })
}

export async function unregisterShortcut(accelerator: string): Promise<void> {
  if (!isTauri()) return
  const { unregister } = await import('@tauri-apps/plugin-global-shortcut')
  await unregister(accelerator)
}

/** Register `accelerator` for the lifetime of the component. */
export function useGlobalShortcut(accelerator: string, handler: () => void) {
  useEffect(() => {
    if (!isTauri()) return
    let cancelled = false
    registerShortcut(accelerator, handler).catch(() => {})
    return () => {
      cancelled = true
      void cancelled
      unregisterShortcut(accelerator).catch(() => {})
    }
  }, [accelerator, handler])
}
