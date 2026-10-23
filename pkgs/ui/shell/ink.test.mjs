/**
 * The account menu's inks follow the page's theme when the host's bar does
 * (`ink="page"`), so no host restates the shell's `--white-NN` rungs on its own
 * element; without the prop the menu is the dark chrome it always was.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const { HanzoIdentity } = await import('./dist/esm/HanzoIdentity.js')
const { INK_CSS } = await import('./dist/esm/shellStyles.js')

const user = { name: 'Dave', email: 'dave@acme.test' }
const draw = (props) => renderToStaticMarkup(React.createElement(HanzoIdentity, props))

test('a page-following bar marks the menu and the sign-in with the page ink', () => {
  assert.match(draw({ auth: { user }, ink: 'page' }), /^<div data-hanzo-ink="page"/)
  assert.match(draw({ auth: {}, ink: 'page' }), /^<a [^>]*data-hanzo-ink="page"/)
})

test('without it the menu is the chrome, unmarked', () => {
  assert.doesNotMatch(draw({ auth: { user } }), /data-hanzo-ink/)
  assert.doesNotMatch(draw({ auth: {} }), /data-hanzo-ink/)
})

test('the page ink restates the four rungs the menu reads, by the theme the page set', () => {
  for (const rung of ['--white-92', '--white-60', '--white-45'])
    assert.match(INK_CSS, new RegExp(`${rung}:light-dark\\(`))
  assert.match(INK_CSS, /--white-10:var\(--border,/)
  // The dimmest is pushed in the light: .56 black, not .45.
  assert.match(
    INK_CSS,
    /--white-45:light-dark\(color-mix\(in srgb,var\(--pure-black,#000\) 56%/
  )
})
