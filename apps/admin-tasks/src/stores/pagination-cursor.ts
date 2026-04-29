// useCursorPager — generic cursor pagination hook. Backend convention:
// each list response carries `nextPageToken`. Pass a `fn` that takes
// the optional token and returns the page; the hook accumulates the
// items and exposes loadMore / reset.
//
// Not specialised to any resource. Workflows, schedules, batches, and
// archival queries all share this shape, so they all share this hook.

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Cursor, NextPageToken } from '../lib/types'

export interface CursorPagerState<T> {
  items: T[]
  loading: boolean
  error: Error | null
  hasMore: boolean
  nextPageToken: NextPageToken
  loadMore: () => Promise<void>
  reset: () => void
  refresh: () => Promise<void>
}

// `fetchPage` receives the current page token (null on first call)
// and returns a Cursor<{ items: T[]; nextPageToken?: NextPageToken }>.
// The wrapper exists so feature pages stay declarative — they
// describe the shape of their list, not the pagination plumbing.

export interface PageResult<T> {
  items: T[]
  nextPageToken?: NextPageToken
}

export function useCursorPager<T>(
  fetchPage: (token: NextPageToken) => Promise<PageResult<T>>,
  deps: ReadonlyArray<unknown> = [],
): CursorPagerState<T> {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [token, setToken] = useState<NextPageToken>(null)
  const [hasMore, setHasMore] = useState(true)
  const generation = useRef(0)
  const fetchRef = useRef(fetchPage)
  fetchRef.current = fetchPage

  const reset = useCallback(() => {
    generation.current++
    setItems([])
    setToken(null)
    setHasMore(true)
    setError(null)
  }, [])

  const fetchAt = useCallback(async (forToken: NextPageToken, isReset: boolean) => {
    const my = ++generation.current
    setLoading(true)
    setError(null)
    try {
      const page = await fetchRef.current(forToken)
      if (my !== generation.current) return
      setItems((prev) => (isReset ? page.items : prev.concat(page.items)))
      const next = page.nextPageToken ?? null
      setToken(next)
      setHasMore(Boolean(next))
    } catch (e) {
      if (my !== generation.current) return
      setError(e instanceof Error ? e : new Error(String(e)))
      setHasMore(false)
    } finally {
      if (my === generation.current) setLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    await fetchAt(token, false)
  }, [loading, hasMore, token, fetchAt])

  const refresh = useCallback(async () => {
    reset()
    await fetchAt(null, true)
  }, [reset, fetchAt])

  // First-load + reset on dependency change.
  useEffect(() => {
    reset()
    void fetchAt(null, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { items, loading, error, hasMore, nextPageToken: token, loadMore, reset, refresh }
}

// pageFromCursor — adapter for callers that already have a Cursor<T>
// shape from api.ts. Lets a useCursorPager call a typed API method
// directly without unwrapping data + nextPageToken at every site.
export function pageFromCursor<TItem, TBody extends { nextPageToken?: NextPageToken } & Record<string, unknown>>(
  cursor: Cursor<TBody>,
  selector: (body: TBody) => TItem[],
): PageResult<TItem> {
  return {
    items: selector(cursor.data),
    nextPageToken: cursor.nextPageToken ?? cursor.data.nextPageToken ?? null,
  }
}
