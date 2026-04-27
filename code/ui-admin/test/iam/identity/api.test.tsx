import { describe, it, expect } from 'vitest'
import { iamUrl, listQuery } from '../../../src/iam/identity'

describe('iam api helpers', () => {
  it('builds /v1/iam/* URLs without double slashes', () => {
    expect(iamUrl('organizations')).toBe('/v1/iam/organizations')
    expect(iamUrl('/users')).toBe('/v1/iam/users')
    expect(iamUrl('groups/built-in/admin')).toBe(
      '/v1/iam/groups/built-in/admin',
    )
  })
  it('serialises list queries deterministically', () => {
    expect(
      listQuery({ owner: 'admin', page: 2, pageSize: 10 }),
    ).toBe('?owner=admin&p=2&pageSize=10')
    expect(listQuery({})).toBe('')
  })
})
