// @tauri-apps/plugin-updater — web-safe shim (native ops route via host.invoke).
import { invoke, isNative } from './runtime';
export async function unsupported(op: string): Promise<never> { throw new Error(`[host] updater.${op} unavailable on web`); }
export { invoke, isNative };
export type Update = { available: boolean; version?: string } | null;
export async function check(): Promise<Update> { return null; }
