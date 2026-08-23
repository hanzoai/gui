import { defaultConfig } from '@hanzogui/config/v4'
import { createGui } from '@hanzo/gui'

// v4 config — carries the true-black default dark theme + the per-brand accent
// themes (dark_hanzo / dark_lux / dark_zoo / dark_pars). Type is the platform
// stack: v4-fonts names no face, so this app ships no typeface of its own.
export const config = createGui(defaultConfig)

export default config

export type Conf = typeof config

declare module 'hanzogui' {
  interface GuiCustomConfig extends Conf {}
}
