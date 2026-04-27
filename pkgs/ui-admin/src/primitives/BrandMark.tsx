// Generic brand mark wrapper — a 28×28 rounded chip with whatever the
// caller wants inside (SVG, glyph, text). The Hanzo "H" mark lives at
// the call site so per-org admin surfaces drop in their own logo.

import type { ReactNode } from 'react'
import { XStack } from 'hanzogui'

export interface BrandMarkProps {
  children: ReactNode
  // Background colour — defaults to white-ish to match Hanzo dark theme.
  bg?: string
  // Mark size in px (default 28).
  size?: number
}

export function BrandMark({ children, bg = '#f2f2f2', size = 28 }: BrandMarkProps) {
  return (
    <XStack
      width={size}
      height={size}
      rounded="$3"
      items="center"
      justify="center"
      bg={bg as never}
    >
      {children}
    </XStack>
  )
}

// Hanzo H mark — the canonical mark used on tasks.hanzo.ai. Sized 16px
// inside a 28px BrandMark.
export function HanzoMark() {
  return (
    <BrandMark>
      <svg viewBox="0 0 24 24" width={16} height={16} fill="#070b13" aria-hidden="true">
        <path d="M4 3 H7 V10 H17 V3 H20 V21 H17 V13 H7 V21 H4 Z" />
      </svg>
    </BrandMark>
  )
}
