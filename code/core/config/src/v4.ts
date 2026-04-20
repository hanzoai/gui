import { shorthands } from '@hanzogui/shorthands/v4'
import { tokens, defaultThemes } from '@hanzogui/themes/v4'
import type { CreateHanzoguiProps } from '@hanzogui/web'
import { animations } from './v3-animations'
import { fonts } from './v4-fonts'
import { media, mediaQueryDefaultActive } from './v4-media'

export { shorthands } from '@hanzogui/shorthands/v4'
export { createThemes } from '@hanzogui/theme-builder'
export { hanzoguiThemes, tokens } from '@hanzogui/themes/v4'
export { animations } from './v4-animations'
export { createSystemFont, fonts } from './v4-fonts'
export { breakpoints, media, mediaQueryDefaultActive } from './v4-media'
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
} satisfies CreateHanzoguiProps['settings']

export const defaultConfig = {
  animations,
  media,
  shorthands,
  themes: defaultThemes,
  tokens,
  fonts,
  selectionStyles,
  settings,
} satisfies CreateHanzoguiProps
