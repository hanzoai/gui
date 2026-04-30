import { describe, expect, it } from 'vitest'
import { buildTicks } from '../workflow/TimelineGantt'

describe('buildTicks', () => {
  it('returns count+1 evenly-spaced ticks across the span', () => {
    const ticks = buildTicks(0, 10_000, 5)
    expect(ticks).toHaveLength(6)
    expect(ticks[0].ms).toBe(0)
    expect(ticks[5].ms).toBe(10_000)
  })

  it('labels sub-second spans in ms', () => {
    const ticks = buildTicks(1000, 1500, 5)
    expect(ticks[0].label).toBe('0ms')
    expect(ticks[5].label).toBe('500ms')
  })

  it('labels minute-scale spans in m', () => {
    const ticks = buildTicks(0, 5 * 60_000, 5)
    expect(ticks[5].label).toBe('5.0m')
  })

  it('returns an empty array for a non-finite span', () => {
    expect(buildTicks(NaN, 1000)).toEqual([])
    expect(buildTicks(0, 0)).toEqual([])
  })
})
