import { animationsCSS } from '@hanzogui/config/v5-css'
import { animationsMotion } from '@hanzogui/config/v5-motion'
import {
  createV5Theme,
  defaultConfig,
  subtleChildrenThemes,
} from '@hanzogui/config/v5-subtle'

// Only the accents the site actually shows: the @hanzogui/logo tint ramp
// (red/pink/purple/gray/blue/teal/green) plus yellow, which the seasonal
// families and the docs still name. Orange and neutral are left out — an
// accent carries its color tokens with it (--orange10 and the rest), so each
// one is render-blocking css, and orange measures 2.86:1 against the light
// ground at its solid step, under the 3:1 a swatch needs to read at all.
// Themes-as-js is still stripped to {} on the client below and hydrated from
// css; component themes stay, since they dedupe to surfaces.
const { gray, blue, red, yellow, green, purple, teal, pink } = subtleChildrenThemes
const themes = createV5Theme({
  childrenThemes: { gray, blue, red, yellow, green, purple, teal, pink },
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
