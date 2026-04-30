// useCluster — capability gate. The Cluster nav entry and route are
// only meaningful when the engine runs in replicated mode. We probe
// `/v1/tasks/cluster` once per session and cache the result; a 404
// hides the surface, a 200 reveals it.
//
// The cache lives at module scope so every consumer (sidebar nav,
// page, dialog) shares one fetch. A SWR-style refresh is overkill —
// replicator mode is decided at boot and does not flip at runtime.

import { useEffect, useState } from 'react'
import { Cluster, type ClusterStatus } from '../lib/api'

type CacheState =
  | { kind: 'unknown' }
  | { kind: 'loading'; promise: Promise<void> }
  | { kind: 'enabled'; status: ClusterStatus }
  | { kind: 'disabled' }
  | { kind: 'error'; error: Error }

let cache: CacheState = { kind: 'unknown' }
const subscribers = new Set<() => void>()

function notify() {
  for (const s of subscribers) s()
}

async function probe(): Promise<void> {
  try {
    const status = await Cluster.getStatus()
    cache = { kind: 'enabled', status }
  } catch (e) {
    const err = e as { status?: number; message?: string }
    if (err && typeof err === 'object' && err.status === 404) {
      cache = { kind: 'disabled' }
    } else {
      // Treat any other failure as "unavailable" rather than disabled
      // so the UI surfaces the error instead of silently hiding the
      // tab. The Cluster page renders an "unavailable" empty state.
      cache = { kind: 'error', error: e instanceof Error ? e : new Error(String(e)) }
    }
  }
  notify()
}

export interface UseClusterResult {
  // True only when /v1/tasks/cluster returned 200. Sidebar uses this
  // to gate the nav item; the Cluster page uses it to decide between
  // the dashboard and the empty state.
  enabled: boolean
  // True until the first probe completes. Sidebar treats this as
  // "hidden" so the nav does not flicker on first paint.
  loading: boolean
  // Last status payload, or undefined.
  status: ClusterStatus | undefined
  // Any non-404 transport failure during the probe. 404 is recorded
  // as `enabled=false`, not an error.
  error: Error | undefined
  // Force a re-probe (used after a deploy that flipped replicator
  // mode without reloading the SPA).
  refresh: () => Promise<void>
}

export function useCluster(): UseClusterResult {
  const [, setTick] = useState(0)
  useEffect(() => {
    const sub = () => setTick((n) => n + 1)
    subscribers.add(sub)
    if (cache.kind === 'unknown') {
      const p = probe()
      cache = { kind: 'loading', promise: p }
    }
    return () => {
      subscribers.delete(sub)
    }
  }, [])

  const loading = cache.kind === 'unknown' || cache.kind === 'loading'
  const enabled = cache.kind === 'enabled'
  const status = cache.kind === 'enabled' ? cache.status : undefined
  const error = cache.kind === 'error' ? cache.error : undefined

  return {
    enabled,
    loading,
    status,
    error,
    refresh: async () => {
      cache = { kind: 'loading', promise: probe() }
      notify()
      await (cache as { promise: Promise<void> }).promise
    },
  }
}

// Test hook — reset the module-scope cache between unit tests. Not
// exported from the package barrel; the import is only for the test
// file.
export function __resetClusterCacheForTests() {
  cache = { kind: 'unknown' }
  subscribers.clear()
}
