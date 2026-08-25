/**
 * The layout claims, checked in a real browser.
 *
 * jsdom is not usable for this. Measured on jsdom 28.1.0 under vitest 4: three
 * IDENTICAL `<View display="grid" />` boxes in one document read `grid`, `flex`,
 * `flex` — `getComputedStyle` resolves the cascade for the FIRST element queried
 * and hands every later element the base `.is_View { display: flex }` instead.
 * Re-reading the first still gives `grid`, and neither a DOM mutation, a
 * classList touch, a fresh sheet, a clone nor a re-parent clears it. So a jsdom
 * suite that reads more than one computed style is reporting the base rule from
 * the second assertion on, and it does so silently.
 *
 * Chromium resolves it correctly, so this boots the same vite pipeline the
 * vitest suites use, mounts `probe.tsx`, and reads every claim in one page.
 *
 *   bun run test:browser
 */
import { chromium } from 'playwright'
import { createServer } from 'vite'
import config from '../../../vite-plugin-internal/src/vite.config'

const fail: string[] = []
const eq = (name: string, got: unknown, want: unknown) => {
  if (got === want) return
  fail.push(`${name}\n    want ${JSON.stringify(want)}\n    got  ${JSON.stringify(got)}`)
}
const ne = (name: string, got: unknown, bad: unknown) => {
  if (got !== bad) return
  fail.push(`${name}\n    must NOT be ${JSON.stringify(bad)}`)
}

const server = await createServer({
  ...(config as any),
  configFile: false,
  root: new URL('.', import.meta.url).pathname,
  server: { port: 0 },
  test: undefined,
  resolve: {
    ...(config as any).resolve,
    // Some workspace packages publish only `main: dist/index.cjs` and no
    // `exports`, so a browser dev server picks the CJS build and the ESM import
    // fails on a missing named export. `source` is the field every package here
    // carries, and it is the one that resolves to the code under edit.
    mainFields: ['source', 'module', 'browser', 'main'],
  },
})
await server.listen()
const url = server.resolvedUrls!.local[0]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
page.on('console', (m) => m.type() === 'error' && console.error('[page]', m.text()))
page.on('pageerror', (e) => console.error('[page]', e.message))
await page.goto(url)
// `attached`, not `visible` — an empty layout box is 0px tall and correct.
await page.waitForSelector('[data-probe="grid-view"]', { state: 'attached' })

const read = await page.evaluate(() => {
  const out: Record<string, Record<string, string>> = {}
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-probe]'))) {
    const s = getComputedStyle(el)
    out[el.dataset.probe!] = {
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute('role') ?? '',
      display: s.display,
      flexDirection: s.flexDirection,
      position: s.position,
      gridTemplateColumns: s.gridTemplateColumns,
      gridTemplateRows: s.gridTemplateRows,
      gridColumn: s.gridColumn,
      gridRow: s.gridRow,
      gap: s.gap,
      width: s.width,
      minWidth: s.minWidth,
      paddingTop: s.paddingTop,
      borderBottomWidth: s.borderBottomWidth,
      borderRightWidth: s.borderRightWidth,
      borderBottomColor: s.borderBottomColor,
      borderRightColor: s.borderRightColor,
      // Every prop gui failed to recognise arrives here instead, lowercased.
      leaked: Array.from(el.attributes)
        .map((a) => a.name)
        .filter((n) => /^(grid|columns|rows|col|min|max|vertical|orientation|display)/.test(n))
        .join(','),
    }
  }
  // The reflow answers: how many distinct x positions does a row of cells take.
  const columns = (name: string) =>
    new Set(
      Array.from(
        document.querySelectorAll<HTMLElement>(`[data-probe-cell="${name}"]`)
      ).map((e) => Math.round(e.getBoundingClientRect().left))
    ).size
  out['#columns'] = { narrow: String(columns('narrow')), wide: String(columns('wide')) }
  out['#document'] = {
    scrollWidth: String(document.documentElement.scrollWidth),
    clientWidth: String(document.documentElement.clientWidth),
  }
  return out
})

await browser.close()
await server.close()

const g = (k: string) => read[k] ?? {}

// --- the flex controls. Nothing here may move them. ---
eq('YStack is a flex column', `${g('ystack').display}/${g('ystack').flexDirection}`, 'flex/column')
eq('XStack is a flex row', `${g('xstack').display}/${g('xstack').flexDirection}`, 'flex/row')
eq('ZStack is a relative flex column', `${g('zstack').display}/${g('zstack').position}`, 'flex/relative')

// --- display: grid is a PARAMETER of a box, not a component ---
eq('a View asked for grid is a grid', g('grid-view').display, 'grid')
eq('...and takes a column track list', g('grid-view').gridTemplateColumns.split(' ').length, 3)
eq('...and a row track list', g('grid-view').gridTemplateRows.split(' ').length, 2)
ne('...and still takes a token gap', g('grid-view').gap, '')
eq('an XStack asked for grid runs across', g('grid-xstack').gridTemplateColumns.split(' ').length, 4)
eq('...and is a grid, not a row', g('grid-xstack').display, 'grid')

// The case jsdom read as `flex`: a caller style prop beside display.
eq('grid survives caller props', g('grid-with-props').display, 'grid')
eq('...and takes the caller width', g('grid-with-props').width, '300px')
ne('...and the caller padding', g('grid-with-props').paddingTop, '0px')

eq('a child spans', g('cell-span').gridColumn, 'span 2')
eq('a child places across', g('cell-place').gridColumn, '2 / -1')
eq('a child places down', g('cell-place').gridRow, 'span 3')
eq('a plain child needs no wrapper', g('grid-plain-child').display, 'flex')

// The floor that keeps one long word from widening its own track.
eq('a placed child is floored at 0', g('cell-span').minWidth, '0px')
eq('a plain child is floored at 0', g('grid-plain-child').minWidth, '0px')

// Nothing leaked to the DOM as an attribute. This is the whole hazard: gui
// drops a prop it does not recognise, so a green build proves nothing.
for (const k of ['grid-view', 'grid-xstack', 'grid-with-props', 'cell-span', 'cell-place'])
  eq(`${k} leaks no attribute`, g(k).leaked, '')

// --- the reflow, which is what a track list buys over a breakpoint ---
eq('a 160/4 fit is 2-up at 390', g('#columns').narrow, '2')
eq('a 160/4 fit is 4-up at 1280', g('#columns').wide, '4')
eq(
  'a 900px floor inside a 390px box does not scroll the page sideways',
  Number(g('#document').scrollWidth) <= Number(g('#document').clientWidth),
  true
)

// --- Separator ---
eq('a separator is a 1px bottom rule', g('sep').borderBottomWidth, '1px')
eq('...and nothing on the side', g('sep').borderRightWidth, '0px')
eq('a vertical separator is a 1px side rule', g('sep-v').borderRightWidth, '1px')
eq('...and nothing on the bottom', g('sep-v').borderBottomWidth, '0px')
eq('a separator leaks no attribute', g('sep').leaked, '')
eq('a vertical separator leaks no attribute', g('sep-v').leaked, '')

// The token, read as a colour so it cannot be satisfied by a lookalike literal.
eq(
  'a separator takes the BORDER token',
  g('sep').borderBottomColor,
  g('token-border').borderBottomColor
)
ne(
  '...and not the focused-background token it used to take',
  g('sep').borderBottomColor,
  g('token-border').borderRightColor
)
eq(
  'a vertical separator takes the same token',
  g('sep-v').borderRightColor,
  g('token-border').borderBottomColor
)

// --- Section is the semantic element, and owns no spacing ---
eq('Section renders <section>', g('section').tag, 'section')
eq('Section is a region', g('section').role, 'region')
eq('Section owns no padding', g('section').paddingTop, '0px')

console.log(JSON.stringify(read, null, 2))
if (fail.length) {
  console.error(`\n${fail.length} FAILED\n\n  ${fail.join('\n\n  ')}\n`)
  process.exit(1)
}
console.log(`\nPASS — ${Object.keys(read).length - 2} probes, 0 failures`)
