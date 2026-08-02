'use client'

/**
 * useEntitlement — resolve the current viewer's plan tier and answer
 * "may this viewer open <appId>?" for the whole shell.
 *
 * ONE resolver for entitlement, composed from two collaborators that each stay
 * in their lane:
 *   - the REAL commerce read (`GET /v1/billing/subscriptions`, the org's held
 *     Stripe-shaped subscriptions — the same endpoint Console consumes via its
 *     same-origin billing proxy) tells us WHICH tier the viewer holds;
 *   - the registry's pure `isEntitled(tier, appId)` decides WHAT that tier
 *     grants. This hook only wires the two together and binds the resolved tier.
 *
 * Self-contained: no secret is ever embedded — the browser's session cookie
 * (`credentials: 'include'`) or caller-supplied headers carry identity, exactly
 * as every other authenticated shell fetch does. Honest states: `loading` while
 * the read is in flight, `tier` once a held subscription resolves, `none` when
 * the viewer is unauthenticated / holds no active plan. In every non-`tier`
 * state `tier` falls back to the lowest tier (free), so callers can gate safely
 * without special-casing the unauthenticated path.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { isEntitled as planEntitles, normalizeTier } from './entitlements'

/** The lowest / fallback tier slug used when no paid subscription resolves. */
export const FREE_TIER = 'free'

/** Honest resolution state (never guesses a paid tier). */
export type EntitlementState = 'loading' | 'none' | 'tier'

export interface UseEntitlementOptions {
  /**
   * Billing read endpoint. Defaults to the same-origin `/v1/billing/subscriptions`
   * proxy (no `/api/` prefix). Point it at an absolute commerce URL for cross-origin
   * hosts.
   */
  endpoint?: string
  /** Extra request headers (e.g. an `Authorization` bearer when not cookie-based). */
  headers?: Record<string, string>
  /** Tier slug to fall back to when unauthenticated / no active subscription. */
  fallbackTier?: string
  /** Inject a `fetch` (tests / non-DOM runtimes). Defaults to `window.fetch`. */
  fetchImpl?: typeof fetch
  /**
   * Gate the network read. When `false` (or SSR) the hook resolves immediately to
   * the fallback tier with state `none` and never fetches. Defaults to `true`.
   */
  enabled?: boolean
}

export interface Entitlement {
  /** Resolved plan tier slug (always usable — falls back to the free tier). */
  tier: string
  /** Honest resolution state. */
  state: EntitlementState
  /** Convenience: `state === 'loading'`. */
  loading: boolean
  /** Does the resolved tier grant access to `appId`? */
  isEntitled: (appId: string) => boolean
  /** Re-run the billing read. */
  refresh: () => void
}

/** Extract a tier slug from a Stripe-shaped subscriptions payload. */
function resolveTier(
  payload: unknown,
  fallback: string
): { tier: string; found: boolean } {
  const arr: unknown = Array.isArray(payload)
    ? payload
    : ((payload as { data?: unknown; subscriptions?: unknown })?.data ??
      (payload as { subscriptions?: unknown })?.subscriptions ??
      [])
  if (!Array.isArray(arr)) return { tier: fallback, found: false }
  // Only an ACTIVE / TRIALING subscription grants a tier — a canceled or past-due
  // one must never silently upgrade the viewer.
  const active = arr.find((s) => {
    const st = (s as { status?: string } | null)?.status
    return st === 'active' || st === 'trialing'
  })
  const plan = (active as { plan?: unknown } | undefined)?.plan
  const slug =
    typeof plan === 'string'
      ? plan
      : ((plan as { slug?: string; id?: string; name?: string } | undefined)?.slug ??
        (plan as { id?: string } | undefined)?.id ??
        (plan as { name?: string } | undefined)?.name)
  if (typeof slug === 'string' && slug) return { tier: slug, found: true }
  return { tier: fallback, found: false }
}

export function useEntitlement(options: UseEntitlementOptions = {}): Entitlement {
  const {
    endpoint = '/v1/billing/subscriptions',
    headers,
    fallbackTier = FREE_TIER,
    fetchImpl,
    enabled = true,
  } = options

  const [tier, setTier] = useState<string>(fallbackTier)
  const [state, setState] = useState<EntitlementState>(enabled ? 'loading' : 'none')
  const [nonce, setNonce] = useState(0)

  const refresh = useCallback(() => setNonce((n) => n + 1), [])

  // Stabilize the header object across renders so the effect doesn't re-fire on
  // an equal-but-new literal.
  const headerKey = headers ? JSON.stringify(headers) : ''

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setTier(fallbackTier)
      setState('none')
      return
    }
    let cancelled = false
    const doFetch = fetchImpl ?? window.fetch.bind(window)
    setState('loading')
    doFetch(endpoint, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json', ...(headers ?? {}) },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((payload) => {
        if (cancelled) return
        const resolved = resolveTier(payload, fallbackTier)
        setTier(resolved.tier)
        setState(resolved.found ? 'tier' : 'none')
      })
      .catch(() => {
        if (cancelled) return
        // Fail SAFE to the lowest tier — never leak a paid tier on a read error.
        setTier(fallbackTier)
        setState('none')
      })
    return () => {
      cancelled = true
    }
    // headerKey stands in for `headers`; fallbackTier/endpoint/fetchImpl are stable props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, fallbackTier, fetchImpl, enabled, nonce, headerKey])

  const isEntitled = useCallback(
    (appId: string) => planEntitles(appId, normalizeTier(tier)),
    [tier]
  )

  return useMemo(
    () => ({ tier, state, loading: state === 'loading', isEntitled, refresh }),
    [tier, state, isEntitled, refresh]
  )
}
