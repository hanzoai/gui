'use client'

/**
 * styles — the shared Gui `styled()` atoms + hooks every chrome component
 * composes. All styling lives INSIDE `styled()` (the compiler flattens it to
 * atomic CSS); component files pass only variants + content.
 *
 * Gui facts this package respects (it is built in isolation, without the
 * host's config augmentation):
 *  - element type is set with `render: 'a' | 'button' | …` (not `tag`);
 *  - hover handlers are the DOM `onMouseEnter` / `onMouseLeave` (not `onHoverIn`);
 *  - only Text carries `color` (Stacks/Views do not), so hover colour-lift on a
 *    row is driven by `useHover()` + an explicit `color` prop on the child Text;
 *  - inline style props use LONGHAND (`textAlign`, `paddingHorizontal`, …) — the
 *    `text` / `px` shorthands live in config augmentation absent here;
 *  - anchors forward `href`/`target`/`rel` through a `.styleable` wrapper
 *    (`linkable`), the same pattern as the repo's own `Anchor`.
 */

import { useEffect, useState, type CSSProperties, type FC } from 'react'
import { styled, Text, View, type GetProps, type StylableComponent } from '@hanzogui/web'
import { XStack, YStack } from '@hanzogui/stacks'
import { c, FONT, LG } from './tokens'

/* ── hooks ─────────────────────────────────────────────────────────────────── */

/**
 * matchMedia breakpoint. Plain hook (not Gui `$lg` media props): this package
 * is built in isolation without the host config augmentation, so media keys are
 * not in the generic config type here — and the chrome is client-side anyway.
 * Defaults wide so SSR/first paint match on desktop.
 */
export function useIsWide(min: number = LG): boolean {
  const [wide, setWide] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${min}px)`)
    const sync = () => setWide(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [min])
  return wide
}

/** Hover state for colour-lift on icon+text rows (Stacks can't cascade `color`). */
export function useHover() {
  const [hovered, setHovered] = useState(false)
  return {
    hovered,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }
}

/**
 * CSS-transition-on-mount reveal (returned as a `style` object). Used instead of
 * Gui's `animation` prop for the same isolation reason as `useIsWide`.
 */
export function useReveal(
  opts: { delay?: number; y?: number; duration?: number } = {}
): CSSProperties {
  const { delay = 0, y = 0, duration = 150 } = opts
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return {
    opacity: on ? 1 : 0,
    transform: on ? 'none' : `translateY(${y}px)`,
    transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
  }
}

/* ── anchor helper ─────────────────────────────────────────────────────────── */

export type AnchorExtra = { href?: string; target?: string; rel?: string }

/** Wrap a `render:'a'` styled frame so it accepts + forwards href/target/rel. */
function linkable(Frame: any): any {
  return Frame.styleable((props: any, ref: any) => {
    const { href, target, rel, ...rest } = props
    return (
      <Frame
        ref={ref}
        {...rest}
        {...(href !== undefined ? { href, target, rel } : null)}
      />
    )
  })
}

/** Type a linkable frame as a component that also accepts href/target/rel. */
export type Link<F extends StylableComponent> = FC<GetProps<F> & AnchorExtra>

/* ── layout re-exports ─────────────────────────────────────────────────────── */
export { XStack, YStack, View, linkable }

/* ── text ──────────────────────────────────────────────────────────────────── */

/** The one Geist text base; `kind` selects the marketing type scale. */
export const Txt = styled(Text, {
  name: 'ChromeText',
  fontFamily: FONT,
  color: c.fg,

  variants: {
    kind: {
      wordmark: { fontSize: 15, lineHeight: 20, fontWeight: '600', letterSpacing: -0.2 },
      nav: { fontSize: 14, lineHeight: 20, color: c.fgMuted },
      explore: { fontSize: 24, lineHeight: 30, fontWeight: '500' },
      desc: { fontSize: 12, lineHeight: 16, color: c.fgDim },
      // Section head. Sentence case — matches @hanzogui/shell's LABEL token,
      // which is the one place that rank is defined. It earns rank from weight
      // and brightness against the dimmer links beneath it, never from caps or
      // wide tracking.
      kicker: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        color: c.fgStrong,
      },
      strong: { fontSize: 14, lineHeight: 20, fontWeight: '500', color: c.fgStrong },
      body: { fontSize: 14, lineHeight: 20, color: c.fgMuted },
      dim: { fontSize: 14, lineHeight: 20, color: c.fgDim },
      mobile: { fontSize: 15, lineHeight: 22, fontWeight: '500', color: c.fgStrong },
    },
  } as const,

  defaultVariants: { kind: 'body' },
})

/** A footer/mobile text-link — the whole element is the anchor, so its own hover lifts colour. */
const LinkTextFrame = styled(Text, {
  name: 'ChromeLinkText',
  render: 'a',
  role: 'link',
  fontFamily: FONT,
  cursor: 'pointer',
  fontSize: 14,
  lineHeight: 20,
  color: c.fgLink,
  hoverStyle: { color: c.fg },
})
export const LinkText = linkable(LinkTextFrame) as Link<typeof LinkTextFrame>

/* ── surfaces ──────────────────────────────────────────────────────────────── */

/** A raised menu/panel card (login + Try dropdowns). */
export const Surface = styled(YStack, {
  name: 'ChromeSurface',
  backgroundColor: c.surface,
  borderWidth: 1,
  borderColor: c.line,
  borderRadius: 16,
  padding: 8,
  shadowColor: '#000',
  shadowOpacity: 0.6,
  shadowRadius: 40,
  shadowOffset: { width: 0, height: 24 },
})

/** A block link row inside a Surface / mega-panel — hover washes the background. */
const LinkRowFrame = styled(YStack, {
  name: 'ChromeLinkRow',
  render: 'a',
  role: 'link',
  cursor: 'pointer',
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 12,
  hoverStyle: { backgroundColor: c.hover },
})
export const LinkRow = linkable(LinkRowFrame) as Link<typeof LinkRowFrame>

/** 1px hairline. */
export const Divider = styled(View, {
  name: 'ChromeDivider',
  height: 1,
  backgroundColor: c.line,
  alignSelf: 'stretch',
})

/** Round icon button (search / menu / close) — background washes on hover. */
export const IconBtn = styled(View, {
  name: 'ChromeIconBtn',
  render: 'button',
  role: 'button',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 8,
  borderRadius: 9999,
  backgroundColor: 'transparent',
  hoverStyle: { backgroundColor: c.hover },
})
