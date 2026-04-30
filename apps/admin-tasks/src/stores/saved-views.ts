// useSavedViews — per-(org, namespace) localStorage-backed list of
// user-defined saved queries. The system presets in Workflows.tsx
// stay in code; this hook is only the user-customizable layer that
// shows up below the divider in the SavedViewsRail.
//
// Storage shape (one key per org/namespace pair):
//   localStorage["tasks.savedViews.<org>.<ns>"] =
//     [{ id, name, query, createdAt }, ...]
//
// Reads parse-on-mount and on cross-tab `storage` events so two
// browser windows in the same namespace stay in sync. Writes go
// through `setItem` and update local state synchronously so the rail
// reflects the change without waiting for a round-trip.
//
// The hook is intentionally framework-free (no admin SWR dep) — the
// data lives in the browser, not on the server, and revalidation is
// the storage event.

import { useCallback, useEffect, useState } from 'react'

export interface SavedQueryView {
  id: string
  name: string
  query: string
  createdAt: string
}

export interface UseSavedViewsResult {
  views: SavedQueryView[]
  save: (input: { name: string; query: string }) => SavedQueryView
  rename: (id: string, name: string) => void
  remove: (id: string) => void
  clear: () => void
}

export function savedViewsKey(org: string, namespace: string): string {
  return `tasks.savedViews.${org}.${namespace}`
}

function readKey(key: string): SavedQueryView[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isView)
  } catch {
    return []
  }
}

function writeKey(key: string, views: SavedQueryView[]): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(views))
  } catch {
    // Quota exceeded or storage disabled — silently drop. Saved
    // views are a convenience layer; failure to persist is not
    // worth surfacing in the UI.
  }
}

function isView(v: unknown): v is SavedQueryView {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as SavedQueryView).id === 'string' &&
    typeof (v as SavedQueryView).name === 'string' &&
    typeof (v as SavedQueryView).query === 'string' &&
    typeof (v as SavedQueryView).createdAt === 'string'
  )
}

function makeId(): string {
  // crypto.randomUUID is universally available in modern browsers
  // and the test jsdom env. Fallback to a Math.random hex for the
  // edge case where it isn't.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `sv-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`
}

export function useSavedViews(org: string, namespace: string): UseSavedViewsResult {
  const key = savedViewsKey(org, namespace)
  const [views, setViews] = useState<SavedQueryView[]>(() => readKey(key))

  // Re-hydrate on key change (org/namespace switch) and stay in sync
  // across tabs via the `storage` event.
  useEffect(() => {
    setViews(readKey(key))
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setViews(readKey(key))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  const save = useCallback(
    ({ name, query }: { name: string; query: string }): SavedQueryView => {
      const next: SavedQueryView = {
        id: makeId(),
        name: name.trim() || 'Untitled view',
        query,
        createdAt: new Date().toISOString(),
      }
      setViews((cur) => {
        const out = [...cur, next]
        writeKey(key, out)
        return out
      })
      return next
    },
    [key],
  )

  const rename = useCallback(
    (id: string, name: string) => {
      setViews((cur) => {
        const out = cur.map((v) => (v.id === id ? { ...v, name: name.trim() || v.name } : v))
        writeKey(key, out)
        return out
      })
    },
    [key],
  )

  const remove = useCallback(
    (id: string) => {
      setViews((cur) => {
        const out = cur.filter((v) => v.id !== id)
        writeKey(key, out)
        return out
      })
    },
    [key],
  )

  const clear = useCallback(() => {
    setViews(() => {
      writeKey(key, [])
      return []
    })
  }, [key])

  return { views, save, rename, remove, clear }
}
