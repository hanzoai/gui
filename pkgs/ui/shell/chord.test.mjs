/**
 * ⌘K belongs to whoever answers it first.
 *
 * A composer with its own command list answers Ctrl-K in its field and claims
 * the press with `preventDefault`. The palette, listening on the document, used
 * to open as well: one press opened two lists, and what was typed next went to
 * the palette on top instead of the composer's commands.
 *
 *   node --test chord.test.mjs
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chorded } from './dist/esm/commandPalette.js'

const press = (key, mods = {}, defaultPrevented = false) => ({ key, metaKey: false, ctrlKey: false, ...mods, defaultPrevented })

test('⌘K and Ctrl-K are the chord, in either case', () => {
  assert.equal(chorded(press('k', { metaKey: true })), true)
  assert.equal(chorded(press('k', { ctrlKey: true })), true)
  assert.equal(chorded(press('K', { ctrlKey: true })), true)
})

test('a press something on the page already claimed is left alone', () => {
  assert.equal(chorded(press('k', { ctrlKey: true }, true)), false)
  assert.equal(chorded(press('k', { metaKey: true }, true)), false)
})

test('K alone, or another chord, is not the palette’s', () => {
  assert.equal(chorded(press('k')), false)
  assert.equal(chorded(press('j', { ctrlKey: true })), false)
})
