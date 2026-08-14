import { config } from '@hanzogui/dev-config'
import { createGui } from '@hanzo/gui'

const tamaConf = createGui(config)

export type Conf = typeof tamaConf

declare module 'hanzogui' {
  interface GuiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content' | 'item'
  }
}

export default tamaConf
