'use client'

/**
 * usePlan — what plan the viewer holds, and how much of it is left.
 *
 * The question a subscriber asks after paying is "did that work", so the account
 * menu answers it: the plan's name, and how much of its period is used.
 *
 * Two reads, each in its lane:
 *   - GET /v1/billing/subscriptions names the plan. Only an ACTIVE or TRIALING
 *     row counts — a canceled or past-due one never shows as held. The row
 *     carries the plan's own name, as the catalog sold it ("Pro", "Max 5x"), so
 *     the menu says what the viewer bought in the catalog's words.
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
import { usageOf, type PlanUsage, type Rollup } from './usage.ts'

/** The plan a viewer holds when no subscription names one. */
const FREE = 'free'

/** Honest resolution state — never guesses a plan. */
export type PlanState = 'loading' | 'none' | 'plan'

export type { PlanUsage, Rollup } from './usage.ts'

export interface Plan {
  /** The held plan's id, as the subscription row names it; `free` when none is held. */
  tier: string
  /** The held plan's name, as the catalog sold it ("Pro"); `Free` when none is held. */
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

export interface UsePlanOptions {
  /** Where the held subscriptions are read. Same-origin `/v1` by default. */
  endpoint?: string
  /** Where the consumption read lives. Same-origin `/v1` by default. */
  usageEndpoint?: string
  /** Extra request headers (e.g. an `Authorization` bearer when not cookie-based). */
  headers?: Record<string, string>
  /** Inject a `fetch` (tests / non-DOM runtimes). Defaults to `window.fetch`. */
  fetchImpl?: typeof fetch
  /** Gate both reads. When `false` (or SSR) nothing is fetched. Defaults to `true`. */
  enabled?: boolean
}

/** What a subscriptions payload says the viewer holds. */
interface Held {
  tier: string
  name: string
  found: boolean
}

const NONE: Held = { tier: FREE, name: 'Free', found: false }

/** The active or trialing row of a subscriptions payload, read for its plan. */
export function held(payload: unknown): Held {
  const rows: unknown = Array.isArray(payload)
    ? payload
    : ((payload as { data?: unknown; subscriptions?: unknown } | null)?.data ??
      (payload as { subscriptions?: unknown } | null)?.subscriptions ??
      [])
  if (!Array.isArray(rows)) return NONE
  const active = rows.find((s) => {
    const st = (s as { status?: string } | null)?.status
    return st === 'active' || st === 'trialing'
  }) as { plan?: unknown; planId?: unknown } | undefined
  if (!active) return NONE
  const plan = active.plan
  const p = (typeof plan === 'object' && plan ? plan : {}) as {
    slug?: unknown
    id?: unknown
    name?: unknown
  }
  const text = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : '')
  const tier = text(plan) || text(p.slug) || text(p.id) || text(active.planId)
  const name = text(p.name) || tier
  if (!name) return NONE
  return { tier: tier || name, name, found: true }
}

/** GET a JSON body; a refusal throws. */
async function read(
  doFetch: typeof fetch,
  url: string,
  headers?: Record<string, string>
): Promise<unknown> {
  const r = await doFetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json', ...headers },
  })
  if (!r.ok) throw new Error(String(r.status))
  return r.json()
}

export function usePlan(options: UsePlanOptions = {}): Plan {
  const {
    endpoint = '/v1/billing/subscriptions',
    usageEndpoint = '/v1/billing/usage/rollup',
    headers,
    fetchImpl,
    enabled = true,
  } = options

  const [plan, setPlan] = useState<Held>(NONE)
  const [state, setState] = useState<'loading' | 'none' | 'tier'>(
    enabled ? 'loading' : 'none'
  )
  const [rollup, setRollup] = useState<Rollup | null>(null)
  const [nonce, setNonce] = useState(0)

  const refresh = useCallback(() => setNonce((n) => n + 1), [])

  const headerKey = headers ? JSON.stringify(headers) : ''

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setPlan(NONE)
      setState('none')
      setRollup(null)
      return
    }
    let cancelled = false
    const doFetch = fetchImpl ?? window.fetch.bind(window)
    setState('loading')
    read(doFetch, endpoint, headers)
      .then((body) => {
        if (cancelled) return
        const h = held(body)
        setPlan(h)
        setState(h.found ? 'tier' : 'none')
      })
      .catch(() => {
        // Unreadable names no plan: the viewer is shown as holding none, never
        // as holding one they might not have paid for.
        if (cancelled) return
        setPlan(NONE)
        setState('none')
      })
    read(doFetch, usageEndpoint, headers)
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
  }, [endpoint, usageEndpoint, fetchImpl, enabled, nonce, headerKey])

  return useMemo(() => {
    const usage = usageOf(rollup)
    const loading = state === 'loading'
    return {
      tier: plan.tier,
      name: plan.name,
      // A viewer with no subscription still HOLDS a plan — the free one — and it
      // is bounded like every other. Reading 'no subscription' as 'nothing to
      // show' hid the daily limit from exactly the people who reach it, and
      // they met it as a refusal with no warning. So a measurable reading is
      // itself a plan: if the ledger answered with a bound, there is something
      // true to say.
      state: loading ? 'loading' : state === 'tier' || usage ? 'plan' : 'none',
      loading,
      paid:
        state === 'tier' && ![plan.tier, plan.name].some((v) => v.toLowerCase() === FREE),
      usage,
      refresh,
    }
  }, [plan, state, rollup, refresh])
}
