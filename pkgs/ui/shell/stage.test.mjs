/**
 * A stage answers two questions, and this file exists because collapsing them
 * into one is a silent, shippable mistake that LOOKS correct.
 *
 * With a single clearance rank, filtering a public menu at zero clearance drops
 * every unfinished product — so marking Studio alpha also took Hanzo Bot out of
 * every anonymous menu, hanzo.bot's own chrome included. Nothing failed: the
 * types were fine, the build was green, and the menu simply had one fewer row.
 * Two products hidden to hide one.
 *
 * So `sees` is about SECRECY and `enters` is about READINESS. Beta is offered to
 * a stranger and opened by a customer; only alpha is secret.
 *
 *   node --test stage.test.mjs
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  HANZO_FLAGSHIP,
  HANZO_FLAGSHIP_PUBLIC,
  enters,
  sees,
} from './dist/hanzo-registry.js'

const ids = (list) => list.map((p) => p.id)

test('a stranger is offered every product but the unannounced one', () => {
  // The regression this file is named for: Bot is beta and MUST still be listed.
  const shown = ids(HANZO_FLAGSHIP_PUBLIC)
  assert.ok(shown.includes('bot'), 'bot is beta, not secret — it stays in the menu')
  assert.ok(shown.includes('team'), 'team is beta, not secret — it stays in the menu')
  assert.ok(!shown.includes('studio'), 'studio is alpha — it is not offered')
})

test('a stranger is offered beta but not let into it', () => {
  for (const p of HANZO_FLAGSHIP.filter((p) => p.stage === 'beta')) {
    assert.ok(sees()(p), `${p.id} must be offered to a stranger`)
    assert.ok(!enters()(p), `${p.id} must not open for a stranger`)
    assert.ok(enters('beta')(p), `${p.id} must open for a customer`)
  }
})

test('alpha is invisible until staff', () => {
  for (const p of HANZO_FLAGSHIP.filter((p) => p.stage === 'alpha')) {
    assert.ok(!sees()(p), `${p.id} is hidden from a stranger`)
    assert.ok(!sees('beta')(p), `${p.id} is hidden from a customer`)
    assert.ok(sees('alpha')(p), `${p.id} is visible to staff`)
  }
})

test('nothing admits a reader it does not offer', () => {
  // The invariant that makes two floors safe to state apart. Without it the pair
  // can drift into a door with no sign on it.
  for (const p of HANZO_FLAGSHIP)
    for (const clearance of [undefined, 'beta', 'alpha'])
      if (enters(clearance)(p))
        assert.ok(sees(clearance)(p), `${p.id} opens for ${clearance ?? 'a stranger'} but is not listed`)
})

test('clearance only ever widens', () => {
  const stranger = ids(HANZO_FLAGSHIP.filter(sees()))
  const customer = ids(HANZO_FLAGSHIP.filter(sees('beta')))
  const staff = ids(HANZO_FLAGSHIP.filter(sees('alpha')))
  assert.ok(stranger.every((id) => customer.includes(id)))
  assert.ok(customer.every((id) => staff.includes(id)))
  assert.equal(staff.length, HANZO_FLAGSHIP.length, 'staff see the whole family')
})
