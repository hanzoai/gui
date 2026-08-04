'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { CHROME, FS, LABEL, PANEL, R, Z, ghostHover, row } from './theme'
import { useShellStyles } from './shellStyles'

interface BrandMenuProps {
  x: number
  y: number
  onClose: () => void
}

function BrandContextMenu({ x, y, onClose }: BrandMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', escape)
    }
  }, [onClose])

  const items = [
    { label: 'Brand Guidelines', href: 'https://hanzo.ai/brand' },
    { label: 'Press Kit', href: 'https://hanzo.ai/press' },
    { label: 'Download Logo', href: 'https://hanzo.ai/brand#download' },
    { label: 'Copy SVG', action: 'copy-svg' },
    { label: 'hanzo.ai →', href: 'https://hanzo.ai' },
  ]

  const LOGO_SVG = `<svg viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg"><path d="M22.21 67V44.6369H0V67H22.21Z" fill="#ffffff"/><path d="M0 44.6369L22.21 46.8285V44.6369H0Z" fill="#DDDDDD"/><path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" fill="#ffffff"/><path d="M22.21 0H0V22.3184H22.21V0Z" fill="#ffffff"/><path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill="#ffffff"/><path d="M66.6753 22.3185L44.5098 20.0822V22.3185H66.6753Z" fill="#DDDDDD"/><path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill="#ffffff"/></svg>`

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
      {items.map((item) =>
        item.action === 'copy-svg' ? (
          <button
            key="copy"
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
        ) : (
          <a
            key={item.label}
            href={item.href}
            role="menuitem"
            target={item.href?.startsWith('https') ? '_blank' : undefined}
            rel="noopener noreferrer"
            onClick={onClose}
            style={MENU_ITEM}
            {...ghostHover()}
          >
            {item.label}
          </a>
        )
      )}
    </div>
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

export interface TenantMarkProps {
  size?: number
  className?: string
  /** Whether to show brand context menu on right-click */
  brandMenu?: boolean
  /** Animate on hover (origami-style scale + slight 3D tilt) */
  animate?: boolean
}

/**
 * Official Hanzo H-mark logo.
 *
 * - White fill paths with subtle shadow details
 * - Hover: origami-style 3D perspective tilt + scale
 * - Right-click: brand context menu (guidelines, press, download, copy SVG)
 */
export function TenantMark({
  size = 22,
  className = '',
  brandMenu = true,
  animate = true,
}: TenantMarkProps) {
  useShellStyles()
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const [hovered, setHovered] = useState(false)

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!brandMenu) return
      e.preventDefault()
      setMenu({ x: e.clientX, y: e.clientY })
    },
    [brandMenu]
  )

  const style: React.CSSProperties = animate
    ? {
        transition:
          'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
        transform: hovered
          ? 'scale(1.12) perspective(80px) rotateY(-6deg)'
          : 'scale(1) perspective(80px) rotateY(0deg)',
        transformOrigin: 'center center',
      }
    : {}

  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox="0 0 67 67"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Hanzo"
        className={className}
        style={style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onContextMenu={handleContextMenu}
      >
        <path d="M22.21 67V44.6369H0V67H22.21Z" fill="#ffffff" />
        <path d="M0 44.6369L22.21 46.8285V44.6369H0Z" fill="#DDDDDD" />
        <path
          d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z"
          fill="#ffffff"
        />
        <path d="M22.21 0H0V22.3184H22.21V0Z" fill="#ffffff" />
        <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill="#ffffff" />
        <path d="M66.6753 22.3185L44.5098 20.0822V22.3185H66.6753Z" fill="#DDDDDD" />
        <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill="#ffffff" />
      </svg>

      {menu && <BrandContextMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} />}
    </>
  )
}
