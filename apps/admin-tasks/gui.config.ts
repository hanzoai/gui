// Tamagui config for Hanzo Tasks UI v2.
//
// Use the canonical @hanzogui/config v5 default (same shape the
// starter at ~/work/hanzo/gui/code/starters/expo-router uses) so
// Tamagui's runtime theme registry resolves cleanly. Hanzo brand
// recoloring lives in src/index.css as CSS variables that we layer
// on top of Tamagui's `dark` theme, NOT by mutating the themes
// object — spreading it through a JS module breaks the static
// shape Tamagui's getThemeProxied() depends on.

// IMPORTANT: this config file imports from `hanzogui` (workspace
// umbrella), NOT `@hanzo/gui`. Source code uses `@hanzo/gui` (the
// canonical Hanzo umbrella name) — the Vite alias in vite.config.ts
// routes that to this same workspace package at bundle time. The
// static extractor copies this file into `.hanzogui/` at build time
// and re-resolves imports from there — that temp dir can find
// `hanzogui` via standard node_modules walk-up but NOT `@hanzo/gui`,
// which has no walk-up reach from a generated subdir.

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
