/**
 * ENTITLEMENTS — the pure plan→apps resolver.
 *
 * No React, no side effects, node-testable. Reads the two DATA values from
 * `hanzo-registry.ts` (the tier ladder `HANZO_PLANS` + the app→min-tier map
 * `APP_ENTITLEMENTS`) and answers the two questions the launcher / gate ask:
 *
 *   entitlementFor(tier) .. the SET of app ids that tier unlocks
 *   isEntitled(app, tier) . may this tier open this app?
 *
 * Gating is by monotonic `rank`: a tier unlocks every app whose required tier
 * ranks at or below it. Apps absent from `APP_ENTITLEMENTS` are treated as the
 * default tier (`free`), so a newly-added app is never silently locked.
 */
import {
  APP_ENTITLEMENTS,
  DEFAULT_PLAN_TIER,
  HANZO_PLANS,
  getPlanTier,
  type HanzoPlanTier,
} from './hanzo-registry.ts'

/** Precomputed slug→rank (built once from HANZO_PLANS). */
const RANK: Record<string, number> = Object.fromEntries(
  HANZO_PLANS.map((p) => [p.slug, p.rank])
)

/** The access rank of a tier. Unknown tiers fall back to the default tier's rank. */
export function rankOf(tier: HanzoPlanTier): number {
  return RANK[tier] ?? RANK[DEFAULT_PLAN_TIER] ?? 0
}

/**
 * The minimum tier that unlocks an app. Apps not in `APP_ENTITLEMENTS` default
 * to `free` (ungated) — adding an app never silently locks it.
 */
export function requiredTier(appId: string): HanzoPlanTier {
  return APP_ENTITLEMENTS[appId] ?? DEFAULT_PLAN_TIER
}

/** May `tier` open `appId`? True when the tier's rank ≥ the app's required rank. */
export function isEntitled(appId: string, tier: HanzoPlanTier): boolean {
  return rankOf(tier) >= rankOf(requiredTier(appId))
}

/**
 * The set of app ids `tier` unlocks — every app whose required tier ranks at or
 * below `tier`. Derived from `APP_ENTITLEMENTS`; never a second hardcoded list.
 */
export function entitlementFor(tier: HanzoPlanTier): Set<string> {
  const r = rankOf(tier)
  const unlocked = new Set<string>()
  for (const appId of Object.keys(APP_ENTITLEMENTS)) {
    if (rankOf(requiredTier(appId)) <= r) unlocked.add(appId)
  }
  return unlocked
}

/**
 * Coerce an arbitrary tier string (e.g. the coarse IAM `tier` JWT claim, which
 * only ever carries free/starter/pro/enterprise) to a canonical `HanzoPlanTier`.
 * Unknown / empty → the default tier. `starter` maps to `pro` (the paid on-ramp).
 */
export function normalizeTier(raw?: string | null): HanzoPlanTier {
  if (!raw) return DEFAULT_PLAN_TIER
  const t = raw.trim().toLowerCase()
  if (getPlanTier(t)) return t as HanzoPlanTier
  if (t === 'starter') return 'pro'
  if (t === 'developer' || t === 'personal') return 'free'
  return DEFAULT_PLAN_TIER
}
