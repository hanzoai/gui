import { describe, expect, it, beforeEach } from 'vitest'
import { formatTimestamp, humanTTL } from '../src/data/format'
import { TZ_KEY } from '../src/data/tz'

describe('humanTTL', () => {
  it('converts hours-suffixed retention to days', () => {
    expect(humanTTL('720h')).toBe('30 days')
  })

  it('returns the raw string when the unit is unknown', () => {
    expect(humanTTL('nope')).toBe('nope')
  })
})

describe('formatTimestamp', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders ISO 8601 in UTC mode', () => {
    localStorage.setItem(TZ_KEY, 'utc')
    const out = formatTimestamp(new Date('2026-04-27T03:14:15.926Z'))
    expect(out).toBe('2026-04-27 03:14:15.926 UTC')
  })

  it('renders the long local form when no preference is set', () => {
    const out = formatTimestamp(new Date('2026-04-27T03:14:15.926Z'))
    // Format is "DD Mon YYYY, HH:MM:SS.mm GMT±N" — assert structure,
    // not the offset (varies by host tz).
    expect(out).toMatch(/^\d{2} [A-Z][a-z]{2} 2026, \d{2}:\d{2}:\d{2}\.\d{2} GMT[+-]\d+$/)
  })
})
