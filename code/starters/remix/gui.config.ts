import { defaultConfig } from '@hanzogui/config/v5'
import { createGui } from '@hanzo/gui'

export const config = createGui(defaultConfig)

export default config

export type Conf = typeof config

declare module '@hanzo/gui' {
  interface GuiCustomConfig extends Conf {}
}
