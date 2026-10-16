'use client'

/**
 * usePlan — what plan the viewer holds, and how much of it is left.
 *
 * The question a subscriber asks after paying is "did that work", so the account
 * menu answers it: the plan's name, and how much of its period is used.
 *
 * Three reads, each in its lane:
 *   - GET /v1/billing/tier names the plan the PAYER is served as (`plan`, a
 *     catalog slug, "" with none). Billing resolves it for the org the request
 *     acts for and maps retired slugs to the rung that replaced them, so this
 *     never picks a row of its own.
 *   - GET /v1/billing/plans is the catalog: the slug's display name ("Max 5x")
 *     and whether the rung is paid (a price, or contact-sales).
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usageOf, type PlanUsage, type Rollup } from './usage.ts'

/** Honest resolution state — never guesses a plan. */
export type PlanState = 'loading' | 'none' | 'plan'

export type { PlanUsage, Rollup } from './usage.ts'

export interface Plan {
  /** The catalog slug the payer is served as ("max-5x"); `free` when none is held. */
  tier: string
  /** The catalog's name for it ("Max 5x"); `Free` when none is held. */
  name: string
  /** Honest resolution state. */
  state: PlanState
  /** Convenience: `state === 'loading'`. */
  loading: boolean
  /** The catalog prices the rung, or sells it by contract. Free and an unresolved viewer are not paid. */
  paid: boolean
  /** Consumption, when it is genuinely measurable. Absent otherwise. */
  usage?: PlanUsage
  /** Re-run the reads. */
  refresh: () => void
}

export interface UsePlanOptions {
  /**
   * Origin the `/v1/billing/*` reads go to. Empty (the default) reads the page's
   * own origin; a host on another origin passes `https://api.hanzo.ai`.
   */
  base?: string
  /**
   * Request headers — an `Authorization` bearer when the session is not a
   * cookie, and `X-Org-Id` for the org the viewer has switched to. A change
   * re-reads.
   */
  headers?: Record<string, string>
  /** Inject a `fetch` (tests / non-DOM runtimes). Defaults to `window.fetch`. */
  fetchImpl?: typeof fetch
  /** Gate every read. When `false` (or SSR) nothing is fetched. Defaults to `true`. */
  enabled?: boolean
}

/** GET /v1/billing/tier, as far as it is read here. */
export interface TierBody {
  plan?: string
}

/** One GET /v1/billing/plans row, as far as it is read here. */
export interface CatalogPlan {
  slug: string
  name?: string
  price?: number
  contactSales?: boolean
}

/** What the viewer holds, named. */
export interface Held {
  tier: string
  name: string
  paid: boolean
  found: boolean
}

const NONE: Held = { tier: 'free', name: 'Free', paid: false, found: false }

const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/**
 * The plan GET /v1/billing/tier serves, named by the catalog. A slug the catalog
 * does not list is shown as the slug. The tier's `displayName` names its CLASS
 * ("Pro" for every Max rung), so it never names the plan.
 */
export function held(tier: unknown, plans: unknown): Held {
  const body = (tier && typeof tier === 'object' ? tier : {}) as TierBody
  const slug = text(body.plan)
  if (!slug) return NONE
  const rows = Array.isArray(plans) ? (plans as CatalogPlan[]) : []
  const row = rows.find((p) => p && text(p.slug) === slug)
  const name = text(row?.name) || slug
  const paid = !!row && ((row.price ?? 0) > 0 || row.contactSales === true)
  return { tier: slug, name, paid, found: true }
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

/** A read that cannot be made answers null. */
const quiet = (p: Promise<unknown>) => p.catch(() => null)

/**
 * The three reads, made once. The tier read decides WHICH plan; the catalog only
 * names it. An unreadable tier names nothing: the viewer is shown as holding no
 * plan, never one they may not have. An unreadable rollup is null, which keeps
 * `usage` absent rather than reading nothing.
 */
export async function resolvePlan(
  doFetch: typeof fetch,
  base = '',
  headers?: Record<string, string>
): Promise<{ held: Held; rollup: Rollup | null }> {
  const root = base.replace(/\/+$/, '')
  const [tier, plans, rollup] = await Promise.all([
    quiet(read(doFetch, `${root}/v1/billing/tier`, headers)),
    quiet(read(doFetch, `${root}/v1/billing/plans`, headers)),
    quiet(read(doFetch, `${root}/v1/billing/usage/rollup`, headers)),
  ])
  return { held: held(tier, plans), rollup: rollup as Rollup | null }
}

export function usePlan(options: UsePlanOptions = {}): Plan {
  const { base = '', headers, fetchImpl, enabled = true } = options

  const [plan, setPlan] = useState<Held>(NONE)
  const [rollup, setRollup] = useState<Rollup | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [nonce, setNonce] = useState(0)

  const refresh = useCallback(() => setNonce((n) => n + 1), [])

  // The latest headers and fetch, read when the reading effect runs (this one is
  // declared first, so it runs first). A host that writes either inline hands
  // over a new object every render; keyed on identity, the reading effect would
  // re-read on every render it caused. Headers re-read when their VALUE changes.
  const latest = useRef({ headers, fetchImpl })
  useEffect(() => {
    latest.current = { headers, fetchImpl }
  })
  const headerKey = headers ? JSON.stringify(headers) : ''

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setPlan(NONE)
      setRollup(null)
      setLoading(false)
      return
    }
    let cancelled = false
    const { headers: h, fetchImpl: f } = latest.current
    setLoading(true)
    resolvePlan(f ?? window.fetch.bind(window), base, h).then((r) => {
      if (cancelled) return
      setPlan(r.held)
      setRollup(r.rollup)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [base, enabled, nonce, headerKey])

  return useMemo(() => {
    const usage = usageOf(rollup)
    return {
      tier: plan.tier,
      name: plan.name,
      // A viewer with no plan named still HOLDS one — the free one — and it is
      // bounded like every other. Reading 'no plan' as 'nothing to show' hid the
      // daily limit from exactly the people who reach it, and they met it as a
      // refusal with no warning. So a measurable reading is itself a plan: if
      // the ledger answered with a bound, there is something true to say.
      state: loading ? 'loading' : plan.found || usage ? 'plan' : 'none',
      loading,
      paid: !loading && plan.paid,
      usage,
      refresh,
    }
  }, [plan, rollup, loading, refresh])
}
