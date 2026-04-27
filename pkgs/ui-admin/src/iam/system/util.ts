// Shared helpers for the system bucket. Two byte sizes are friendly
// formatted to match the upstream `Setting.getFriendlyFileSize`, and
// progress colours follow the original semantic mapping (orange at
// 70%, red at 90%).

export function getFriendlyFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let i = 0
  let v = bytes
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i += 1
  }
  return `${v.toFixed(v >= 100 ? 0 : 1)} ${units[i]}`
}

export function getProgressColor(percent: number): string {
  if (percent >= 90) return '#ef4444'
  if (percent >= 70) return '#f59e0b'
  return '#3b82f6'
}

// Parse the `jsonWebConfig` cookie that the backend sets on first
// load. Returns null when the cookie is absent or malformed — the
// caller falls back to compile-time defaults.
export function readRuntimeConfigCookie(): unknown {
  if (typeof document === 'undefined') return null
  try {
    const all = document.cookie || ''
    const match = all.split('; ').find((c) => c.startsWith('jsonWebConfig='))
    if (!match) return null
    const raw = decodeURIComponent(match.slice('jsonWebConfig='.length))
    if (!raw || raw === 'null') return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

