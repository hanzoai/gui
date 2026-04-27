// One smoke test per page, asserts the imported component is a
// valid React element type. Full rendering requires a hanzogui
// Provider + Tamagui theme — that's wired by the admin shell at the
// route level, not in unit tests. The export tests in exports.test.ts
// catch type regressions; this file catches "page named export
// changed" regressions by name+arity.

import { describe, expect, it } from 'vitest'
import { isValidElementType } from 'react-is'

import { OrgList } from '../../../src/iam/identity/OrgList'
import { OrgEdit } from '../../../src/iam/identity/OrgEdit'
import { UserList } from '../../../src/iam/identity/UserList'
import { UserEdit } from '../../../src/iam/identity/UserEdit'
import { GroupList } from '../../../src/iam/identity/GroupList'
import { GroupEdit } from '../../../src/iam/identity/GroupEdit'
import { GroupTree } from '../../../src/iam/identity/GroupTree'
import { RoleList } from '../../../src/iam/identity/RoleList'
import { RoleEdit } from '../../../src/iam/identity/RoleEdit'

const PAGES = {
  OrgList,
  OrgEdit,
  UserList,
  UserEdit,
  GroupList,
  GroupEdit,
  GroupTree,
  RoleList,
  RoleEdit,
}

describe('identity bucket — page exports', () => {
  for (const [name, Page] of Object.entries(PAGES)) {
    it(`${name} is a valid React element type`, () => {
      expect(isValidElementType(Page)).toBe(true)
      // Function name is preserved by the build — guards against
      // accidental default-vs-named export drift.
      expect((Page as { name: string }).name).toBe(name)
    })
  }
})
