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
import { CHROME, FS, LABEL, PANEL, R, Z, ghostHover, row } from './theme'
import { useShellStyles } from './shellStyles'

/** The mark's paths, as a standalone document — what "Copy SVG" hands over. */
const LOGO_SVG =
  `<svg viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg" fill="currentColor">` +
  `<path d="M22.21 67V44.6369H0V67H22.21Z"/>` +
  `<path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z"/>` +
  `<path d="M22.21 0H0V22.3184H22.21V0Z"/>` +
  `<path d="M66.7198 0H44.5098V22.3184H66.7198V0Z"/>` +
  `<path d="M66.7198 67V44.6369H44.5098V67H66.7198Z"/>` +
  `</svg>`

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
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const [hovered, setHovered] = useState(false)

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!brandMenu) return
      e.preventDefault()
      setMenu({ x: e.clientX, y: e.clientY })
    },
    [brandMenu]
  )

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

      {menu && <BrandMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} />}
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
  label = 'Hanzo',
  size = 22,
}: {
  label?: string
  size?: number
}) {
  return (
    <span
      style={{
        fontSize: Math.round(size * 0.62),
        fontWeight: 800,
        letterSpacing: -0.2,
        color: 'inherit',
      }}
    >
      {label}
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
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'inherit' }}>
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
