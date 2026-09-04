import { shorthands } from '@hanzogui/shorthands/v4'
import { tokens, defaultThemes } from '@hanzogui/themes/v4'
import type { CreateGuiProps } from '@hanzogui/web'
import { animations } from './v3-animations.ts'
import { fonts } from './v4-fonts.ts'
import { media, mediaQueryDefaultActive } from './v4-media.ts'

export { shorthands } from '@hanzogui/shorthands/v4'
export { createThemes } from '@hanzogui/theme-builder'
export { hanzoguiThemes, tokens } from '@hanzogui/themes/v4'
export { animations } from './v4-animations.ts'
export { createSystemFont, fonts } from './v4-fonts.ts'
export { breakpoints, media, mediaQueryDefaultActive } from './v4-media.ts'
export { defaultThemes as themes } from '@hanzogui/themes/v4'

// Configuration:

export const selectionStyles = (theme) =>
  theme.color5
    ? {
        backgroundColor: theme.color5,
        color: theme.color11,
      }
    : null

export const settings = {
  mediaQueryDefaultActive,
  defaultFont: 'body',
  fastSchemeChange: true,
  shouldAddPrefersColorThemes: true,
  allowedStyleValues: 'somewhat-strict-web',
  addThemeClassName: 'html',
  onlyAllowShorthands: true,
  styleCompat: 'legacy',
  defaultPosition: 'relative',
} satisfies CreateGuiProps['settings']

export const defaultConfig = {
  animations,
  media,
  shorthands,
  themes: defaultThemes,
  tokens,
  fonts,
  selectionStyles,
  settings,
} satisfies CreateGuiProps
