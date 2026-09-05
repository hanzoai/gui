'use client'

/**
 * Shared Hanzo block-H mark + wordmark for the reusable shell chrome.
 * `fill="currentColor"` so it themes monochrome with the surrounding text color
 * (paper-white on the dark shell chrome; ink on light) — no baked-in hue.
 *
 * The brand context menu (right-click → guidelines, press, copy SVG) lives HERE
 * rather than in a second mark component. It was a second mark: the signed-in
 * header carried its own copy of these paths with the fill hardcoded white, so
 * the two marks could not theme together and a path edit had to be made twice.
 * A mark either carries the menu or it does not; that is a prop, not a fork.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CHROME, FS, LABEL, PANEL, R, Z, ghostHover, row } from './theme.ts'
import { useShellStyles } from './shellStyles.ts'

/** The mark's paths, as a standalone document — what "Copy SVG" hands over. */
const LOGO_SVG =
  `<svg viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg" fill="currentColor">` +
  `<path d="M22.21 67V44.6369H0V67H22.21Z"/>` +
  `<path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z"/>` +
  `<path d="M22.21 0H0V22.3184H22.21V0Z"/>` +
  `<path d="M66.7198 0H44.5098V22.3184H66.7198V0Z"/>` +
  `<path d="M66.7198 67V44.6369H44.5098V67H66.7198Z"/>` +
  `</svg>`

// Right-click opens the brand menu (guidelines, press, download, copy SVG). That
// is a behaviour attached to the brand, not a property of the glyph, so it lives
// here and both the mark and the wordmark can offer it. Asking for brand assets
// by right-clicking the NAME is at least as natural as right-clicking the H.
function useBrandMenu(enabled: boolean) {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return
      e.preventDefault()
      setMenu({ x: e.clientX, y: e.clientY })
    },
    [enabled]
  )
  return {
    onContextMenu,
    node: menu ? <BrandMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} /> : null,
  }
}

export function HanzoMark({
  size = 22,
  title = 'Hanzo',
  className,
  brandMenu = false,
  animate = false,
}: {
  size?: number
  title?: string
  className?: string
  /** Right-click opens the brand menu (guidelines, press, download, copy SVG). */
  brandMenu?: boolean
  /** Origami-style scale + slight 3D tilt on hover. */
  animate?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const { onContextMenu, node: menuNode } = useBrandMenu(brandMenu)

  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox="0 0 67 67"
        fill="currentColor"
        role="img"
        aria-label={title}
        className={className}
        style={
          animate
            ? {
                transition:
                  'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
                transform: hovered
                  ? 'scale(1.12) perspective(80px) rotateY(-6deg)'
                  : 'scale(1) perspective(80px) rotateY(0deg)',
                transformOrigin: 'center center',
              }
            : undefined
        }
        onMouseEnter={animate ? () => setHovered(true) : undefined}
        onMouseLeave={animate ? () => setHovered(false) : undefined}
        onContextMenu={brandMenu ? onContextMenu : undefined}
      >
        <path d="M22.21 67V44.6369H0V67H22.21Z" />
        <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" />
        <path d="M22.21 0H0V22.3184H22.21V0Z" />
        <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" />
        <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" />
      </svg>

      {menuNode}
    </>
  )
}

// Three things, three names, because they were two things under one.
//
// A MARK is the glyph. A WORDMARK is the name set in type. A LOCKUP is the pair.
// `HanzoWordmark` used to render the glyph AND the name, so a caller that wanted
// the name alone had no way to ask for it and every surface got the pair whether
// it suited the surface or not. Naming the pair is what lets either half be
// chosen: the header wears the wordmark, the footer wears the lockup, and
// neither has to restate the other's type or spacing to get there.

export function HanzoWordmark({
  // "Hanzo AI" — the company's name, which is what a wordmark says. This is only
  // the FALLBACK: every surface passes its own `brandName` from the registry, so
  // the bar reads Hanzo AI, Hanzo Chat, Hanzo App, Hanzo Cloud in its own place.
  // It matters because a bare "Hanzo" is the one spelling that is nobody's in
  // particular, and it is what shipped while the label was hard-coded here.
  label = 'Hanzo AI',
  size = 22,
  brandMenu = false,
}: {
  label?: string
  size?: number
  /** Right-click opens the brand menu, the same one the mark offers. */
  brandMenu?: boolean
}) {
  const { onContextMenu, node } = useBrandMenu(brandMenu)
  return (
    <span
      onContextMenu={onContextMenu}
      style={{
        // 0.86 of the box, not 0.62. The wordmark is the NAME of the place and it
        // was rendering at 14px beside 15px nav items and 18px sheet rows — the
        // one word on the bar that should outrank its neighbours was the smallest
        // thing on it, which is why it read as slightly wrong without looking
        // broken. At size 22 that is now ~19px: bigger than the row it leads,
        // which is the only relationship that has to hold.
        fontSize: Math.round(size * 0.86),
        // 600 — the weight the drawn wordmark is set in (Zen 600), so
        // the name in the corner and the name on the brand page are one piece
        // of type. 800 was heavier than anything else the house sets and read
        // as a shout rather than as a signature.
        fontWeight: 600,
        // Tightens as it grows. -0.2 was tuned at 14px; the same absolute
        // tracking reads loose at 19px, and this is one word set once.
        letterSpacing: -0.4,
        color: 'inherit',
      }}
    >
      {label}
      {node}
    </span>
  )
}

export function HanzoLockup({
  label = 'Hanzo',
  size = 22,
}: {
  label?: string
  size?: number
}) {
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'inherit' }}
    >
      <HanzoMark size={size} />
      <HanzoWordmark label={label} size={size} />
    </span>
  )
}

/** One row shape for both the link and the button form of a menu item. */
const MENU_ITEM: React.CSSProperties = {
  ...row(),
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  margin: 0,
  padding: '7px 8px',
  borderRadius: R.row,
  border: 'none',
  background: 'transparent',
  fontSize: FS.sm,
  fontFamily: 'inherit',
  textAlign: 'left',
}

const BRAND_LINKS = [
  { label: 'Brand Guidelines', href: 'https://hanzo.ai/brand' },
  { label: 'Press Kit', href: 'https://hanzo.ai/press' },
  { label: 'Download Logo', href: 'https://hanzo.ai/brand#download' },
  { label: 'hanzo.ai →', href: 'https://hanzo.ai' },
]

function BrandMenu({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  useShellStyles()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const away = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', escape)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Hanzo brand"
      data-hanzo-shell=""
      style={{
        position: 'fixed',
        top: y,
        left: x,
        ...PANEL,
        zIndex: Z.popover as unknown as number,
        minWidth: 180,
        padding: 6,
        fontFamily: CHROME.font,
      }}
    >
      <div
        style={{
          borderBottom: `1px solid ${CHROME.borderSoft}`,
          padding: '2px 8px 6px',
          marginBottom: 4,
        }}
      >
        <p style={{ ...LABEL, margin: 0 }}>Hanzo brand</p>
      </div>
      {BRAND_LINKS.map((item) => (
        <a
          key={item.label}
          href={item.href}
          role="menuitem"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          style={MENU_ITEM}
          {...ghostHover()}
        >
          {item.label}
        </a>
      ))}
      <button
        type="button"
        role="menuitem"
        onClick={() => {
          navigator.clipboard.writeText(LOGO_SVG).catch(() => {})
          onClose()
        }}
        style={MENU_ITEM}
        {...ghostHover()}
      >
        Copy SVG
      </button>
    </div>
  )
}
