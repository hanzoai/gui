import { defaultConfig } from '@hanzogui/config/v5'
import { createHanzogui } from 'hanzogui'

const hanzoguiConfig = createHanzogui(defaultConfig)

export type Conf = typeof hanzoguiConfig

declare module 'hanzogui' {
  interface HanzoguiCustomConfig extends Conf {}
}

export default hanzoguiConfig
