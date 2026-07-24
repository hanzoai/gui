'use client'

/**
 * styles — the shared Tamagui `styled()` atoms every chrome component composes.
 *
 * All styling lives INSIDE `styled()` definitions (where longhand style keys are
 * accepted and the compiler flattens them to atomic CSS); component files stay
 * declarative and pass only variants + content. Colour lifts on hover use the
 * CSS-inheritance idiom — a container sets `color` + `hoverStyle.color`, its
 * text child sets `color: 'inherit'`, and icons render with `color="currentColor"`
 * — so a parent hover restyles its children without group-selector typing.
 */

import { useEffect, useState, type CSSProperties } from 'react'
import { styled, Text, View } from '@hanzogui/web'
import { XStack, YStack } from '@hanzogui/stacks'
import { c, FONT, LG } from './tokens'

/* ── responsive ──────────────────────────────────────────────────────────────
 * A plain matchMedia hook instead of Tamagui media props: this package is built
 * in isolation (no host config augmentation), so `$lg`-style media keys are not
 * in the generic config type here. The chrome is already fully client-side, so a
 * JS breakpoint is faithful. Defaults wide so SSR/first paint match on desktop.
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

/* ── entrance ──────────────────────────────────────────────────────────────────
 * A CSS-transition-on-mount reveal, returned as a `style` object. Used instead of
 * Tamagui's `animation` prop for the same isolation reason as `useIsWide`: the
 * animation-driver keys are not in the generic config type when this package is
 * typechecked alone. Applying it via the web `style` escape hatch is bulletproof
 * and matches the site's 150ms ease-out fade+rise.
 */
export function useReveal(opts: { delay?: number; y?: number; duration?: number } = {}): CSSProperties {
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

/* ── layout re-exports ─────────────────────────────────────────────────────── */
export { XStack, YStack, View }

/* ── text ──────────────────────────────────────────────────────────────────── */

/** The one Geist text base; `role` selects the marketing type scale. */
export const Txt = styled(Text, {
  name: 'ChromeText',
  fontFamily: FONT,
  color: c.fg,

  variants: {
    role: {
      wordmark: { fontSize: 15, lineHeight: 20, fontWeight: '600', letterSpacing: -0.2 },
      nav: { fontSize: 14, lineHeight: 20, color: c.fgMuted },
      explore: { fontSize: 24, lineHeight: 30, fontWeight: '500' },
      desc: { fontSize: 12, lineHeight: 16, color: c.fgDim },
      kicker: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500',
        color: c.fgDim,
        textTransform: 'uppercase',
        letterSpacing: 1.4,
      },
      strong: { fontSize: 14, lineHeight: 20, fontWeight: '500', color: c.fgStrong },
      body: { fontSize: 14, lineHeight: 20, color: c.fgMuted },
      dim: { fontSize: 14, lineHeight: 20, color: c.fgDim },
      inherit: { fontSize: 14, lineHeight: 20, color: 'inherit' },
      mobile: { fontSize: 15, lineHeight: 22, fontWeight: '500', color: c.fgStrong },
    },
  } as const,

  defaultVariants: { role: 'body' },
})

/** A footer/mobile text-link — the whole element is the anchor, so hover lifts its own colour. */
export const LinkText = styled(Text, {
  name: 'ChromeLinkText',
  tag: 'a',
  role: 'link',
  fontFamily: FONT,
  cursor: 'pointer',
  fontSize: 14,
  lineHeight: 20,
  color: c.fgLink,
  hoverStyle: { color: c.fg },
})

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
export const MenuRow = styled(YStack, {
  name: 'ChromeMenuRow',
  tag: 'a',
  role: 'link',
  cursor: 'pointer',
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 12,
  hoverStyle: { backgroundColor: c.hover },
})

/** 1px hairline. */
export const Divider = styled(View, {
  name: 'ChromeDivider',
  height: 1,
  backgroundColor: c.line,
  alignSelf: 'stretch',
})

/** Round icon button (search / menu / close) — colour inherits to a currentColor icon. */
export const IconBtn = styled(View, {
  name: 'ChromeIconBtn',
  tag: 'button',
  role: 'button',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 8,
  borderRadius: 9999,
  backgroundColor: 'transparent',
  color: c.fgMuted,
  hoverStyle: { backgroundColor: c.hover, color: c.fg },
})
