import { defaultConfig } from '@hanzo/gui-config/v4'
import { createTamagui } from '@hanzo/gui'
import { bodyFont, headingFont } from './fonts'
import { animations } from './animations'

export const config = createTamagui({
  ...defaultConfig,
  animations,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
})
