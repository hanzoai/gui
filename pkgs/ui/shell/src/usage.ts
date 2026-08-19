/**
 * How much of a plan's period is spent — the pure half of `usePlan`.
 *
 * No React, no fetch, no imports. It is a function from the billing rollup's
 * wire shape to a proportion, which makes it the part that can be tested
 * directly, and the part worth testing: every way this is wrong shows a
 * confident wrong number to someone checking whether their payment worked.
 */

/** How much of the plan's period is spent. Present only when both halves are real. */
export interface PlanUsage {
  /** Consumed, 0–100, clamped. */
  usedPct: number
  /** Remaining, 0–100. Derived from `usedPct`, so the two cannot disagree. */
  leftPct: number
  /** The period this covers, as the ledger labelled it (e.g. "2026-08"). */
  period: string
  /** True once consumption has passed what the plan includes. */
  over: boolean
}

/** The rollup's plan block. Only the fields read here are named. */
export interface Rollup {
  period?: string
  included?: {
    /** What is actually on the balance for this period — the denominator. */
    grantedCents?: number
    /** Of that, what has been used. */
    consumedCents?: number
  }
  /** Total consumption, which may exceed what the plan includes. */
  consumedCents?: number
}

/**
 * The proportion consumed, or undefined when there is nothing honest to say.
 *
 * UNDEFINED IS A REAL ANSWER and the most important one. "You have used none of
 * your plan" and "we could not measure your plan" are identical on a bar and
 * opposite in meaning: the first reassures, the second is a fault. A plan with
 * nothing behind it, a period whose grant has not run, and an unreachable ledger
 * are all the second — so each yields undefined, and the meter draws nothing
 * rather than an empty bar that reads as good news.
 *
 * The denominator is `grantedCents` — what the period ACTUALLY holds — not the
 * catalog's declared figure. Before the period's grant runs, the catalog says a
 * plan includes something while the balance holds none of it, and dividing by
 * the promise reports a full meter for a plan that has not been funded yet.
 */
export function usageOf(r: Rollup | null): PlanUsage | undefined {
  const granted = r?.included?.grantedCents
  const consumed = r?.consumedCents ?? r?.included?.consumedCents
  if (typeof granted !== 'number' || granted <= 0) return undefined
  if (typeof consumed !== 'number' || consumed < 0) return undefined
  const pct = Math.min(100, Math.round((consumed / granted) * 100))
  return {
    usedPct: pct,
    leftPct: 100 - pct,
    period: typeof r?.period === 'string' ? r.period : '',
    over: consumed > granted,
  }
}
