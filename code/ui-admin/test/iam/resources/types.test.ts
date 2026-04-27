import { describe, expect, it } from 'vitest'
import {
  isAdminAccount,
  requestOrg,
  type AdminAccount,
} from '../../../src/iam/resources/types'

// The two helpers are tiny but they gate destructive UI everywhere
// in the bucket. They need to keep returning the same answers as the
// upstream Casdoor `Setting.isAdminUser` / `getRequestOrganization`.

describe('isAdminAccount', () => {
  it('treats the built-in admin org as admin', () => {
    const a: AdminAccount = { owner: 'admin', name: 'satoshi' }
    expect(isAdminAccount(a)).toBe(true)
  })

  it('treats the built-in org as admin', () => {
    const a: AdminAccount = { owner: 'built-in', name: 'satoshi' }
    expect(isAdminAccount(a)).toBe(true)
  })

  it('honors an explicit isAdmin flag', () => {
    const a: AdminAccount = { owner: 'lux', name: 'z', isAdmin: true }
    expect(isAdminAccount(a)).toBe(true)
  })

  it('returns false for a regular org user', () => {
    const a: AdminAccount = { owner: 'lux', name: 'z' }
    expect(isAdminAccount(a)).toBe(false)
  })
})

describe('requestOrg', () => {
  it('returns "" for the default/built-in admin scope', () => {
    expect(requestOrg({ owner: 'admin', name: 'x' })).toBe('')
    expect(requestOrg({ owner: 'built-in', name: 'x' })).toBe('')
    expect(requestOrg({ owner: '', name: 'x' })).toBe('')
  })

  it('returns the owner verbatim for a scoped org', () => {
    expect(requestOrg({ owner: 'lux', name: 'x' })).toBe('lux')
  })
})
