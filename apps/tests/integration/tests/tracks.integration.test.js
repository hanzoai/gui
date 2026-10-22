import { execSync, spawn } from 'node:child_process'
import { expect, test } from '@playwright/test'
import waitPort from 'wait-port'

/**
 * `tracks` and `Wrap` laid out by a real browser (src/Tracks.tsx). jsdom has
 * no layout engine, so the unit suite can prove which declarations gui wrote
 * and only this can prove the boxes they produce. Run against the dev server
 * and against the production build, which goes through the compiler.
 */

const devPort = 5010
const prodPort = 5011

test.describe.configure({ timeout: 180_000 })

function spawnServer(command, args) {
  const proc = spawn(command, args, { cwd: process.cwd(), stdio: 'pipe', detached: true })
  // drained, or a full pipe stalls the server before it listens
  proc.stdout.on('data', () => {})
  proc.stderr.on('data', (d) => console.log(d.toString()))
  return proc
}

function killServer(proc) {
  try {
    process.kill(-proc.pid, 'SIGTERM')
  } catch {
    // already exited
  }
}

/** Every box the fixture names, relative to its stack's top-left corner. */
async function boxes(page, port) {
  await page.goto(`http://localhost:${port}/?tracks`, { waitUntil: 'load' })
  await expect(page.getByTestId('w2')).toBeVisible({ timeout: 30_000 })
  return page.evaluate(() => {
    const rect = (id) =>
      document.querySelector(`[data-testid="${id}"]`).getBoundingClientRect()
    const within = (parent, id) => {
      const p = rect(parent)
      const r = rect(id)
      return { x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height }
    }
    const out = {}
    for (const [parent, ids] of [
      ['y', ['y0', 'y1', 'y2']],
      ['y1', ['g0']],
      ['ya', ['ya0', 'ya1']],
      ['x', ['x0', 'x1']],
      ['f', ['f0']],
      ['w', ['w0', 'w1', 'w2']],
    ]) {
      for (const id of ids) out[id] = within(parent, id)
    }
    const display = (id) =>
      getComputedStyle(document.querySelector(`[data-testid="${id}"]`)).display
    out.display = { y: display('y'), x: display('x'), f: display('f'), w: display('w') }
    out.tracks = document.querySelector('[data-testid="y"]').getAttribute('tracks')
    return out
  })
}

function expectLayout(b) {
  // rows 40 / 1fr / 30 down 300px, each child stretched across 200px
  expect(b.y0).toEqual({ x: 0, y: 0, w: 200, h: 40 })
  expect(b.y1).toEqual({ x: 0, y: 40, w: 200, h: 230 })
  expect(b.y2).toEqual({ x: 0, y: 270, w: 200, h: 30 })

  // a grandchild is a flex item again: flex-end is the right edge of y1
  expect(b.g0).toMatchObject({ x: 180, w: 20 })

  // alignItems centers across, alignSelf: flex-end goes to the right edge
  expect(b.ya0).toMatchObject({ x: 75, y: 0, w: 50 })
  expect(b.ya1).toMatchObject({ x: 150, y: 10, w: 50 })

  // columns 60 / 1fr across 300px; alignItems centers the 20px child down 100px
  expect(b.x0).toMatchObject({ x: 0, w: 60 })
  expect(b.x1).toEqual({ x: 60, y: 40, w: 240, h: 20 })

  // the flex stack is still a flex stack
  expect(b.f0).toMatchObject({ x: 75, w: 50 })

  // 40 + 10 + 40 fit in 100; the third wraps to the next line
  expect(b.w0).toMatchObject({ x: 0, y: 0 })
  expect(b.w1).toMatchObject({ x: 50, y: 0 })
  expect(b.w2).toMatchObject({ x: 0, y: 50 })

  expect(b.display).toEqual({ y: 'grid', x: 'grid', f: 'flex', w: 'flex' })
  expect(b.tracks).toBeNull()
}

test('tracks and Wrap lay out in dev mode', async ({ page }) => {
  const server = spawnServer('bun', ['run', 'dev', '--port', String(devPort)])
  try {
    await waitPort({ port: devPort, host: 'localhost' })
    expectLayout(await boxes(page, devPort))
  } finally {
    killServer(server)
  }
})

test('tracks and Wrap lay out in the production build', async ({ page }) => {
  execSync('bun run build:prod', { stdio: 'pipe' })
  const server = spawnServer('bun', ['run', 'preview', '--port', String(prodPort)])
  try {
    await waitPort({ port: prodPort, host: 'localhost' })
    expectLayout(await boxes(page, prodPort))
  } finally {
    killServer(server)
  }
})
