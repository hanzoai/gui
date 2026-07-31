import { createGui } from 'hanzogui'
import { config } from '@hanzogui/dev-config'

const tamaConf = createGui(config)

export type Conf = typeof tamaConf

declare module 'hanzogui' {
  interface GuiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content' | 'item'
  }
}

export default tamaConf
