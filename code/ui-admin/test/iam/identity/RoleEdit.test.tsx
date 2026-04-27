import { describe, it, expect } from 'vitest'
import { RoleEdit } from '../../../src/iam/identity'

describe('RoleEdit', () => {
  it('exports a function component', () => {
    expect(typeof RoleEdit).toBe('function')
    expect(RoleEdit.name).toBe('RoleEdit')
  })
})
