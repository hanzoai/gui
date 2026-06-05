// @tauri-apps/plugin-notification — web-safe shim. Uses the browser Notification
// API when present, else no-ops. Native ops route via host.invoke. Exposes the
// names the app imports (isPermissionGranted/requestPermission/sendNotification).
import { invoke, isNative } from './runtime';

export async function isPermissionGranted(): Promise<boolean> {
  if (isNative()) return (await invoke<boolean>('plugin:notification|is_permission_granted')) ?? false;
  return typeof Notification !== 'undefined' && Notification.permission === 'granted';
}

export async function requestPermission(): Promise<'granted' | 'denied' | 'default'> {
  if (isNative()) {
    return (await invoke<'granted' | 'denied' | 'default'>('plugin:notification|request_permission')) ?? 'denied';
  }
  if (typeof Notification === 'undefined') return 'denied';
  try { return await Notification.requestPermission(); } catch { return 'denied'; }
}

export function sendNotification(options: string | { title: string; body?: string }): void {
  const opts = typeof options === 'string' ? { title: options } : options;
  if (isNative()) { void invoke('plugin:notification|notify', { options: opts }); return; }
  try {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(opts.title, { body: opts.body });
    }
  } catch { /* noop */ }
}

export async function unsupported(op: string): Promise<never> {
  throw new Error(`[host] notification.${op} unavailable on web`);
}
export { invoke, isNative };
