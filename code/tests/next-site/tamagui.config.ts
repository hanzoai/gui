import { config } from '@hanzo/gui-config/v3'
import { createTamagui } from '@hanzo/gui'

// for site responsive demo
Object.assign(config.media, {
  tiny: { maxWidth: 500 },
  gtTiny: { minWidth: 500 + 1 },
  small: { maxWidth: 620 },
  gtSmall: { minWidth: 620 + 1 },
  medium: { maxWidth: 780 },
  gtMedium: { minWidth: 780 + 1 },
  large: { maxWidth: 900 },
  gtLarge: { minWidth: 900 + 1 },
})

const tamaConf = createTamagui(config)

export type Conf = typeof tamaConf

declare module '@hanzo/gui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody'
  }
}

export default tamaConf
