import { createGui } from 'hanzogui'
import { config } from '@hanzogui/dev-config'

const guiConf = createGui(config)

export type Conf = typeof guiConf

declare module 'hanzogui' {
  interface GuiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content' | 'item'
  }
}

export default guiConf
