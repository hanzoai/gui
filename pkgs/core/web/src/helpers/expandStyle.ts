/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { isAndroid, isWeb } from '@hanzogui/constants'

import { getStyleCompat, type StyleCompat } from '../config.ts'
import type { PropMappedValue } from '../types.tsx'
import { parseBorderShorthand } from './parseBorderShorthand.ts'
import { parseOutlineShorthand } from './parseOutlineShorthand.ts'

const neg1Flex = [
  ['flexGrow', 0],
  ['flexShrink', 1],
  ['flexBasis', 'auto'],
] satisfies PropMappedValue

function expandFlex(value: unknown, compat: StyleCompat): PropMappedValue {
  if (typeof value === 'string') {
    return [['flex', value]]
  }

  if (typeof value !== 'number') {
    return
  }

  if (value === -1) {
    return neg1Flex
  }

  switch (compat) {
    case 'legacy':
      return [
        ['flexGrow', value],
        ['flexShrink', 1],
        ['flexBasis', 'auto'],
      ]
    case 'react-native':
      if (value > 0) {
        return [
          ['flexGrow', value],
          ['flexShrink', 0],
          ['flexBasis', 0],
        ]
      }
      if (value === 0) {
        return [
          ['flexGrow', 0],
          ['flexShrink', 0],
          ['flexBasis', 'auto'],
        ]
      }
      return [
        ['flexGrow', 0],
        ['flexShrink', -value],
        ['flexBasis', 'auto'],
      ]
    case 'web':
      if (value < 0) {
        return [['flex', value]]
      }
      return [
        ['flexGrow', value],
        ['flexShrink', 1],
        ['flexBasis', 0],
      ]
  }
}

export function expandStyle(
  key: string,
  value: any,
  styleCompat: StyleCompat = getStyleCompat()
): PropMappedValue {
  if (process.env.GUI_TARGET === 'web') {
    if (key === 'flex') {
      return expandFlex(value, styleCompat)
    }

    // react-native's direction-relative names are not CSS: `paddingStart`
    // hyphenates to `padding-start`, which no browser parses, so the rule was
    // dropped and the element laid out as if the prop were absent. They land on
    // the CSS logical property that follows the writing direction.
    if (key in webInlineNames) {
      return [[webInlineNames[key], value]]
    }
    // two-sided inline shorthands split into the longhands above, so a later
    // `paddingInlineEnd` replaces one side instead of racing the shorthand
    if (key in webInlineExpansions) {
      return webInlineExpansions[key].map((k) => [k, value])
    }

    switch (key) {
      case 'writingDirection': {
        return [['direction', value]]
      }
      // some safari-based browsers seem not to support without -webkit prefix
      case 'backdropFilter': {
        return [
          ['backdropFilter', value],
          ['WebkitBackdropFilter', value],
        ]
      }
    }
  }

  if (process.env.GUI_TARGET === 'native') {
    if (isAndroid && key === 'elevationAndroid') {
      return [['elevation', value]]
    }

    // native-only value transforms
    switch (key) {
      case 'objectFit': {
        const resizeMode = resizeModeMap[value] || 'cover'
        return [['resizeMode', resizeMode]]
      }
      case 'verticalAlign': {
        return [['textAlignVertical', verticalAlignMap[value] || 'auto']]
      }
      case 'position': {
        // position: fixed|sticky -> absolute on native
        if (value === 'fixed' || value === 'sticky') {
          return [['position', 'absolute']]
        }
        return
      }
      case 'display': {
        // `grid` CROSSES now. It used to be rewritten to flex here, because
        // Yoga's Display enum carried Flex, None and Contents and nothing else
        // — so a grid arriving on native could only be laid out by the flex
        // properties the element already had. That bought a one-dimensional
        // stack and lost everything else about the layout.
        //
        // hanzoai/yoga has `Display::Grid` and a grid algorithm under
        // yoga/algorithm/grid, so the value now reaches an engine that reads
        // it, and the track and placement properties travel with it — gridProps
        // moved to the cross-platform table in @hanzogui/helpers for the same
        // reason.
        //
        // `inline-grid` still folds to `grid`: native has no inline formatting
        // context for a box to participate in, so the inline half has nothing
        // to mean there, while the grid half now does.
        if (value === 'inline-grid') {
          return [['display', 'grid']]
        }
        // list-item crosses the same way and for the same reason: native has no
        // marker box, and a bare <li> there already laid out as a flex column.
        // Left untouched it warns in dev and lays out as flex regardless, so the
        // degradation is identical and only the warning would be new.
        if (value === 'list-item') {
          return [['display', 'flex']]
        }
        return
      }
      case 'backgroundImage': {
        // RN 0.76+ uses experimental_backgroundImage
        // value may be a parsed array (from parseNativeStyle) or a plain string
        return [['experimental_backgroundImage', value]]
      }
      case 'border': {
        // parse border shorthand string to individual properties
        // on native, only supports a single border (all sides)
        if (typeof value === 'string') {
          const parsed = parseBorderShorthand(value)
          if (parsed) {
            return parsed
          }
        }
        return
      }
      case 'outline': {
        if (typeof value === 'string') {
          const parsed = parseOutlineShorthand(value)
          if (parsed) {
            return parsed
          }
        }
        return
      }
      case 'textAlign': {
        // react-native has no start/end alignment; its left/right already
        // swap under RTL (I18nManager.doLeftAndRightSwapInRTL), so they are
        // the direction-relative values there
        if (value === 'start') {
          return [['textAlign', 'left']]
        }
        if (value === 'end') {
          return [['textAlign', 'right']]
        }
        return
      }
    }

    // native-only logical expansions (RTL-aware inline props output RN-style
    // names like marginStart/borderEndColor that aren't valid CSS on web)
    if (key in nativeInlineExpansions) {
      return nativeInlineExpansions[key].map((k) => [k, value])
    }
  }

  // universal logical expansions — applied on both targets so atomic CSS
  // generates one class per longhand. Otherwise `inset: 0` becomes a single
  // `_inset-0px` class controlling four sub-properties, which silently breaks
  // dedup/override against `top`/`left`/etc.
  if (key in universalExpansions) {
    return universalExpansions[key].map((k) => [k, value])
  }

  if (key in EXPANSIONS) {
    return EXPANSIONS[key].map((k) => [k, value])
  }
}

// native value transforms
const resizeModeMap: Record<string, string> = {
  fill: 'stretch',
  none: 'center',
  'scale-down': 'contain',
  contain: 'contain',
  cover: 'cover',
}

const verticalAlignMap: Record<string, string> = {
  top: 'top',
  middle: 'center',
  bottom: 'bottom',
  auto: 'auto',
}

// shared expansions
const all = ['Top', 'Right', 'Bottom', 'Left']
const horiz = ['Right', 'Left']
const vert = ['Top', 'Bottom']
const xy = ['X', 'Y']

const EXPANSIONS: Record<string, string[]> = {
  borderColor: ['TopColor', 'RightColor', 'BottomColor', 'LeftColor'],
  borderRadius: [
    'TopLeftRadius',
    'TopRightRadius',
    'BottomRightRadius',
    'BottomLeftRadius',
  ],
  borderWidth: ['TopWidth', 'RightWidth', 'BottomWidth', 'LeftWidth'],
  margin: all,
  marginHorizontal: horiz,
  marginVertical: vert,
  padding: all,
  paddingHorizontal: horiz,
  paddingVertical: vert,
  ...(isWeb && {
    // react-native only supports borderStyle
    borderStyle: ['TopStyle', 'RightStyle', 'BottomStyle', 'LeftStyle'],
    // react-native doesn't support X / Y
    overflow: xy,
    overscrollBehavior: xy,
  }),
}

for (const parent in EXPANSIONS) {
  const prefix = parent.slice(0, /[A-Z]/.exec(parent)?.index ?? parent.length)
  EXPANSIONS[parent] = EXPANSIONS[parent].map((k) => `${prefix}${k}`)
}

// Logical expansions whose targets are physical longhands valid on both
// targets. Applied unconditionally so atomic CSS stays one-class-per-longhand:
// without this, `inset: 0` emits `_inset-0px` (one class, four sub-properties)
// and silently breaks dedup/override against `top`/`left`/etc.
const universalExpansions: Record<string, string[]> = {
  // inset
  inset: ['top', 'right', 'bottom', 'left'],
  insetBlock: ['top', 'bottom'],
  insetBlockStart: ['top'],
  insetBlockEnd: ['bottom'],
  // block-axis margin/padding
  marginBlock: ['marginTop', 'marginBottom'],
  marginBlockStart: ['marginTop'],
  marginBlockEnd: ['marginBottom'],
  paddingBlock: ['paddingTop', 'paddingBottom'],
  paddingBlockStart: ['paddingTop'],
  paddingBlockEnd: ['paddingBottom'],
  // block-axis border
  borderBlockColor: ['borderTopColor', 'borderBottomColor'],
  borderBlockWidth: ['borderTopWidth', 'borderBottomWidth'],
  borderBlockStyle: ['borderTopStyle', 'borderBottomStyle'],
  borderBlockStartColor: ['borderTopColor'],
  borderBlockEndColor: ['borderBottomColor'],
  borderBlockStartWidth: ['borderTopWidth'],
  borderBlockEndWidth: ['borderBottomWidth'],
  borderBlockStartStyle: ['borderTopStyle'],
  borderBlockEndStyle: ['borderBottomStyle'],
  // logical sizing → physical width/height
  minBlockSize: ['minHeight'],
  maxBlockSize: ['maxHeight'],
  minInlineSize: ['minWidth'],
  maxInlineSize: ['maxWidth'],
  blockSize: ['height'],
  inlineSize: ['width'],
}

// Inline-axis logical expansions are native-only: their targets are RN-style
// RTL-aware names (marginStart/borderEndColor/etc.) which web's CSS hyphenator
// would emit as invalid CSS. On web these props pass through as native CSS
// logical properties, which the browser handles RTL-aware.
const nativeInlineExpansions: Record<string, string[]> = {
  borderInlineColor: ['borderEndColor', 'borderStartColor'],
  borderInlineWidth: ['borderEndWidth', 'borderStartWidth'],
  borderInlineStyle: ['borderEndStyle', 'borderStartStyle'],
  borderInlineStartColor: ['borderStartColor'],
  borderInlineEndColor: ['borderEndColor'],
  borderInlineStartWidth: ['borderStartWidth'],
  borderInlineEndWidth: ['borderEndWidth'],
  borderInlineStartStyle: ['borderStartStyle'],
  borderInlineEndStyle: ['borderEndStyle'],
  marginInline: ['marginEnd', 'marginStart'],
  marginInlineStart: ['marginStart'],
  marginInlineEnd: ['marginEnd'],
  paddingInline: ['paddingEnd', 'paddingStart'],
  paddingInlineStart: ['paddingStart'],
  paddingInlineEnd: ['paddingEnd'],
  // start/end follow the layout direction on native; left/right do not
  insetInline: ['start', 'end'],
  insetInlineStart: ['start'],
  insetInlineEnd: ['end'],
}

// react-native's direction-relative names -> the CSS logical property each one
// means. Radii read block-then-inline: top-start is start-start.
const webInlineNames: Record<string, string> = {
  start: 'insetInlineStart',
  end: 'insetInlineEnd',
  marginStart: 'marginInlineStart',
  marginEnd: 'marginInlineEnd',
  paddingStart: 'paddingInlineStart',
  paddingEnd: 'paddingInlineEnd',
  borderStartColor: 'borderInlineStartColor',
  borderEndColor: 'borderInlineEndColor',
  borderStartWidth: 'borderInlineStartWidth',
  borderEndWidth: 'borderInlineEndWidth',
  borderTopStartRadius: 'borderStartStartRadius',
  borderTopEndRadius: 'borderStartEndRadius',
  borderBottomStartRadius: 'borderEndStartRadius',
  borderBottomEndRadius: 'borderEndEndRadius',
}

const webInlineExpansions: Record<string, string[]> = {
  insetInline: ['insetInlineStart', 'insetInlineEnd'],
  marginInline: ['marginInlineStart', 'marginInlineEnd'],
  paddingInline: ['paddingInlineStart', 'paddingInlineEnd'],
  borderInlineColor: ['borderInlineStartColor', 'borderInlineEndColor'],
  borderInlineWidth: ['borderInlineStartWidth', 'borderInlineEndWidth'],
  borderInlineStyle: ['borderInlineStartStyle', 'borderInlineEndStyle'],
}
