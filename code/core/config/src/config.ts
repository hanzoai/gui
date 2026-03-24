import { shorthands } from '@hanzogui/shorthands'
import { themes, tokens } from '@hanzogui/themes'
import type { CreateGuiProps } from '@hanzogui/web'

import { fonts } from './fonts'
import { media, mediaQueryDefaultActive } from './media'

export const configWithoutAnimations = {
  themes,
  media,
  shorthands,
  tokens,
  fonts,
  selectionStyles: (theme) =>
    theme.color5
      ? {
          backgroundColor: theme.color5,
          color: theme.color11,
        }
      : null,

  settings: {
    defaultFont: 'body',
    shouldAddPrefersColorThemes: true,
    mediaQueryDefaultActive,
  },
} satisfies CreateGuiProps
