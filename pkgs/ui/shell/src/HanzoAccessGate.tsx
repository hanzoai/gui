'use client'

/**
 * HanzoAccessGate — wrap a feature or app surface and reveal it only to viewers
 * whose plan tier grants it; everyone else gets a clean monochrome paywall.
 *
 * Self-contained by the shell contract: plain React + inline styles + theme.ts
 * tokens (no Tailwind, no CSS classes), monochrome (no brand hue), keyboard
 * accessible (the Upgrade action is a real link in the tab order). Drops into
 * any Hanzo host regardless of its styling setup.
 *
 * Entitlement source is composable:
 *   - pass a resolved `isEntitled` (and/or `tier`) — e.g. from a shared
 *     `useEntitlement()` higher in the tree — and the gate stays render-only; or
 *   - pass nothing and the gate resolves the viewer's plan itself via
 *     `useEntitlement({ endpoint })`.
 * The registry's `APP_ENTITLEMENTS` + `HANZO_PLANS` name the tier required, so
 * the paywall reads "Included in <tier>" with an Upgrade CTA to the plans surface.
 */
import React from 'react'
import { APP_ENTITLEMENTS, HANZO_PLANS, U } from './hanzo-registry'
import { isEntitled as planEntitles, normalizeTier } from './entitlements'
import { findHanzoApp } from './hanzo-apps'
import { useEntitlement } from './useEntitlement'
import { ACCENT, ACCENT_SOFT, CHROME, FS, R } from './theme'
import { useShellStyles } from './shellStyles'

export interface HanzoAccessGateProps {
  /** The gated app / feature id (matches a `HanzoApp.id` and an `APP_ENTITLEMENTS` key). */
  appId: string
  /** The protected content, shown only when the viewer is entitled. */
  children: React.ReactNode
  /** Replace the built-in paywall entirely. */
  upgrade?: React.ReactNode
  /**
   * Pre-resolved access check (e.g. from a shared `useEntitlement()`). When
   * provided the gate is render-only and does NOT fetch.
   */
  isEntitled?: (appId: string) => boolean
  /** Pre-resolved tier slug — pairs with `isEntitled` for a fully controlled gate. */
  tier?: string
  /** Billing endpoint for the internal `useEntitlement` (used only when `isEntitled` is absent). */
  endpoint?: string
  /** Where the Upgrade CTA points. Defaults to the plans surface (`U.pricing`). */
  upgradeHref?: string
  /** Human app name for the paywall copy. Defaults to the `HanzoApp` label. */
  appName?: string
}

/** Resolve the tier a gated app requires: its slug + display name (or null if ungated). */
function requiredTier(appId: string): { slug: string; name: string } | null {
  const slug = (APP_ENTITLEMENTS as Record<string, string>)[appId]
  if (!slug) return null
  const plan = (HANZO_PLANS as ReadonlyArray<{ slug: string; name?: string }>).find(
    (p) => p.slug === slug
  )
  return { slug, name: plan?.name ?? slug }
}

const LockGlyph = ({ size = 22 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    <circle cx="12" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

export function HanzoAccessGate({
  appId,
  children,
  upgrade,
  isEntitled: providedIsEntitled,
  tier: providedTier,
  endpoint,
  upgradeHref = U.pricing,
  appName,
}: HanzoAccessGateProps) {
  useShellStyles()

  // Resolve entitlement internally only when the caller did not supply a check.
  const controlled = providedIsEntitled != null
  const auto = useEntitlement({ endpoint, enabled: !controlled })

  const loading = controlled ? false : auto.loading
  const entitled = controlled
    ? providedIsEntitled!(appId)
    : providedTier != null
      ? planEntitles(appId, normalizeTier(providedTier))
      : auto.isEntitled(appId)

  // Avoid a flash of paywall while the viewer's tier is still resolving.
  if (loading) {
    return (
      <div
        data-hanzo-shell=""
        aria-busy="true"
        style={{
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    )
  }

  if (entitled) return <>{children}</>
  if (upgrade !== undefined) return <>{upgrade}</>

  const req = requiredTier(appId)
  const name = appName ?? findHanzoApp(appId)?.label ?? appId

  return (
    <div
      data-hanzo-shell=""
      role="region"
      aria-label={`${name} requires an upgrade`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 14,
        maxWidth: 380,
        margin: '0 auto',
        padding: '40px 28px',
        borderRadius: R.card,
        border: `1px solid ${CHROME.border}`,
        background: CHROME.panel,
        color: CHROME.fg,
        fontFamily: CHROME.font,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 52,
          height: 52,
          borderRadius: R.pill,
          background: ACCENT_SOFT,
          color: ACCENT,
        }}
      >
        <LockGlyph size={24} />
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: FS.xl, fontWeight: 700, lineHeight: 1.25 }}>{name}</span>
        <span style={{ fontSize: FS.sm, color: CHROME.fgMuted, lineHeight: 1.4 }}>
          {req ? (
            <>
              Included in{' '}
              <strong style={{ color: CHROME.fg, fontWeight: 600 }}>{req.name}</strong>
            </>
          ) : (
            'Upgrade your plan to unlock this.'
          )}
        </span>
      </div>

      <a
        href={upgradeHref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '9px 18px',
          borderRadius: R.pill,
          background: ACCENT,
          color: '#000',
          fontSize: FS.sm,
          fontWeight: 600,
          textDecoration: 'none',
          border: '1px solid transparent',
        }}
      >
        {req ? `Upgrade to ${req.name}` : 'View plans'}
      </a>
    </div>
  )
}
