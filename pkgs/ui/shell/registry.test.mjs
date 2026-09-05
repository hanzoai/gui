/**
 * A control that promises something NEW has to lead somewhere that makes one.
 *
 * The header renders any control naming the current place as `aria-current`
 * with no href — a page may not link to itself. That is right for a control
 * that names a DESTINATION ("Open Studio", standing in Studio), and wrong for
 * one that names an ACTION: "+ New project" pointing at hanzo.app is a dead
 * `<span>` on hanzo.app, which is the one page every visitor presses it from.
 *
 * The comparison is the header's own (`here` in HanzoHeader.tsx): origin and
 * path, no query — so a create action must differ from its surface root by
 * PATH. A query alone would satisfy this test and still render inert.
 *
 * Reads the built registry, so the assertion is about the data every consumer
 * receives rather than about the source text.
 *
 *   node --test registry.test.mjs
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HANZO_SURFACES } from './dist/esm/hanzo-registry.js'

const place = (href, host) => {
  const { origin, pathname } = new URL(href, `https://${host}`)
  return origin + pathname.replace(/\/+$/, '')
}

/** Labels that promise a thing does not exist yet. */
const makes = (label) => /\b(new|create|start)\b/i.test(label)

test('an action that makes something leads off the page it is drawn on', () => {
  const inert = []
  for (const s of HANZO_SURFACES) {
    const own = [s.primaryCTA, s.secondaryCTA, ...s.preFooter.actions].filter(Boolean)
    for (const link of own) {
      if (!makes(link.label)) continue
      if (place(link.href, s.host) === `https://${s.host}`) {
        inert.push(`${s.id}: "${link.label}" -> ${link.href}`)
      }
    }
  }
  assert.deepEqual(inert, [], 'these are inert on the surface that draws them')
})

test('every registered link is an address', () => {
  const bad = []
  for (const s of HANZO_SURFACES) {
    const links = [
      s.primaryCTA,
      s.secondaryCTA,
      ...s.localNav.flatMap((n) => [n, ...(n.items ?? [])]),
      ...s.preFooter.actions,
    ].filter(Boolean)
    for (const link of links) {
      try {
        place(link.href, s.host)
      } catch {
        bad.push(`${s.id}: ${link.id} -> ${link.href}`)
      }
    }
  }
  assert.deepEqual(bad, [], 'these hrefs do not parse')
})
