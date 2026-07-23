// Time plane — pure date/timezone helpers via Intl + Date only.
// No external date library. Web and React Native safe.

/** The visitor's IANA time zone, e.g. "America/New_York". */
export function visitorTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

/** Calendar date "YYYY-MM-DD" from a Date's local components. */
export function ymd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

export function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** True if the day key is strictly before today (lexicographic works on YYYY-MM-DD). */
export function isBeforeToday(key: string): boolean {
  return key < ymd(new Date())
}

export interface MonthCell {
  date: Date
  key: string
  inMonth: boolean
}

/**
 * A 6×7 grid of days covering the month of `viewDate`, including the leading
 * and trailing days needed to fill whole weeks.
 */
export function monthMatrix(viewDate: Date, weekStartsOn = 0): MonthCell[] {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const startOffset = (firstWeekday - weekStartsOn + 7) % 7
  const cells: MonthCell[] = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(year, month, 1 - startOffset + i)
    cells.push({ date, key: ymd(date), inMonth: date.getMonth() === month })
  }
  return cells
}

/**
 * ISO start/end covering the visible month, clamped so the start is never in
 * the past (the backend rejects past ranges anyway).
 */
export function monthRange(viewDate: Date): { startTime: string; endTime: string } {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const startOfView = new Date(year, month, 1, 0, 0, 0, 0)
  const now = new Date()
  const start = startOfView.getTime() > now.getTime() ? startOfView : now
  const endOfView = new Date(year, month + 1, 0, 23, 59, 59, 999)
  return { startTime: start.toISOString(), endTime: endOfView.toISOString() }
}

/** Short weekday headers ordered from `weekStartsOn` (0 = Sunday). */
export function weekdayLabels(weekStartsOn = 0): string[] {
  const fmt = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
  const out: string[] = []
  for (let i = 0; i < 7; i++) {
    // 2023-01-01 is a Sunday; offset from there.
    const d = new Date(2023, 0, 1 + ((i + weekStartsOn) % 7))
    out.push(fmt.format(d))
  }
  return out
}

export function formatMonthLabel(d: Date): string {
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(d)
}

export function formatDayLong(d: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/** Slot time in the visitor's zone, e.g. "9:00 AM". */
export function formatSlotTime(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(iso))
}

/** Full human "when" for a confirmation, e.g. "Monday, July 27, 2026 at 9:00 AM PDT". */
export function formatBookingWhen(iso: string, timeZone: string): string {
  const at = new Date(iso)
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(at)
  const time = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone,
  }).format(at)
  return `${date} at ${time}`
}

/** A parsed local Date from a "YYYY-MM-DD" key (noon avoids DST edge slips). */
export function dateFromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0)
}
