/**
 * How much of a plan is left — the pure half of `usePlan`.
 *
 * No React, no fetch, no imports. It is a function from the billing rollup's
 * wire shape to a reading, which makes it the part that can be tested directly
 * and the part worth testing: every way this is wrong shows a confident wrong
 * number to someone checking whether their payment worked.
 */

/** One of the plan's nested bounds, as the rollup publishes it. */
export interface RollupWindow {
  /** hour · day · week · month */
  span?: string
  /** Requests the plan includes in this span. 0 = no bound declared here. */
  limit?: number
  /** Requests made inside the current period. */
  used?: number
  /** limit − used, floored at zero. */
  remaining?: number
  /** When this period rolls over, RFC3339 UTC. */
  resets?: string
}

/** The rollup's plan block. Only the fields read here are named. */
export interface Rollup {
  period?: string
  windows?: RollupWindow[]
}

/** The reading shown to a holder: the bound that actually binds, and its state. */
export interface PlanUsage {
  /** Consumed in the binding window, 0–100. */
  usedPct: number
  /** Remaining, 0–100. Derived from `usedPct`, so the two cannot disagree. */
  leftPct: number
  /** Which bound is nearest: hour · day · week · month. */
  span: string
  /** Requests still available in it. */
  remaining: number
  /** When it rolls over, RFC3339 UTC. Empty when the rollup did not say. */
  resets: string
  /** True once the bound is spent. */
  over: boolean
}

/**
 * The binding window, or undefined when there is nothing honest to say.
 *
 * UNDEFINED IS A REAL ANSWER and the most important one. "You have used none of
 * your plan" and "we could not measure your plan" are identical on a bar and
 * opposite in meaning: the first reassures, the second is a fault. A plan that
 * declares no bounds, a rollup that predates windows, and an unreachable ledger
 * are all the second — so each yields undefined and the meter draws nothing
 * rather than an empty bar that reads as good news.
 *
 * THE NEAREST BOUND WINS, not the longest period. A holder throttled at 22:05
 * needs to know their hour clears at 23:00; telling them they are 3% through
 * the month is true and useless. Windows nest, so the one with the highest
 * proportion spent is the one they will actually hit.
 *
 * A span with `limit: 0` declares NO BOUND at that period — it is not a bound of
 * none — so it is skipped rather than read as fully spent.
 */
export function usageOf(r: Rollup | null): PlanUsage | undefined {
  const windows = r?.windows
  if (!Array.isArray(windows) || windows.length === 0) return undefined

  let binding: PlanUsage | undefined
  for (const w of windows) {
    const limit = w?.limit
    const used = w?.used
    if (typeof limit !== 'number' || limit <= 0) continue
    if (typeof used !== 'number' || used < 0) continue

    const pct = Math.min(100, Math.round((used / limit) * 100))
    // Trust the server's own remaining when it sent one — it is the figure the
    // gate will enforce — and fall back to the subtraction when it did not.
    const remaining =
      typeof w.remaining === 'number' && w.remaining >= 0
        ? w.remaining
        : Math.max(0, limit - used)

    if (binding && pct <= binding.usedPct) continue
    binding = {
      usedPct: pct,
      leftPct: 100 - pct,
      span: typeof w.span === 'string' ? w.span : '',
      remaining,
      resets: typeof w.resets === 'string' ? w.resets : '',
      over: used >= limit,
    }
  }
  return binding
}

/**
 * "clears at 23:00" — when the binding window rolls over, in the reader's own
 * timezone. Empty when the rollup named no instant, or named one this runtime
 * cannot parse; a wrong time is worse than none, because a holder waits on it.
 */
export function resetsAt(usage: PlanUsage | undefined): string {
  if (!usage?.resets) return ''
  const t = new Date(usage.resets)
  if (Number.isNaN(t.getTime())) return ''
  // An hour or a day rolls over at a TIME; a week or a month at a DATE. Showing
  // "resets 00:00" for a month is technically true and reads as tonight.
  return usage.span === 'hour' || usage.span === 'day'
    ? t.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    : t.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
