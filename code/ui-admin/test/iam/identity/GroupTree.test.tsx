import { describe, it, expect } from 'vitest'
import { GroupTree } from '../../../src/iam/identity'

describe('GroupTree', () => {
  it('exports a function component', () => {
    expect(typeof GroupTree).toBe('function')
    expect(GroupTree.name).toBe('GroupTree')
  })
})
