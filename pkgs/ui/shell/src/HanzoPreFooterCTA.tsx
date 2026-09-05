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
import { resolveSurface } from './HanzoHeader.tsx'
import { type HanzoLink, type HanzoSurface } from './hanzo-registry.ts'
import { CHROME, FS, TAP_H, cta } from './theme.ts'
import { useShellStyles } from './shellStyles.ts'

export interface HanzoPreFooterCTAProps {
  /** A `HanzoSurface`, or a surface id / hostname to resolve one. */
  surface: HanzoSurface | string
  className?: string
}

export function HanzoPreFooterCTA({ surface, className }: HanzoPreFooterCTAProps) {
  useShellStyles()
  const s = resolveSurface(surface)
  const { heading, actions } = s.preFooter

  return (
    <section
      data-hanzo-shell=""
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
        <div
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}
        >
          {actions.map((action, i) => (
            <ActionButton
              key={action.id}
              link={action}
              variant={i === 0 ? 'filled' : 'ghost'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Piece ───────────────────────────────────────────────────────────────── */

function ActionButton({
  link,
  variant,
}: {
  link: HanzoLink
  variant: 'ghost' | 'filled'
}) {
  const filled = variant === 'filled'
  return (
    <a
      href={link.href}
      style={{ ...cta(filled, TAP_H), fontSize: FS.base }}
      onMouseEnter={(e) => {
        if (filled) e.currentTarget.style.opacity = '0.85'
        else e.currentTarget.style.background = CHROME.hover
      }}
      onMouseLeave={(e) => {
        if (filled) e.currentTarget.style.opacity = '1'
        else e.currentTarget.style.background = 'transparent'
      }}
    >
      {link.label}
    </a>
  )
}
