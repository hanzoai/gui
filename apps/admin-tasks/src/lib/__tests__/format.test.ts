import { describe, it, expect } from 'vitest'
import {
  formatDuration,
  parseDurationToMs,
  formatRelative,
  formatBytes,
  formatBigInt,
  iconForStatus,
} from '../format'

describe('parseDurationToMs', () => {
  it('parses ms / s / m / h / d suffixes', () => {
    expect(parseDurationToMs('500ms')).toBe(500)
    expect(parseDurationToMs('30s')).toBe(30_000)
    expect(parseDurationToMs('5m')).toBe(300_000)
    expect(parseDurationToMs('2h')).toBe(7_200_000)
    expect(parseDurationToMs('1d')).toBe(86_400_000)
  })
  it('treats bare numeric strings as seconds (proto JSON)', () => {
    expect(parseDurationToMs('12')).toBe(12_000)
    expect(parseDurationToMs('1.5')).toBe(1_500)
  })
  it('returns NaN for unparseable input', () => {
    expect(Number.isNaN(parseDurationToMs(''))).toBe(true)
    expect(Number.isNaN(parseDurationToMs('weeks'))).toBe(true)
  })
})

describe('formatDuration', () => {
  it('renders sub-second as ms', () => {
    expect(formatDuration(450)).toBe('450ms')
    expect(formatDuration('250ms')).toBe('250ms')
  })
  it('renders seconds with adaptive precision', () => {
    expect(formatDuration(1500)).toBe('1.50s')
    expect(formatDuration(45_000)).toBe('45.0s')
  })
  it('renders minutes / hours / days with two units', () => {
    expect(formatDuration(65_000)).toBe('1m 5s')
    expect(formatDuration(3_600_000)).toBe('1h')
    expect(formatDuration(90 * 60 * 1000)).toBe('1h 30m')
    expect(formatDuration(2 * 24 * 60 * 60 * 1000)).toBe('2d')
  })
  it('returns em-dash for null/undefined', () => {
    expect(formatDuration(null)).toBe('—')
    expect(formatDuration(undefined)).toBe('—')
  })
})

describe('formatRelative', () => {
  it('formats past as "X ago"', () => {
    const now = new Date('2026-04-29T12:00:00Z')
    const t = new Date('2026-04-29T11:59:00Z')
    expect(formatRelative(t, now)).toMatch(/ago$/)
  })
  it('formats future as "in X"', () => {
    const now = new Date('2026-04-29T12:00:00Z')
    const t = new Date('2026-04-29T12:05:00Z')
    expect(formatRelative(t, now)).toMatch(/^in /)
  })
  it('returns em-dash for missing or invalid input', () => {
    expect(formatRelative(null)).toBe('—')
    expect(formatRelative('not a date')).toBe('—')
  })
})

describe('formatBytes', () => {
  it('formats bytes scales', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(500)).toBe('500 B')
    expect(formatBytes(1500)).toBe('1.50 KB')
    expect(formatBytes(1_500_000)).toBe('1.50 MB')
  })
  it('handles strings (proto-int convention)', () => {
    expect(formatBytes('2048')).toMatch(/KB$/)
  })
  it('returns em-dash for null', () => {
    expect(formatBytes(null)).toBe('—')
  })
})

describe('formatBigInt', () => {
  it('formats with thousands separators', () => {
    expect(formatBigInt(1234567)).toBe('1,234,567')
    expect(formatBigInt('98765432100')).toBe('98,765,432,100')
  })
  it('preserves decimal portion', () => {
    expect(formatBigInt('1234.56')).toBe('1,234.56')
  })
  it('returns em-dash for empty/null', () => {
    expect(formatBigInt('')).toBe('—')
    expect(formatBigInt(null)).toBe('—')
  })
})

describe('iconForStatus', () => {
  it('maps each status to a known icon name', () => {
    expect(iconForStatus('Running')).toBe('Play')
    expect(iconForStatus('Completed')).toBe('CheckCircle2')
    expect(iconForStatus('Failed')).toBe('XCircle')
    expect(iconForStatus('Canceled')).toBe('Ban')
    expect(iconForStatus('Terminated')).toBe('Square')
    expect(iconForStatus('TimedOut')).toBe('Clock')
  })
})
