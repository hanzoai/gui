// Local-time / UTC display helpers shared by every page that renders
// timestamps. Stored choice persists in localStorage and pages can
// re-render on the `admin:tz-changed` window event.
//
// Storage key is shared across admin surfaces — the *display* choice
// of UTC vs local belongs to the user, not the app. If you want
// per-app isolation, override KEY at the call site (advanced; not
// recommended).

const KEY = 'admin.tz'

export type Tz = 'local' | 'utc'

export function getTz(): Tz {
  if (typeof window === 'undefined') return 'local'
  const stored = localStorage.getItem(KEY)
  return stored === 'utc' ? 'utc' : 'local'
}

export function setTz(tz: Tz) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, tz)
  window.dispatchEvent(new CustomEvent('admin:tz-changed', { detail: tz }))
}

// formatTimestamp renders a Date in the user's chosen tz mode. UTC
// produces ISO 8601, local produces the upstream
// "26 Apr 2026, 22:33:39.64 GMT-7" shape.
export function formatTimestamp(d: Date): string {
  const tz = getTz()
  if (tz === 'utc') {
    return d.toISOString().replace('T', ' ').slice(0, 23) + ' UTC'
  }
  const day = d.getDate().toString().padStart(2, '0')
  const month = d.toLocaleString('en-US', { month: 'short' })
  const year = d.getFullYear()
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const ms = String(d.getMilliseconds()).padStart(3, '0').slice(0, 2)
  const tzOffset = -d.getTimezoneOffset() / 60
  const tzLabel = `GMT${tzOffset >= 0 ? '+' : ''}${tzOffset}`
  return `${day} ${month} ${year}, ${time}.${ms} ${tzLabel}`
}

// humanTTL — "720h" → "30 days", "604800s" → "7 days", fallthrough
// returns the raw string. Common case for retention TTL fields.
export function humanTTL(raw?: string): string {
  if (!raw) return '—'
  if (raw.endsWith('h')) {
    const h = parseInt(raw, 10)
    if (!Number.isFinite(h)) return raw
    const days = Math.round(h / 24)
    return days >= 1 ? `${days} days` : `${h}h`
  }
  if (raw.endsWith('s')) {
    const s = parseInt(raw, 10)
    if (!Number.isFinite(s)) return raw
    const days = Math.round(s / 86400)
    return days >= 1 ? `${days} days` : `${Math.round(s / 3600)}h`
  }
  return raw
}

export type StatusVariant = 'success' | 'destructive' | 'warning' | 'muted' | 'default'

// Badge color tokens. Pure-string CSS so they pass through Tamagui's
// strict ColorTokens generic (cast to never at the call site).
export function badgeColors(variant: StatusVariant): { bg: string; fg: string } {
  switch (variant) {
    case 'success':
      return { bg: 'rgba(34,197,94,0.15)', fg: '#86efac' }
    case 'destructive':
      return { bg: 'rgba(239,68,68,0.15)', fg: '#fca5a5' }
    case 'warning':
      return { bg: 'rgba(234,179,8,0.15)', fg: '#fde68a' }
    case 'muted':
    case 'default':
    default:
      return { bg: 'rgba(148,163,184,0.15)', fg: '#cbd5e1' }
  }
}
