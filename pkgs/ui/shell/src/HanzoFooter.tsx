'use client'

/**
 * HanzoFooter — the ONE ecosystem footer for every Hanzo property.
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │ PRODUCTS      AI PLATFORM   INSTALL      DEVELOPERS  RESOURCES  COMPANY │
 *   │ Hanzo Chat    Models        Desktop app  Docs        Quickstarts About  │
 *   │ …             …             …            …           …          …       │
 *   │ ───────────────────────────────────────────────────────────────────── │
 *   │ [H Hanzo]   © 2026 Hanzo AI, Inc.       Status · Security · Privacy · … │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 * Everything is DATA from the registry (`HANZO_FOOTER_COLUMNS` +
 * `HANZO_FOOTER_BOTTOM`) so the footer is byte-identical across surfaces; the
 * current product is highlighted in the PRODUCTS column. Self-contained: inline
 * styles + theme.ts tokens, React the only runtime dep — drops into any host.
 */
import React from 'react'
import { HanzoWordmark } from './mark'
import { HANZO_FOOTER_BOTTOM, HANZO_FOOTER_COLUMNS, type HanzoLink } from './hanzo-registry'
import { ACCENT, CHROME, FS } from './theme'
import { useShellFocusRing } from './focusRing'

export interface HanzoFooterProps {
  /** Highlights the current product in the PRODUCTS column (`aria-current`). */
  currentProductId?: string
  className?: string
}

export function HanzoFooter({ currentProductId, className }: HanzoFooterProps) {
  useShellFocusRing()
  return (
    <footer
      role="contentinfo"
      data-hanzo-shell=""
      className={className}
      style={{
        borderTop: `1px solid ${CHROME.border}`,
        background: CHROME.panel,
        color: CHROME.fg,
        fontFamily: CHROME.font,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 24px', boxSizing: 'border-box' }}>
        {/* ── Link columns ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '32px 24px',
          }}
        >
          {HANZO_FOOTER_COLUMNS.map((col) => (
            <nav key={col.id} aria-label={col.title}>
              <div
                style={{
                  fontSize: FS.xs,
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                  color: CHROME.fgDim,
                  marginBottom: 14,
                }}
              >
                {col.title}
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {col.items.map((item) => (
                  <li key={item.id}>
                    <FooterLink link={item} current={col.id === 'products' && item.id === currentProductId} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── Bottom legal bar ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 16,
            marginTop: 40,
            paddingTop: 22,
            borderTop: `1px solid ${CHROME.border}`,
          }}
        >
          <a href="https://hanzo.ai" aria-label="Hanzo" style={{ color: CHROME.fg, textDecoration: 'none', flexShrink: 0 }}>
            <HanzoWordmark label="Hanzo" size={20} />
          </a>
          <span style={{ fontSize: FS.sm, color: CHROME.fgMuted, flexShrink: 0 }}>
            {HANZO_FOOTER_BOTTOM.copyright}
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {HANZO_FOOTER_BOTTOM.links.map((link) => (
              <LegalLink key={link.id} link={link} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

function FooterLink({ link, current }: { link: HanzoLink; current: boolean }) {
  return (
    <a
      href={link.href}
      aria-current={current ? 'true' : undefined}
      style={{
        fontSize: FS.sm,
        textDecoration: 'none',
        color: current ? ACCENT : CHROME.fgMuted,
        transition: 'color 120ms ease',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.color = CHROME.fg
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.color = current ? ACCENT : CHROME.fgMuted
      }}
    >
      {link.label}
    </a>
  )
}

function LegalLink({ link }: { link: HanzoLink }) {
  return (
    <a
      href={link.href}
      style={{
        fontSize: FS.sm,
        textDecoration: 'none',
        color: CHROME.fgMuted,
        padding: '2px 6px',
        borderRadius: 6,
        transition: 'color 120ms ease',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.color = CHROME.fg
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.color = CHROME.fgMuted
      }}
    >
      {link.label}
    </a>
  )
}
