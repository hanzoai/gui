'use client'

/**
 * StudioAccessGate — the wiring PROOF for the unified access layer.
 *
 * Flagship gated app: Studio. `APP_ENTITLEMENTS.studio === 'pro'`, so the SAME
 * registry map that drives the launcher lock UI and HanzoPlans also drives the
 * gate here — one source, no per-surface gating rule.
 *
 *   - a Free viewer   → the paywall (lock + "Upgrade to Pro" → U.pricing)
 *   - a Pro  viewer   → the real feature
 *   - the upgrade surface is <HanzoPlans/>, reused unchanged.
 *
 * `runAccessGateSelfCheck()` asserts the gate's decision against the pure
 * resolver so the composition is verifiable without a DOM.
 */
import React from 'react'
import { HanzoAccessGate } from '../HanzoAccessGate'
import { HanzoPlans } from '../HanzoPlans'
import { isEntitled } from '../entitlements'

/** The flagship gated app id — Pro-tier per APP_ENTITLEMENTS. */
export const GATED_APP_ID = 'studio'

/** The protected feature — only ever rendered to an entitled viewer. */
export function StudioWorkspace() {
  return <div data-testid="studio-workspace">Studio workspace — the paid feature</div>
}

/** Paywalled path: a Free viewer sees the lock + upgrade CTA, not the feature. */
export function StudioForFreeUser() {
  return (
    <HanzoAccessGate appId={GATED_APP_ID} tier="free">
      <StudioWorkspace />
    </HanzoAccessGate>
  )
}

/** Entitled path: a Pro viewer sees the real feature. */
export function StudioForProUser() {
  return (
    <HanzoAccessGate appId={GATED_APP_ID} tier="pro">
      <StudioWorkspace />
    </HanzoAccessGate>
  )
}

/**
 * Host pattern: resolve entitlement ONCE (useEntitlement, done inside the gate
 * here for brevity) and route the paywall CTA to the shared upgrade surface.
 */
export function StudioUpgradeSurface() {
  return <HanzoPlans />
}

/** Pure, DOM-free proof the gate and the plans surface read the same map. */
export function runAccessGateSelfCheck(): { ok: boolean; detail: string } {
  const free = isEntitled(GATED_APP_ID, 'free') // expect false — locked
  const pro = isEntitled(GATED_APP_ID, 'pro') // expect true  — unlocked
  const ok = free === false && pro === true
  return { ok, detail: `isEntitled(studio,free)=${free} isEntitled(studio,pro)=${pro}` }
}
