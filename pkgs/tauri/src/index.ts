// @hanzogui/tauri — the Tauri desktop weld for Hanzo GUI.
//
// hanzogui already targets web (Next/Vite) and native (Expo/RN). This adapter
// adds the third host: a Tauri webview with a native bridge. The same hanzogui
// component tree renders in the webview; this package gives it OS window
// controls, global shortcuts, and fs/shell access — all guarded by isTauri() so
// nothing breaks on the web.

export { isTauri } from './isTauri.ts'
export { windowControls, useWindowControls } from './window.ts'
export { registerShortcut, unregisterShortcut, useGlobalShortcut } from './shortcuts.ts'
export { readTextFile, writeTextFile, openExternal } from './system.ts'
export { TitleBar, type TitleBarProps } from './TitleBar.tsx'
