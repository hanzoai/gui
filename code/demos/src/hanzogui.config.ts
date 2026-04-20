import { config } from '@hanzogui/hanzogui-dev-config'
import { createHanzogui } from 'hanzogui'

const tamaConf = createHanzogui(config)

export type Conf = typeof tamaConf

declare module 'hanzogui' {
  interface HanzoguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content' | 'item'
  }
}

export default tamaConf
