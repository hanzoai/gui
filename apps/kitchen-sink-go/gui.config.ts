import { defaultConfig } from '@hanzogui/config/v5'
import { createGui } from 'hanzogui'

const guiConfig = createGui(defaultConfig)

export type Conf = typeof guiConfig

declare module 'hanzogui' {
  interface GuiCustomConfig extends Conf {}
}

export default guiConfig
