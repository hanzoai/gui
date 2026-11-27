import '@testing-library/jest-dom'

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { describe, expect, it } from 'vitest'

// the reset ships as css; jsdom has no cascade for `:focus-visible`, so the
// stylesheet itself is the thing under test here
function findReset() {
  let dir = process.cwd()
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, 'pkgs/core/core/reset.css')
    if (existsSync(candidate)) return candidate
    dir = dirname(dir)
  }
  throw new Error(`could not find pkgs/core/core/reset.css from ${process.cwd()}`)
}

const resetPath = findReset()
const resetCss = readFileSync(resetPath, 'utf8')
const resetCssWebCopy = readFileSync(
  join(dirname(dirname(resetPath)), 'web/reset.css'),
  'utf8'
)

const selectorsRemovingOutline = (css: string) =>
  css
    .split('}')
    .filter((block) => block.includes('outline: none'))
    .map((block) => block.split('{')[0].trim())

describe('reset.css focus ring', () => {
  it('stops removing the outline from pointer focus only', () => {
    const selectors = selectorsRemovingOutline(resetCss)
    expect(selectors.length).toBeGreaterThan(0)
    for (const selector of selectors) {
      expect(selector).toContain(':focus:not(:focus-visible)')
    }
  })

  it('keeps a visible focus indicator for keyboard focus', () => {
    expect(resetCss).toMatch(/:focus-visible\s*\{[^}]*outline:\s*2px solid/)
  })

  it('ships the same rules in the web copy of the reset', () => {
    expect(resetCssWebCopy).toBe(resetCss)
  })
})
