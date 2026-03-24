import { defaultConfig } from '@hanzogui/config/v5'
import { createGui } from '@hanzo/gui'

const guiConfig = createGui(defaultConfig)

export type Conf = typeof guiConfig

declare module '@hanzo/gui' {
  interface GuiCustomConfig extends Conf {}
}

export default guiConfig
