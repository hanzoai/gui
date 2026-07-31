import { defaultConfig } from '@hanzogui/config/v5'
import { createGui } from 'hanzogui'

const hanzoguiConfig = createGui(defaultConfig)

export type Conf = typeof hanzoguiConfig

declare module 'hanzogui' {
  interface GuiCustomConfig extends Conf {}
}

export default hanzoguiConfig
