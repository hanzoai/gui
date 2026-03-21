import { defaultConfig } from '@hanzo/gui-config/v5'
import { animations } from '@hanzo/gui-config/v5-rn'
import { createTamagui } from '@hanzo/gui'

export const config = createTamagui({
  ...defaultConfig,
  animations,
})

export type Conf = typeof config

declare module '@hanzo/gui' {
  interface TamaguiCustomConfig extends Conf {}
}
