import { isTauri } from './isTauri'

// Thin fs + shell bridge. Each guards on isTauri() and dynamically imports the
// Tauri plugin, so the web build stays clean. Off-Tauri, reads/opens reject or
// fall back to the browser (openExternal uses window.open).

export async function readTextFile(path: string): Promise<string> {
  if (!isTauri()) throw new Error('readTextFile is only available under Tauri')
  const { readTextFile } = await import('@tauri-apps/plugin-fs')
  return readTextFile(path)
}

export async function writeTextFile(path: string, contents: string): Promise<void> {
  if (!isTauri()) throw new Error('writeTextFile is only available under Tauri')
  const { writeTextFile } = await import('@tauri-apps/plugin-fs')
  return writeTextFile(path, contents)
}

/** Open a URL in the user's default browser (Tauri) or a new tab (web). */
export async function openExternal(url: string): Promise<void> {
  if (!isTauri()) {
    if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener')
    return
  }
  const { open } = await import('@tauri-apps/plugin-shell')
  await open(url)
}
