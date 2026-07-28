import { invoke, isNative } from './runtime';

// @tauri-apps/plugin-log — web/desktop-safe shim. Logging is diagnostics, never
// a feature, so it must NEVER throw. Under Tauri (desktop) route to the real log
// plugin whether or not an explicit host adapter was injected; otherwise fall
// back to the injected host; otherwise console (plain web / SSR).
const LEVELS: Record<string, number> = {
  trace: 1, debug: 2, info: 3, warn: 4, error: 5,
};

type Internals = {
  invoke?: (cmd: string, args?: unknown) => Promise<unknown>;
  __isBrowserShim?: boolean;
};
const tauriInvoke = (): Internals['invoke'] | undefined => {
  if (typeof window === 'undefined') return undefined;
  const internals = (window as unknown as { __TAURI_INTERNALS__?: Internals })
    .__TAURI_INTERNALS__;
  // Ignore the browser fallback bridge — logging routes to console below.
  if (!internals || internals.__isBrowserShim) return undefined;
  return internals.invoke;
};

const consoleFor = (level: string): ((m: string) => void) =>
  (console as unknown as Record<string, (m: string) => void>)[
    level === 'warn' ? 'warn' : level === 'error' ? 'error' : 'log'
  ] ?? console.log;

const lg = (level: string) => async (message: string): Promise<void> => {
  const direct = tauriInvoke();
  if (direct) {
    try {
      await direct('plugin:log|log', { level: LEVELS[level] ?? 3, message });
      return;
    } catch {
      /* fall through to host/console */
    }
  }
  if (isNative()) {
    try {
      await invoke('plugin:log|log', { level: LEVELS[level] ?? 3, message });
      return;
    } catch {
      /* fall through to console */
    }
  }
  consoleFor(level)(`[hanzo] ${message}`);
};

export const trace = lg('trace');
export const debug = lg('debug');
export const info = lg('info');
export const warn = lg('warn');
export const error = lg('error');
