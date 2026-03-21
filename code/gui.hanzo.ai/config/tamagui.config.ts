import { createTamagui } from '@hanzo/gui'
import { config } from '@hanzo/gui-dev-config'

const tamaConf = createTamagui(config)

export type Conf = typeof tamaConf

declare module '@hanzo/gui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content' | 'item'
  }
}

export default tamaConf
