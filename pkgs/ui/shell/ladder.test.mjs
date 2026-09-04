/**
 * A tier we do not recognise is a customer we downgrade.
 *
 * `normalizeTier` answers an unknown slug with the DEFAULT tier, and the default
 * is free. That is right for "nobody is signed in" and catastrophic for "this
 * person pays us": commerce sold a `go` plan, the ladder here had never heard of
 * it, and every Go subscriber resolved to free on hanzo.ai, hanzo.chat and
 * hanzo.app at once — gated out of what they had just bought, with nothing
 * anywhere reporting a fault. The plan did not merely LOOK broken. It was.
 *
 * The failure is silent by construction, so it needs a test rather than
 * attention: adding a tier in commerce is a different repo on a different day,
 * and nothing about that change fails here. This holds the ladder against the
 * tiers commerce actually sells, and against the two invariants that make the
 * ladder mean anything.
 *
 * Read as TEXT, like `barrel.test.mjs` beside it and for the same reason: this
 * package is TypeScript with no build step under `node --test`, and a fixture
 * retyping the ladder would only ever prove itself consistent.
 *
 *   node --test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = join(dirname(fileURLToPath(import.meta.url)), 'src')
const registry = readFileSync(join(SRC, 'hanzo-registry.ts'), 'utf8')

/** The rungs, in declaration order: slug, rank, and whether it is still sold. */
function rungs() {
  const ladder = registry.slice(registry.indexOf('export const HANZO_PLANS'))
  const out = []
  for (const m of ladder.matchAll(
    /slug: '([\w-]+)',(?:[^}]*?retired: (true))?[^}]*?rank: (\d+)/g
  )) {
    out.push({ slug: m[1], retired: m[2] === 'true', rank: Number(m[3]) })
  }
  return out
}

/**
 * The personal ladder commerce sells, cheapest first — go $9, dev $19, pro $49,
 * max $99. Named here rather than fetched: a test that reads the live catalog
 * passes during an outage and fails on a deploy, which is the opposite of what a
 * test is for. When commerce adds a tier, this line is the one edit that makes
 * this file fail until the ladder learns it.
 */
const SOLD = ['free', 'go', 'dev', 'pro', 'max']

test('every tier commerce sells has a rung', () => {
  const known = new Set(rungs().map((r) => r.slug))
  const missing = SOLD.filter((slug) => !known.has(slug))
  assert.deepEqual(
    missing,
    [],
    `${missing.join(', ')} would fall through normalizeTier to free, so anyone paying for one is gated as if they pay nothing`
  )
})

test('a retired tier keeps its rung', () => {
  // Retiring a tier stops us SELLING it. It does not refund the people already
  // on one, and deleting the rung is how they become free users.
  const plus = rungs().find((r) => r.slug === 'plus')
  assert.ok(
    plus,
    'plus was removed rather than retired; whoever still holds one now resolves to free'
  )
  assert.equal(plus.retired, true, 'plus is still offered; it is not sold any more')
})

test('rank is a strict order, and declaration order is that order', () => {
  const all = rungs()
  assert.ok(all.length > 0, 'no rungs parsed — this test is watching nothing')

  const ranks = all.map((r) => r.rank)
  assert.equal(
    new Set(ranks).size,
    ranks.length,
    `two rungs share a rank: ${ranks.join(', ')}`
  )

  // Gating is `rankOf(tier) >= rankOf(required)`, and the file's own comment says
  // order IS display order. A rung declared out of order gates correctly and
  // renders in the wrong place, which is the kind of wrong nobody reads as a bug.
  for (let i = 1; i < all.length; i++) {
    assert.ok(
      all[i].rank > all[i - 1].rank,
      `${all[i].slug} (rank ${all[i].rank}) is declared after ${all[i - 1].slug} (rank ${all[i - 1].rank}) but does not outrank it`
    )
  }
})

test('free is the floor', () => {
  // normalizeTier falls back to DEFAULT_PLAN_TIER, and every gate is written
  // expecting that fallback to grant the least. A ladder where something ranks
  // below free would make the fallback grant MORE than a real tier.
  const all = rungs()
  const free = all.find((r) => r.slug === 'free')
  assert.ok(free, 'no free rung')
  for (const r of all) {
    assert.ok(r.rank >= free.rank, `${r.slug} ranks below free`)
  }
})
