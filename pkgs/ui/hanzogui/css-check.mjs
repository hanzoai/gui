#!/usr/bin/env node
/**
 * gui-css-check — every class in the markup must have a rule in the CSS that
 * ships with it.
 *
 * A build is green when the code compiles. Nothing in a compiler knows whether
 * the stylesheet a document links actually contains the classes that document
 * uses, so "classes without rules" ships silently and renders a blank-looking
 * page. It has happened three times here: hanzo.app served 18KB of CSS holding
 * zero of its ~240 gui atomic classes; @hanzogui/shell@8.0.3 published 966
 * lines of Tailwind classes with no Tailwind anywhere in its dependencies.
 * Both type-checked. Both built. Both were completely unstyled in production.
 *
 * This reads the built output and compares two sets:
 *   used    — class tokens in class="..." attributes of the rendered markup
 *   defined — class tokens in selector position across every sheet the page
 *             delivers: linked .css files AND inline <style>
 * Anything used and not defined is a miss and the process exits 1.
 *
 * Per page, not per build: a rule that exists in some sheet the page never
 * links is not delivered, and the browser agrees.
 *
 * Zero dependencies, one file. It has to run in any app without dragging a
 * toolchain behind it, and it has to keep working when the toolchain is the
 * thing that broke.
 */
import {
  readFileSync,
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  writeFileSync,
} from 'node:fs'
import { join, resolve, relative, basename, sep } from 'node:path'
import { tmpdir } from 'node:os'

// ---------------------------------------------------------------- extraction

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, ' ')

/** Strings and url() can hold braces and dots; neither is ever a selector. */
const stripLiterals = (css) =>
  css
    .replace(/"(?:[^"\\]|\\[\s\S])*"/g, '""')
    .replace(/'(?:[^'\\]|\\[\s\S])*'/g, "''")
    .replace(/url\([^)]*\)/g, 'url()')

/** `\3a ` and `\:` both mean a literal `:` in a class name. */
const unescapeIdent = (s) =>
  s.replace(/\\([0-9a-fA-F]{1,6})[ \t]?|\\([\s\S])/g, (_, hex, ch) =>
    hex ? String.fromCodePoint(parseInt(hex, 16)) : ch
  )

/**
 * A class token. The hex-escape branch comes first and swallows its own
 * terminating space (`.a\3a b` is the single class `a:b`) — without that the
 * token would stop at the space and lose everything after it.
 */
const CLASS_IN_SELECTOR =
  /\.((?:\\[0-9a-fA-F]{1,6}[ \t]?|\\[\s\S]|[^\s.,:;>+~()[\]{}#*%"'\\!])+)/g

/**
 * Class tokens in selector position. Walks the sheet tracking brace depth and
 * collects only the text that PRECEDES a `{` — a declaration body never does,
 * so `padding:.5rem` can't masquerade as a class, while rules nested inside
 * `@media`/`@supports`/`@layer` still get read.
 */
export function definedClasses(css) {
  const src = stripLiterals(stripComments(css))
  const out = new Set()
  let prelude = ''
  let depth = 0
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (c === '{') {
      const sel = prelude.trim()
      // at-rule preludes hold media queries and numbers, never class selectors
      if (sel && !sel.startsWith('@')) {
        for (const m of sel.matchAll(CLASS_IN_SELECTOR)) out.add(unescapeIdent(m[1]))
      }
      prelude = ''
      depth++
    } else if (c === '}') {
      prelude = ''
      depth = Math.max(0, depth - 1)
    } else if (c === ';' && depth > 0) {
      prelude = ''
    } else {
      prelude += c
    }
  }
  return out
}

/** Scripts carry the RSC flight payload, which quotes markup; never markup. */
const stripNonMarkup = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" }

export function usedClasses(html) {
  const out = new Set()
  const markup = stripNonMarkup(html)
  for (const m of markup.matchAll(/\bclass(?:Name)?\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/gi)) {
    const raw = (m[2] ?? m[3] ?? m[4] ?? '').replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e)
    for (const cls of raw.split(/\s+/)) if (cls) out.add(cls)
  }
  return out
}

export function inlineStyles(html) {
  return [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1])
}

export function stylesheetHrefs(html) {
  const out = []
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0]
    if (!/\brel\s*=\s*["']?[^"'>]*\bstylesheet\b/i.test(tag)) continue
    const href = tag.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/i)
    if (href) out.push((href[2] ?? href[3] ?? href[4]).replace(/&amp;/g, '&').split('?')[0])
  }
  return out
}

// ------------------------------------------------------------------ scanning

const SKIP_DIR = new Set(['node_modules', '.git', 'cache', 'sourcemaps'])

function walk(dir, hit, depth = 0) {
  if (depth > 12) return
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    if (e.name.startsWith('.') && depth > 0) continue
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      if (!SKIP_DIR.has(e.name)) walk(p, hit, depth + 1)
    } else if (e.isFile()) {
      hit(p)
    }
  }
}

/** Built output as a browser sees it: pages, and every sheet on disk. */
export function collect(roots) {
  const pages = []
  const sheets = new Map() // absolute path -> css text
  for (const root of roots) {
    const st = statSync(root)
    const add = (p) => {
      if (/\.html?$/i.test(p)) pages.push(p)
      else if (/\.css$/i.test(p) && !/\.map$/.test(p)) sheets.set(resolve(p), readFileSync(p, 'utf8'))
    }
    if (st.isDirectory()) walk(root, add)
    else add(root)
  }
  return { pages, sheets }
}

/**
 * `/_next/static/css/x.css` has to become a path on disk. Basename is the one
 * key both sides agree on across Next, Vite and a plain static dir, and every
 * bundler content-hashes the name, so it is unique in practice.
 */
function indexByBase(sheets) {
  const byBase = new Map()
  for (const [p, css] of sheets) {
    const b = basename(p)
    if (!byBase.has(b)) byBase.set(b, { path: p, css })
  }
  return byBase
}

// -------------------------------------------------------------------- render

/**
 * A client-rendered app ships an empty shell, so reading its HTML off disk
 * measures nothing. Rendering it is the only honest way to ask the question,
 * and the browser is also the only thing that knows the full sheet list once
 * a runtime has injected into it.
 *
 * Playwright is imported lazily and is not a dependency of this package: an
 * SSR app never needs it, and the apps that do need it already have it.
 */
export async function render(urls, { dir }) {
  let chromium
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    throw new Error(
      `--render needs playwright, which is not installed here.\n` +
        `  npm i -D playwright && npx playwright install chromium\n` +
        `  Or point gui-css-check at pre-rendered HTML instead.`
    )
  }
  mkdirSync(dir, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const out = []
  try {
    for (const [i, url] of urls.entries()) {
      const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
      if (!res || !res.ok()) throw new Error(`${url} returned ${res ? res.status() : 'nothing'}`)
      // Every rule the document actually has, including anything a runtime
      // injected after load — inlined into one <style> so the on-disk shape is
      // identical to an SSR page and one code path reads both.
      const css = await page.evaluate(() =>
        [...document.styleSheets]
          .flatMap((s) => {
            try {
              return [...s.cssRules].map((r) => r.cssText)
            } catch {
              return [] // cross-origin sheet, unreadable by design
            }
          })
          .join('\n')
      )
      const html = await page.evaluate(() => document.documentElement.outerHTML)
      const name = `${String(i).padStart(3, '0')}-${url.replace(/[^\w.-]+/g, '_').slice(-60)}.html`
      const file = join(dir, name)
      writeFileSync(file, `<style>${css}</style>${html}`)
      out.push(file)
    }
  } finally {
    await browser.close()
  }
  return out
}

// -------------------------------------------------------------------- config

/**
 * Classes a library provably stamps as an IDENTITY MARKER and never styles.
 * Each line cites where it is emitted — an allowance without a source is a
 * guess, and a guess here is how a real miss gets waved through.
 */
const DEFAULT_ALLOW = [
  // gui, getSplitStyles.tsx: `is_${componentNameFinal}` on every styled
  // component so devtools and tests can name it. Carries no rule by design.
  'is_*',
  // gui, Theme.tsx: marks a nested (non-root) Theme. The styling comes from
  // the t_* theme class beside it, which does have rules.
  't_sub_theme',
  // lucide-react, Icon.js: `mergeClasses("lucide", className)` and
  // createLucideIcon.js: `lucide-${name}` — hooks for consumers to target.
  'lucide',
  'lucide-*',
  // next/font mints these to carry a font-family custom property. The rule is
  // emitted by next/font's own pipeline, not by anything in this repo.
  '__variable_*',
  '__className_*',
]

const globToRe = (g) =>
  new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$')

export function loadConfig(cwd) {
  for (const name of ['gui-css-check.json', '.gui-css-check.json']) {
    const p = join(cwd, name)
    if (existsSync(p)) return { ...JSON.parse(readFileSync(p, 'utf8')), _from: p }
  }
  const pkgPath = join(cwd, 'package.json')
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    if (pkg['gui-css-check']) return { ...pkg['gui-css-check'], _from: pkgPath }
  }
  return {}
}

// --------------------------------------------------------------------- check

/**
 * @returns {{pages: Array, used: Set, missing: Map, sheets: Map, bytes: object}}
 */
export function check({ roots, allow = [], extraCss = [] }) {
  const { pages, sheets } = collect(roots)
  const byBase = indexByBase(sheets)
  const allowRe = [...DEFAULT_ALLOW, ...allow].map(globToRe)
  const allowed = (c) => allowRe.some((re) => re.test(c))

  const shared = new Set()
  for (const p of extraCss) for (const c of definedClasses(readFileSync(p, 'utf8'))) shared.add(c)

  // Sheets are parsed once and reused; a page just unions the ones it links.
  const parsed = new Map()
  const classesOf = (path, css) => {
    if (!parsed.has(path)) parsed.set(path, definedClasses(css))
    return parsed.get(path)
  }

  const results = []
  const allUsed = new Set()
  const missing = new Map() // class -> [page, ...]
  const linkedOnce = new Map() // path -> bytes, counted once however many pages link it
  let inlineBytes = 0

  for (const page of pages) {
    const html = readFileSync(page, 'utf8')
    const used = usedClasses(html)
    const defined = new Set(shared)

    for (const css of inlineStyles(html)) {
      inlineBytes += Buffer.byteLength(css)
      for (const c of definedClasses(css)) defined.add(c)
    }

    const unresolved = []
    const linked = []
    for (const href of stylesheetHrefs(html)) {
      if (/^(https?:)?\/\//i.test(href)) continue // remote sheet, not ours to verify
      const hit = byBase.get(basename(href))
      if (!hit) {
        unresolved.push(href)
        continue
      }
      linked.push(hit.path)
      linkedOnce.set(hit.path, Buffer.byteLength(hit.css))
      for (const c of classesOf(hit.path, hit.css)) defined.add(c)
    }

    const miss = []
    for (const c of used) {
      allUsed.add(c)
      if (defined.has(c) || allowed(c)) continue
      miss.push(c)
      if (!missing.has(c)) missing.set(c, [])
      missing.get(c).push(page)
    }
    results.push({ page, used: used.size, missing: miss.sort(), linked, unresolved })
  }

  // A document with no classes at all proves nothing: it is either an empty
  // shell a client will fill in, or a render that failed. Counting it as a
  // pass is how a checker becomes decoration.
  const empty = results.filter((r) => !r.used)

  return {
    results,
    pages,
    sheets,
    empty,
    used: allUsed,
    missing,
    bytes: {
      // cached once by the browser, however many pages link it
      static: [...linkedOnce.values()].reduce((a, b) => a + b, 0),
      staticFiles: linkedOnce.size,
      // re-sent with every single document and cacheable by nobody — the
      // number a static extractor exists to drive to zero
      inlinePerPage: pages.length ? Math.round(inlineBytes / pages.length) : 0,
      inlineTotal: inlineBytes,
    },
  }
}

// ------------------------------------------------------------------------ cli

const HELP = `gui-css-check — fail the build when the markup uses a class the CSS never defines

  gui-css-check [dir|file ...] [options]

  With no path it looks for .next, dist, out, build, storybook-static in cwd.

  --render <url>   render a running route in a browser and check THAT (repeatable).
                   The only honest measurement for a client-rendered app, whose
                   built HTML is an empty shell. Needs playwright in the app.
  --css <file>     an extra sheet every page gets (repeatable)
  --allow <glob>   a class pattern that needs no rule (repeatable)
  --json           machine-readable result on stdout
  --quiet          only print on failure

  Allowances also load from gui-css-check.json or a "gui-css-check" key in
  package.json:  { "allow": ["swiper-*"] }
`

const DEFAULT_ROOTS = ['.next', 'dist', 'out', 'build', 'storybook-static']

/** Utility-framework shapes: `px-3`, `text-white/40`, `hover:bg-white/[0.06]`. */
const UTILITY =
  /^(-?[a-z][\w-]*:)*-?((p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|w|h|z|gap|text|bg|border|ring|max|min|top|left|right|bottom|inset|col|row|order|basis|space|leading|tracking|font|opacity|shadow|rounded|aspect|overflow|translate|scale|rotate|duration|delay|ease|from|via|to|fill|stroke|divide|placeholder|outline|decoration|indent|justify|items|content|self|place|object|cursor|backdrop|prose|grid|flex)(-[\w./[\]#%()-]+)?|(flex|grid|block|inline|hidden|absolute|relative|fixed|sticky|static|truncate|italic|underline|uppercase|antialiased|container|prose|sr-only|isolate|visible|invisible))$/

/**
 * Misses are grouped by CAUSE, because the fix differs completely and a flat
 * list of 300 class names tells you nothing about which one you have.
 */
const KINDS = [
  {
    test: (c) => c.startsWith('_'),
    title: 'gui atomic classes — the atomic sheet was never authored',
    cause:
      `      Nothing produced these rules. Exactly one of the two paths has to run:\n` +
      `        · GuiProvider injects at runtime — do NOT set disableInjectCSS, or\n` +
      `        · a compiler plugin extracts them at build time —\n` +
      `          @hanzogui/next-plugin withGui() / @hanzogui/vite-plugin gui().\n` +
      `      disableInjectCSS with no plugin configured leaves nobody writing it.`,
  },
  {
    test: (c) => UTILITY.test(c),
    title: 'utility-framework classes — no such framework is installed',
    cause:
      `      These are Tailwind-shaped, and nothing in this build compiles them.\n` +
      `      They have never rendered. Delete them and use gui props instead;\n` +
      `      adding Tailwind back is not the fix.`,
  },
  {
    test: () => true,
    title: 'authored classes with no stylesheet behind them',
    cause:
      `      Someone wrote these class names and no delivered sheet defines them.\n` +
      `      Either ship the stylesheet that styles them or drop the class.`,
  },
]

const num = (n) => n.toLocaleString('en-US')
const kb = (n) => `${num(Math.round(n / 1024))} KB`

async function main(argv) {
  const roots = []
  const extraCss = []
  const allow = []
  const urls = []
  let json = false
  let quiet = false
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') return console.log(HELP), 0
    else if (a === '--json') json = true
    else if (a === '--quiet') quiet = true
    else if (a === '--css') extraCss.push(argv[++i])
    else if (a === '--allow') allow.push(argv[++i])
    else if (a === '--render') urls.push(argv[++i])
    else if (a.startsWith('-')) return console.error(`unknown option ${a}\n${HELP}`), 2
    else roots.push(a)
  }

  const cwd = process.cwd()
  const cfg = loadConfig(cwd)
  const wanted = [...urls, ...(urls.length ? [] : cfg.render ?? [])]

  let found = roots
  if (wanted.length) {
    const dir = mkdtempSync(join(tmpdir(), 'gui-css-check-'))
    try {
      found = await render(wanted, { dir })
    } catch (err) {
      console.error(`gui-css-check: ${err.message}`)
      return 2
    }
  } else if (!found.length) {
    found = DEFAULT_ROOTS.filter((d) => existsSync(join(cwd, d)))
  }

  if (!found.length) {
    console.error(
      `gui-css-check: no built output.\n` +
        `  Looked for ${DEFAULT_ROOTS.join(', ')} in ${cwd}\n` +
        `  Build first, or pass the directory holding the rendered HTML and CSS,\n` +
        `  or --render <url> against a running server.`
    )
    return 2
  }
  for (const r of found)
    if (!existsSync(r)) return console.error(`gui-css-check: no such path: ${r}`), 2

  const res = check({
    roots: found,
    allow: [...(cfg.allow ?? []), ...allow],
    extraCss: [...(cfg.css ?? []), ...extraCss],
  })

  if (!res.pages.length || res.empty.length === res.pages.length) {
    console.error(
      (res.pages.length
        ? `gui-css-check: all ${res.pages.length} document(s) under ${found.join(', ')} use ZERO classes.\n`
        : `gui-css-check: found no rendered HTML under ${found.join(', ')}.\n`) +
        `  Nothing was checked, so nothing is proven — that is a failure, not a pass.\n` +
        `  This is what a client-rendered app looks like on disk: an empty shell the\n` +
        `  browser fills in. Check the real thing instead:\n` +
        `      gui-css-check --render http://localhost:8080/`
    )
    return 2
  }

  const unresolved = res.results.flatMap((r) => r.unresolved.map((h) => [r.page, h]))
  const total = res.used.size
  const missCount = res.missing.size
  const covered = total - missCount
  const pct = total ? (covered / total) * 100 : 100

  if (json) {
    console.log(
      JSON.stringify(
        {
          pages: res.pages.length,
          sheets: res.sheets.size,
          bytes: res.bytes,
          used: total,
          covered,
          coverage: Number(pct.toFixed(2)),
          missing: Object.fromEntries(
            [...res.missing].map(([c, pages]) => [c, pages.map((p) => relative(cwd, p))])
          ),
          unresolved: unresolved.map(([p, h]) => ({ page: relative(cwd, p), href: h })),
        },
        null,
        2
      )
    )
    return missCount || unresolved.length ? 1 : 0
  }

  const ok = !missCount && !unresolved.length
  if (!ok || !quiet) {
    const b = res.bytes
    console.log(
      `gui-css-check  ${num(res.pages.length)} page(s) · ` +
        `${b.staticFiles} cached sheet(s), ${kb(b.static)} · ` +
        `${kb(b.inlinePerPage)} inline per document\n` +
        `               ${num(covered)}/${num(total)} classes covered (${pct.toFixed(1)}%)` +
        // 100% of nothing is still 100%, and that is the shape of a page that
        // failed to render. Say so on the same line as the score.
        (res.empty.length ? `\n               ${num(res.empty.length)} page(s) use no classes at all` : '')
    )
  }

  if (unresolved.length) {
    console.error(`\nFAIL  ${unresolved.length} stylesheet link(s) point at a file that is not there:`)
    for (const [page, href] of unresolved.slice(0, 20))
      console.error(`  ${relative(cwd, page)}  ->  ${href}`)
  }

  if (missCount) {
    console.error(
      `\nFAIL  ${num(missCount)} of ${num(total)} classes in the markup have NO rule in any\n` +
        `      stylesheet these pages deliver. They render with no styling at all.`
    )
    const bins = KINDS.map(() => [])
    for (const c of res.missing.keys()) bins[KINDS.findIndex((k) => k.test(c))].push(c)
    for (const [i, kind] of KINDS.entries()) {
      const classes = bins[i]
      if (!classes.length) continue
      const where = relative(cwd, res.missing.get(classes[0])[0])
      console.error(`\n  ${classes.length}× ${kind.title}`)
      console.error(classes.slice(0, 10).map((c) => `      ${c}`).join('\n'))
      if (classes.length > 10) console.error(`      … ${classes.length - 10} more`)
      console.error(`      first in ${where}\n${kind.cause}`)
    }
    console.error(
      `  A class that really is styled by something this check cannot see belongs\n` +
        `  in gui-css-check.json {"allow": [...]}, with a note saying who styles it.\n`
    )
  }

  return ok ? 0 : 1
}

const invokedDirectly =
  process.argv[1] &&
  (import.meta.url === `file://${process.argv[1]}` ||
    resolve(process.argv[1]).endsWith(`${sep}css-check.mjs`) ||
    basename(process.argv[1]) === 'gui-css-check')

if (invokedDirectly) process.exit(await main(process.argv.slice(2)))
