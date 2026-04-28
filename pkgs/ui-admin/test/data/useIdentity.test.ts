// useIdentity — module-cached hook, tested through its public seam.
// We exercise (a) the predicate `isSuperAdmin`, (b) the fetcher
// override, and (c) the cache reset. Render-side gating is asserted
// in the matching UserEdit test.

import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import {
  __resetIdentityForTests,
  isSuperAdmin,
  useIdentity,
  type Identity,
} from '../../src/data/useIdentity'

afterEach(() => {
  __resetIdentityForTests(null)
  vi.restoreAllMocks()
})

describe('isSuperAdmin', () => {
  it('returns true only for built-in/* admins', () => {
    const root: Identity = {
      owner: 'built-in',
      name: 'admin',
      displayName: 'admin',
      isAdmin: true,
    }
    expect(isSuperAdmin(root)).toBe(true)
  })

  it('rejects org-scoped admins', () => {
    const orgAdmin: Identity = {
      owner: 'hanzo',
      name: 'z',
      displayName: 'Z',
      isAdmin: true,
    }
    expect(isSuperAdmin(orgAdmin)).toBe(false)
  })

  it('rejects non-admins, null, undefined', () => {
    expect(
      isSuperAdmin({
        owner: 'built-in',
        name: 'somebody',
        displayName: 's',
        isAdmin: false,
      }),
    ).toBe(false)
    expect(isSuperAdmin(null)).toBe(false)
    expect(isSuperAdmin(undefined)).toBe(false)
  })
})

describe('useIdentity', () => {
  it('resolves the identity once and caches it', async () => {
    const fetcher = vi.fn(async (): Promise<Identity> => ({
      owner: 'built-in',
      name: 'admin',
      displayName: 'admin',
      isAdmin: true,
    }))
    __resetIdentityForTests(fetcher)

    const { result } = renderHook(() => useIdentity())
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.identity?.name).toBe('admin')

    // Second invocation must reuse the cached promise — fetcher is
    // not called again within the same module lifetime.
    const second = renderHook(() => useIdentity())
    await waitFor(() => {
      expect(second.result.current.isLoading).toBe(false)
    })
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('fails secure when the fetcher rejects', async () => {
    __resetIdentityForTests(async () => {
      throw new Error('network')
    })
    const { result } = renderHook(() => useIdentity())
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    // No identity → isSuperAdmin(null) → false → toggle disabled.
    expect(result.current.identity).toBe(null)
    expect(isSuperAdmin(result.current.identity)).toBe(false)
  })
})
