// Minimal SWR replacement. Same surface the tasks UI v2 spike used:
//   - keyed by URL string
//   - returns { data, error, isLoading, isValidating, mutate }
//   - revalidates on focus and on demand
//
// No cross-instance cache. Each `useFetch` owns its data. That's
// enough for list pages and keeps the bundle small. When a consumer
// needs shared cache (e.g. cross-tab dedup) swap this for SWR/react-query
// at the consumer level — don't reinvent it here.

import { useCallback, useEffect, useRef, useState } from 'react'

export class ApiError extends Error {
  constructor(public status: number, public body: unknown, message?: string) {
    super(message ?? `HTTP ${status}`)
    this.name = 'ApiError'
  }
}

export interface FetchOptions {
  // Override the global fetch implementation (useful for tests or
  // for pinning auth headers). Defaults to window.fetch.
  fetcher?: (url: string) => Promise<unknown>
}

const defaultFetcher = async (url: string) => {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  const contentType = res.headers.get('content-type') || ''
  const body: unknown = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null)
  if (!res.ok) {
    const msg =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : `${url} → ${res.status}`
    throw new ApiError(res.status, body, msg)
  }
  return body
}

export interface FetchState<T> {
  data: T | undefined
  error: ApiError | Error | undefined
  isLoading: boolean
  isValidating: boolean
  mutate: () => Promise<void>
}

export function useFetch<T>(url: string | null, options?: FetchOptions): FetchState<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [error, setError] = useState<ApiError | Error | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(url !== null)
  const [isValidating, setIsValidating] = useState(false)
  const generation = useRef(0)

  // The fetcher is held in a ref so that callers passing an inline lambda
  // (e.g. `useFetch(url, { fetcher: (u) => authFetch(u) })`) don't trigger
  // a new `run` identity every render → effect re-fire → setState → render
  // loop. We update the ref each render and read `.current` inside `run`.
  const fetcherRef = useRef<(url: string) => Promise<unknown>>(options?.fetcher ?? defaultFetcher)
  useEffect(() => {
    fetcherRef.current = options?.fetcher ?? defaultFetcher
  })

  const run = useCallback(async () => {
    if (url === null) return
    const my = ++generation.current
    setIsValidating(true)
    try {
      const next = (await fetcherRef.current(url)) as T
      if (my !== generation.current) return
      setData(next)
      setError(undefined)
    } catch (e) {
      if (my !== generation.current) return
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      if (my === generation.current) {
        setIsLoading(false)
        setIsValidating(false)
      }
    }
  }, [url])

  useEffect(() => {
    if (url === null) {
      setData(undefined)
      setError(undefined)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    run()
  }, [url, run])

  // Revalidate when the tab regains focus (matches SWR's default).
  useEffect(() => {
    const onFocus = () => {
      if (url !== null) run()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [run, url])

  return { data, error, isLoading, isValidating, mutate: run }
}

// Generic POST helper. Returns the parsed JSON body or throws
// ApiError on non-2xx.
export async function apiPost<T = unknown>(url: string, payload: unknown): Promise<T> {
  return apiSend<T>('POST', url, payload)
}

export async function apiDelete<T = unknown>(url: string): Promise<T> {
  return apiSend<T>('DELETE', url, undefined)
}

async function apiSend<T>(method: string, url: string, payload: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers:
      payload === undefined
        ? { Accept: 'application/json' }
        : { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  })
  const body: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    const msg =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : `${method} ${url} → ${res.status}`
    throw new ApiError(res.status, body, msg)
  }
  return body as T
}
