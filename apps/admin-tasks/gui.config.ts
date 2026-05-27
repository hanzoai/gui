// Gui config for Hanzo Tasks UI v2.
//
// Use the canonical @hanzogui/config v5 default (same shape the
// starter at ~/work/hanzo/gui/code/starters/expo-router uses) so
// Gui's runtime theme registry resolves cleanly. Hanzo brand
// recoloring lives in src/index.css as CSS variables that we layer
// on top of Gui's `dark` theme, NOT by mutating the themes
// object — spreading it through a JS module breaks the static
// shape Gui's getThemeProxied() depends on.

// IMPORTANT: this config file imports from `gui` (workspace
// umbrella), NOT `@hanzo/gui`. Source code uses `@hanzo/gui` (the
// canonical Hanzo umbrella name) — the Vite alias in vite.config.ts
// routes that to this same workspace package at bundle time. The
// static extractor copies this file into `.gui/` at build time
// and re-resolves imports from there — that temp dir can find
// `gui` via standard node_modules walk-up but NOT `@hanzo/gui`,
// which has no walk-up reach from a generated subdir.

import { defaultConfig } from '@hanzogui/config/v5'
import { createGui } from 'hanzogui'

export const config = createGui(defaultConfig)

export default config

export type Conf = typeof config

declare module 'hanzogui' {
  interface GuiCustomConfig extends Conf {}
}
declare module '@hanzogui/web' {
  interface GuiCustomConfig extends Conf {}
}
