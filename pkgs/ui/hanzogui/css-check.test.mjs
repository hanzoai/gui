/**
 * The checker is the last thing standing between an unstyled page and
 * production, so its two extractors get held to the cases that would silently
 * break them: a declaration value that looks like a class, an escaped Tailwind
 * selector, and markup quoted inside a script payload.
 *
 *   node --test css-check.test.mjs
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  definedClasses,
  usedClasses,
  inlineStyles,
  stylesheetHrefs,
  check,
} from './css-check.mjs'

const set = (css) => [...definedClasses(css)].sort()

test('definedClasses reads selectors, not declaration values', () => {
  // `.5rem` and `#fff` are values; only `.card` is a selector
  assert.deepEqual(set('.card{padding:.5rem;color:#fff;background:url(a.b.c)}'), ['card'])
})

test('definedClasses handles compound, grouped and nested selectors', () => {
  assert.deepEqual(set('.a.b, .c > .d:hover .e::after{color:red}'), [
    'a',
    'b',
    'c',
    'd',
    'e',
  ])
  assert.deepEqual(set('@media (min-width:768.5px){.wide{display:flex}}'), ['wide'])
  assert.deepEqual(set('@supports (d:g){@media screen{.x{color:red}}}'), ['x'])
})

test('definedClasses unescapes CSS identifier escapes', () => {
  // what Tailwind emits for `hover:bg-white/[0.06]`
  assert.deepEqual(set('.hover\\:bg-white\\/\\[0\\.06\\]{color:red}'), [
    'hover:bg-white/[0.06]',
  ])
  // hex escape form
  assert.deepEqual(set('.a\\3a b{color:red}'), ['a:b'])
})

test('definedClasses ignores comments and string literals', () => {
  assert.deepEqual(set('/* .ghost{} */ .real{content:".fake"}'), ['real'])
})

test('usedClasses reads class attributes and decodes entities', () => {
  assert.deepEqual([...usedClasses('<div class="a  b"><p class=\'c\'>')].sort(), [
    'a',
    'b',
    'c',
  ])
  assert.deepEqual([...usedClasses('<div class="a&amp;b">')], ['a&b'])
  assert.deepEqual([...usedClasses('<div class=bare>')], ['bare'])
})

test('usedClasses ignores markup quoted inside scripts and styles', () => {
  // Next pushes the RSC payload through here; it is not delivered markup
  const html = `<div class="real"></div><script>self.__next_f.push('<i class="ghost">')</script>`
  assert.deepEqual([...usedClasses(html)], ['real'])
  assert.deepEqual(
    [...usedClasses('<style>.x::after{content:"class=\\"ghost\\""}</style>')],
    []
  )
})

test('inlineStyles and stylesheetHrefs pull the delivered sheets', () => {
  const html =
    `<link rel="stylesheet" href="/_next/static/css/a.css?v=1"/>` +
    `<link rel="preload" as="style" href="/skip.css">` +
    `<link href="https://cdn.example/x.css" rel="stylesheet">` +
    `<style>.inline{color:red}</style>`
  assert.deepEqual(stylesheetHrefs(html), [
    '/_next/static/css/a.css',
    'https://cdn.example/x.css',
  ])
  assert.deepEqual(inlineStyles(html), ['.inline{color:red}'])
})

// ---------------------------------------------------------------- end to end

const fixture = (files) => {
  const dir = mkdtempSync(join(tmpdir(), 'css-check-'))
  for (const [p, body] of Object.entries(files)) {
    const full = join(dir, p)
    mkdirSync(join(full, '..'), { recursive: true })
    writeFileSync(full, body)
  }
  return dir
}

test('a page passes when every class it uses is delivered', () => {
  const dir = fixture({
    'static/css/main.css': '._bg-1{background:red}',
    'server/index.html':
      '<link rel="stylesheet" href="/_next/static/css/main.css">' +
      '<style>._col-2{color:blue}</style>' +
      '<div class="_bg-1 _col-2 is_View __variable_abc">hi</div>',
  })
  try {
    const r = check({ roots: [dir] })
    assert.equal(r.missing.size, 0, [...r.missing.keys()].join(' '))
    assert.equal(r.used.size, 4) // is_View and __variable_* are allowed, not undefined
    assert.equal(r.bytes.staticFiles, 1)
    assert.equal(r.bytes.inlinePerPage, '._col-2{color:blue}'.length)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a class with no rule anywhere is reported against its page', () => {
  const dir = fixture({
    'static/css/main.css': '._bg-1{background:red}',
    'server/index.html':
      '<link rel="stylesheet" href="/_next/static/css/main.css">' +
      '<div class="_bg-1 _fs-9 px-4">hi</div>',
  })
  try {
    const r = check({ roots: [dir] })
    assert.deepEqual([...r.missing.keys()].sort(), ['_fs-9', 'px-4'])
    assert.match(r.missing.get('_fs-9')[0], /index\.html$/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a rule in a sheet the page never links does not count as delivered', () => {
  const dir = fixture({
    'static/css/linked.css': '._bg-1{background:red}',
    'static/css/orphan.css': '._fs-9{font-size:9px}',
    'server/index.html':
      '<link rel="stylesheet" href="/_next/static/css/linked.css">' +
      '<div class="_bg-1 _fs-9">hi</div>',
  })
  try {
    assert.deepEqual([...check({ roots: [dir] }).missing.keys()], ['_fs-9'])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a stylesheet link pointing at nothing is a failure of its own', () => {
  const dir = fixture({
    'server/index.html':
      '<link rel="stylesheet" href="/_next/static/css/gone.css"><div class="x">',
  })
  try {
    const r = check({ roots: [dir] })
    assert.deepEqual(r.results[0].unresolved, ['/_next/static/css/gone.css'])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('allow patterns exempt a class, and only the class they name', () => {
  const dir = fixture({ 'server/index.html': '<div class="swiper-x swiper-y other">' })
  try {
    const r = check({ roots: [dir], allow: ['swiper-*'] })
    assert.deepEqual([...r.missing.keys()], ['other'])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a build whose only page is the framework error page has measured nothing', () => {
  const dir = fixture({
    'server/pages/500.html':
      '<link rel="stylesheet" href="/_next/static/css/a.css">' +
      '<h1 class="next-error-h1">500</h1>',
    'static/css/a.css': '.next-error-h1{font-size:1rem}',
  })
  try {
    const r = check({ roots: [dir] })
    assert.equal(r.missing.size, 0) // it "passes" on the numbers …
    assert.equal(r.boilerplate.length, r.pages.length) // … and is refused anyway
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a real page alongside the error page is a real measurement', () => {
  const dir = fixture({
    'server/pages/500.html': '<h1 class="next-error-h1">500</h1>',
    'server/pages/index.html': '<div class="_bg-1">hi</div>',
  })
  try {
    const r = check({ roots: [dir] })
    assert.equal(r.boilerplate.length, 1)
    assert.notEqual(r.boilerplate.length, r.pages.length)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
