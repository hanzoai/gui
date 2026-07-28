// @hanzo/app/desktop links the REAL @tauri-apps (the desktop build externalizes
// it), so when this bundle is loaded in a PLAIN BROWSER (Playwright e2e, web
// preview) every @tauri-apps call throws: getCurrentWindow() dereferences
// window.__TAURI_INTERNALS__.metadata, listen() reads .transformCallback and
// invoke() reads .invoke — all undefined without a Tauri host.
//
// Install a minimal no-op Tauri bridge so the shared app degrades gracefully
// instead of blanking the render. Installed ONLY when the real bridge is absent,
// so the shipped Tauri desktop app is byte-for-byte untouched (Tauri injects
// __TAURI_INTERNALS__ before any app script runs). The bridge is flagged
// __isBrowserShim so isTauriAvailable() stays honest (returns false) and every
// native-only feature renders its web fallback rather than pretending to work.
type AnyArgs = Record<string, unknown> | undefined;

export function installBrowserTauriShim(): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { __TAURI_INTERNALS__?: unknown };
  if (w.__TAURI_INTERNALS__) return; // real Tauri (or already shimmed) — leave it

  let nextCallbackId = 1;

  w.__TAURI_INTERNALS__ = {
    __isBrowserShim: true,
    // getCurrentWindow() reads metadata.currentWindow.label.
    metadata: {
      currentWindow: { label: 'main' },
      currentWebview: { windowLabel: 'main', label: 'main' },
    },
    // event.listen() registers its handler here and expects a numeric id.
    transformCallback(_cb: unknown, _once = false): number {
      return nextCallbackId++;
    },
    // No native host on web: never throw. Resolve to null so callers read
    // "feature unavailable" and render web fallbacks (React Query also rejects
    // an undefined result, so null is deliberate). Surface diagnostic logs.
    async invoke(cmd: string, args?: AnyArgs): Promise<null> {
      if (cmd === 'plugin:log|log' && args && typeof args === 'object') {
        const message = (args as { message?: unknown }).message;
        if (typeof message === 'string') console.log(`[hanzo] ${message}`);
      }
      return null;
    },
    convertFileSrc(src: string): string {
      return src;
    },
  };
}
