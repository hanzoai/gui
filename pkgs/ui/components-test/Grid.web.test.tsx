import { tracks } from '@hanzogui/stacks'
import { describe, expect, it } from 'vitest'

/**
 * The two formulas in `tracks()` that look like verbosity.
 *
 * They are pinned HERE, against the shorter spelling they must not produce,
 * because a browser cannot tell them apart: Chromium resolves
 * `grid-template-columns` to used pixel values, so `repeat(3, minmax(0, 1fr))`
 * and `repeat(3, 1fr)` read identically on a laid-out grid and differ only when
 * a child holds one long unbroken word. The rendered half is in
 * `browser/run.ts`; this is the half that outlives a tidy-up.
 */
describe('tracks()', () => {
  it('a count is minmax(0, 1fr), never a bare 1fr', () => {
    expect(tracks(3)).toBe('repeat(3, minmax(0, 1fr))')
    expect(tracks(3)).not.toBe('repeat(3, 1fr)')
  })

  it('a fit floor is min(Npx, 100%), never a bare Npx', () => {
    expect(tracks({ min: 900 })).toBe('repeat(auto-fill, minmax(min(900px, 100%), 1fr))')
    expect(tracks({ min: 900 })).not.toContain('minmax(900px')
  })

  it('a capped fit subtracts the gaps before dividing', () => {
    expect(tracks({ min: 160, max: 4 }, 12)).toBe(
      'repeat(auto-fill, minmax(max(min(160px, 100%), calc((100% - 36px) / 4)), 1fr))'
    )
  })

  it('a list is one entry per track; a number is px', () => {
    expect(tracks(['2fr', 240])).toBe('2fr 240px')
  })

  it('a written track list passes through', () => {
    expect(tracks('repeat(3, 1fr)')).toBe('repeat(3, 1fr)')
  })
})
