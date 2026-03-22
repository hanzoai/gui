import { stylePropsTextOnly, validStyles } from '@hanzo/gui-helpers'

import { createComponent } from '../createComponent'
import type {
  GuiTextElement,
  TextNonStyleProps,
  TextProps,
  TextStylePropsBase,
} from '../types'

export type Text = GuiTextElement

const ellipsisStyle =
  process.env.HANZO_GUI_TARGET === 'web'
    ? {
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }
    : {
        numberOfLines: 1,
        lineBreakMode: 'clip',
      }

export const Text = createComponent<
  TextProps,
  Text,
  TextNonStyleProps,
  TextStylePropsBase
>({
  componentName: 'Text',
  acceptsClassName: true,
  isText: true,

  defaultProps:
    process.env.HANZO_GUI_TARGET === 'web'
      ? undefined
      : {
          suppressHighlighting: true,
        },

  inlineWhenUnflattened: new Set(['fontFamily']),

  variants: {
    ...(process.env.HANZO_GUI_TARGET === 'web' && {
      numberOfLines: {
        1: ellipsisStyle,

        ':number': (numberOfLines) =>
          numberOfLines >= 1
            ? {
                WebkitLineClamp: numberOfLines,
                WebkitBoxOrient: 'vertical',
                display: '-webkit-box',
                overflow: 'hidden',
              }
            : null,
      },
    }),

    ellipsis: {
      true: ellipsisStyle,
    },
  },

  validStyles: {
    ...validStyles,
    ...stylePropsTextOnly,
  },
})
