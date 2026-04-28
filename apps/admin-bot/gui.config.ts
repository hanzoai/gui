// Hanzo GUI config for admin-bot v0.1 — mirrors apps/admin-tasks shape.
//
// Use the canonical @hanzogui/config v5 default so the runtime theme
// registry resolves cleanly. Brand recoloring (if/when the bot brand
// diverges from neutral Hanzo) lives in CSS variables, NOT by mutating
// the themes object — spreading it through a JS module breaks the
// static shape getThemeProxied() depends on.
//
// IMPORTANT: this config file imports from `hanzogui` (workspace
// umbrella). The static extractor copies this file into `.hanzogui/`
// at build time; that temp dir can find `hanzogui` via standard
// node_modules walk-up.

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
