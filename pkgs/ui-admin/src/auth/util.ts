// Shared helpers for the auth bucket. CSRF wiring lives in
// `data/csrf` — the only place that parses the cookie. The header is
// attached automatically by `apiPost`/`apiDelete`.

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
