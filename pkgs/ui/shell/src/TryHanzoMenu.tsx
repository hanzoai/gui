'use client'

/**
 * TryHanzoMenu — what the primary action opens.
 *
 * "Try Hanzo" was one link to the console, which answered a question nobody
 * asked. A visitor arrives wanting to build an app, or to put data somewhere,
 * or to chat, or to code from a terminal; the console is one of those. So the
 * action names the doors and the visitor picks.
 *
 *   ┌──────────────────────────────┬─────────────────────┐
 *   │ OPEN                         │ INSTALL             │
 *   │ Hanzo Chat    Ask anything   │ Desktop app         │
 *   │ Hanzo App     Build and ship │ Browser extension   │
 *   │ Hanzo Base    Data, auth …   │ Hanzo CLI           │
 *   │ …                            │ …                   │
 *   └──────────────────────────────┴─────────────────────┘
 *
 * NOT a second Meet Hanzo, and it must never become one. Meet Hanzo answers
 * "what IS Hanzo" and carries the whole ecosystem; this answers "start what?"
 * and holds only what you can OPEN right now. They cannot drift, because
 * neither owns a list — both project `HANZO_PRODUCTS`, so a product is spelled
 * once and appears in both.
 *
 * A CARD, not a drape. Meet Hanzo and Products are full-bleed panels under the
 * bar because they are for reading; this is for choosing, so it hangs off its
 * own trigger at the right edge and stays the width of its contents. The two
 * shapes are how a reader tells "browse" from "go" before reading a word.
 *
 * Self-contained: inline styles + theme.ts tokens, React the only runtime dep.
 * Esc closes and returns focus; ↑/↓/←/→/Home/End rove (see `useRove`), and a
 * hover opens it without stealing the caret (see `useIntent`).
 */
import React, { useCallback, useMemo } from 'react'
import type { PointerEventHandler } from 'react'
import { TRY_HANZO_GROUPS } from './hanzo-registry'
import { CHROME, FS, GLASS, LABEL, R, SHADOW, Z, ghostHover, row } from './theme'
import { useShellStyles } from './shellStyles'
import { useIsMobile } from './useMediaQuery'
import { useRove } from './rove'

/** Matches the header's own `padding: 0 16px`, so the card lines up with the bar. */
const EDGE = 16
/** The Open column. Wide enough for "Hanzo Studio" + its hint on one line. */
const OPEN_W = 232
/** The Install column. Wide enough for "Browser extension" without wrapping. */
const INSTALL_W = 168
/** Below this the card gives up its two columns and stacks, like the drapes do. */
const STACK_BELOW = 900

export interface TryHanzoMenuProps {
  open?: boolean
  onClose?: () => void
  /** px from the viewport top where the card hangs (under the header row). */
  anchor?: number
  id?: string
  className?: string
  /** Take focus on open — true for a click or a key, false for a hover. */
  autoFocus?: boolean
  onPointerEnter?: PointerEventHandler<HTMLDivElement>
  onPointerLeave?: PointerEventHandler<HTMLDivElement>
}

export function TryHanzoMenu({
  open,
  onClose,
  anchor = 60,
  id,
  className,
  autoFocus = true,
  onPointerEnter,
  onPointerLeave,
}: TryHanzoMenuProps) {
  useShellStyles()
  const stacked = useIsMobile(STACK_BELOW)
  const close = useCallback(() => onClose?.(), [onClose])
  const rove = useRove(!!open, close, autoFocus)

  const [opens, installs] = useMemo(
    () => [
      TRY_HANZO_GROUPS.find((g) => g.id === 'open'),
      TRY_HANZO_GROUPS.find((g) => g.id === 'install'),
    ],
    []
  )

  if (!open) return null

  return (
    <div
      id={id}
      role="dialog"
      aria-label="Try Hanzo"
      className={className}
      ref={rove.ref}
      onKeyDown={rove.onKeyDown}
      onFocus={rove.onFocus}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={{
        position: 'fixed',
        top: anchor,
        right: EDGE,
        // A phone has no room for a card hanging off one edge, so it spans.
        left: stacked ? EDGE : undefined,
        zIndex: Z.sticky as unknown as number,
        display: 'flex',
        flexDirection: stacked ? 'column' : 'row',
        gap: stacked ? 18 : 28,
        padding: 18,
        borderRadius: R.card,
        border: `1px solid ${CHROME.border}`,
        boxShadow: SHADOW,
        // The bar's own glass, continuing — one surface, lit once.
        ...GLASS,
        color: CHROME.fg,
        fontFamily: CHROME.font,
        // A long list on a short phone must not run off the bottom; `dvh`
        // because a phone's URL bar moves the usable height.
        maxHeight: `calc(100dvh - ${anchor + EDGE}px)`,
        overflowY: 'auto',
      }}
    >
      {[
        { g: opens, w: OPEN_W, hints: true },
        { g: installs, w: INSTALL_W, hints: false },
      ].map(({ g, w, hints }) =>
        g ? (
          <div key={g.id} style={{ minWidth: 0, width: stacked ? '100%' : w }}>
            <div style={{ ...LABEL, marginBottom: 6 }}>{g.title}</div>
            {g.items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={close}
                style={{ ...row(), display: 'block', padding: '4px 8px', textDecoration: 'none' }}
                {...ghostHover()}
              >
                <span style={{ display: 'block', fontSize: FS.sm, fontWeight: 500 }}>
                  {item.label}
                </span>
                {hints && item.hint ? (
                  <span
                    style={{
                      display: 'block',
                      fontSize: FS.xs,
                      color: CHROME.fgMuted,
                      lineHeight: '1.35',
                    }}
                  >
                    {item.hint}
                  </span>
                ) : null}
              </a>
            ))}
          </div>
        ) : null
      )}
    </div>
  )
}

export default TryHanzoMenu
