/**
 * The workspace frame's laws — the ones a host would break by accident.
 *
 * The frame is rendered to markup and read, the way a prerendered page ships
 * it; the account menu's set and order are read off the one function that
 * decides them; the stylesheet is read for the rules that decide what is drawn.
 *
 *   node --test frame.test.mjs   (after `bun run build`)
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Frame } from './dist/esm/Frame.js'
import { Account, rows } from './dist/esm/Account.js'
import { Scope } from './dist/esm/Scope.js'

const SRC = join(dirname(fileURLToPath(import.meta.url)), 'src')
const read = (f) => readFileSync(join(SRC, f), 'utf8')

const Mark = ({ size }) => h('svg', { width: size, height: size })
const SECTIONS = [
  { id: 'chat', label: 'Chat', icon: Mark, href: '/chat' },
  { id: 'dev', label: 'Dev', title: 'Hanzo Dev', icon: Mark, href: '/dev' },
  { id: 'team', label: 'Team', icon: Mark, href: 'https://hanzo.team' },
]
const noop = () => {}

const render = (props = {}) =>
  renderToStaticMarkup(
    h(
      Frame,
      {
        sections: SECTIONS,
        active: 'chat',
        navigate: noop,
        workspace: h('select', { 'aria-label': 'Workspace' }),
        scope: h('span', { id: 'scope' }, 'scope'),
        find: { label: 'hanzo', open: noop },
        list: h('div', { id: 'held' }),
        account: h(Account, { name: 'Z', email: 'z@hanzo.ai', onSignOut: noop }),
        settings: noop,
        more: noop,
        ...props,
      },
      h('div', { id: 'room' })
    )
  )

test('the account menu is the person: Profile, Notifications, Appearance, Security, Sign out', () => {
  const all = rows({
    onProfile: noop,
    onNotifications: noop,
    onAppearance: noop,
    onSecurity: noop,
    onSignOut: noop,
  })
  assert.deepEqual(
    all.map((r) => r.label),
    ['Profile', 'Notifications', 'Appearance', 'Security', 'Sign out']
  )
  // A row with nowhere to go is not drawn; the way out always is.
  assert.deepEqual(
    rows({ onSignOut: noop }).map((r) => r.label),
    ['Sign out']
  )
  assert.deepEqual(
    rows({ onProfile: noop, onSignOut: noop }).map((r) => r.id),
    ['profile', 'signout']
  )
})

test('the account card carries no balance and no workspace', () => {
  const src = read('Account.tsx')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
  assert.doesNotMatch(src, /balance|top.?up|credit|billing|switchOrg|organi[sz]ation/i)
  const card = renderToStaticMarkup(
    h(Account, { name: 'Z', email: 'z@hanzo.ai', onSignOut: noop })
  )
  assert.match(card, /aria-label="Account"/)
  assert.doesNotMatch(card, /\$\d/)
  // Outside a frame there is no sidebar to collapse, so no control for it.
  assert.doesNotMatch(card, /Collapse sidebar/)
})

test('the frame draws no far-left strip unless the host asks for one', () => {
  const plain = render()
  assert.match(plain, /data-hanzo-frame=""/)
  assert.doesNotMatch(plain, /data-strip/)
  assert.doesNotMatch(plain, /data-slot="strip"/)

  const team = render({ strip: h('a', { id: 'org' }, 'org') })
  assert.match(team, /data-strip=""/)
  assert.match(
    team,
    /<nav data-slot="rail"[^>]*><div data-slot="strip"><a id="org">org<\/a>/
  )

  const css = read('shellStyles.ts')
  assert.match(
    css,
    /\[data-sidebar=open\]:not\(\[data-strip\]\)>\[data-slot=rail\]\{display:none\}/,
    'beside an open sidebar the rail steps aside — unless it is the strip'
  )
})

test('the sidebar: the workspace switcher at the top, the sections, what they hold, the account at the foot', () => {
  const html = render()
  const at = (needle) => {
    const i = html.indexOf(needle)
    assert.ok(i >= 0, `${needle} is drawn`)
    return i
  }
  const sidebar = at('data-slot="sidebar"')
  const switcher = at('data-slot="workspace-switcher"')
  const places = at('data-slot="places-list"')
  const held = at('id="held"')
  const account = at('data-slot="account"')
  assert.ok(sidebar < switcher && switcher < places && places < held && held < account)
  for (const label of ['Chat', 'Dev', 'Team', 'Settings'])
    assert.match(html.slice(places, held), new RegExp(`aria-label="${label}"`))
  assert.match(html.slice(places, held), /aria-label="Chat" aria-current="page"/)
  // A section on another host is a link; one here is the host's to move to.
  assert.match(html, /<a href="https:\/\/hanzo.team" aria-label="Team"/)
  // Inside a frame the account card collapses the sidebar.
  assert.match(html.slice(account), /Collapse sidebar/)
})

test('project and environment sit in the bar, and the room in the pane', () => {
  const html = render()
  const bar = html.indexOf('data-slot="bar"')
  const scope = html.indexOf('data-slot="scope"')
  const list = html.indexOf('data-slot="list"')
  assert.ok(bar >= 0 && bar < scope && scope < list, 'the scope is in the bar')
  assert.match(html, /Search hanzo/)
  assert.match(html, /<main data-slot="pane"[^>]*><div id="room"><\/div><\/main>/)
})

test('the sidebar opens and shuts on an explicit toggle, never under a passing pointer', () => {
  const src = read('Frame.tsx')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
  assert.doesNotMatch(src, /onMouseEnter|onPointerEnter|onMouseOver|peek/i)
  assert.match(render(), /aria-label="Close sidebar"/)
})

test('the scope falls back to All projects, and draws no environment it was not given', () => {
  const html = renderToStaticMarkup(
    h(Scope, { projects: [{ id: 'p1', name: 'one' }], project: 'gone', onProject: noop })
  )
  assert.match(html, /<option value="" selected="">All projects<\/option>/)
  assert.doesNotMatch(html, /aria-label="Environment"/)
  const both = renderToStaticMarkup(
    h(Scope, {
      projects: [{ id: 'p1', name: 'one' }],
      project: 'p1',
      onProject: noop,
      environments: ['production', 'dev'],
      environment: 'dev',
      onEnvironment: noop,
    })
  )
  assert.match(both, /<option value="p1" selected="">one<\/option>/)
  assert.match(both, /<option value="dev" selected="">dev<\/option>/)
})

test('notifications ask through the host and hold no credential', () => {
  const src = read('Notifications.tsx')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
  assert.doesNotMatch(src, /\bfetch\(|Authorization|localStorage|token/i)
  for (const path of ["'/v1/team/inbox'", '/read`', '/archive`'])
    assert.ok(src.includes(path), path)
})

test('a section points at a path here or an https address elsewhere, and nothing else', () => {
  const html = render({
    sections: [
      ...SECTIONS,
      { id: 'proto', label: 'Proto', icon: Mark, href: '//evil.example' },
      { id: 'script', label: 'Script', icon: Mark, href: 'javascript:alert(1)' },
      { id: 'bare', label: 'Bare', icon: Mark, href: '@evil.example' },
      { id: 'plain', label: 'Plain', icon: Mark, href: 'http://hanzo.team' },
    ],
    home: '//evil.example',
  })
  for (const label of ['Proto', 'Script', 'Bare', 'Plain'])
    assert.doesNotMatch(
      html,
      new RegExp(`aria-label="${label}"`),
      `${label} is not drawn`
    )
  assert.match(html, /<a href="\/" data-slot="home"/, 'the mark falls back to this app')
})

test('a notification is acted on only by a plain id, and its reason is looked up safely', () => {
  const src = read('Notifications.tsx')
  assert.match(src, /const SEGMENT = \/\^\[A-Za-z0-9_-\]\+\$\//)
  assert.match(src, /SEGMENT\.test\(n\.id\)/)
  assert.match(src, /new Map<string, string>/)
})
