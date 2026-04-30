// HanzoMark — canonical Hanzo H mark (7-path SVG, viewBox 0 0 67 67).
// Single source of truth for the brand mark in admin-tasks. Mirrors
// `~/work/hanzo/logo/src/logos.ts:getMonoSVG`. White fills suit the
// dark sidebar background; pass `fill` to override per-context.

import { XStack } from 'hanzogui'

export interface HanzoMarkProps {
  // Outer chip size in px (default 28, matches @hanzogui/admin BrandMark).
  size?: number
  // Glyph fill (default #ffffff for dark sidebar).
  fill?: string
  // Chip background (default #070b13 — Hanzo dark).
  bg?: string
}

export function HanzoMark({ size = 28, fill = '#ffffff', bg = '#070b13' }: HanzoMarkProps) {
  const inner = Math.round(size * 0.6)
  return (
    <XStack
      width={size}
      height={size}
      rounded="$3"
      items="center"
      justify="center"
      bg={bg as never}
    >
      <svg
        viewBox="0 0 67 67"
        width={inner}
        height={inner}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M22.21 67V44.6369H0V67H22.21Z" fill={fill} />
        <path d="M0 44.6369L22.21 46.8285V44.6369H0Z" fill={fill} />
        <path
          d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z"
          fill={fill}
        />
        <path d="M22.21 0H0V22.3184H22.21V0Z" fill={fill} />
        <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill={fill} />
        <path d="M66.6753 22.3185L44.5098 20.0822V22.3185H66.6753Z" fill={fill} />
        <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill={fill} />
      </svg>
    </XStack>
  )
}
