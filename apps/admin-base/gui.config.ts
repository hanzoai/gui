// Gui config for Hanzo Base admin UI.
//
// Same shape as admin-tasks — uses @hanzogui/config v5 default so
// runtime theme registry resolves. Brand recoloring lives in
// src/index.css as CSS variables layered over Gui's `dark` theme.
//
// IMPORTANT: imports from `gui` (workspace umbrella). The static
// extractor copies this file into `.gui/` at build time and
// re-resolves imports from there — that temp dir can find `gui`
// via standard node_modules walk-up.

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
