import { describe, it, expect } from 'vitest'
import {
  describeCron,
  describeInterval,
  describeSpec,
  nextOccurrences,
  nextCronAfter,
} from '../schedule-recurrence'

describe('describeCron', () => {
  it('handles common @aliases', () => {
    expect(describeCron('@daily')).toMatch(/Once a day/)
    expect(describeCron('@hourly')).toMatch(/Every|hour/)
    expect(describeCron('@yearly')).toMatch(/Once a year/)
  })
  it('describes "*/15 * * * *" as every 15 minutes', () => {
    expect(describeCron('*/15 * * * *')).toBe('Every 15 minutes')
  })
  it('describes "0 * * * *" as every hour', () => {
    expect(describeCron('0 * * * *')).toBe('Every hour')
  })
  it('describes "0 0 * * *" as daily at midnight', () => {
    expect(describeCron('0 0 * * *')).toBe('Every day at 00:00')
  })
  it('falls back to cron(...) for unfamiliar patterns', () => {
    expect(describeCron('0 9 * * 1-5')).toMatch(/^cron\(/)
  })
})

describe('describeInterval', () => {
  it('formats whole-unit intervals', () => {
    expect(describeInterval({ interval: '60s' })).toBe('Every 1m')
    expect(describeInterval({ interval: '3600s' })).toBe('Every 1h')
    expect(describeInterval({ interval: '86400s' })).toBe('Every 1d')
  })
  it('reports the phase offset when non-zero', () => {
    expect(describeInterval({ interval: '60s', phase: '15s' })).toMatch(/offset 15s/)
  })
})

describe('describeSpec', () => {
  it('returns "No schedule" when nothing is set', () => {
    expect(describeSpec({})).toBe('No schedule')
  })
  it('joins cron + interval + calendar parts', () => {
    const out = describeSpec({
      cronString: ['0 0 * * *'],
      interval: [{ interval: '300s' }],
      calendar: [{ minute: '0' }],
    })
    expect(out).toMatch(/Every 5m/)
    expect(out).toMatch(/Every day at 00:00/)
    expect(out).toMatch(/calendar rule/)
  })
})

describe('nextCronAfter', () => {
  it('returns the next minute boundary for "* * * * *"', () => {
    const start = Date.UTC(2026, 3, 29, 10, 30, 15)
    const next = nextCronAfter('* * * * *', start)
    expect(next).not.toBeNull()
    const d = new Date(next!)
    expect(d.getUTCMinutes()).toBe(31)
    expect(d.getUTCSeconds()).toBe(0)
  })
  it('returns the next quarter-hour for "*/15 * * * *"', () => {
    const start = Date.UTC(2026, 3, 29, 10, 7, 0)
    const next = nextCronAfter('*/15 * * * *', start)
    expect(new Date(next!).getUTCMinutes()).toBe(15)
  })
  it('returns null for unparseable cron', () => {
    expect(nextCronAfter('not a cron', Date.now())).toBeNull()
  })
})

describe('nextOccurrences', () => {
  it('produces N future times for an interval spec', () => {
    const out = nextOccurrences(
      { interval: [{ interval: '60s' }] },
      3,
      new Date('2026-04-29T12:00:00Z'),
    )
    expect(out).toHaveLength(3)
    // Each tick is 60s apart.
    const t1 = new Date(out[0]).getTime()
    const t2 = new Date(out[1]).getTime()
    expect(t2 - t1).toBe(60_000)
  })
  it('produces N future times for "*/15 * * * *"', () => {
    const out = nextOccurrences(
      { cronString: ['*/15 * * * *'] },
      4,
      new Date('2026-04-29T12:01:00Z'),
    )
    expect(out).toHaveLength(4)
    expect(new Date(out[0]).getUTCMinutes()).toBe(15)
    expect(new Date(out[3]).getUTCMinutes()).toBe(0) // wraps to next hour
  })
  it('returns empty array when no spec is set', () => {
    expect(nextOccurrences({})).toEqual([])
  })
})
