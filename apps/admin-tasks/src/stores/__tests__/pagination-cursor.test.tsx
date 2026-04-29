import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCursorPager, pageFromCursor } from '../pagination-cursor'
import type { NextPageToken } from '../../lib/types'

describe('useCursorPager', () => {
  it('fetches the first page on mount', async () => {
    const fetchPage = vi.fn(async (_token: NextPageToken) => ({
      items: [1, 2, 3],
      nextPageToken: null as NextPageToken,
    }))
    const { result } = renderHook(() => useCursorPager(fetchPage))
    await waitFor(() => expect(result.current.items).toEqual([1, 2, 3]))
    expect(result.current.loading).toBe(false)
    expect(result.current.hasMore).toBe(false)
    expect(fetchPage).toHaveBeenCalledTimes(1)
    expect(fetchPage).toHaveBeenCalledWith(null)
  })

  it('appends pages on loadMore and stops at hasMore=false', async () => {
    const pages = [
      { items: [1, 2], nextPageToken: 'p2' as NextPageToken },
      { items: [3, 4], nextPageToken: null as NextPageToken },
    ]
    let i = 0
    const fetchPage = vi.fn(async () => pages[i++])
    const { result } = renderHook(() => useCursorPager(fetchPage))
    await waitFor(() => expect(result.current.items).toEqual([1, 2]))
    expect(result.current.hasMore).toBe(true)

    await act(async () => { await result.current.loadMore() })
    await waitFor(() => expect(result.current.items).toEqual([1, 2, 3, 4]))
    expect(result.current.hasMore).toBe(false)

    // loadMore is a no-op once hasMore is false.
    await act(async () => { await result.current.loadMore() })
    expect(fetchPage).toHaveBeenCalledTimes(2)
  })

  it('captures errors into state', async () => {
    const err = new Error('boom')
    const fetchPage = vi.fn(async () => { throw err })
    const { result } = renderHook(() => useCursorPager(fetchPage))
    await waitFor(() => expect(result.current.error).toBe(err))
    expect(result.current.hasMore).toBe(false)
  })

  it('refresh resets and re-fetches', async () => {
    const fetchPage = vi.fn(async (_t: NextPageToken) => ({
      items: ['a'],
      nextPageToken: null as NextPageToken,
    }))
    const { result } = renderHook(() => useCursorPager(fetchPage))
    await waitFor(() => expect(result.current.items.length).toBe(1))
    await act(async () => { await result.current.refresh() })
    expect(fetchPage).toHaveBeenCalledTimes(2)
    expect(result.current.items).toEqual(['a'])
  })
})

describe('pageFromCursor', () => {
  it('extracts items via selector and resolves nextPageToken priority', () => {
    const cursor = {
      data: { executions: [{ id: 1 }, { id: 2 }], nextPageToken: 'inner' as NextPageToken },
    }
    const page = pageFromCursor(cursor, (b) => (b as { executions: Array<{ id: number }> }).executions)
    expect(page.items).toHaveLength(2)
    expect(page.nextPageToken).toBe('inner')
  })
  it('outer nextPageToken wins over inner', () => {
    const cursor = {
      data: { executions: [], nextPageToken: 'inner' as NextPageToken },
      nextPageToken: 'outer' as NextPageToken,
    }
    const page = pageFromCursor(cursor, (b) => (b as { executions: unknown[] }).executions)
    expect(page.nextPageToken).toBe('outer')
  })
})
