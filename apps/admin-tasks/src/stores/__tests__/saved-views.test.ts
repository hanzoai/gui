import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSavedViews, savedViewsKey } from '../saved-views'

// bun + jsdom exposes a localStorage object on globalThis but does
// not implement getItem/setItem/removeItem in every harness combo.
// Replace it with an in-memory shim before any hook reads it.
beforeAll(() => {
  const store = new Map<string, string>()
  const shim = {
    get length() {
      return store.size
    },
    key(i: number) {
      return Array.from(store.keys())[i] ?? null
    },
    getItem(k: string) {
      return store.has(k) ? store.get(k)! : null
    },
    setItem(k: string, v: string) {
      store.set(k, String(v))
    },
    removeItem(k: string) {
      store.delete(k)
    },
    clear() {
      store.clear()
    },
  }
  Object.defineProperty(globalThis, 'localStorage', { value: shim, writable: true })
  Object.defineProperty(window, 'localStorage', { value: shim, writable: true })
})

beforeEach(() => {
  localStorage.clear()
})

describe('useSavedViews', () => {
  it('starts empty when nothing is stored', () => {
    const { result } = renderHook(() => useSavedViews('hanzo', 'default'))
    expect(result.current.views).toEqual([])
  })

  it('persists save() to localStorage under the (org, ns) key', () => {
    const { result } = renderHook(() => useSavedViews('hanzo', 'default'))
    act(() => {
      result.current.save({ name: 'Failures', query: 'ExecutionStatus="Failed"' })
    })
    expect(result.current.views).toHaveLength(1)
    expect(result.current.views[0].name).toBe('Failures')
    expect(result.current.views[0].query).toBe('ExecutionStatus="Failed"')

    const raw = localStorage.getItem(savedViewsKey('hanzo', 'default'))
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!) as Array<{ name: string }>
    expect(parsed).toHaveLength(1)
    expect(parsed[0].name).toBe('Failures')
  })

  it('rename() updates the entry without changing id', () => {
    const { result } = renderHook(() => useSavedViews('hanzo', 'default'))
    let id = ''
    act(() => {
      id = result.current.save({ name: 'a', query: 'q' }).id
    })
    act(() => result.current.rename(id, 'b'))
    expect(result.current.views[0].id).toBe(id)
    expect(result.current.views[0].name).toBe('b')
  })

  it('remove() drops the entry', () => {
    const { result } = renderHook(() => useSavedViews('hanzo', 'default'))
    let id = ''
    act(() => {
      id = result.current.save({ name: 'a', query: 'q' }).id
    })
    act(() => result.current.remove(id))
    expect(result.current.views).toEqual([])
  })

  it('isolates by (org, namespace)', () => {
    const a = renderHook(() => useSavedViews('hanzo', 'ns1'))
    const b = renderHook(() => useSavedViews('hanzo', 'ns2'))
    act(() => {
      a.result.current.save({ name: 'in-ns1', query: 'q' })
    })
    expect(a.result.current.views).toHaveLength(1)
    expect(b.result.current.views).toHaveLength(0)
  })

  it('ignores corrupt storage payloads', () => {
    localStorage.setItem(savedViewsKey('hanzo', 'default'), '{not-json')
    const { result } = renderHook(() => useSavedViews('hanzo', 'default'))
    expect(result.current.views).toEqual([])
  })

  it('falls back to Untitled when name is blank', () => {
    const { result } = renderHook(() => useSavedViews('hanzo', 'default'))
    act(() => {
      result.current.save({ name: '   ', query: 'q' })
    })
    expect(result.current.views[0].name).toBe('Untitled view')
  })
})
