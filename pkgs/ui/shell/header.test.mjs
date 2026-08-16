/**
 * The canonical header's laws.
 *
 * Four surfaces render this bar from ONE component, so the things that make it
 * one bar are asserted here rather than left to review: the material, the
 * label, the single filled pill, and the rule that this package never holds a
 * credential. Each test reads the source it governs, so breaking the rule
 * breaks the test.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = path.join(fileURLToPath(new URL('.', import.meta.url)), 'src')
const read = (f) => fs.readFileSync(path.join(SRC, f), 'utf8')
/** Source with every comment removed — what the package actually RENDERS. */
const stripped = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

const sources = fs
  .readdirSync(SRC, { recursive: true })
  .filter((f) => /\.tsx?$/.test(f))
  .map((f) => [f, fs.readFileSync(path.join(SRC, f), 'utf8')])

test('both bars wear the audited material — 60px of glass with no hairline', () => {
  for (const file of ['HanzoHeader.tsx', 'OrgHeader.tsx']) {
    const src = read(file)
    assert.match(src, /const HEADER_H = 60/, `${file}: the bar is 60 tall`)
    assert.match(src, /\.\.\.GLASS,/, `${file}: the bar IS the glass recipe`)
    assert.match(
      src,
      /borderBottom: '1px solid transparent'/,
      `${file}: the audited bar draws no hairline`
    )
  }
  const theme = read('theme.ts')
  assert.match(theme, /bg: 'rgba\(9,9,11,0\.72\)'/, 'the ground is the audited one')
  assert.match(theme, /blur\(20px\) saturate\(1\.8\)/, 'the lens is the audited one')
})

test('the brand trigger is named, not an invitation — nothing says "Meet Hanzo"', () => {
  const src = read('HanzoHeader.tsx')
  assert.match(src, /label="Hanzo"/, 'the desktop trigger says Hanzo')
  // Every string the bar RENDERS, at both widths. The prose that explains why
  // the label is not "Meet Hanzo" is allowed to name it; a rendered label is not.
  assert.doesNotMatch(stripped(src), /Meet Hanzo/, 'no rendered label says "Meet Hanzo"')
})

test('one filled pill, one style — the CTA is the canonical geometry', () => {
  const theme = read('theme.ts')
  assert.match(theme, /export const CTRL_H = 34/, 'the pill is 34 tall')
  assert.match(theme, /R = \{ pill: 999/, 'the pill is a pill')
  assert.match(theme, /ACCENT = 'var\(--neutral-50, #fafafa\)'/, 'near-white, not white')
  assert.match(theme, /sm: 'var\(--font-size-sm, 0\.8125rem\)'/, '13px label')
  assert.match(theme, /fontWeight: 600/, '600 weight')
  // The filled variant exists exactly once, and it is what the header spends on
  // the primary action. A surface may change the LABEL; the style has one home.
  assert.equal(
    (theme.match(/background: filled \? ACCENT : 'transparent'/g) ?? []).length,
    1,
    'the filled fill is defined once'
  )
  const header = read('HanzoHeader.tsx')
  assert.match(header, /cta\(filled, height\)|style=\{cta\(filled/, 'the CTA uses cta()')
  assert.doesNotMatch(header, /borderRadius: 8/, 'no square CTA anywhere in the bar')
})

test('the shell never holds a credential — one action, one provider', () => {
  for (const [file, src] of sources) {
    const rendered = stripped(src)
    assert.doesNotMatch(rendered, /type="password"/, `${file}: no password field`)
    assert.doesNotMatch(
      rendered,
      /client_secret|code_verifier|code_challenge|grant_type/,
      `${file}: the shell never runs a token exchange`
    )
    assert.doesNotMatch(
      rendered,
      /signInWith(Google|Github|Apple|Microsoft)|provider=['"](google|github|apple)/i,
      `${file}: no per-provider button — IAM owns which methods are on`
    )
  }
  const identity = read('HanzoIdentity.tsx')
  // Signed out, the cluster is exactly one control.
  assert.equal(
    (identity.match(/<a\s/g) ?? []).length,
    2, // the sign-in action, and the account-menu row template
    'signed out there is one action, not a sign-in/sign-up pair'
  )
  assert.doesNotMatch(identity, /Sign up|Create account|Continue with email/)
})

test('chrome is dark on every surface — no ground reads an inverting token', () => {
  const theme = read('theme.ts')
  // `--border` belongs here too: design defines it as `--white-10` in dark and
  // `rgb(0 0 0 / .10)` in light, so binding the chrome's edge to it would draw
  // black hairlines on a black bar under a light host.
  assert.doesNotMatch(
    theme,
    /var\(--border[,)]/,
    'the edge takes the rung, not the semantic'
  )
  for (const token of [
    '--background',
    '--foreground',
    '--card',
    '--popover',
    '--primary',
  ]) {
    assert.doesNotMatch(
      theme,
      new RegExp(`var\\(${token}`),
      `chrome must not follow the host theme via ${token}`
    )
  }
  // And nothing outside theme.ts may invent a colour at all.
  for (const [file, src] of sources) {
    if (file === 'theme.ts') continue
    assert.doesNotMatch(src, /var\(--(background|foreground|card|popover)/, `${file}`)
  }
})

test('the signed-in bar has a seat for the surface own leading controls', () => {
  const src = read('OrgHeader.tsx')
  assert.match(src, /headerLeft\?: React\.ReactNode/, 'the prop exists')
  assert.match(src, /\{headerLeft\}/, 'and it is rendered')
  // Composed WITH the brand, never instead of it. The brand here is the WORDMARK:
  // the glyph is the assistant's launcher in the corner, and one shape cannot mean
  // "ask Hanzo" there and "go home" here.
  const left = src.slice(src.indexOf('{headerLeft}'))
  assert.match(left.slice(0, 1200), /<HanzoWordmark/, 'the wordmark still follows it')
})

test('a page never links to itself — and keeps the control anyway', () => {
  const src = read('HanzoHeader.tsx')
  assert.match(src, /function here\(/, 'the predicate exists')
  // Derived from props, so the server and the browser render the same markup.
  assert.doesNotMatch(stripped(src), /window\.location|document\.location/, 'no location')

  // Every "you are here" branch drops the href and says so. This is the whole
  // fix: a surface should never have to choose between a dead self-link and no
  // control at all.
  const branches = src.split('if (current) {').slice(1)
  assert.ok(branches.length >= 4, `expected 4+ current branches, got ${branches.length}`)
  for (const [i, tail] of branches.entries()) {
    const block = tail.slice(0, tail.indexOf('\n  }'))
    assert.match(block, /aria-current="page"/, `branch ${i} announces current`)
    assert.doesNotMatch(block, /href=/, `branch ${i} emits NO href`)
  }
  // The pill stays a pill — same token, so "current" cannot drift into a
  // different-looking control.
  assert.match(src, /aria-current="page" style=\{cta\(filled, height\)\}/, 'still cta()')
})

test('one edge, at design value — 10%, spelled once', () => {
  const theme = read('theme.ts')
  assert.match(
    theme,
    /border: 'var\(--white-10, rgb\(255 255 255 \/ \.10\)\)'/,
    "the resting edge is design's rung with design's value as the fallback"
  )
  // The 9% spelling is gone from the package, and cannot come back by hand:
  // every hairline reads CHROME.border, so there is one place to change.
  for (const [file, src] of sources) {
    assert.doesNotMatch(src, /0\.09|,\s*\.09\)/, `${file}: a second edge value`)
  }
})

test('the switcher asks the server — it never holds the list', () => {
  const src = read('UserOrgDropdown.tsx')
  assert.match(src, /findOrgs\?: \(query: OrgQuery\) => Promise<OrgPage>/, 'it asks')
  assert.match(src, /cursor: page\.cursor/, 'and it pages')
  // The search field exists only because the host wired a way to answer it.
  assert.match(src, /\{findOrgs \? \(/, 'no field without a server behind it')
  const types = read('types.ts')
  assert.match(types, /reach\?: boolean/, 'the page says whether it reached')
})

test('privilege is the server answer, never a client role check', () => {
  for (const [file, src] of sources) {
    assert.doesNotMatch(
      stripped(src),
      /isAdmin|isSuperAdmin|owner === ['"]admin['"]|role === ['"](admin|superadmin)/i,
      `${file}: the chrome must not compute a privilege`
    )
  }
  const src = read('UserOrgDropdown.tsx')
  // The reach section is gated on the server's flag AND a handler for it.
  assert.match(src, /page\?\.reach && onMasquerade/, 'reach is the API answer')
})

test('a running masquerade is unmistakable, and has a way out', () => {
  const src = read('Masquerade.tsx')
  assert.match(src, /background: ACCENT/, 'the loudest fill in the chrome')
  assert.match(src, /Acting as \{org\.name\}/, 'it names the org')
  assert.match(src, /aria-label=\{`Stop acting as \$\{org\.name\}`\}/, 'and it exits')
  // Mounting the switcher is what puts the sign in the bar — never a copy.
  const switcher = read('UserOrgDropdown.tsx')
  assert.match(switcher, /<Masquerade org=\{masquerade\}/, 'the switcher carries it')
})

test('one switcher — nothing else lists organizations', () => {
  const listers = sources.filter(
    ([f, src]) =>
      f !== 'UserOrgDropdown.tsx' && /organizations\.map\(|orgs\.map\(/.test(src)
  )
  assert.deepEqual(
    listers.map(([f]) => f),
    [],
    'only one component renders orgs'
  )
})

test('one chat, two docks — the corner is a parameter, not a second UI', () => {
  // One module defines what a chat turn IS; everything else reuses it.
  const chats = sources.filter(([, src]) => /role: 'user' \| 'assistant'/.test(src))
  assert.deepEqual(
    chats.map(([f]) => f),
    ['AskHanzo.tsx'],
    'exactly one chat implementation in the package'
  )
  const src = read('AskHanzo.tsx')
  assert.match(src, /corner\?: boolean/, 'the dock is a prop')
  assert.match(src, /const LAUNCHER = TAP_H/, 'the launcher is the thumb, no bigger')
  assert.match(src, /const EDGE = 16/, 'and it rides the page gutter')
  assert.match(src, /model = 'enso-free'/, 'the house FREE tier answers by default')
})

test('the chat carries no key, and refuses to pretend it can answer', () => {
  // A `pk-` cannot do completions and an `sk-` is spendable, so shared chrome
  // that ships to every page carries neither. Not a hardcoded one, not a
  // default, not an example.
  for (const [file, src] of sources) {
    assert.doesNotMatch(stripped(src), /['"](pk|sk)-[A-Za-z0-9]{6,}/, `${file}: a key`)
  }
  const src = read('AskHanzo.tsx')
  // With no way to answer a turn, the composer is not rendered at all — the
  // visitor gets the one sign-in action instead of a box that would be refused.
  assert.match(src, /const canChat = !!\(onSubmit \|\| authToken\)/, 'it knows')
  assert.match(src, /\{canChat \? \(/, 'the composer is gated on it')
  assert.match(src, /\{canChat \? null : \(/, 'and the invitation takes its place')
  assert.match(src, /auth\?\.signInHref \?\? U\.id/, 'one provider, the same one')
})

test('every palette ends the same way — a question is never a dead end', () => {
  // One ⌘K across the estate means one BEHAVIOUR across the estate, and the
  // load-bearing half of that is what happens when the list cannot answer.
  // The rule lived only in the public header's palette, so the signed-in apps'
  // palette — mounted in the products where a person is actually working — was
  // the one place an unmatched query really was a dead end.
  const frame = read('commandPalette.tsx')
  assert.match(frame, /export const askLabel =/, 'the frame owns the label')
  assert.match(frame, /export function useAsk\(/, 'and the act')

  for (const file of ['HanzoCommandPalette.tsx', 'OrgCommandPalette.tsx']) {
    const src = read(file)
    assert.match(src, /askLabel\(question\)/, `${file}: the row says what the frame says`)
    assert.match(src, /useAsk\(\{ askHref, onAsk, onNavigate, close \}\)/, `${file}: one act`)
    // Neither may keep its own copy of the destination or the encoding: two
    // spellings of `?q=` is how the same question reaches two different places.
    assert.doesNotMatch(
      stripped(src),
      /encodeURIComponent\(question\)/,
      `${file}: restates the ask URL the frame already builds`
    )
    assert.match(src, /askHref = U\.chat/, `${file}: the same default destination`)
  }
})

test('the two palettes share the frame, and neither redraws it', () => {
  // They differ in what fills the list and in nothing else. A palette that
  // grew its own scrim, field or row would be a second product wearing ⌘K.
  for (const file of ['HanzoCommandPalette.tsx', 'OrgCommandPalette.tsx']) {
    const src = stripped(read(file))
    assert.match(src, /from '\.\/commandPalette'/, `${file}: renders the shared frame`)
    for (const own of ['PaletteShell', 'PaletteField', 'PaletteRow', 'usePaletteNav']) {
      assert.doesNotMatch(
        src,
        new RegExp(`(function|const)\\s+${own}\\b`),
        `${file}: declares its own ${own}`
      )
    }
    assert.match(src, /useCommandKey\(/, `${file}: binds the one chord`)
  }
})
