import { describe, it, expect } from 'vitest'
import { GroupList } from '../../../src/iam/identity'

describe('GroupList', () => {
  it('exports a function component', () => {
    expect(typeof GroupList).toBe('function')
    expect(GroupList.name).toBe('GroupList')
  })
})
