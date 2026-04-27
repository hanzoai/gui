import { describe, it, expect } from 'vitest'
import { OrgEdit } from '../../../src/iam/identity'

describe('OrgEdit', () => {
  it('exports a function component', () => {
    expect(typeof OrgEdit).toBe('function')
    expect(OrgEdit.name).toBe('OrgEdit')
  })
})
