import { describe, it, expect } from 'vitest'
import { OrgList } from '../../../src/iam/identity'

describe('OrgList', () => {
  it('exports a function component', () => {
    expect(typeof OrgList).toBe('function')
    // Calling the component would require a Hanzo GUI provider + Router;
    // we instead assert the exported value is a renderable function.
    // The full render is exercised by the e2e/integration suite once
    // the admin shell wires it into a route.
    expect(OrgList.name).toBe('OrgList')
  })
})
