'use client'

/**
 * HanzoPreFooterCTA — the product-specific call-to-action band placed
 * immediately ABOVE the shared <HanzoFooter> on every marketing page.
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │            Turn an idea into a live application                        │
 *   │              [ New project ]   [ Browse templates ]                   │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 * The heading + actions are DATA from the surface's `preFooter` (in the
 * registry), so each property says its own thing while the layout stays
 * identical. Self-contained: inline styles + theme.ts tokens.
 */
import React from 'react'
import { resolveSurface } from './HanzoHeader'
import { type HanzoLink, type HanzoSurface } from './hanzo-registry'
import { ACCENT, CHROME, FS } from './theme'

export interface HanzoPreFooterCTAProps {
  /** A `HanzoSurface`, or a surface id / hostname to resolve one. */
  surface: HanzoSurface | string
  className?: string
}

export function HanzoPreFooterCTA({ surface, className }: HanzoPreFooterCTAProps) {
  const s = resolveSurface(surface)
  const { heading, actions } = s.preFooter

  return (
    <section
      className={className}
      aria-label={heading}
      style={{
        borderTop: `1px solid ${CHROME.border}`,
        background: CHROME.bg,
        color: CHROME.fg,
        fontFamily: CHROME.font,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '56px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: FS['2xl'],
            fontWeight: 800,
            letterSpacing: -0.4,
            lineHeight: 1.15,
          }}
        >
          {heading}
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          {actions.map((action, i) => (
            <ActionButton key={action.id} link={action} variant={i === 0 ? 'filled' : 'ghost'} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Piece ───────────────────────────────────────────────────────────────── */

function ActionButton({ link, variant }: { link: HanzoLink; variant: 'ghost' | 'filled' }) {
  const filled = variant === 'filled'
  return (
    <a
      href={link.href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 42,
        padding: '0 22px',
        borderRadius: 10,
        textDecoration: 'none',
        fontSize: FS.base,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        border: filled ? '1px solid transparent' : `1px solid ${CHROME.border}`,
        background: filled ? ACCENT : 'transparent',
        color: filled ? '#0b0b0f' : CHROME.fg,
        transition: 'opacity 120ms ease, background 120ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        if (filled) el.style.opacity = '0.85'
        else el.style.background = CHROME.hover
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        if (filled) el.style.opacity = '1'
        else el.style.background = 'transparent'
      }}
    >
      {link.label}
    </a>
  )
}
