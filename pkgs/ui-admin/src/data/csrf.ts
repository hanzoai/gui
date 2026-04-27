// CSRF token wiring. The backend issues a `csrf_token` cookie on
// first GET; every mutating request must echo that value back as the
// `X-CSRF-Token` header. Cookie-only would defeat same-site fetch
// flows, and a header-only token without a cookie can be forged — the
// pair (cookie + matching header) is the canonical double-submit
// pattern.
//
// One reader, one writer:
//   - `readCsrfToken()` is the only place that parses `document.cookie`.
//   - `apiPost`/`apiDelete` in `./useFetch` are the only places that
//     attach the header.
//
// No hidden form fields, no body-echoed `csrfToken` — those got
// silently dropped on JSON-POST and were security theatre.

export const CSRF_HEADER = 'X-CSRF-Token'

const CSRF_COOKIE = 'csrf_token'

export function readCsrfToken(): string {
  if (typeof document === 'undefined') return ''
  const all = document.cookie || ''
  const match = all.split('; ').find((c) => c.startsWith(`${CSRF_COOKIE}=`))
  if (!match) return ''
  return decodeURIComponent(match.slice(CSRF_COOKIE.length + 1))
}
