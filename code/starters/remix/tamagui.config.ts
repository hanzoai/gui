import { defaultConfig } from '@hanzo/gui-config/v5'
import { createTamagui } from '@hanzo/gui'

export const config = createTamagui(defaultConfig)

export default config

export type Conf = typeof config

declare module '@hanzo/gui' {
  interface TamaguiCustomConfig extends Conf {}
}
