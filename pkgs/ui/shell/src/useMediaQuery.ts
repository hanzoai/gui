'use client'

/**
 * useMediaQuery — SSR-safe media-query hook for the reusable shell chrome.
 *
 * Used by HanzoHeader / UserOrgDropdown to collapse marketing nav below a
 * breakpoint. Renders desktop-first on the server (matches === false) then
 * corrects on mount, so there is no hydration flash of the mobile layout on
 * wide viewports.
 */
import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True when the viewport is narrower than `px` (default 900). */
export function useIsMobile(px = 900): boolean {
  return useMediaQuery(`(max-width: ${px - 0.02}px)`)
}
