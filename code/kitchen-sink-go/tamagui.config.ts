import { defaultConfig } from '@hanzo/gui-config/v5'
import { createTamagui } from '@hanzo/gui'

const tamaguiConfig = createTamagui(defaultConfig)

export type Conf = typeof tamaguiConfig

declare module '@hanzo/gui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
