import { describe, it, expect } from 'vitest'
import { UserList } from '../../../src/iam/identity'

describe('UserList', () => {
  it('exports a function component', () => {
    expect(typeof UserList).toBe('function')
    expect(UserList.name).toBe('UserList')
  })
})
