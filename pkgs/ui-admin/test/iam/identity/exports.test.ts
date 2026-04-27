// Smoke tests for the identity bucket. We don't render here — full
// render needs a hanzogui Provider and Tamagui theme stack which the
// admin-shell wires up at the route level. Instead we assert each
// page is a function component (i.e. exports cleanly), and that the
// barrel re-exports align with the package contract.

import { describe, expect, it } from 'vitest'

describe('identity bucket — module exports', () => {
  it('exports every page as a function component', { timeout: 30000 }, async () => {
    // Import each module directly so the shared barrel (which pulls
    // in unrelated buckets) doesn't leak into this test surface.
    const { OrgList } = await import('../../../src/iam/identity/OrgList')
    const { OrgEdit } = await import('../../../src/iam/identity/OrgEdit')
    const { UserList } = await import('../../../src/iam/identity/UserList')
    const { UserEdit } = await import('../../../src/iam/identity/UserEdit')
    const { GroupList } = await import('../../../src/iam/identity/GroupList')
    const { GroupEdit } = await import('../../../src/iam/identity/GroupEdit')
    const { GroupTree } = await import('../../../src/iam/identity/GroupTree')
    const { RoleList } = await import('../../../src/iam/identity/RoleList')
    const { RoleEdit } = await import('../../../src/iam/identity/RoleEdit')
    const { Field, ToggleField } = await import(
      '../../../src/iam/identity/Field'
    )

    for (const c of [
      OrgList,
      OrgEdit,
      UserList,
      UserEdit,
      GroupList,
      GroupEdit,
      GroupTree,
      RoleList,
      RoleEdit,
      Field,
      ToggleField,
    ]) {
      expect(typeof c).toBe('function')
    }

    // Bucket index re-exports the same surface.
    const idx = await import('../../../src/iam/identity')
    expect(typeof idx.OrgList).toBe('function')
    expect(typeof idx.UserList).toBe('function')
    expect(typeof idx.GroupTree).toBe('function')
    expect(typeof idx.RoleEdit).toBe('function')
    expect(typeof idx.iamUrl).toBe('function')
    expect(typeof idx.listQuery).toBe('function')
  })
})
