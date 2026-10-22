import type { GetProps, SizeTokens } from '@hanzogui/core'
import { View, styled } from '@hanzogui/core'

import { getElevation } from './getElevation.tsx'

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
export type WrapProps = GetProps<typeof Wrap>

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
 *
 * `tracks` lays them on grid tracks the stack sizes instead:
 * `<YStack tracks="auto 1fr auto">` is a header, a body that fills and a
 * footer, with no flex prop on any of them. See `tracks` in @hanzogui/web.
 * @see — Docs https://hanzogui.dev/ui/stacks#xstack-ystack-zstack
 */
export const YStack = styled(View, {
  flexDirection: 'column',
  variants,
})

YStack['displayName'] = 'YStack'

/**
 * @summary A view that arranges its children in a horizontal line.
 *
 * `tracks` lays them on grid tracks the stack sizes instead:
 * `<XStack tracks="240px 1fr">` is a fixed rail and the page beside it.
 * @see — Docs https://hanzogui.dev/ui/stacks#xstack-ystack-zstack
 */
export const XStack = styled(View, {
  flexDirection: 'row',
  variants,
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

/**
 * @summary A row that wraps its children onto as many lines as they need, each
 * at its own content size, spaced by `gap`.
 *
 * The one place content-sized wrapping lives. A stack sizes its children on
 * tracks; what has no tracks — chips, tags, a run of buttons — wraps here, and
 * a child of a Wrap is the one place a flex prop (`grow`, `shrink`,
 * `flexBasis`) still means something.
 *
 * @example <Wrap gap="$2">{tags.map((t) => <Chip key={t}>{t}</Chip>)}</Wrap>
 */
export const Wrap = styled(View, {
  flexDirection: 'row',
  flexWrap: 'wrap',
})

Wrap['displayName'] = 'Wrap'
