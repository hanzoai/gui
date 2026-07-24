'use client'

/**
 * ProductsMegaMenu — the RICH ten-category cloud Products mega-menu, at the
 * flagship (hanzo.ai) level of richness. It renders a `ProductCategory[]` as the
 * signature "two rows of five" cloud taxonomy:
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │ AI →       Compute →   Data →      Network →   Security →              │
 *   │  Models     GPUs        Vector      Gateway     IAM                    │
 *   │  Agents     Machines    SQL         VPC         Authz     … item lists  │
 *   │  …          …           …           …           …                       │
 *   │ Dev →      Platform →  Observe →   Web3 →      Apps →                   │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 * Each category header links to its `/products/<slug>` landing page; each leaf
 * links to its product page and shows a short descriptor (`hint`). The current
 * category (`currentCategoryId`) and the current leaf (`currentHref`) are
 * highlighted with the accent + `aria-current`.
 *
 * Controlled-open (`open`/`onClose`/`anchor`) so a header can drive it. Self-
 * contained: inline styles + theme.ts tokens, React the only runtime dep — drops
 * into any host with zero setup. Fully keyboard-accessible: Esc closes and
 * returns focus to the trigger; ↑/↓/←/→/Home/End rove the links (category
 * headers + leaves in render order).
 */
import React, { useCallback, useEffect, useRef } from 'react'
import { type HanzoLink, type ProductCategory } from './hanzo-registry'
import { ACCENT, ACCENT_SOFT, ACCENT_SOFTER, CHROME, FS, Z } from './theme'

export interface ProductsMegaMenuProps {
  /** The category taxonomy to render (≈10 categories, ≈6 leaves each). */
  categories: ProductCategory[]
  /** Controlled visibility. When false/undefined the menu renders nothing. */
  open?: boolean
  /** Called on Esc, backdrop click, or item activation. */
  onClose?: () => void
  /** px from the viewport top where the panel drops (under the header row). */
  anchor?: number
  /** Highlights the current category header (accent + `aria-current`). */
  currentCategoryId?: string
  /** Highlights the current leaf whose href matches (accent + `aria-current`). */
  currentHref?: string
  /** id for the panel (wire the trigger's `aria-controls` to it). */
  id?: string
  className?: string
}

export function ProductsMegaMenu({
  categories,
  open,
  onClose,
  anchor = 60,
  currentCategoryId,
  currentHref,
  id,
  className,
}: ProductsMegaMenuProps) {
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const restoreRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => onClose?.(), [onClose])

  // Save focus on open, restore it on close (clean keyboard loop).
  useEffect(() => {
    if (!open) return
    restoreRef.current = (document.activeElement as HTMLElement) ?? null
    const first = itemRefs.current.find(Boolean)
    requestAnimationFrame(() => first?.focus())
    return () => {
      restoreRef.current?.focus?.()
    }
  }, [open])

  const focusItem = useCallback((i: number) => {
    const els = itemRefs.current.filter(Boolean) as HTMLAnchorElement[]
    if (els.length === 0) return
    const idx = ((i % els.length) + els.length) % els.length
    els[idx]?.focus()
  }, [])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      const els = itemRefs.current.filter(Boolean) as HTMLAnchorElement[]
      const cur = els.indexOf(document.activeElement as HTMLAnchorElement)
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          focusItem((cur < 0 ? -1 : cur) + 1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          focusItem((cur < 0 ? els.length : cur) - 1)
          break
        case 'Home':
          e.preventDefault()
          focusItem(0)
          break
        case 'End':
          e.preventDefault()
          focusItem(els.length - 1)
          break
      }
    },
    [close, focusItem],
  )

  // Reset the ref list each render so indices track render order.
  itemRefs.current = []
  const register = (el: HTMLAnchorElement | null) => {
    if (el) itemRefs.current.push(el)
  }

  if (!open) return null

  return (
    <>
      {/* Click-away backdrop (transparent). */}
      <div
        aria-hidden="true"
        onClick={close}
        style={{ position: 'fixed', inset: 0, zIndex: Z.overlay as unknown as number, background: 'transparent' }}
      />
      <div
        id={id}
        role="dialog"
        aria-modal="false"
        aria-label="Products"
        className={className}
        onKeyDown={onKeyDown}
        style={{
          position: 'fixed',
          top: anchor,
          left: 0,
          right: 0,
          zIndex: Z.modal as unknown as number,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 16px 16px',
          boxSizing: 'border-box',
          fontFamily: CHROME.font,
          color: CHROME.fg,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1180,
            maxHeight: 'calc(100vh - 96px)',
            overflowY: 'auto',
            padding: 24,
            borderRadius: 18,
            border: `1px solid ${CHROME.border}`,
            background: CHROME.panel,
            boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '20px 24px',
            }}
          >
            {categories.map((category) => (
              <CategoryColumn
                key={category.id}
                category={category}
                currentCategory={category.id === currentCategoryId}
                currentHref={currentHref}
                register={register}
                onNavigate={close}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

function CategoryColumn({
  category,
  currentCategory,
  currentHref,
  register,
  onNavigate,
}: {
  category: ProductCategory
  currentCategory: boolean
  currentHref?: string
  register: (el: HTMLAnchorElement | null) => void
  onNavigate: () => void
}) {
  return (
    <div>
      {/* Category header — links to its /products/<slug> landing page. */}
      <a
        ref={register}
        href={category.href}
        aria-current={currentCategory ? 'true' : undefined}
        onClick={onNavigate}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          margin: '0 -6px 4px',
          padding: '2px 6px',
          borderRadius: 7,
          textDecoration: 'none',
          fontSize: FS.xs,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          color: currentCategory ? ACCENT : CHROME.fg,
          outlineColor: ACCENT,
          transition: 'color 120ms ease',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.color = ACCENT
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.color = currentCategory ? ACCENT : CHROME.fg
        }}
      >
        {category.label}
        <Arrow />
      </a>

      {category.tagline ? (
        <p
          title={category.tagline}
          style={{
            margin: '0 0 8px',
            fontSize: FS.xs,
            lineHeight: 1.3,
            color: CHROME.fgDim,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {category.tagline}
        </p>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {category.items.map((item) => (
          <LeafRow
            key={item.id}
            link={item}
            current={!!currentHref && item.href === currentHref}
            register={register}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  )
}

function LeafRow({
  link,
  current,
  register,
  onNavigate,
}: {
  link: HanzoLink
  current: boolean
  register: (el: HTMLAnchorElement | null) => void
  onNavigate: () => void
}) {
  return (
    <a
      ref={register}
      href={link.href}
      aria-current={current ? 'true' : undefined}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noreferrer noopener' : undefined}
      onClick={onNavigate}
      style={{
        display: 'block',
        padding: '5px 8px',
        margin: '0 -8px',
        borderRadius: 8,
        textDecoration: 'none',
        outlineColor: ACCENT,
        background: current ? ACCENT_SOFT : 'transparent',
        transition: 'background 120ms ease',
      }}
      onMouseEnter={(e) => {
        if (!current) (e.currentTarget as HTMLElement).style.background = ACCENT_SOFTER
      }}
      onMouseLeave={(e) => {
        if (!current) (e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      <span
        style={{
          display: 'block',
          fontSize: FS.sm,
          fontWeight: 500,
          lineHeight: 1.25,
          color: current ? ACCENT : CHROME.fg,
        }}
      >
        {link.label}
      </span>
      {link.hint ? (
        <span
          style={{
            display: 'block',
            fontSize: FS.xs,
            lineHeight: 1.25,
            color: CHROME.fgDim,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {link.hint}
        </span>
      ) : null}
    </a>
  )
}

function Arrow() {
  return (
    <svg
      width={10}
      height={10}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
