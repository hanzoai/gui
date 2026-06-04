// @tauri-apps/plugin-shell — web-safe shim (native ops route via host.invoke).
import { invoke, isNative } from './runtime';
export async function unsupported(op: string): Promise<never> { throw new Error(`[host] shell.${op} unavailable on web`); }
export { invoke, isNative };
export async function open(url: string): Promise<void> { if (typeof window !== 'undefined') window.open(url, '_blank'); }
