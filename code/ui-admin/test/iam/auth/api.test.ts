import { describe, expect, it } from 'vitest'
import { authUrl, listQuery } from '../../../src/iam/auth/api'

// Smoke tests for the auth bucket URL builders. These pin the wire
// shape so a future refactor that swaps `?p=` for `?page=` (or
// drops `owner` filtering) breaks here first.

describe('authUrl', () => {
  it('mounts under /v1/iam', () => {
    expect(authUrl('applications')).toBe('/v1/iam/applications')
    expect(authUrl('providers')).toBe('/v1/iam/providers')
    expect(authUrl('sessions')).toBe('/v1/iam/sessions')
    expect(authUrl('tokens')).toBe('/v1/iam/tokens')
    expect(authUrl('certs')).toBe('/v1/iam/certs')
    expect(authUrl('keys')).toBe('/v1/iam/keys')
  })

  it('strips a leading slash on the path arg', () => {
    expect(authUrl('/applications')).toBe('/v1/iam/applications')
  })

  it('honours an explicit base prefix', () => {
    expect(authUrl('keys', 'https://iam.example.com')).toBe(
      'https://iam.example.com/v1/iam/keys',
    )
  })
})

describe('listQuery', () => {
  it('returns empty string for an empty query', () => {
    expect(listQuery({})).toBe('')
  })

  it('mirrors Casdoor wire params (p / pageSize / owner)', () => {
    expect(listQuery({ page: 2, pageSize: 50, owner: 'admin' })).toBe(
      '?owner=admin&p=2&pageSize=50',
    )
  })

  it('passes through search + sort', () => {
    expect(
      listQuery({
        page: 1,
        pageSize: 20,
        field: 'displayName',
        value: 'frodo',
        sortField: 'createdTime',
        sortOrder: 'descend',
      }),
    ).toBe(
      '?p=1&pageSize=20&field=displayName&value=frodo&sortField=createdTime&sortOrder=descend',
    )
  })

  it('omits undefined params (no `owner=undefined`)', () => {
    expect(listQuery({ page: 1, pageSize: 10 })).toBe('?p=1&pageSize=10')
  })
})
