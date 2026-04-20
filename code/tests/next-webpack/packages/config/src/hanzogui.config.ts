import { defaultConfig } from '@hanzogui/config/v4'
import { createHanzogui } from 'hanzogui'
import { bodyFont, headingFont } from './fonts'
import { animations } from './animations'

export const config = createHanzogui({
  ...defaultConfig,
  animations,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
})
