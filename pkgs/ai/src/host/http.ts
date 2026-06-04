// @tauri-apps/plugin-http — web-safe shim (native ops route via host.invoke).
import { invoke, isNative } from './runtime';
export async function unsupported(op: string): Promise<never> { throw new Error(`[host] http.${op} unavailable on web`); }
export { invoke, isNative };
export const tauriFetch = (...a: Parameters<typeof fetch>) => fetch(...a);
export { tauriFetch as fetch };
