// The injectable host runtime. <HanzoAI host={tauriHost}/> registers the
// native adapter; on plain web it stays the web default so the SAME app
// surface runs on hanzo.chat / hanzo.app / mobile / desktop. (decomplect:
// platform is an orthogonal, injected axis — not 48 hard @tauri-apps imports.)
import type { HostAdapter } from '../types';
let H: HostAdapter = { platform: 'web' };
export function setHost(h?: HostAdapter): void { if (h) H = { platform: 'web', ...h }; }
export function getHost(): HostAdapter { return H; }
export const platformName = (): 'tauri' | 'web' | 'expo' => H.platform ?? 'web';
export const isNative = (): boolean => platformName() !== 'web';
export async function invoke<T = unknown>(cmd: string, args?: unknown): Promise<T> {
  if (H.invoke) return H.invoke(cmd, args) as Promise<T>;
  if (import.meta?.env?.DEV) console.warn(`[host] invoke('${cmd}') ignored on web`);
  return undefined as unknown as T;
}
export type UnlistenFn = () => void;
export async function listen<T = unknown>(event: string, cb: (e: { payload: T }) => void): Promise<UnlistenFn> {
  if (H.listen) return (await H.listen(event, (e) => cb(e as { payload: T }))) as UnlistenFn;
  return () => {};
}
export async function emit(event: string, payload?: unknown): Promise<void> {
  if (H.invoke) { try { await H.invoke('plugin:event|emit', { event, payload }); } catch { /* noop */ } }
}
