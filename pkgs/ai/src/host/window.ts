// @tauri-apps/api/window — web-safe shim. getCurrentWindow() returns a
// Window-like object whose methods are async no-ops on web and route through
// the injected host (emit/listen) when running under Tauri. Covers the full
// surface the app touches so a missing method never crashes the render.
import { listen as hostListen, emit as hostEmit, type UnlistenFn } from './runtime';

const unlisten = async (): Promise<UnlistenFn> => () => {};

function makeWindow(label = 'main') {
  return {
    label,
    // identity / geometry — async no-ops returning sensible defaults
    async scaleFactor() { return 1; },
    async innerPosition() { return { x: 0, y: 0 }; },
    async outerPosition() { return { x: 0, y: 0 }; },
    async innerSize() { return { width: 0, height: 0 }; },
    async outerSize() { return { width: 0, height: 0 }; },
    async isFullscreen() { return false; },
    async isMinimized() { return false; },
    async isMaximized() { return false; },
    async isFocused() { return true; },
    async isVisible() { return true; },
    async isDecorated() { return true; },
    async isResizable() { return true; },
    async theme() { return 'dark' as const; },
    async title() { return label; },
    // mutations
    async center() {}, async requestUserAttention() {},
    async setResizable() {}, async setTitle() {}, async setDecorations() {},
    async setShadow() {}, async setAlwaysOnTop() {}, async setContentProtected() {},
    async setSize() {}, async setMinSize() {}, async setMaxSize() {},
    async setPosition() {}, async setFullscreen() {}, async setFocus() {},
    async setIcon() {}, async setSkipTaskbar() {}, async setCursorGrab() {},
    async setCursorVisible() {}, async setCursorIcon() {}, async setCursorPosition() {},
    async setIgnoreCursorEvents() {}, async startDragging() {}, async startResizeDragging() {},
    async maximize() {}, async unmaximize() {}, async toggleMaximize() {},
    async minimize() {}, async unminimize() {},
    async show() {}, async hide() {}, async close() {}, async destroy() {},
    async setFocusable() {}, async setEnabled() {}, async setVisibleOnAllWorkspaces() {},
    // events — subscriptions return an unlisten fn; emit routes through host
    listen: <T = unknown>(event: string, cb: (e: { payload: T }) => void) => hostListen<T>(event, cb),
    once: <T = unknown>(event: string, cb: (e: { payload: T }) => void) => hostListen<T>(event, cb),
    emit: (event: string, payload?: unknown) => hostEmit(event, payload),
    emitTo: (_target: string, event: string, payload?: unknown) => hostEmit(event, payload),
    onResized: unlisten, onMoved: unlisten, onCloseRequested: unlisten,
    onFocusChanged: unlisten, onScaleChanged: unlisten, onThemeChanged: unlisten,
    onDragDropEvent: unlisten, onMenuClicked: unlisten,
  };
}

export type Window = ReturnType<typeof makeWindow>;
export function getCurrentWindow(): Window { return makeWindow('main'); }
export const getCurrent = getCurrentWindow;
export function getAllWindows(): Window[] { return [makeWindow('main')]; }
export const getAll = getAllWindows;
export const appWindow: Window = makeWindow('main');

// Constructor-style usage: new Window(label) / WebviewWindow(label)
export class WebviewWindow {
  label: string;
  private w: Window;
  constructor(label: string) { this.label = label; this.w = makeWindow(label); Object.assign(this, this.w); }
  static getByLabel(_label: string): Window | null { return null; }
}
export { WebviewWindow as Window };
export const currentMonitor = async () => null;
export const primaryMonitor = async () => null;
export const availableMonitors = async () => [];
export enum UserAttentionType { Critical = 1, Informational = 2 }
export enum Effect {}
