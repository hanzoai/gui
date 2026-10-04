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
import { HANZO_FOOTER_BOTTOM, HANZO_FOOTER_COLUMNS, HANZO_SURFACES } from './dist/esm/hanzo-registry.js'

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

/**
 * The legal bar reaches every document a buyer is asked to accept.
 *
 * Privacy, Terms and Cookies are three of eleven. The Acceptable Use Policy,
 * the Data Processing Addendum and the subprocessor register — what a
 * procurement review asks for first — sat one document deep, reachable only by
 * finding the link inside the Terms. hanzo.ai/legal is the index of all of
 * them, and the bar names it.
 */
test('the footer legal bar links the legal center', () => {
  const hrefs = HANZO_FOOTER_BOTTOM.links.map((l) => l.href)
  for (const want of [
    'https://hanzo.ai/privacy',
    'https://hanzo.ai/terms',
    'https://hanzo.ai/legal',
  ]) {
    assert.ok(hrefs.includes(want), `the legal bar is missing ${want}`)
  }
})

/**
 * The footer names each destination once, at the page that explains it.
 *
 * It listed Hanzo CLI twice, Status and "System Status" for one address,
 * Foundation in a column and again in the legal bar, and pointed at console
 * addresses (platform.hanzo.ai/keys answered "No such page") and at
 * hanzo.app/community, which only redirects to Support.
 */
test('the footer names each destination once, on its own host', () => {
  const all = [...HANZO_FOOTER_COLUMNS.flatMap((c) => c.items), ...HANZO_FOOTER_BOTTOM.links]
  const seen = new Map()
  for (const l of all) seen.set(l.href, (seen.get(l.href) ?? 0) + 1)
  const twice = [...seen].filter(([, n]) => n > 1).map(([h]) => h)
  assert.deepEqual(twice, [], 'a destination the footer names twice')
  const away = all.filter((l) => /platform\.hanzo\.ai|hanzo\.app\/community/.test(l.href)).map((l) => l.href)
  assert.deepEqual(away, [], 'a footer row that sends a reader into the console or a redirect')
})
