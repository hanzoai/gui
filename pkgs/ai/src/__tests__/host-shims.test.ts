// Regression: "getCurrentWindow(...).emit is not a function" crashed the mount
// after the chain fix. The web host shims must expose the full surface the app
// touches, as no-op-safe defaults.
import { describe, it, expect } from 'vitest';
import { getCurrentWindow, getAllWindows } from '../host/window';
import { isNative, platformName, invoke, listen, emit, setHost } from '../host/runtime';
import * as notification from '../host/notification';

describe('host window shim (web-safe)', () => {
  it('getCurrentWindow() exposes emit/listen/once + lifecycle as functions', () => {
    const w = getCurrentWindow();
    expect(w.label).toBe('main');
    for (const m of ['emit', 'listen', 'once', 'onCloseRequested', 'onResized', 'setTitle', 'close', 'show'] as const) {
      expect(typeof (w as Record<string, unknown>)[m]).toBe('function');
    }
    expect(getAllWindows().length).toBeGreaterThan(0);
  });

  it('emit resolves and listen returns an unlisten function (no-op on web)', async () => {
    const w = getCurrentWindow();
    await expect(w.emit('evt', { a: 1 })).resolves.toBeUndefined();
    const unlisten = await w.listen('evt', () => {});
    expect(typeof unlisten).toBe('function');
    expect(() => unlisten()).not.toThrow();
  });
});

describe('host runtime (injected platform adapter)', () => {
  it('defaults to web; invoke returns null (not undefined → react-query error)', async () => {
    expect(platformName()).toBe('web');
    expect(isNative()).toBe(false);
    // null, NOT undefined — React Query rejects undefined query results.
    await expect(invoke('any_cmd')).resolves.toBeNull();
    const un = await listen('e', () => {});
    expect(typeof un).toBe('function');
    await expect(emit('e', {})).resolves.toBeUndefined();
  });

  it('setHost switches to an injected native adapter (tauri/expo)', async () => {
    const calls: string[] = [];
    setHost({ platform: 'tauri', invoke: async (c: string) => { calls.push(c); return 'ok'; } });
    expect(platformName()).toBe('tauri');
    expect(isNative()).toBe(true);
    await expect(invoke('greet')).resolves.toBe('ok');
    expect(calls).toEqual(['greet']);
    setHost({ platform: 'web' }); // reset for other tests
  });
});

describe('host notification shim (web-safe)', () => {
  it('exposes isPermissionGranted/requestPermission/sendNotification', () => {
    // Regression: "isPermissionGranted is not a function" — the shim was a stub.
    expect(typeof notification.isPermissionGranted).toBe('function');
    expect(typeof notification.requestPermission).toBe('function');
    expect(typeof notification.sendNotification).toBe('function');
  });

  it('isPermissionGranted resolves a boolean; sendNotification never throws', async () => {
    await expect(notification.isPermissionGranted()).resolves.toEqual(expect.any(Boolean));
    expect(() => notification.sendNotification('hi')).not.toThrow();
    expect(() => notification.sendNotification({ title: 'a', body: 'b' })).not.toThrow();
  });
});
