// Configurable table column visibility — pure store + hook. One
// canonical key per table (workflows, activities, schedules, batches…)
// drives a localStorage entry under `tasks.columns.${key}`. The hook
// returns the active column subset plus mutators; the drawer component
// renders the toggles. No table itself reaches into localStorage.
//
// Persistence shape: a single string[] of column keys, in the order
// they should render. Unknown keys are ignored on read so the schema
// can evolve without invalidating the user's choice.
//
// Tier 1A (workflow / schedule / batch tables) and Tier 1B (activity
// table) wire this in by declaring a `TableColumn[]` next to their
// table component and rendering <ColumnSettingsButton storageKey=…/>.

import { useCallback, useEffect, useState } from 'react'
import type { TableColumn } from '../lib/types'

const STORAGE_PREFIX = 'tasks.columns.'

function storageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`
}

function defaultsOf(columns: TableColumn[]): string[] {
  return columns.filter((c) => c.default).map((c) => c.key)
}

// readVisible — returns the persisted set or null when no choice is
// stored. Falls back gracefully when localStorage is unavailable
// (SSR, sandboxed iframe, privacy mode).
export function readVisible(key: string): string[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(storageKey(key))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.filter((v): v is string => typeof v === 'string')
  } catch {
    return null
  }
}

// writeVisible — persists or clears the visibility set. Passing
// `null` removes the entry, restoring the column defaults on reload.
export function writeVisible(key: string, value: string[] | null): void {
  if (typeof window === 'undefined') return
  try {
    if (value === null) {
      window.localStorage.removeItem(storageKey(key))
    } else {
      window.localStorage.setItem(storageKey(key), JSON.stringify(value))
    }
  } catch {
    // ignore — quota exceeded / disabled storage
  }
}

// resolve — given the stored set + the descriptor list, return the
// ordered list of columns that should currently render. Preserves
// the descriptor's declared order; ignores unknown stored keys; falls
// back to the descriptor's `default: true` columns when nothing is
// stored. Always returns at least one column so the table is never
// empty (the first column is forced visible if the user toggled all
// off).
export function resolveVisible(
  columns: TableColumn[],
  stored: string[] | null,
): TableColumn[] {
  const allow = stored == null ? new Set(defaultsOf(columns)) : new Set(stored)
  let out = columns.filter((c) => allow.has(c.key))
  if (out.length === 0 && columns.length > 0) out = [columns[0]]
  return out
}

export interface UseTableColumns {
  // All columns in their declared order (for the drawer).
  all: TableColumn[]
  // The currently visible subset, in declared order.
  visible: TableColumn[]
  // Quick lookup used by tables: is the column with this key visible?
  isVisible: (key: string) => boolean
  // Toggle one column.
  toggle: (key: string) => void
  // Replace the entire visibility set (drawer "select-all" / "clear").
  setVisible: (keys: string[]) => void
  // Restore the descriptor's defaults and clear localStorage.
  reset: () => void
}

// useTableColumns — the table-side hook. The descriptor list is the
// source of truth for available columns; the persisted set decides
// which subset shows. Hot-reload safe: when the descriptor changes
// the next render rolls forward without dropping the user's choice.
export function useTableColumns(
  key: string,
  columns: TableColumn[],
): UseTableColumns {
  const [stored, setStored] = useState<string[] | null>(() => readVisible(key))

  // Re-read when the storage key changes (key includes namespace, so a
  // namespace switch reloads the right preference).
  useEffect(() => {
    setStored(readVisible(key))
  }, [key])

  const visible = resolveVisible(columns, stored)
  const visibleKeys = new Set(visible.map((c) => c.key))

  const setVisible = useCallback(
    (keys: string[]) => {
      // Constrain to known column keys, preserving descriptor order so
      // the persisted list is stable across reloads.
      const known = new Set(columns.map((c) => c.key))
      const next = columns.map((c) => c.key).filter((k) => keys.includes(k) && known.has(k))
      writeVisible(key, next)
      setStored(next)
    },
    [columns, key],
  )

  const toggle = useCallback(
    (k: string) => {
      const has = visibleKeys.has(k)
      const next = has
        ? visible.filter((c) => c.key !== k).map((c) => c.key)
        : [...visible.map((c) => c.key), k]
      setVisible(next)
    },
    [setVisible, visible, visibleKeys],
  )

  const reset = useCallback(() => {
    writeVisible(key, null)
    setStored(null)
  }, [key])

  return {
    all: columns,
    visible,
    isVisible: (k) => visibleKeys.has(k),
    toggle,
    setVisible,
    reset,
  }
}
