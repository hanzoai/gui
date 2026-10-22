/**
 * The shell reads in either direction.
 *
 * Hosts set `<html dir="rtl">` for Arabic, Persian, Hebrew, Urdu and the other
 * right-to-left locales. Flex rows and grid columns follow it on their own; what
 * does not is a side named in physical terms. So the shell names sides in
 * logical terms, and these tests hold it there: the markup a prerender ships,
 * the stylesheet, and every inline style in the source.
 *
 *   node --test direction.test.mjs   (after `bun run build`)
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Frame } from './dist/esm/Frame.js'
import { Account } from './dist/esm/Account.js'
import { MARKS } from './dist/esm/glyph.js'

const SRC = join(dirname(fileURLToPath(import.meta.url)), 'src')
const read = (f) => readFileSync(join(SRC, f), 'utf8')

// A side of the inline axis named physically, as markup or CSS writes it.
const PHYSICAL_CSS =
  /(margin|padding|border)-(left|right)\b|text-align:\s*(left|right)|border-(top|bottom)-(left|right)-radius/

const noop = () => {}
const Mark = ({ size }) => h('svg', { width: size, height: size })

const frame = () =>
  renderToStaticMarkup(
    h(
      Frame,
      {
        sections: [{ id: 'chat', label: 'Chat', icon: Mark, href: '/chat' }],
        active: 'chat',
        navigate: noop,
        back: noop,
        forward: noop,
        workspace: h('select', { 'aria-label': 'Workspace' }),
        find: { label: 'hanzo', open: noop },
        list: h('div'),
        account: h(Account, { name: 'Z', email: 'z@hanzo.ai', onSignOut: noop }),
        settings: noop,
        side: { title: 'Notes', close: noop, node: h('div') },
      },
      h('div', { id: 'room' })
    )
  )

test('the frame ships no physical side in its markup', () => {
  const html = frame()
  assert.doesNotMatch(html, PHYSICAL_CSS)
  // the columns' dividers and the grips that size them are logical
  assert.match(html, /border-inline-start:/)
  assert.match(html, /inset-inline-(start|end):0/)
})

test('marks that point along the line mirror; the rest do not', () => {
  for (const name of ['back', 'forward', 'sidebar', 'collapse']) {
    const svg = renderToStaticMarkup(h(MARKS[name], { size: 16 }))
    assert.match(svg, /data-i18n-mirror=""/, `${name} mirrors under RTL`)
  }
  for (const name of ['chat', 'gear']) {
    const svg = renderToStaticMarkup(h(MARKS[name], { size: 16 }))
    assert.doesNotMatch(svg, /data-i18n-mirror/, `${name} keeps its shape`)
  }
})

test('the stylesheet names no physical side and mirrors under :dir(rtl)', () => {
  const css = read('shellStyles.ts')
  assert.doesNotMatch(css.replace(/\/\/.*$/gm, ''), PHYSICAL_CSS)
  assert.match(css, /\[data-i18n-mirror\]:dir\(rtl\)\{transform:scaleX\(-1\)\}/)
  assert.match(css, /\[data-hanzo-edge=drawer\]:dir\(rtl\)\{box-shadow:/)
})

test('no inline style in the shell names a physical inline side', () => {
  const offences = []
  for (const file of readdirSync(SRC).filter((f) => /\.tsx?$/.test(f))) {
    read(file)
      .split('\n')
      .forEach((line, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(line)) return
        if (
          /\b(margin|padding)(Left|Right)\s*:|\bborder(Left|Right)\w*\s*:|textAlign:\s*['"](left|right)['"]/.test(
            line
          )
        ) {
          offences.push(`${file}:${i + 1}  ${line.trim()}`)
        }
      })
  }
  assert.deepEqual(offences, [])
})
