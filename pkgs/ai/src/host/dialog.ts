// @tauri-apps/plugin-dialog — web-safe shim (native ops route via host.invoke).
import { invoke, isNative } from './runtime';
export async function unsupported(op: string): Promise<never> { throw new Error(`[host] dialog.${op} unavailable on web`); }
export { invoke, isNative };
export async function save(_o?: unknown): Promise<string | null> { return null; }
export async function open(_o?: unknown): Promise<string | null> { return null; }
