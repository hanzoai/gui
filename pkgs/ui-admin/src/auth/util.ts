// Shared helpers for the auth bucket. Read-only on cookies — no form
// component sets `document.cookie` directly. CSRF tokens are issued
// by the backend on first GET; we echo them back as a hidden form
// field, never as a custom header (which would dodge SameSite).

export function readCsrfToken(): string {
  if (typeof document === 'undefined') return ''
  const all = document.cookie || ''
  const match = all.split('; ').find((c) => c.startsWith('csrf_token='))
  if (!match) return ''
  return decodeURIComponent(match.slice('csrf_token='.length))
}

// validateEmail — narrow check matching the upstream regex. Not a
// security boundary; the backend always re-validates.
const EMAIL_RE = /^[\w.+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value)
}

const PHONE_RE = /^[+0-9 ()-]{6,}$/

export function isPhoneShape(value: string): boolean {
  return PHONE_RE.test(value)
}

// scorePassword — rough zxcvbn-lite. Returns 0..4 matching the
// upstream PasswordChecker bins. Backend enforces the actual
// policy; this is a UX hint only.
export function scorePassword(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (password.length >= 14) score++
  return Math.min(score, 4) as 0 | 1 | 2 | 3 | 4
}

// inIframe — used by login chrome to suppress branding when the
// flow renders inside a third-party portal.
export function inIframe(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.self !== window.top
  } catch {
    // Cross-origin parent — by definition, in an iframe.
    return true
  }
}
