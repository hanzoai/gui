/**
 * `tracks`: a stack that lays its children on CSS grid tracks along its own
 * axis, so the parent sizes them and the children carry no flex props.
 *
 *   <YStack tracks="auto 1fr auto">   header, body that fills, footer
 *   <XStack tracks="240px 1fr">       a fixed rail and the page beside it
 *
 * The axis is the stack's own flexDirection: `row` and `row-reverse` run across
 * (x), everything else runs down (y). A reverse direction is not mirrored —
 * grid has no reverse flow — so the children sit on the tracks in source order.
 *
 * WEB is the browser's grid:
 *
 *                 y (YStack)                     x (XStack)
 *   display       grid                           grid
 *   flow          grid-auto-flow: row            grid-auto-flow: column
 *   tracks        grid-template-rows             grid-template-columns
 *   cross axis    grid-auto-columns:             grid-auto-rows:
 *                   minmax(0, 1fr)                 minmax(0, 1fr)
 *
 * The cross-axis track is one that fills the stack and has no content floor,
 * which is what a flex line's cross size is: a child stretched across a column
 * is exactly as wide as the column, however wide its content.
 *
 * A prop the author names on the stack wins over all of these, so
 * `display="none"` still hides it and an explicit `gridAutoFlow` stays.
 *
 * ALIGNMENT KEEPS ITS FLEX MEANING. On x, grid's block axis is the row's cross
 * axis and its inline axis the main axis, so `items`, `justify` and `self` mean
 * what they meant and pass through. On y the two axes swap, so they are
 * renamed:
 *
 *   on the stack     items   (alignItems)      ->  justifyItems
 *                    justify (justifyContent)  ->  alignContent
 *                    content (alignContent)    ->  justifyContent
 *   on a child       self    (alignSelf)       ->  justifySelf
 *
 * The rename happens where every style key is mapped (propMapper), so it holds
 * for a key written in a media query, a pseudo style or a variant as well as a
 * plain prop. A child learns that it sits in a vertical stack from
 * ComponentContext; the context reaches only the stack's direct children, and
 * each of them clears it for its own.
 *
 * NATIVE falls back to flex: the stack stays the flex column or row it is, and
 * each child takes the track at its position as its flex style. Every child
 * gets one, written as longhands, so a flex prop the child set on itself does
 * not combine with it: the track wins, as it does on web.
 *
 *   Nfr, minmax(_, Nfr)          flexGrow N, flexShrink 1, flexBasis 0  (flex: N)
 *   Npx, N%, 0                   flexGrow 0, flexShrink 0, flexBasis N  (px as a number)
 *   repeat(K, list)              the list written out K times
 *   anything else, and every     flexGrow 0, flexShrink 0, flexBasis auto
 *   child past the list          (content-sized, as an auto track is)
 *
 * `repeat(auto-fill, …)` and `repeat(auto-fit, …)` need the stack's measured
 * size, so the list ends there and the children from that position on are
 * content-sized.
 *
 * Positions count each child that renders, through fragments, and skip a child
 * whose `position` prop is absolute or fixed, as grid does. A gui child takes
 * the style as props; any other element as a `style` entry after its own, which
 * a custom component has to pass to its root. Alignment is not renamed on
 * native: the stack is still flex there.
 */
import React from 'react'

import { isGuiComponent } from './isGuiComponent.tsx'

export type Axis = 'x' | 'y'

/** The axis a stack lays its tracks on, from its own flexDirection. */
export const axisOf = (props: Record<string, any>): Axis =>
  props.flexDirection === 'row' || props.flexDirection === 'row-reverse' ? 'x' : 'y'

/** Grid styles for a tracks stack on web. */
export const gridOf = (tracks: string, axis: Axis): Record<string, string> =>
  axis === 'x'
    ? {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: tracks,
        gridAutoRows: 'minmax(0, 1fr)',
      }
    : {
        display: 'grid',
        gridAutoFlow: 'row',
        gridTemplateRows: tracks,
        gridAutoColumns: 'minmax(0, 1fr)',
      }

const STACK: Record<string, string> = {
  alignItems: 'justifyItems',
  justifyContent: 'alignContent',
  alignContent: 'justifyContent',
}
const ITEM: Record<string, string> = { alignSelf: 'justifySelf' }
const BOTH: Record<string, string> = { ...STACK, ...ITEM }

/**
 * The renames for one component on web: as a vertical tracks stack, as a
 * direct child of one, or both. Undefined when neither, which is every
 * component that does not opt in.
 */
export function renamesOf(
  own: Axis | null,
  parent: Axis | null | undefined
): Record<string, string> | undefined {
  if (own === 'y') return parent === 'y' ? BOTH : STACK
  return parent === 'y' ? ITEM : undefined
}

type Flex = { flexGrow: number; flexShrink: number; flexBasis: number | string }

const CONTENT: Flex = { flexGrow: 0, flexShrink: 0, flexBasis: 'auto' }

const FR = /^(\d*\.?\d+)fr$/
const PX = /^(\d*\.?\d+)px$/
const PERCENT = /^\d*\.?\d+%$/

/** One track as a child's flex style. */
function flexOf(track: string): Flex {
  const fr = FR.exec(track)
  if (fr) return { flexGrow: Number(fr[1]), flexShrink: 1, flexBasis: 0 }
  const px = PX.exec(track)
  if (px) return { flexGrow: 0, flexShrink: 0, flexBasis: Number(px[1]) }
  if (track === '0') return { flexGrow: 0, flexShrink: 0, flexBasis: 0 }
  if (PERCENT.test(track)) return { flexGrow: 0, flexShrink: 0, flexBasis: track }
  if (track.startsWith('minmax(')) {
    const max = split(track.slice(7, -1), ',')[1]
    if (max && FR.test(max)) return flexOf(max)
  }
  return CONTENT
}

/** Split at the top level only, so `minmax(0, 1fr)` stays one piece. */
function split(list: string, at: ' ' | ','): string[] {
  const out: string[] = []
  let depth = 0
  let part = ''
  for (const c of list) {
    if (c === '(') depth++
    if (c === ')') depth--
    if (depth === 0 && (at === ' ' ? /\s/.test(c) : c === ',')) {
      if (part.trim()) out.push(part.trim())
      part = ''
    } else {
      part += c
    }
  }
  if (part.trim()) out.push(part.trim())
  return out
}

const REPEAT = /^repeat\(\s*(\d+)\s*,([\s\S]*)\)$/

const cache = new Map<string, Flex[]>()

/** The flex style for each position, read once per distinct track list. */
export function flexesOf(tracks: string): Flex[] {
  let flexes = cache.get(tracks)
  if (flexes) return flexes
  flexes = []
  for (const part of split(tracks, ' ')) {
    if (!part.startsWith('repeat(')) {
      flexes.push(flexOf(part))
      continue
    }
    const fixed = REPEAT.exec(part)
    if (!fixed) break
    const inner = split(fixed[2], ' ').map(flexOf)
    for (let i = 0; i < Number(fixed[1]); i++) flexes.push(...inner)
  }
  cache.set(tracks, flexes)
  return flexes
}

const placed = (child: React.ReactElement<any>) => {
  const position = child.props?.position
  return position !== 'absolute' && position !== 'fixed'
}

/** Native: each child takes the flex style of the track at its position. */
export function place(children: React.ReactNode, tracks: string): React.ReactNode {
  const flexes = flexesOf(tracks)
  const at = { i: 0 }
  const walk = (list: React.ReactNode): React.ReactNode =>
    React.Children.map(list, (node) => {
      if (node == null || typeof node === 'boolean') return node
      if (!React.isValidElement(node)) {
        at.i++
        return node
      }
      const child = node as React.ReactElement<any>
      if (child.type === React.Fragment) {
        return React.cloneElement(child, undefined, walk(child.props.children))
      }
      if (!placed(child)) return child
      const flex = flexes[at.i++] ?? CONTENT
      if (isGuiComponent(child.type)) return React.cloneElement(child, flex)
      const own = child.props.style
      return React.cloneElement(child, {
        style: own == null ? flex : [...(Array.isArray(own) ? own : [own]), flex],
      })
    })
  return walk(children)
}
