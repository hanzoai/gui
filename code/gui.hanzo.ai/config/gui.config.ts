import { createGui } from '@hanzo/gui'
import { config } from '@hanzogui/dev-config'

const guiConf = createGui(config)

export type Conf = typeof guiConf

declare module '@hanzo/gui' {
  interface GuiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content' | 'item'
  }
}

export default guiConf
