import { beforeEach, describe, expect, it } from 'vitest'
import { readVisible, writeVisible, resolveVisible } from '../table-columns'
import type { TableColumn } from '../../lib/types'

const COLS: TableColumn[] = [
  { key: 'id', label: 'Workflow ID', default: true },
  { key: 'type', label: 'Type', default: true },
  { key: 'status', label: 'Status', default: true },
  { key: 'startTime', label: 'Started', default: true },
  { key: 'endTime', label: 'Ended', default: false },
  { key: 'taskQueue', label: 'Task queue', default: false },
]

// jsdom in this project ships a partial Storage shim; replace with a
// fresh in-memory map per test so the tests are hermetic regardless
// of the host's localStorage behaviour.
function installFakeStorage() {
  const map = new Map<string, string>()
  const store: Storage = {
    get length() {
      return map.size
    },
    clear() {
      map.clear()
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null
    },
    key(i: number) {
      return Array.from(map.keys())[i] ?? null
    },
    removeItem(key: string) {
      map.delete(key)
    },
    setItem(key: string, value: string) {
      map.set(key, String(value))
    },
  }
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: store,
  })
}

describe('table-columns store', () => {
  beforeEach(() => {
    installFakeStorage()
  })

  it('readVisible returns null when nothing is stored', () => {
    expect(readVisible('workflows')).toBeNull()
  })

  it('writeVisible round-trips a visibility set', () => {
    writeVisible('workflows', ['id', 'type'])
    expect(readVisible('workflows')).toEqual(['id', 'type'])
  })

  it('writeVisible(null) clears the persisted entry', () => {
    writeVisible('workflows', ['id'])
    writeVisible('workflows', null)
    expect(readVisible('workflows')).toBeNull()
  })

  it('resolveVisible falls back to descriptor defaults when nothing is stored', () => {
    const out = resolveVisible(COLS, null)
    expect(out.map((c) => c.key)).toEqual(['id', 'type', 'status', 'startTime'])
  })

  it('resolveVisible respects the stored set', () => {
    const out = resolveVisible(COLS, ['endTime', 'taskQueue'])
    expect(out.map((c) => c.key)).toEqual(['endTime', 'taskQueue'])
  })

  it('resolveVisible preserves descriptor order, ignoring stored order', () => {
    const out = resolveVisible(COLS, ['taskQueue', 'id'])
    expect(out.map((c) => c.key)).toEqual(['id', 'taskQueue'])
  })

  it('resolveVisible drops unknown stored keys', () => {
    const out = resolveVisible(COLS, ['id', 'gone', 'type'])
    expect(out.map((c) => c.key)).toEqual(['id', 'type'])
  })

  it('resolveVisible returns at least one column even when stored is empty', () => {
    const out = resolveVisible(COLS, [])
    expect(out).toHaveLength(1)
    expect(out[0].key).toBe('id')
  })

  it('readVisible recovers from corrupt JSON gracefully', () => {
    window.localStorage.setItem('tasks.columns.workflows', '{not valid')
    expect(readVisible('workflows')).toBeNull()
  })

  it('readVisible filters non-string entries', () => {
    window.localStorage.setItem(
      'tasks.columns.workflows',
      JSON.stringify(['id', 7, null, 'type']),
    )
    expect(readVisible('workflows')).toEqual(['id', 'type'])
  })
})
