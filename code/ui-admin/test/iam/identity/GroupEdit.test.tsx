import { describe, it, expect } from 'vitest'
import { GroupEdit } from '../../../src/iam/identity'

describe('GroupEdit', () => {
  it('exports a function component', () => {
    expect(typeof GroupEdit).toBe('function')
    expect(GroupEdit.name).toBe('GroupEdit')
  })
})
