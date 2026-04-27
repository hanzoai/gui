import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CSRF_HEADER, readCsrfToken } from '../../src/data/csrf'
import { apiPost, apiDelete } from '../../src/data/useFetch'

// CSRF wiring lives in `data/csrf` and is consumed by `data/useFetch`.
// We assert two contracts:
//   1. `readCsrfToken` parses + URL-decodes the `csrf_token` cookie.
//   2. `apiPost` / `apiDelete` attach the cookie value as the
//      `X-CSRF-Token` header on every mutating request, and set
//      `credentials: 'same-origin'` so the cookie travels with the
//      request without leaking to cross-origin endpoints.

describe('readCsrfToken', () => {
  afterEach(() => {
    document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  })

  it('returns "" when the cookie is absent', () => {
    expect(readCsrfToken()).toBe('')
  })

  it('reads + URL-decodes a cookie value', () => {
    document.cookie = `csrf_token=${encodeURIComponent('abc/=+123')}`
    expect(readCsrfToken()).toBe('abc/=+123')
  })

  it('exposes the canonical header name as a constant', () => {
    // Hardcoding the string in callers is what made the original
    // bug invisible — pin the canonical value here.
    expect(CSRF_HEADER).toBe('X-CSRF-Token')
  })
})

interface FetchCall {
  url: string
  init: RequestInit
}

function stubFetch(): { calls: FetchCall[]; restore: () => void } {
  const calls: FetchCall[] = []
  const original = globalThis.fetch
  // Cast through `unknown`: Node 25's lib types include `preconnect`
  // on the global fetch which we don't model in this stub. The
  // contract under test is `(url, init) => Promise<Response>`.
  const fake = ((input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} })
    return Promise.resolve(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  }) as unknown as typeof fetch
  globalThis.fetch = fake
  return {
    calls,
    restore: () => {
      globalThis.fetch = original
    },
  }
}

function readHeader(init: RequestInit, name: string): string | undefined {
  const h = init.headers
  if (!h) return undefined
  if (h instanceof Headers) return h.get(name) ?? undefined
  if (Array.isArray(h)) {
    const found = h.find(([k]) => k.toLowerCase() === name.toLowerCase())
    return found?.[1]
  }
  // Plain Record
  const rec = h as Record<string, string>
  for (const k of Object.keys(rec)) {
    if (k.toLowerCase() === name.toLowerCase()) return rec[k]
  }
  return undefined
}

describe('apiPost / apiDelete wire the X-CSRF-Token header', () => {
  let stub: ReturnType<typeof stubFetch>

  beforeEach(() => {
    stub = stubFetch()
    document.cookie = `csrf_token=${encodeURIComponent('cookie-value-abc')}`
  })

  afterEach(() => {
    stub.restore()
    document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    vi.restoreAllMocks()
  })

  it('apiPost sets X-CSRF-Token to the cookie value and credentials: same-origin', async () => {
    await apiPost('/v1/iam/login', { username: 'z' })
    expect(stub.calls).toHaveLength(1)
    const { init } = stub.calls[0]!
    expect(readHeader(init, 'X-CSRF-Token')).toBe('cookie-value-abc')
    expect(readHeader(init, 'Content-Type')).toBe('application/json')
    expect(init.credentials).toBe('same-origin')
    expect(init.method).toBe('POST')
  })

  it('apiDelete sets X-CSRF-Token to the cookie value and credentials: same-origin', async () => {
    await apiDelete('/v1/iam/groups/built-in/x')
    expect(stub.calls).toHaveLength(1)
    const { init } = stub.calls[0]!
    expect(readHeader(init, 'X-CSRF-Token')).toBe('cookie-value-abc')
    expect(init.credentials).toBe('same-origin')
    expect(init.method).toBe('DELETE')
    // DELETE has no body; Content-Type must be absent.
    expect(readHeader(init, 'Content-Type')).toBeUndefined()
  })

  it('still attaches the header when the cookie is empty (server will 403)', async () => {
    document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    await apiPost('/v1/iam/login', { username: 'z' })
    const { init } = stub.calls[0]!
    // Empty string, but the header is present so the server can
    // distinguish "missing header" (network bug) from "no token"
    // (fresh tab, expected 403 → reload).
    expect(readHeader(init, 'X-CSRF-Token')).toBe('')
  })
})
