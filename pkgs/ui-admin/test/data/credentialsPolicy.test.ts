// Defense-in-depth: every fetch path in this package must pin
// `credentials: 'same-origin'` so cookies (session + CSRF) are
// included regardless of bundler defaults. Some build chains
// (Vite SSR, jest-fetch-mock) flip the default to 'omit', which
// silently breaks auth. Pinning the option means the only way to
// drop cookies is to remove the line — and that line is what this
// test guards.
//
// We exercise both the GET path (`useFetch` → defaultFetcher) and
// the mutating path (`apiPost`/`apiDelete` → apiSend) by stubbing
// `globalThis.fetch` and inspecting the RequestInit it receives.

import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { apiDelete, apiPost, useFetch } from '../../src/data/useFetch'

afterEach(() => {
  vi.restoreAllMocks()
})

function captureFetch(): {
  spy: ReturnType<typeof vi.fn>
  calls: { url: string; init: RequestInit | undefined }[]
} {
  const calls: { url: string; init: RequestInit | undefined }[] = []
  const spy = vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url, init })
    return new Response('{}', {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  })
  // jsdom + node 25 export `fetch` as a writable property on
  // globalThis. Patch it for the duration of the test.
  globalThis.fetch = spy as unknown as typeof fetch
  return { spy, calls }
}

describe('credentials policy — same-origin always', () => {
  it("apiPost pins credentials: 'same-origin'", async () => {
    const { calls } = captureFetch()
    await apiPost('/v1/iam/users', { name: 'alice' })
    expect(calls.length).toBe(1)
    expect(calls[0].init?.credentials).toBe('same-origin')
    expect(calls[0].init?.method).toBe('POST')
  })

  it("apiDelete pins credentials: 'same-origin'", async () => {
    const { calls } = captureFetch()
    await apiDelete('/v1/iam/users/built-in/alice')
    expect(calls.length).toBe(1)
    expect(calls[0].init?.credentials).toBe('same-origin')
    expect(calls[0].init?.method).toBe('DELETE')
  })

  it("useFetch defaultFetcher pins credentials: 'same-origin'", async () => {
    const { calls } = captureFetch()
    const { result } = renderHook(() => useFetch<unknown>('/v1/iam/users'))
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(calls.length).toBeGreaterThanOrEqual(1)
    expect(calls[0].init?.credentials).toBe('same-origin')
  })

  it('useFetch pins credentials even on subsequent revalidations', async () => {
    const { calls } = captureFetch()
    const { result, rerender } = renderHook(
      ({ url }: { url: string }) => useFetch<unknown>(url),
      { initialProps: { url: '/v1/iam/users' } },
    )
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    rerender({ url: '/v1/iam/orgs' })
    await waitFor(() => {
      expect(calls.length).toBeGreaterThanOrEqual(2)
    })
    for (const c of calls) {
      expect(c.init?.credentials).toBe('same-origin')
    }
  })
})
