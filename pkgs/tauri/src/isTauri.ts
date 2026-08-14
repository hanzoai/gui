/**
 * True when running inside a Tauri webview. Tauri v2 injects
 * `window.__TAURI_INTERNALS__` (and `window.isTauri`) into the page. Every
 * bridge call guards on this so the same hanzogui component runs unchanged on
 * the web — off-Tauri the native calls are no-ops.
 */
export function isTauri(): boolean {
  return (
    typeof window !== 'undefined' &&
    (!!(window as any).__TAURI_INTERNALS__ || (window as any).isTauri === true)
  )
}
