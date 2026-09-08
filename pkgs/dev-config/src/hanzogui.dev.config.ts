import { animationsCSS } from '@hanzogui/config/v5-css'
import { animationsMotion } from '@hanzogui/config/v5-motion'
import {
  createV5Theme,
  defaultConfig,
  subtleChildrenThemes,
} from '@hanzogui/config/v5-subtle'

// The accents the site shows: the @hanzogui/logo ramp's six hues plus the grey
// it rests on. Black and white come with every v5 theme and need no entry here.
// Teal, pink and neutral have none because nothing names them — an accent
// carries its own color tokens (--teal10 and the rest), and this stylesheet is
// render-blocking. Themes-as-js is still stripped to {} on the client below and
// hydrated from css; component themes stay, since they dedupe to surfaces.
const { gray, blue, red, yellow, green, orange, purple } = subtleChildrenThemes
const themes = createV5Theme({
  childrenThemes: { gray, blue, red, yellow, green, orange, purple },
})
import type { CreateGuiProps } from '@hanzogui/core'
import { setupDev } from '@hanzogui/core'
import { bodyFont, headingFont, monoFont, pixelFont } from './fonts.ts'
import { media, mediaQueryDefaultActive } from './media.ts'

setupDev({
  visualizer: true,
})

const fonts = {
  heading: headingFont,
  body: bodyFont,
  mono: monoFont,
  pixel: pixelFont,
}

export const animations = {
  default: animationsMotion,
  css: animationsCSS,
}

// Use v5 config as base, but with hanzogui.dev custom themes
export const config = {
  ...defaultConfig,
  themes: process.env.VITE_ENVIRONMENT === 'client' ? ({} as typeof themes) : themes,
  fonts,
  animations,
  media,
  settings: {
    ...defaultConfig.settings,
    mediaQueryDefaultActive,
    allowedStyleValues: 'somewhat-strict-web',
    autocompleteSpecificTokens: 'except-special',
    // Allow both shorthands and longhand names for flexibility
    onlyAllowShorthands: false,
  },
} satisfies CreateGuiProps

// for site responsive demo, but we want no types
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
