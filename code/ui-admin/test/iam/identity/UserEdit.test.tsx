import { describe, it, expect } from 'vitest'
import { UserEdit } from '../../../src/iam/identity'

describe('UserEdit', () => {
  it('exports a function component', () => {
    expect(typeof UserEdit).toBe('function')
    expect(UserEdit.name).toBe('UserEdit')
  })
})
