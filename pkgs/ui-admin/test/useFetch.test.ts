import { describe, expect, it } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFetch, ApiError } from '../src/data/useFetch'

// Each test injects its own fetcher — no global fetch mock, no
// network. The hook's `fetcher` option is the seam for that.

describe('useFetch', () => {
  it('cancels stale responses via the generation counter', async () => {
    // First call resolves slowly with "stale", second resolves fast
    // with "fresh". When `url` changes, the stale response must be
    // dropped and never written into state.
    const fetcher = (url: string): Promise<unknown> =>
      new Promise((resolve) => {
        if (url === '/slow') setTimeout(() => resolve({ value: 'stale' }), 60)
        else resolve({ value: 'fresh' })
      })

    const { result, rerender } = renderHook(
      ({ url }: { url: string }) => useFetch<{ value: string }>(url, { fetcher }),
      { initialProps: { url: '/slow' } },
    )

    // Swap to /fast before /slow has resolved.
    rerender({ url: '/fast' })

    // Final state must reflect /fast and never flash "stale".
    await waitFor(() => {
      expect(result.current.data).toEqual({ value: 'fresh' })
    })
    // Wait long enough for the slow promise to settle in the
    // background; data must remain 'fresh'.
    await new Promise((r) => setTimeout(r, 100))
    expect(result.current.data).toEqual({ value: 'fresh' })
  })

  it('surfaces non-2xx responses as ApiError', async () => {
    const fetcher = () =>
      Promise.reject(new ApiError(500, { error: 'boom' }, 'boom'))

    const { result } = renderHook(() =>
      useFetch<unknown>('/x', { fetcher }),
    )

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(ApiError)
    })
    expect((result.current.error as ApiError).status).toBe(500)
  })
})
