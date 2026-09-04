import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * SelectTrigger reads `(pointer:coarse)` at MODULE SCOPE. That is fine in a
 * browser and a trap everywhere else: jsdom defines `window` and does NOT
 * define `window.matchMedia`, so a guard on `window` alone answers "yes, there
 * is a browser here" and then calls a method that is not there. Because it runs
 * at module scope the TypeError lands on the IMPORT — before any test body, and
 * unreachable by a `beforeEach` polyfill — so every jsdom consumer of
 * `@hanzogui/select` had to shim matchMedia in setup just to import a Select.
 *
 * This test does not mount anything, on purpose. The repo's own web-test config
 * (`vite-plugin-internal/src/test-setup.ts`) installs a matchMedia polyfill, so
 * a test that merely imported the module would pass either way — that polyfill
 * is precisely what kept this invisible in-repo while it broke consumers. So
 * the guard is read out of the real source and evaluated against the DOM shape
 * that has no matchMedia, which no setup file can paper over.
 */
const SOURCE = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../select/src/SelectTrigger.tsx'
)

/** The module-scope guard, verbatim from the file — never a copy kept in step by hand. */
function guard(): string {
  const src = readFileSync(SOURCE, 'utf8')
  const match = src.match(/const isPointerCoarse =[\s\S]*?\n\s*: true/)
  if (!match) throw new Error(`no isPointerCoarse guard in ${SOURCE}`)
  return match[0]
}

/** Evaluates the guard against a given `window` and returns its value. */
function evaluate(win: unknown): unknown {
  return new Function('window', 'process', `${guard()}; return isPointerCoarse`)(win, {
    env: { GUI_TARGET: 'web' },
  })
}

describe('SelectTrigger pointer-coarse guard', () => {
  it('does not throw in a DOM that has no matchMedia (jsdom)', () => {
    // The exact shape jsdom presents: window exists, matchMedia does not.
    expect(() => evaluate({})).not.toThrow()
  })

  it('assumes a coarse pointer when the DOM cannot answer', () => {
    // Matches the no-window branch. Assuming touch grows the hit target, and
    // being generous with a target is the safe way to be wrong.
    expect(evaluate({})).toBe(true)
  })

  it('still reads the real query when matchMedia is there', () => {
    const win = (matches: boolean) => ({ matchMedia: () => ({ matches }) })
    expect(evaluate(win(true))).toBe(true)
    expect(evaluate(win(false))).toBe(false)
  })

  it('guards on matchMedia itself, not merely on window', () => {
    // The regression, named: a guard that only tests `window` passes the two
    // browser cases above and still throws in jsdom. Assert the predicate.
    expect(guard()).toMatch(/typeof window\.matchMedia === 'function'/)
  })
})
