// Hanzo GUI config for the Commerce admin SPA. Mirrors admin-tasks —
// uses @hanzogui/config v5 default so the static extractor can resolve
// the theme registry from the generated .gui temp dir.

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
