// Generic brand mark wrapper — a rounded chip with whatever the caller
// wants inside (SVG, glyph, text, <img>). Per-org admin surfaces drop
// in their own logo by passing children or using `imageSrc` for a
// hosted asset (env-driven white label).

import type { ReactNode } from 'react'
import { XStack } from 'hanzogui'

// Canonical Hanzo brand colors. Background of the mark chip is BLACK
// (matches ~/work/hanzo/logo/dist/hanzo-favicon.svg). Red is the brand
// accent for links/focus/CTA — never the logo background.
export const HANZO_BLACK = '#000000'
export const HANZO_RED = '#d81c33'

export interface BrandMarkProps {
  children?: ReactNode
  // Hosted image to use instead of `children` (for white-label deployments
  // that ship a logo asset via env, e.g. VITE_BRAND_MARK_URL).
  imageSrc?: string
  // Background colour — defaults to black to match the canonical mark.
  bg?: string
  // Mark size in px (default 28).
  size?: number
  // Alt text when imageSrc is used.
  alt?: string
}

export function BrandMark({
  children,
  imageSrc,
  bg = HANZO_BLACK,
  size = 28,
  alt = '',
}: BrandMarkProps) {
  const content = imageSrc ? (
    <img
      src={imageSrc}
      alt={alt}
      width={size}
      height={size}
      style={{ borderRadius: 6, display: 'block', objectFit: 'cover' }}
    />
  ) : (
    children
  )

  return (
    <XStack
      width={size}
      height={size}
      rounded="$3"
      items="center"
      justify="center"
      bg={bg as never}
      overflow="hidden"
    >
      {content}
    </XStack>
  )
}

// Hanzo brand mark — black square with the canonical block-H, identical
// to ~/work/hanzo/logo/dist/hanzo-favicon.svg. Five SVG paths: four
// corner blocks + diagonal crossbar. No font dependency, no network
// fetch, scales cleanly. The artwork is rendered in a 100×100 viewBox
// with translate+scale so the 67×67 H is visually centered (matches
// the canonical favicon's padding scheme exactly). Override at the
// call site (or via VITE_BRAND_MARK_URL → <BrandMark imageSrc=…/>)
// for white-label deployments.
export function HanzoMark({ size = 28 }: { size?: number } = {}) {
  return (
    <BrandMark size={size} bg={HANZO_BLACK}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="#ffffff"
        aria-hidden="true"
      >
        <g transform="translate(12.5, 12.5) scale(1.119)">
          <path d="M22.21 67V44.6369H0V67H22.21Z" />
          <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" />
          <path d="M22.21 0H0V22.3184H22.21V0Z" />
          <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" />
          <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" />
        </g>
      </svg>
    </BrandMark>
  )
}
