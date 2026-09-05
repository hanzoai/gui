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

test('both bars — 60 tall, the plane recipe, no hairline; the public bar flush over the hero', () => {
  for (const file of ['HanzoHeader.tsx', 'OrgHeader.tsx']) {
    const src = read(file)
    assert.match(src, /const HEADER_H = 60/, `${file}: the bar is 60 tall`)
    // Both wear the plane's recipe (BAR), and NEITHER draws a hairline — flush
    // means seamless, the audited rule (a line over the boundary reads as a seam).
    assert.match(src, /\bBAR\b/, `${file}: the bar's ground IS the plane recipe (BAR)`)
    assert.match(
      src,
      /borderBottom: '1px solid transparent'/,
      `${file}: the audited bar draws no hairline`
    )
  }
  // OrgHeader sits over dashboard content, not a hero, so it is the plane at
  // every scroll position — grounded always.
  assert.match(
    read('OrgHeader.tsx'),
    /\.\.\.BAR,/,
    'OrgHeader is the plane at every scroll'
  )
  // The PUBLIC header is flush over the hero at rest and eases the plane in on
  // scroll (or while a drape is open). The ground is conditional on `grounded`;
  // still never a hairline.
  const pub = read('HanzoHeader.tsx')
  assert.match(
    pub,
    /grounded \? BAR : \{ background: 'transparent' \}/,
    'HanzoHeader is flush at rest, the plane in motion'
  )
  assert.match(
    pub,
    /const grounded = scrolled \|\| menu\.key != null \|\| mobileOpen/,
    'grounded = scrolled, or a drape / mobile sheet open'
  )
  // And the recipe it spreads is the one the menus wear, which is the whole
  // point of naming it: a bar and the plane hanging off it are ONE material, so
  // there is no boundary between them to see.
  const theme = read('theme.ts')
  for (const name of ['BAR', 'DRAPE']) {
    assert.match(
      theme,
      new RegExp(`export const ${name}[^}]*background: CHROME\\.panel`),
      `${name} stands on the panel ground`
    )
  }
})

test('glass is what a compact control wears, and the recipe is the audited one', () => {
  const theme = read('theme.ts')
  assert.match(theme, /bg: 'rgba\(9,9,11,0\.72\)'/, 'the ground is the audited one')
  assert.match(theme, /blur\(20px\) saturate\(1\.8\)/, 'the lens is the audited one')
  // A full-width plane never wears it: at that size the blur is a picture
  // competing with the words on top of it. Only small rounded things do.
  for (const [file, src] of sources) {
    if (!/\.\.\.GLASS,/.test(src)) continue
    assert.match(
      src,
      /borderRadius: R\./,
      `${file}: spreads GLASS, so it must be a rounded control`
    )
  }
})

test('the brand trigger is named, not an invitation — nothing says "Meet Hanzo"', () => {
  const src = read('HanzoHeader.tsx')
  // The SURFACE's name, not the literal. A hard-coded "Hanzo" here is the same
  // white-label defect the phone sheet carried — a Lux or Zoo bar saying Hanzo —
  // so the brand is read from the surface and this asserts that it is.
  assert.match(src, /label=\{s\.brandName\}/, 'the trigger is named by its surface')
  assert.doesNotMatch(stripped(src), /label="Hanzo"/, 'and never by a literal')
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
  // The pill stays a pill — the SAME token builds it, so "current" cannot
  // drift into a different-looking control. It may be composed onto (the sheet
  // aligns its label left), but `cta()` has to be what it is composed FROM:
  // a current control that stopped spreading it would be a second pill.
  assert.match(
    src,
    /aria-current="page" style=\{\{?\s*\.{0,3}\s*cta\(filled, height\)/,
    'the current control is still built from cta()'
  )
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
    assert.match(
      src,
      /useAsk\(\{ askHref, onAsk, onNavigate, close \}\)/,
      `${file}: one act`
    )
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
    assert.match(
      src,
      /from '\.\/commandPalette\.tsx'/,
      `${file}: renders the shared frame`
    )
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

test('the chrome owns no colour of its own — every value is a design rung', () => {
  // This bar mounts on every Hanzo property, so a colour typed here is a colour
  // the estate has in two places. That is not hypothetical: the resting
  // hairline sat at .06 while @hanzo/design published .10, so the shared bar
  // and the page under it drew different hairlines for as long as nobody
  // compared them.
  //
  // Every value reads `var(--white-NN, <same value>)` now. The fallback is what
  // ships when a host loads no stylesheet — this package depends on design on
  // purpose-not-at-all — so the rung and the fallback must AGREE, and the test
  // reads both halves rather than trusting the name.
  const src = read('theme.ts')
  const bare = [
    ...stripped(src).matchAll(/rgba?\(\s*255\s*,\s*255\s*,\s*255[^)]*\)/g),
  ].filter((m) => !src.slice(Math.max(0, m.index - 60), m.index).includes('var(--white-'))
  assert.deepEqual(
    bare.map((m) => m[0]),
    [],
    'white values not on the ladder'
  )

  for (const m of stripped(src).matchAll(
    /var\(--white-(\d+),\s*rgb\(255 255 255 \/ \.(\d+)\)\)/g
  )) {
    assert.equal(m[1], m[2], `--white-${m[1]} falls back to .${m[2]}`)
  }
})

test('the products menu has ONE name, on the phone as on the desktop', () => {
  // The bar honoured `productsLabel` and the sheet hard-coded 'Products', so a
  // surface that renamed the taxonomy — hanzo.app opens it as Platform — said
  // one word on the desktop and another on the phone, for the same menu.
  const src = read('HanzoHeader.tsx')
  const sheet = src.slice(src.indexOf('function MobileSheet('))
  assert.match(sheet, /label: productsLabel/, 'the sheet takes the name it is given')
  assert.doesNotMatch(
    stripped(sheet),
    /label: 'Products'/,
    'and never states one of its own'
  )
  // One default, declared once, where the prop is.
  assert.match(src, /productsLabel = 'Products'/, 'the default lives at the prop')
})

test('the public menu explains; the launcher opens', () => {
  // Two audiences read the same taxonomy. Someone who has not signed in wants
  // to know what a product IS — and measured anonymously, the hosts cannot
  // tell them: studio.hanzo.ai and console.hanzo.ai answer with a bare
  // "Login or Signup" that never names the product, and hanzo.chat's whole
  // page is 260 characters that never say what it does. hanzo.ai publishes a
  // page for every one of them, and nothing linked to any of it.
  const reg = read('hanzo-registry.ts')

  // ONE field carries the difference, on the product, not a second list.
  assert.match(reg, /page\?: string/, 'a product may name the page that explains it')
  // Derived ONCE. It was applied at one call site and there were three
  // consumers, so the Meet menu and the footer went on sending anonymous
  // readers to the app hosts while the Try menu did the right thing.
  assert.match(
    reg,
    /HANZO_FLAGSHIP_PUBLIC[\s\S]{0,200}href: p\.page \?\? p\.href/,
    'derived once'
  )
  assert.doesNotMatch(
    stripped(reg).replace(/HANZO_FLAGSHIP_PUBLIC/g, ''),
    /items: HANZO_FLAGSHIP\b|\.\.\.HANZO_FLAGSHIP\.map/,
    'no public menu reads the raw flagship list'
  )

  // Every flagship has one, and it is a hanzo.ai page — never the app host
  // again under a second name.
  const flagships = ['chat', 'app', 'team', 'studio', 'bot', 'cloud', 'base']
  for (const id of flagships) {
    const at = reg.indexOf(`    id: '${id}',`)
    assert.ok(at > 0, `${id} is in the registry`)
    const block = reg.slice(at, at + 400)
    assert.match(
      block,
      new RegExp(`page: \`\\$\\{U\\.ai\\}/${id}\``),
      `${id} names its page`
    )
  }

  // The launcher is the OTHER audience and must keep the hosts: someone
  // clicking a nine-tile app grid is asking to open the app, not read about it.
  const apps = read('hanzo-apps.tsx')
  assert.match(apps, /href: U\.studio,/, 'the launcher opens Studio')
  assert.match(apps, /href: U\.console,/, 'the launcher opens the console')
  assert.doesNotMatch(
    stripped(apps),
    /U\.ai\}\//,
    'the launcher never opens a marketing page'
  )
})

test('away is a relation to the surface, not the shape of the string', () => {
  const src = read('HanzoHeader.tsx')
  // A link to this surface's OWN pages stays in the tab. Testing only for a
  // scheme made every absolute href external, so `https://hanzo.app/new` on
  // hanzo.app opened a second tab and wore an outbound arrow.
  assert.match(
    src,
    /export const outward = \(href: string, host: string\)/,
    'outward takes the surface'
  )
  assert.match(src, /new URL\(href\)\.host !== host/, 'and compares hosts')
  // Nothing may ask the question without saying which surface is asking.
  for (const call of src.match(/outward\([^)]*\)/g) ?? []) {
    if (call.startsWith('outward(href:')) continue // the definition
    assert.match(call, /,\s*\S/, `outward called with no surface: ${call}`)
  }
  // Every pill that can open away is drawn for a surface, so every one is told
  // which. A CTA without it cannot answer the question at all.
  // `<CTA ` only — <CTATrigger> opens a menu and never leaves the page.
  const ctas = src.match(/<CTA\s[\s\S]*?\/>/g) ?? []
  assert.ok(ctas.length >= 4, `expected 4+ CTA call sites, got ${ctas.length}`)
  for (const cta of ctas) {
    assert.match(cta, /host=\{/, `a CTA is drawn without its surface:\n${cta}`)
  }
})
