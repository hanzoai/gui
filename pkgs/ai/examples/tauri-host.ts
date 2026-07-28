// Desktop (Tauri) host adapter. The ONLY place the desktop shim touches
// @tauri-apps — everything else in @hanzo/app goes through this injected host.
import { invoke as tauriInvoke } from '@tauri-apps/api/core';
import { listen as tauriListen } from '@tauri-apps/api/event';
import type { HostAdapter } from '@hanzo/app';
export const tauriHost: HostAdapter = {
  platform: 'tauri',
  invoke: (cmd, args) => tauriInvoke(cmd, args as Record<string, unknown>),
  listen: async (event, cb) => tauriListen(event, (e) => cb(e)),
};
