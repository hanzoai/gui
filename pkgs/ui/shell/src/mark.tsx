'use client'

/**
 * Shared Hanzo block-H mark + wordmark for the reusable shell chrome.
 * `fill="currentColor"` so it themes monochrome with the surrounding text color
 * (paper-white on the dark shell chrome; ink on light) — no baked-in hue.
 */
import React from 'react'

export function HanzoMark({
  size = 22,
  title = 'Hanzo',
}: {
  size?: number
  title?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 67 67"
      fill="currentColor"
      role="img"
      aria-label={title}
    >
      <path d="M22.21 67V44.6369H0V67H22.21Z" />
      <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" />
      <path d="M22.21 0H0V22.3184H22.21V0Z" />
      <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" />
      <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" />
    </svg>
  )
}

export function HanzoWordmark({
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
      <span
        style={{
          fontSize: Math.round(size * 0.62),
          fontWeight: 800,
          letterSpacing: -0.2,
        }}
      >
        {label}
      </span>
    </span>
  )
}
