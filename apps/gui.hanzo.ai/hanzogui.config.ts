import { createHanzogui } from 'hanzogui'
import { config } from '@hanzogui/dev-config'

const guiConf = createHanzogui(config)

export type Conf = typeof guiConf

declare module 'hanzogui' {
  interface HanzoguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content' | 'item'
  }
}

export default guiConf
