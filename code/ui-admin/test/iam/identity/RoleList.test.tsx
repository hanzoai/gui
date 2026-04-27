import { describe, it, expect } from 'vitest'
import { RoleList } from '../../../src/iam/identity'

describe('RoleList', () => {
  it('exports a function component', () => {
    expect(typeof RoleList).toBe('function')
    expect(RoleList.name).toBe('RoleList')
  })
})
