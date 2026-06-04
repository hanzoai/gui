// @tauri-apps/plugin-notification — web-safe shim (native ops route via host.invoke).
import { invoke, isNative } from './runtime';
export async function unsupported(op: string): Promise<never> { throw new Error(`[host] notification.${op} unavailable on web`); }
export { invoke, isNative };
