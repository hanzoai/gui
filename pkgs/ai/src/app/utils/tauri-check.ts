import { invoke } from '@tauri-apps/api/core';
import type { Event, EventCallback, UnlistenFn } from '@tauri-apps/api/event';
import { emit, listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';

export const isTauriAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  const w = window as unknown as {
    __TAURI__?: unknown;
    __TAURI_INTERNALS__?: { __isBrowserShim?: boolean };
  };
  // The browser fallback bridge (host/browser-shim) is NOT real Tauri.
  if (w.__TAURI_INTERNALS__?.__isBrowserShim) return false;
  return Boolean(w.__TAURI__ ?? w.__TAURI_INTERNALS__);
};

// The current window's label under Tauri, or a stable 'main' fallback on plain
// web. Reading getCurrentWindow() eagerly on web throws (it dereferences
// window.__TAURI_INTERNALS__.metadata), so gate it.
export const currentWindowLabel = (): string =>
  isTauriAvailable() ? getCurrentWindow().label : 'main';

export const safeInvoke = async <T>(
  cmd: string,
  args?: Record<string, unknown>,
): Promise<T | null> => {
  if (!isTauriAvailable()) return null;
  try {
    return await invoke<T>(cmd, args);
  } catch (error) {
    console.warn(`[tauri] invoke "${cmd}" failed:`, error);
    return null;
  }
};

export const safeListen = async <T>(
  event: string,
  handler: (event: Event<T>) => void,
): Promise<UnlistenFn | null> => {
  if (!isTauriAvailable()) return null;
  try {
    return await listen<T>(event, handler as EventCallback<T>);
  } catch (error) {
    console.warn(`[tauri] listen "${event}" failed:`, error);
    return null;
  }
};

export const safeEmit = async (
  event: string,
  payload?: unknown,
): Promise<void> => {
  if (!isTauriAvailable()) return;
  try {
    await emit(event, payload);
  } catch (error) {
    console.warn(`[tauri] emit "${event}" failed:`, error);
  }
};
