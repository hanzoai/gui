import { defaultConfig } from '@hanzo/gui-config/v4'
import { createGui } from '@hanzo/gui'
import { bodyFont, headingFont } from './fonts'
import { animations } from './animations'

export const config = createGui({
  ...defaultConfig,
  animations,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
})
