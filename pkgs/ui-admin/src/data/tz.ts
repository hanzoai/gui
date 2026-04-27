// User's local-vs-UTC timestamp display preference. Persisted in
// localStorage under a single key shared across admin surfaces — the
// *display* choice belongs to the user, not the app.
//
// Setting tz dispatches a `admin:tz-changed` window event so any
// `formatTimestamp` consumer mounted on the page can re-render
// without prop drilling.

export const TZ_KEY = 'admin.tz'

export type Tz = 'local' | 'utc'

export function getTz(): Tz {
  if (typeof window === 'undefined') return 'local'
  const stored = localStorage.getItem(TZ_KEY)
  return stored === 'utc' ? 'utc' : 'local'
}

export function setTz(tz: Tz) {
  if (typeof window === 'undefined') return
  localStorage.setItem(TZ_KEY, tz)
  window.dispatchEvent(new CustomEvent('admin:tz-changed', { detail: tz }))
}
