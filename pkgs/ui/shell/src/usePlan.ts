'use client'

/**
 * usePlan — what plan the viewer holds, and how much of it is left.
 *
 * The question a subscriber asks after paying is "did that work", and until now
 * nothing on any Hanzo surface could answer it. The shell knew the viewer's tier
 * (useEntitlement) but only ever used it to GATE — to decide which apps open —
 * so a plan was visible exactly when it stopped you doing something.
 *
 * Two collaborators, each in its lane:
 *   - useEntitlement resolves WHICH tier, from the org's held subscriptions.
 *     Reused rather than re-fetched: it already reads that endpoint, applies the
 *     active/trialing rule, and fails safe to free.
 *   - GET /v1/billing/usage/rollup answers how much of it is consumed.
 *
 * USAGE IS ABSENT WHEN IT CANNOT BE MEASURED, never zero. A plan with nothing
 * behind it, an unreachable ledger and a customer who has genuinely used nothing
 * are three different facts, and only the last is 0%. Rendering the first two as
 * an empty meter tells someone who has been working all month that they have not
 * started — which is worse than showing them nothing, because it looks like an
 * answer. `usage` is undefined unless a real denominator and a real numerator
 * both arrived.
 *
 * The proportion is deliberately the only thing published. What backs a plan is
 * a dollar figure, and dollars are what PREPAID CREDIT is — a separate balance
 * the customer buys. Putting the plan's backing on screen in the same unit is
 * how one page comes to show two different things under one word.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getPlanTier } from './hanzo-registry'
import { FREE_TIER, useEntitlement, type UseEntitlementOptions } from './useEntitlement'
import { usageOf, type PlanUsage, type Rollup } from './usage'

/** Honest resolution state — never guesses a plan. */
export type PlanState = 'loading' | 'none' | 'plan'

export type { PlanUsage, Rollup } from './usage'

export interface Plan {
  /** Resolved tier slug — always usable, falls back to free. */
  tier: string
  /** Display name from the ladder ("Go"), or the slug when it is a tier we do not know. */
  name: string
  /** Honest resolution state. */
  state: PlanState
  /** Convenience: `state === 'loading'`. */
  loading: boolean
  /** Whether this is a paid rung — free and an unresolved viewer are not. */
  paid: boolean
  /** Consumption, when it is genuinely measurable. Absent otherwise. */
  usage?: PlanUsage
  /** Re-run both reads. */
  refresh: () => void
}

export interface UsePlanOptions extends UseEntitlementOptions {
  /** Where the consumption read lives. Same-origin `/v1` by default. */
  usageEndpoint?: string
}

export function usePlan(options: UsePlanOptions = {}): Plan {
  const { usageEndpoint = '/v1/billing/usage/rollup', ...entitlementOptions } = options
  const { headers, fetchImpl, enabled = true } = entitlementOptions

  const ent = useEntitlement(entitlementOptions)
  const [rollup, setRollup] = useState<Rollup | null>(null)
  const [nonce, setNonce] = useState(0)

  const refresh = useCallback(() => {
    setNonce((n) => n + 1)
    ent.refresh()
  }, [ent])

  const headerKey = headers ? JSON.stringify(headers) : ''

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setRollup(null)
      return
    }
    let cancelled = false
    const doFetch = fetchImpl ?? window.fetch.bind(window)
    doFetch(usageEndpoint, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json', ...(headers ?? {}) },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((body) => {
        if (!cancelled) setRollup(body as Rollup)
      })
      .catch(() => {
        // Unreadable is not empty. Leaving it null keeps `usage` absent, which
        // renders as no meter rather than as a meter reading nothing.
        if (!cancelled) setRollup(null)
      })
    return () => {
      cancelled = true
    }
    // headerKey stands in for `headers`; the rest are stable props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usageEndpoint, fetchImpl, enabled, nonce, headerKey])

  return useMemo(() => {
    const rung = getPlanTier(ent.tier)
    return {
      tier: ent.tier,
      // A tier the ladder has not learned yet still shows its own slug rather
      // than the free rung's name — the viewer is paying for something, and
      // calling it "Free" is the failure this ladder already had once.
      name: rung?.name ?? ent.tier,
      state: ent.loading ? 'loading' : ent.state === 'tier' ? 'plan' : 'none',
      loading: ent.loading,
      paid: ent.state === 'tier' && ent.tier !== FREE_TIER,
      usage: usageOf(rollup),
      refresh,
    }
  }, [ent.tier, ent.state, ent.loading, rollup, refresh])
}
