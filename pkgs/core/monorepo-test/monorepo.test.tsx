import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { expect, test } from 'vitest'

function runBaseline() {
  const start = Date.now()
  new Array(100_000).fill(0).map(() => {
    return JSON.stringify([].concat([]).concat([]).concat([]))
  })
  return Date.now() - start
}

function median(arr: number[]) {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

// warm up, then take median of 5 runs
runBaseline()
const baselines = Array.from({ length: 5 }, runBaseline)
const baseline = median(baselines)

console.info('baselines', baselines.join(', '), '→ median', baseline)

test('performance of types', { retry: 1, timeout: 5 * 60 * 1000 }, async () => {
  // `--force` because this measures how long checking the repo TAKES, and
  // `tsc -b` is incremental: run it against a warm tsbuildinfo — which is the
  // normal state after any earlier typecheck, including the one `release.ts`
  // runs a step before this — and it does no work, prints no `Check time`, and
  // the measurement below reads as instant. A benchmark that reports "fast"
  // because it measured nothing is a gate that cannot fail.
  // Three levels: this package sits at pkgs/core/monorepo-test. It used to sit
  // two levels down, and the move that became pkgs/ did not re-anchor this, so
  // the command was being run from pkgs/ — a directory with no package.json.
  const repoRoot = join(__dirname, '..', '..', '..')
  const out = execSync(`bun run typecheck --extendedDiagnostics --force || exit 0`, {
    cwd: repoRoot,
  }).toString()
  const [_, checkTime] = out.match(/Check time:\s+([^\s]+)/) ?? []
  if (!checkTime) {
    throw new Error(
      'no `Check time` in the typecheck output, so nothing was measured — the ' +
        'build was cached or the typecheck failed. Output tail:\n' +
        out.slice(-2000)
    )
  }
  const [seconds, ms] = checkTime.replace('s', '').split('.')

  const total = +seconds * 1000 + +ms * 10

  // uncached time to build the whole repo / time to run the baseline
  const initial = 2460 / 14

  // this should = 1 if its at baseline, 2 if 2x slower
  const slowdown = total / baseline / initial

  console.info(`\n\nTotal time: ${total}ms`)
  console.info(
    `${slowdown < 1 ? '🐇' : '🐢'} It is ${slowdown} slower than the baseline\n\n`
  )

  // threshold is somewhat loose because CI machines have variable load
  expect(slowdown).toBeLessThan(2.5)
})
