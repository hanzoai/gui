// Schedule recurrence helpers. Pure functions — no React, no globals.
// Two responsibilities:
//   1. Translate a ScheduleSpec (cron string, structured calendar,
//      interval) into a human-readable description.
//   2. Compute the next-N action times relative to a given anchor.
//
// The implementation supports:
//   - cron strings: "* * * * *" (5-field) and "* * * * * *" (6-field
//     with seconds), with the standard wildcards / ranges / steps
//   - interval specs (every Ns / Nm / Nh / Nd, optional phase offset)
// It does NOT support upstream's full StructuredCalendar set with
// per-second ranges; UI reduces those to "matches calendar spec" until
// the engine emits its own next-time list.

import type { IntervalSpec, ScheduleSpec } from '../lib/types'
import { parseDurationToMs } from '../lib/format'

// describeSpec — one-line human description.
export function describeSpec(spec: ScheduleSpec): string {
  if (!spec) return 'No schedule'
  const parts: string[] = []
  if (spec.cronString && spec.cronString.length) {
    parts.push(spec.cronString.map(describeCron).join(', '))
  }
  if (spec.interval && spec.interval.length) {
    parts.push(spec.interval.map(describeInterval).join(', '))
  }
  if (spec.calendar && spec.calendar.length) {
    parts.push(`${spec.calendar.length} calendar rule${spec.calendar.length === 1 ? '' : 's'}`)
  }
  if (spec.structuredCalendar && spec.structuredCalendar.length) {
    parts.push(
      `${spec.structuredCalendar.length} structured calendar rule${spec.structuredCalendar.length === 1 ? '' : 's'}`,
    )
  }
  if (parts.length === 0) return 'No schedule'
  return parts.join(' • ')
}

export function describeInterval(i: IntervalSpec): string {
  const ms = parseDurationToMs(i.interval)
  const human = humanInterval(ms)
  if (!i.phase || i.phase === '0s') return `Every ${human}`
  return `Every ${human} (offset ${humanInterval(parseDurationToMs(i.phase))})`
}

function humanInterval(ms: number): string {
  if (!Number.isFinite(ms)) return '?'
  if (ms % (24 * 3600 * 1000) === 0) return `${ms / (24 * 3600 * 1000)}d`
  if (ms % (3600 * 1000) === 0) return `${ms / (3600 * 1000)}h`
  if (ms % (60 * 1000) === 0) return `${ms / (60 * 1000)}m`
  if (ms % 1000 === 0) return `${ms / 1000}s`
  return `${ms}ms`
}

// describeCron — best-effort description for the most common cron
// patterns. Falls back to the raw expression for anything we don't
// recognise.
export function describeCron(cron: string): string {
  const trimmed = cron.trim().replace(/^@/, '')
  switch (trimmed.toLowerCase()) {
    case 'yearly':
    case 'annually':
      return 'Once a year (Jan 1, 00:00)'
    case 'monthly':
      return 'Once a month (1st, 00:00)'
    case 'weekly':
      return 'Once a week (Sunday, 00:00)'
    case 'daily':
    case 'midnight':
      return 'Once a day (00:00)'
    case 'hourly':
      return 'Once an hour'
    case 'every_minute':
      return 'Every minute'
    case 'every_second':
      return 'Every second'
  }
  // Pre-compiled mappings for common 5-field crons.
  const fields = trimmed.split(/\s+/)
  if (fields.length === 5) {
    const [m, h, dom, mon, dow] = fields
    if (m === '0' && h === '*' && dom === '*' && mon === '*' && dow === '*') return 'Every hour'
    if (m === '0' && h === '0' && dom === '*' && mon === '*' && dow === '*') return 'Every day at 00:00'
    if (m === '*' && h === '*' && dom === '*' && mon === '*' && dow === '*') return 'Every minute'
    if (/^\*\/\d+$/.test(m) && h === '*' && dom === '*' && mon === '*' && dow === '*') {
      return `Every ${m.slice(2)} minutes`
    }
  }
  return `cron(${cron})`
}

// nextOccurrences — best-effort future action times relative to
// `from`. For cron strings we step at the cron's resolution. For
// intervals we walk by the interval length. Returns up to `count`
// timestamps as ISO strings.
export function nextOccurrences(
  spec: ScheduleSpec,
  count = 5,
  from: Date = new Date(),
): string[] {
  const out: string[] = []

  if (spec.interval && spec.interval.length) {
    const i = spec.interval[0]
    const intervalMs = parseDurationToMs(i.interval)
    const phaseMs = parseDurationToMs(i.phase ?? '0s')
    if (Number.isFinite(intervalMs) && intervalMs > 0) {
      let t = nextIntervalTick(from.getTime(), intervalMs, Number.isFinite(phaseMs) ? phaseMs : 0)
      for (let n = 0; n < count; n++) {
        out.push(new Date(t).toISOString())
        t += intervalMs
      }
      return out
    }
  }

  if (spec.cronString && spec.cronString.length) {
    const cron = spec.cronString[0]
    let t = from.getTime()
    for (let n = 0; n < count; n++) {
      const next = nextCronAfter(cron, t)
      if (next == null) break
      out.push(new Date(next).toISOString())
      t = next + 1000 // step past, recurse
    }
    return out
  }

  return out
}

function nextIntervalTick(now: number, intervalMs: number, phaseMs: number): number {
  const epochAligned = now - phaseMs
  const ticks = Math.floor(epochAligned / intervalMs) + 1
  return ticks * intervalMs + phaseMs
}

// nextCronAfter — minimal 5-field cron evaluator. Supports `*`,
// numbers, ranges (a-b), lists (a,b,c), and steps (*/n). Returns the
// next firing time strictly after `afterMs`. Returns null if the
// cron is unparseable.
export function nextCronAfter(cron: string, afterMs: number): number | null {
  const expr = cron.trim().replace(/^@/, '').toLowerCase()
  const aliases: Record<string, string> = {
    yearly: '0 0 1 1 *',
    annually: '0 0 1 1 *',
    monthly: '0 0 1 * *',
    weekly: '0 0 * * 0',
    daily: '0 0 * * *',
    midnight: '0 0 * * *',
    hourly: '0 * * * *',
  }
  const fields = (aliases[expr] ?? cron).trim().split(/\s+/)
  if (fields.length < 5) return null
  // Strip seconds field if present (6-field). We round to minute.
  const [m, h, dom, mon, dow] = fields.length === 6 ? fields.slice(1) : fields

  const minutes = parseField(m, 0, 59)
  const hours = parseField(h, 0, 23)
  const days = parseField(dom, 1, 31)
  const months = parseField(mon, 1, 12)
  const dows = parseField(dow, 0, 6)
  if (!minutes || !hours || !days || !months || !dows) return null

  // Walk forward minute-by-minute. Cap at 1 year of search.
  const limit = afterMs + 366 * 24 * 60 * 60 * 1000
  const t = new Date(Math.floor(afterMs / 60000) * 60000 + 60000)
  while (t.getTime() < limit) {
    if (
      months.has(t.getUTCMonth() + 1) &&
      days.has(t.getUTCDate()) &&
      dows.has(t.getUTCDay()) &&
      hours.has(t.getUTCHours()) &&
      minutes.has(t.getUTCMinutes())
    ) {
      return t.getTime()
    }
    t.setUTCMinutes(t.getUTCMinutes() + 1)
  }
  return null
}

function parseField(field: string, lo: number, hi: number): Set<number> | null {
  const out = new Set<number>()
  const parts = field.split(',')
  for (const raw of parts) {
    let p = raw
    let step = 1
    const slash = p.indexOf('/')
    if (slash >= 0) {
      const s = Number(p.slice(slash + 1))
      if (!Number.isFinite(s) || s <= 0) return null
      step = s
      p = p.slice(0, slash)
    }
    if (p === '*') {
      for (let i = lo; i <= hi; i += step) out.add(i)
      continue
    }
    const dash = p.indexOf('-')
    if (dash >= 0) {
      const a = Number(p.slice(0, dash))
      const b = Number(p.slice(dash + 1))
      if (!Number.isFinite(a) || !Number.isFinite(b)) return null
      for (let i = a; i <= b; i += step) out.add(i)
      continue
    }
    const v = Number(p)
    if (!Number.isFinite(v)) return null
    out.add(v)
  }
  return out
}
