import { createHanzogui } from 'hanzogui'
import { shorthands } from '@hanzogui/shorthands'

import { animations } from './animations'
import { fonts } from './fonts'
import { media } from './media'
import { themes } from './themes'
import { tokens } from './tokens'

const config = createHanzogui({
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

// declare module 'hanzogui' {
//   // overrides HanzoguiCustomConfig so that custom types
//   // work everywhere `hanzogui` is imported
//   interface HanzoguiCustomConfig extends AppConfig {}
// }

export default config
