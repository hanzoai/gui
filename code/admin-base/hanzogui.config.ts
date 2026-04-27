// Tamagui config for Hanzo Base admin UI.
//
// Same shape as admin-tasks — uses @hanzogui/config v5 default so
// runtime theme registry resolves. Brand recoloring lives in
// src/index.css as CSS variables layered over Tamagui's `dark` theme.
//
// IMPORTANT: imports from `hanzogui` (workspace umbrella). The static
// extractor copies this file into `.hanzogui/` at build time and
// re-resolves imports from there — that temp dir can find `hanzogui`
// via standard node_modules walk-up.

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
