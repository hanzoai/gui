import { createGui } from '@hanzo/gui'
import { shorthands } from '@hanzo/gui-shorthands'

import { animations } from './animations'
import { fonts } from './fonts'
import { media } from './media'
import { themes } from './themes'
import { tokens } from './tokens'

const config = createGui({
  defaultFont: 'body',
  animations,
  shouldAddPrefersColorThemes: true,
  shorthands,
  fonts,
  themes,
  tokens,
  media,
})

type AppConfig = typeof config

// declare module '@hanzo/gui' {
//   // overrides GuiCustomConfig so that custom types
//   // work everywhere `gui` is imported
//   interface GuiCustomConfig extends AppConfig {}
// }

export default config
