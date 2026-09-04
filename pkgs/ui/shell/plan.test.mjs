/**
 * A meter that reads zero is a claim, and the wrong one.
 *
 * "You have used none of your plan" and "we could not measure your plan" look
 * identical on a bar and mean opposite things. The first is reassuring; the
 * second is a fault. Rendering the second as the first tells someone who has
 * been working all month that they have not started — on the one screen they
 * opened to check whether their payment worked.
 *
 * So `usageOf` returns UNDEFINED unless a real bound and a real count both
 * arrived, and <Meter> draws no bar for undefined. Every case below is a way
 * the rollup can arrive without both, and each is reachable today: a server
 * that predates windows, a plan declaring no bound at a span, an unreadable
 * ledger.
 *
 *   node --test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { usageOf, resetsAt } from './dist/usage.js'

const W = (span, limit, used, extra = {}) => ({ span, limit, used, ...extra })

test('no windows is not zero usage', () => {
  // A server that predates windows. It answers, and it says nothing about them.
  assert.equal(usageOf({ period: '2026-08' }), undefined)
  assert.equal(usageOf({ windows: [] }), undefined)
  // The ledger did not answer at all.
  assert.equal(usageOf(null), undefined)
})

test('a span with no bound is skipped, not read as fully spent', () => {
  // limit 0 means "no bound at this period" — the opposite of "you may make
  // zero requests". Reading it as spent would pin the meter at 100%.
  assert.equal(usageOf({ windows: [W('hour', 0, 0), W('day', 0, 12)] }), undefined)

  const u = usageOf({ windows: [W('hour', 0, 5), W('day', 100, 25)] })
  assert.equal(u.span, 'day', 'the only real bound must be the one reported')
  assert.equal(u.usedPct, 25)
})

test('a fresh period with no spend is a real zero', () => {
  // This one IS 0%, and it must render — the difference from the cases above is
  // the whole point of the file.
  const u = usageOf({ windows: [W('day', 1000, 0, { remaining: 1000 })] })
  assert.ok(u, 'a declared bound with no spend must report, not vanish')
  assert.equal(u.usedPct, 0)
  assert.equal(u.leftPct, 100)
  assert.equal(u.remaining, 1000)
  assert.equal(u.over, false)
})

test('the nearest bound wins, not the longest period', () => {
  // Throttled on the hour while barely into the month. Telling this person they
  // are 2% through the month is true and useless: the hour is what stops them.
  // The binding window is deliberately NOT first in the array. Ordered first,
  // "nearest wins" and "whichever came first wins" are indistinguishable, and
  // the test passes against an implementation that never compares anything.
  const u = usageOf({
    windows: [
      W('day', 1000, 300),
      W('week', 5000, 900),
      W('hour', 150, 148, { remaining: 2, resets: '2026-08-19T23:00:00Z' }),
      W('month', 15000, 300),
    ],
  })
  assert.equal(u.span, 'hour', 'the nearest bound must win regardless of its position')
  assert.equal(u.usedPct, 99)
  assert.equal(u.remaining, 2)

  // And the reverse ordering, so neither "first" nor "last" can masquerade.
  const v = usageOf({
    windows: [
      W('month', 15000, 300),
      W('hour', 150, 148),
      W('week', 5000, 900),
      W('day', 1000, 300),
    ],
  })
  assert.equal(v.span, 'hour')
})

test('used and left always sum to a whole', () => {
  // Two numbers for one fact drift. left is derived from used, so a reader can
  // never be shown 62% used beside 39% left.
  for (const used of [0, 1, 37, 500, 999, 1000]) {
    const u = usageOf({ windows: [W('day', 1000, used)] })
    assert.equal(u.usedPct + u.leftPct, 100, `${used}/1000 does not sum to 100`)
  }
})

test('a spent bound clamps the bar and says so', () => {
  // A bar cannot draw 240%, and usage CAN pass the bound — the ledger keeps
  // recording. The bar pins at full and the flag carries what it cannot.
  const u = usageOf({ windows: [W('day', 1000, 2400)] })
  assert.equal(u.usedPct, 100, 'the fill must not exceed the track')
  assert.equal(u.leftPct, 0)
  assert.equal(u.remaining, 0)
  assert.equal(u.over, true)
})

test('the server’s own remaining is trusted over the subtraction', () => {
  // remaining is what the GATE will enforce. If it disagrees with limit−used,
  // the gate is right and the arithmetic here is the guess.
  const u = usageOf({ windows: [W('day', 1000, 400, { remaining: 550 })] })
  assert.equal(u.remaining, 550)
  // …and the subtraction still covers a server that sent none.
  assert.equal(usageOf({ windows: [W('day', 1000, 400)] }).remaining, 600)
})

test('a nonsense reading is refused rather than rendered', () => {
  // Negative usage is a broken row, not a credit. Showing it as over-100% left
  // would be inventing good news.
  assert.equal(usageOf({ windows: [W('day', 1000, -5)] }), undefined)
  assert.equal(usageOf({ windows: [W('day', -1, 10)] }), undefined)
})

test('a reset instant is shown only when it can be trusted', () => {
  assert.equal(resetsAt(undefined), '')
  assert.equal(resetsAt({ span: 'day', resets: '' }), '')
  // A time this runtime cannot parse is worse than none: a holder waits on it.
  assert.equal(resetsAt({ span: 'day', resets: 'tomorrow-ish' }), '')
  // An hour rolls over at a TIME; a month at a DATE. "resets 00:00" for a month
  // is technically true and reads as tonight.
  assert.match(resetsAt({ span: 'hour', resets: '2026-08-19T23:00:00Z' }), /\d/)
  assert.match(resetsAt({ span: 'month', resets: '2026-09-01T00:00:00Z' }), /\w/)
})

test('a bound is worth showing whether or not it was paid for', () => {
  // The free rung declares 20 a day. It is a real bound, met by real people, and
  // it used to be invisible because the meter keyed on "has a subscription" —
  // so the viewers most likely to hit a limit were the only ones never warned
  // about it. They met it as a refusal instead.
  //
  // usageOf does not know or care who paid; it reports a reading when one
  // exists. This asserts the free shape produces one.
  const u = usageOf({
    windows: [
      W('hour', 10, 9, { remaining: 1, resets: '2026-08-20T15:00:00Z' }),
      W('day', 20, 18, { remaining: 2 }),
    ],
  })
  assert.ok(u, 'the free rung is bounded and the bound must be readable')
  assert.equal(u.span, 'hour', '9/10 binds before 18/20')
  assert.equal(u.remaining, 1)
})
