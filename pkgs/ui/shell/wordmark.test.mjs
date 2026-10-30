/**
 * The wordmark's type is a rule, not an inline style: the name's span carries
 * its part and size as data, and the rules ride in `<style>` elements React
 * hoists into the head (one copy a page, in the server's HTML before any
 * script). A host that bans `style={…}` gets none from the brand.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'

const { HanzoWordmark, HanzoLockup } = await import('./dist/esm/mark.js')
const h = React.createElement

test('the name is a span with no inline style, its part and size as data', () => {
  const html = renderToString(
    h('a', { href: '/' }, h(HanzoWordmark, { label: 'Hanzo AI', size: 22 }))
  )
  assert.match(html, /<span data-slot="wordmark" data-size="19">Hanzo AI<\/span>/)
  assert.doesNotMatch(html, /style="/)
})

test('its type is two rules, hoisted out of the name: the face once, the size per size', () => {
  const html = renderToString(
    h(
      'div',
      null,
      h(HanzoWordmark, { size: 22 }),
      h(HanzoWordmark, { size: 22 }),
      h(HanzoWordmark, { size: 16 })
    )
  )
  const sheets = html.match(/<style[^>]*>[^<]*<\/style>/g) ?? []
  assert.equal(
    sheets.filter((s) => s.includes('font-weight:600;letter-spacing:-0.4px')).length,
    1,
    'the face, once'
  )
  assert.equal(
    sheets.filter((s) => s.includes('[data-size="19"]{font-size:19px}')).length,
    1,
    '22 sets it at 19px, once'
  )
  assert.equal(
    sheets.filter((s) => s.includes('[data-size="14"]{font-size:14px}')).length,
    1,
    '16 sets it at 14px'
  )
  // Hoisted: no rule inside a name.
  assert.doesNotMatch(html, /<span data-slot="wordmark"[^>]*><style/)
})

test('the lockup lays the mark beside the name by the same sheet, with no inline style', () => {
  const html = renderToString(h(HanzoLockup, { label: 'Hanzo' }))
  assert.match(html, /<span data-slot="lockup">/)
  assert.match(
    html,
    /\[data-slot="lockup"\]\{display:inline-flex;align-items:center;gap:8px/
  )
  assert.doesNotMatch(
    html.replace(/<style[^>]*>[^<]*<\/style>/g, ''),
    /<span[^>]*style="/
  )
})
