import { defaultConfig } from '@hanzogui/config/v4'
import { createGui } from 'hanzogui'

// v4 config — carries the true-black default dark theme + the per-brand accent
// themes (dark_hanzo / dark_lux / dark_zoo / dark_pars) and the Geist type system.
export const config = createGui(defaultConfig)

export default config

export type Conf = typeof config

declare module 'hanzogui' {
  interface GuiCustomConfig extends Conf {}
}
