// @tauri-apps/plugin-fs — web-safe shim. Native ops route via host.invoke;
// on web they no-op / return empty. Exports the names the app imports.
import { invoke, isNative } from './runtime';

export const BaseDirectory = {
  AppConfig: 1, AppData: 2, AppLocalData: 3, AppCache: 4, AppLog: 5,
  Audio: 6, Cache: 7, Config: 8, Data: 9, LocalData: 10, Document: 11,
  Download: 12, Picture: 13, Public: 14, Video: 15, Resource: 16,
  Temp: 17, Home: 18, Desktop: 19, Executable: 20, Font: 21, Runtime: 22,
} as const;
export type BaseDirectory = (typeof BaseDirectory)[keyof typeof BaseDirectory];

const fsInvoke = async <T>(cmd: string, args?: unknown): Promise<T> =>
  isNative() ? invoke<T>(`plugin:fs|${cmd}`, args) : (undefined as unknown as T);

export async function writeFile(path: string, data: Uint8Array, options?: unknown) { return fsInvoke('write_file', { path, data: Array.from(data), options }); }
export async function writeTextFile(path: string, data: string, options?: unknown) { return fsInvoke('write_text_file', { path, data, options }); }
export async function readFile(path: string, options?: unknown): Promise<Uint8Array> { const r = await fsInvoke<number[]>('read_file', { path, options }); return r ? new Uint8Array(r) : new Uint8Array(); }
export async function readTextFile(path: string, options?: unknown): Promise<string> { return (await fsInvoke<string>('read_text_file', { path, options })) ?? ''; }
export async function exists(path: string, options?: unknown): Promise<boolean> { return (await fsInvoke<boolean>('exists', { path, options })) ?? false; }
export async function mkdir(path: string, options?: unknown) { return fsInvoke('mkdir', { path, options }); }
export async function remove(path: string, options?: unknown) { return fsInvoke('remove', { path, options }); }
export async function readDir(path: string, options?: unknown): Promise<unknown[]> { return (await fsInvoke<unknown[]>('read_dir', { path, options })) ?? []; }
export async function copyFile(fromPath: string, toPath: string, options?: unknown) { return fsInvoke('copy_file', { fromPath, toPath, options }); }
export { invoke, isNative };
