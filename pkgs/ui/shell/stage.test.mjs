/**
 * What a stranger is offered, and what a clearance adds.
 *
 * This file exists because the failure it guards is silent and shippable: a menu
 * that shows one row too many looks exactly like a menu that is correct. Nothing
 * throws, the types are fine, the build is green — an unfinished product is
 * simply on the page, in front of everyone, until someone happens to look.
 *
 * The rule is one question. A product carries `stage`, absent meaning released,
 * and a reader carries a clearance. Only the released estate is public; Team,
 * Bot and Studio are held back until they are ready.
 *
 * It briefly became two questions — "may they SEE it" apart from "may they OPEN
 * it" — on the reasoning that a beta is announced while an alpha is secret. That
 * is a fair rule for a product someone chose to announce, and it is not this
 * one, so the pair computed the same answer twice under two names. If a beta
 * should ever be advertised, that is the product saying so: give it a field and
 * let it opt in, rather than loosening what `beta` means for everything else.
 *
 *   node --test stage.test.mjs
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HANZO_FLAGSHIP, HANZO_FLAGSHIP_PUBLIC, sees } from './dist/hanzo-registry.js'

const ids = (list) => list.map((p) => p.id)

test('a stranger is offered the released estate and nothing else', () => {
  assert.deepEqual(ids(HANZO_FLAGSHIP_PUBLIC), ['chat', 'app', 'base', 'cloud', 'dev'])
})

test('an unfinished product never reaches an anonymous menu', () => {
  for (const p of HANZO_FLAGSHIP.filter((p) => p.stage))
    assert.ok(!sees()(p), `${p.id} is ${p.stage} — a stranger must not be offered it`)
})

test('alpha stays hidden from a customer, beta does not', () => {
  const customer = ids(HANZO_FLAGSHIP.filter(sees('beta')))
  assert.ok(customer.includes('bot'), 'bot is beta — a cleared customer sees it')
  assert.ok(customer.includes('team'), 'team is beta — a cleared customer sees it')
  assert.ok(
    !customer.includes('studio'),
    'studio is alpha — beta clearance is not enough'
  )
})

test('staff see the whole family', () => {
  assert.equal(HANZO_FLAGSHIP.filter(sees('alpha')).length, HANZO_FLAGSHIP.length)
})

test('clearance only ever widens', () => {
  // Monotonic, so raising a clearance can never take a row AWAY — the property
  // that lets a surface pass whatever it has without reasoning about the order.
  const stranger = ids(HANZO_FLAGSHIP.filter(sees()))
  const customer = ids(HANZO_FLAGSHIP.filter(sees('beta')))
  const staff = ids(HANZO_FLAGSHIP.filter(sees('alpha')))
  assert.ok(stranger.every((id) => customer.includes(id)))
  assert.ok(customer.every((id) => staff.includes(id)))
})

test('the public list is exactly what a stranger passes', () => {
  // Two values, one rule: HANZO_FLAGSHIP_PUBLIC must not drift from the filter.
  assert.deepEqual(ids(HANZO_FLAGSHIP_PUBLIC), ids(HANZO_FLAGSHIP.filter(sees())))
})
