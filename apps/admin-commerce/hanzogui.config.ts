// Hanzo GUI config for the Commerce admin SPA. Mirrors admin-tasks —
// uses @hanzogui/config v5 default so the static extractor can resolve
// the theme registry from the generated .hanzogui temp dir.

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
