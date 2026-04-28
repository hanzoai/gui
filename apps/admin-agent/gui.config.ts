// Hanzo GUI v7 config for the Hanzo Agents admin SPA.
//
// Use the canonical @hanzogui/config v5 default — same shape
// admin-tasks uses — so Hanzo GUI's runtime theme registry resolves
// cleanly. Hanzo brand recoloring lives in src/index.css as CSS
// variables that we layer on top of Hanzo GUI's `dark` theme, NOT
// by mutating the themes object.
//
// IMPORTANT: this config file imports from `hanzogui` (workspace
// umbrella), NOT `@hanzo/gui`. Source code uses `@hanzo/gui`; the
// Vite alias in vite.config.ts routes that to this same workspace
// package at bundle time.

import { defaultConfig } from '@hanzogui/config/v5'
import { createHanzogui } from 'hanzogui'

export const config = createHanzogui(defaultConfig)

export default config

export type Conf = typeof config

declare module 'hanzogui' {
  interface HanzoguiCustomConfig extends Conf {}
}
declare module '@hanzogui/web' {
  interface HanzoguiCustomConfig extends Conf {}
}
