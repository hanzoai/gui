// Shared helpers for the auth bucket. Pure input shape detection +
// display-only masking. Network requests go through the `IAM` class
// (`@hanzo/iam/browser`) which owns its own CSRF + PKCE wiring; this
// file is never on the wire path.

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

// maskEmail — display-only obfuscation. Keeps the first character of
// the local part + `***` + the domain. Used wherever the UI surfaces
// a user identifier the requester didn't already type (e.g. the
// "we sent a code to ..." line in password reset). Without masking,
// any anonymous client could enumerate accounts by submitting a
// username and harvesting the verified contact. Empty/null/no-`@`
// returns ''. The backend re-validates; if a server returns garbage
// we render nothing rather than echo it raw.
export function maskEmail(email: string | undefined | null): string {
  if (!email) return ''
  const at = email.lastIndexOf('@')
  if (at < 1) return ''
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  if (!domain.includes('.')) return ''
  const head = local.charAt(0)
  return `${head}***@${domain}`
}

// maskPhone — display-only obfuscation. Keeps the last 4 digits of
// the *primary* phone number (excluding any extension). Everything
// before that collapses to digit placeholders (`*`) while preserving
// separators (`+`, ` `, `-`, `(`, `)`). Empty/null and numbers with
// fewer than 4 primary-digits return ''.
//
// Why split on extension first: a naive `\D` flatten folds the
// extension digits into the trailing 4, so `555-1234x99` would mask
// to `***-***-3499` and mislabel the number. We split on the first
// alphabetic separator (`x`, `ext`, `Ext.`, etc) and mask only the
// leading run. International numbers (`+44 20 7946 0958`) keep their
// shape because we transform digits to `*` in place rather than
// stripping all non-digits.
export function maskPhone(phone: string | undefined | null): string {
  if (!phone) return ''
  // Split on first alphabetic character (extension marker like `x`,
  // `ext`, `Ext.`). The leading run is the primary number; ignore
  // anything after.
  const primary = phone.split(/[A-Za-z]/, 1)[0].trimEnd()
  if (!primary) return ''
  const primaryDigits = primary.replace(/\D/g, '')
  if (primaryDigits.length < 4) return ''
  // Walk the primary string right-to-left, replacing digits with `*`
  // until we have kept the trailing 4 (which are the only digits the
  // user is allowed to see). Separators pass through untouched —
  // this preserves `+44 20 7946 0958` → `+** ** **** 0958` shape.
  let kept = 0
  let out = ''
  for (let i = primary.length - 1; i >= 0; i--) {
    const ch = primary[i]
    if (ch >= '0' && ch <= '9') {
      if (kept < 4) {
        out = ch + out
        kept++
      } else {
        out = '*' + out
      }
    } else {
      out = ch + out
    }
  }
  return out
}
