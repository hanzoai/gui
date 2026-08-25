import type { GetProps, SizeTokens } from '@hanzogui/core'
import { View, styled } from '@hanzogui/core'

import { getElevation } from './getElevation'

export interface StackVariants {
  /**
   * @deprecated use `inset: 0, position: 'absolute'` instead
   */
  fullscreen?: boolean

  elevation?: number | SizeTokens
}

export type YStackProps = Omit<GetProps<typeof YStack>, keyof StackVariants> &
  StackVariants

export type XStackProps = YStackProps
export type ZStackProps = YStackProps

export const fullscreenStyle = {
  position: 'absolute',
  inset: 0,
} as const

const variants = {
  fullscreen: {
    true: fullscreenStyle,
  },

  elevation: {
    '...size': getElevation,
    ':number': getElevation,
  },
} as const

/**
 * @summary A view that arranges its children in a vertical line.
 * @see — Docs https://hanzogui.dev/ui/stacks#xstack-ystack-zstack
 */
export const YStack = styled(View, {
  flexDirection: 'column',
  variants,
})

YStack['displayName'] = 'YStack'

/**
 * @summary A view that arranges its children in a horizontal line.
 * @see — Docs https://hanzogui.dev/ui/stacks#xstack-ystack-zstack
 */
export const XStack = styled(View, {
  flexDirection: 'row',
  variants: {
    ...variants,
    // The axis is the thing a stack means; flexDirection is only one engine's
    // word for it. Grid's word is grid-auto-flow, and the two invert: flex
    // `row` runs across, grid `row` fills rows and so runs DOWN. So
    // flex-direction is inert under grid, and an XStack asked for grid laid its
    // children out VERTICALLY — measured in a browser at x 24,24,24 / y
    // 313,353,393, the opposite of this component's name.
    //
    // Saying the axis in grid's vocabulary too costs nothing when nobody asks:
    // a variant that is not passed emits no class, so a plain XStack is still
    // `is_View _fd-row`, byte for byte.
    //
    // YStack needs no such arm. Grid's default flow already fills one implicit
    // column top to bottom, which is a YStack — measured at x 0,0,0 / y
    // 0,20,40, identical to the flex column.
    display: {
      grid: { display: 'grid', gridAutoFlow: 'column' },
      'inline-grid': { display: 'inline-grid', gridAutoFlow: 'column' },
      ':string': (mode: string) => ({ display: mode }),
    },
  } as const,
})

XStack['displayName'] = 'XStack'

/**
 * @summary A view that stacks its children on top of each other.
 * @see — Docs https://hanzogui.dev/ui/stacks#xstack-ystack-zstack
 */
export const ZStack = styled(
  YStack,
  {
    position: 'relative',
  },
  {
    neverFlatten: true,
    isZStack: true,
  }
)

ZStack['displayName'] = 'ZStack'
