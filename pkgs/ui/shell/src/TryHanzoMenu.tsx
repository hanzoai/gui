'use client'

/**
 * TryHanzoMenu — what the primary action opens.
 *
 * "Try Hanzo" was one link to the console, which answered a question nobody
 * asked. A visitor arrives wanting to build an app, or to put data somewhere,
 * or to chat, or to code from a terminal; the console is one of those. So the
 * action names the products and the visitor picks.
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
import { MARKS } from './glyph'
import { CHROME, FS, GLASS, LABEL, R, SHADOW, Z, ghostHover, row, veil } from './theme'
import { useShellStyles } from './shellStyles'
import { useIsMobile } from './useMediaQuery'
import { useRove } from './rove'

/** Matches the header's own `padding: 0 16px`, so the card lines up with the bar. */
const EDGE = 16
/** The Open column. Wide enough for "Hanzo Studio" + its hint on one line. */
const OPEN_W = 206
/** The Install column. Wide enough for "Browser extension" without wrapping. */
const INSTALL_W = 168
/** Below this the card gives up its two columns and stacks, like the drapes do. */
const STACK_BELOW = 900
/**
 * How far apart the rows arrive, in ms.
 *
 * Small on purpose. The cascade is meant to be felt rather than watched: at
 * 22ms thirteen rows are all in within 300ms, which still reads as one gesture.
 * Anything slower turns a menu into a performance the second time you open it.
 */
const CASCADE = 22

/* Each row's mark comes from the row itself (`HanzoLink.glyph`), resolved
   against the ONE table in `glyph.tsx` — the same table the launcher's tiles and
   both drapes draw from. It used to be a lookup by id against `HANZO_APPS`,
   which answered only for rows that were also launcher tiles; a row naming its
   own mark answers for every row, and there is still exactly one place a shape
   is drawn. */

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
    <>
      {/* The page RECEDES behind this card exactly as it does behind the two
          planes — same `veil`, same click-to-close. It was the one menu in the
          bar that left the page in full focus, which is what made it read as a
          different menu system rather than as the same one in a smaller shape. */}
      <div aria-hidden="true" onClick={close} style={veil(anchor)} />
      <div
        id={id}
        role="dialog"
        aria-label="Try Hanzo"
        /* The card is a SIBLING of the bar, not a child, so it does not inherit
         the header's marker — and without it none of shellStyles reaches here:
         not the hover rules below, and not the reduced-motion silencer, which
         is the one that matters, because this surface states its entrance as an
         inline `animation` that no media query can otherwise reach. */
        data-hanzo-shell=""
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
          zIndex: Z.modal as unknown as number,
          display: 'flex',
          flexDirection: stacked ? 'column' : 'row',
          gap: stacked ? 14 : 20,
          padding: 12,
          borderRadius: R.card,
          border: `1px solid ${CHROME.border}`,
          boxShadow: SHADOW,
          // A rounded card floating over the page, so it shows the page through
          // it. The bar itself does not — a full-width plane wearing this would
          // put a blur behind the words. See `GLASS`.
          ...GLASS,
          color: CHROME.fg,
          fontFamily: CHROME.font,
          // It drops out of the pill that opened it, so it grows from that
          // corner. Scaling from the centre would make the card appear to arrive
          // from behind the page instead of out of the control.
          transformOrigin: stacked ? 'top center' : 'top right',
          animation: 'hanzo-card-in 200ms cubic-bezier(.2,.9,.3,1.1) both',
          // A long list on a short phone must not run off the bottom; `dvh`
          // because a phone's URL bar moves the usable height.
          maxHeight: `calc(100dvh - ${anchor + EDGE}px)`,
          overflowY: 'auto',
        }}
      >
        {(() => {
          // One counter across BOTH columns, so the rows arrive in reading order
          // rather than two columns racing each other.
          let seq = 0
          return [
            { g: opens, w: OPEN_W, hints: true },
            { g: installs, w: INSTALL_W, hints: false },
          ].map(({ g, w, hints }) =>
            g ? (
              <div key={g.id} style={{ minWidth: 0, width: stacked ? '100%' : w }}>
                <div style={{ ...LABEL, marginBottom: 4 }}>{g.title}</div>
                {g.items.map((item) => {
                  const Mark = item.glyph ? MARKS[item.glyph] : undefined
                  const delay = seq++ * CASCADE
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={close}
                      className="hanzo-door"
                      style={{
                        ...row(),
                        display: 'block',
                        padding: '2px 8px',
                        textDecoration: 'none',
                        animation: `hanzo-row-in 180ms ease-out ${delay}ms both`,
                      }}
                      {...ghostHover()}
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: FS.sm,
                          fontWeight: 500,
                          // Stated, not inherited: the default line box on a
                          // flex row is tall enough to add 5px to every row,
                          // which over thirteen of them is a taller card for
                          // nothing a reader can see.
                          lineHeight: 1.35,
                        }}
                      >
                        {/* The rail is 18px whether or not there is a mark in it,
                          so one row without an icon cannot shunt its label out
                          of the column the others line up on. */}
                        <span
                          aria-hidden
                          className="hanzo-door-mark"
                          style={{
                            display: 'inline-flex',
                            width: 18,
                            flexShrink: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: CHROME.fgMuted,
                          }}
                        >
                          {Mark ? <Mark size={16} /> : null}
                        </span>
                        {item.label}
                        {/* Where it goes, said only while the pointer is on it —
                          a row of thirteen permanent arrows is noise. */}
                        <span
                          aria-hidden
                          className="hanzo-door-go"
                          style={{
                            marginLeft: 'auto',
                            paddingLeft: 6,
                            fontSize: FS.xs,
                            color: 'inherit',
                          }}
                        >
                          →
                        </span>
                      </span>
                      {hints && item.hint ? (
                        <span
                          style={{
                            display: 'block',
                            /* Clears the 18px rail + its 8px gap so the tagline
                             sits under the LABEL rather than under the mark. */
                            marginLeft: 26,
                            fontSize: FS.xs,
                            color: CHROME.fgMuted,
                            lineHeight: 1.3,
                          }}
                        >
                          {item.hint}
                        </span>
                      ) : null}
                    </a>
                  )
                })}
              </div>
            ) : null
          )
        })()}
      </div>
    </>
  )
}

export default TryHanzoMenu
