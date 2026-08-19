/**
 * A meter that reads zero is a claim, and the wrong one.
 *
 * "You have used none of your plan" and "we could not measure your plan" look
 * identical on a bar and mean opposite things. The first is reassuring; the
 * second is a fault. Rendering the second as the first tells someone who has
 * been working all month that they have not started — and it does it on the one
 * surface they opened to check whether their payment worked.
 *
 * So `usageOf` returns UNDEFINED unless a real denominator and a real numerator
 * both arrived, and <Meter> draws no bar at all for undefined. Every case below
 * is a way the rollup can arrive without both, and each one has actually been
 * reachable: a plan with no backing (only Go carries one today), a period whose
 * grant has not run yet, and a ledger that did not answer.
 *
 * The denominator is grantedCents — what the period ACTUALLY holds — never the
 * catalog's declared figure. Dividing by the promise reports a full meter for a
 * plan that has not been funded.
 *
 *   node --test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { usageOf } from './dist/usage.js'

test('no denominator is not zero usage', () => {
  // A plan with nothing behind it. Every paid rung but Go is here today.
  assert.equal(usageOf({ included: { grantedCents: 0 }, consumedCents: 0 }), undefined)
  assert.equal(usageOf({ included: {} }), undefined)
  assert.equal(usageOf({}), undefined)
  // The ledger did not answer at all.
  assert.equal(usageOf(null), undefined)
})

test('a granted period with no spend is a real zero', () => {
  // This one IS 0%, and it must render — the difference from the cases above is
  // the whole point of the file.
  const u = usageOf({ included: { grantedCents: 500 }, consumedCents: 0, period: '2026-08' })
  assert.ok(u, 'a funded period with no spend must report, not vanish')
  assert.equal(u.usedPct, 0)
  assert.equal(u.leftPct, 100)
  assert.equal(u.over, false)
  assert.equal(u.period, '2026-08')
})

test('used and left always sum to a whole', () => {
  // Two numbers for one fact drift. left is derived from used, so a reader can
  // never be shown 62% used beside 39% left.
  for (const consumed of [0, 1, 149, 250, 499, 500]) {
    const u = usageOf({ included: { grantedCents: 500 }, consumedCents: consumed })
    assert.equal(u.usedPct + u.leftPct, 100, `${consumed} of 500 does not sum to 100`)
  }
})

test('over the included amount clamps the bar and says so', () => {
  // A bar cannot draw 240%, and a plan CAN be consumed past what it includes —
  // the ledger keeps charging. The bar pins at full and the flag carries the
  // truth the bar cannot.
  const u = usageOf({ included: { grantedCents: 500 }, consumedCents: 1200 })
  assert.equal(u.usedPct, 100, 'the fill must not exceed the track')
  assert.equal(u.leftPct, 0)
  assert.equal(u.over, true)
})

test('a nonsense reading is refused rather than rendered', () => {
  // A negative consumption is a broken ledger row, not a credit. Showing it as a
  // meter over 100% left would be inventing good news.
  assert.equal(usageOf({ included: { grantedCents: 500 }, consumedCents: -10 }), undefined)
  assert.equal(usageOf({ included: { grantedCents: -1 }, consumedCents: 10 }), undefined)
})

test('consumption falls back to the included block when the total is absent', () => {
  // The rollup publishes consumption twice — once overall, once clipped to what
  // the plan includes. Either is a real reading; missing both is not.
  const u = usageOf({ included: { grantedCents: 400, consumedCents: 100 } })
  assert.equal(u.usedPct, 25)
})
