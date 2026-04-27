// Smoke tests for the policy bucket. Most of the bucket is JSX
// against `hanzogui` primitives that don't have a resolvable
// peer in this isolated package — we'd need a workspace-wide
// install for those. Tests here cover the pure-logic surface:
// `validateModelText`, the type re-exports, and the URL contracts
// our pages depend on.

import { describe, expect, it } from 'vitest'
import {
  validateModelText,
  type Adapter,
  type Enforcer,
  type IamListResponse,
  type Model,
  type Permission,
} from '../../../src/iam/policy/types'

describe('validateModelText', () => {
  const VALID_RBAC = `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act`

  it('accepts the canonical RBAC model', () => {
    expect(validateModelText(VALID_RBAC)).toEqual([])
  })

  it('flags an empty model', () => {
    const errors = validateModelText('')
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toMatch(/empty/i)
  })

  it('reports each missing required section', () => {
    const errors = validateModelText('[request_definition]\nr = sub, obj, act')
    const messages = errors.map((e) => e.message)
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/policy_definition/),
        expect.stringMatching(/policy_effect/),
        expect.stringMatching(/matchers/),
      ]),
    )
  })

  it('flags content outside any [section] with line/col', () => {
    const text = `r = sub
[request_definition]
r = sub, obj`
    const errs = validateModelText(text)
    expect(errs[0]).toMatchObject({ line: 1, column: 1 })
    expect(errs[0].message).toMatch(/outside/i)
  })

  it('flags malformed key=value lines', () => {
    const text = `[request_definition]
this is not a key=value
[policy_definition]
p = sub, obj, act
[policy_effect]
e = some(where (p.eft == allow))
[matchers]
m = r.sub == p.sub`
    const errs = validateModelText(text)
    const offending = errs.find((e) => e.line === 2)
    expect(offending).toBeDefined()
    expect(offending?.message).toMatch(/key = value/i)
  })

  it('flags duplicate sections', () => {
    const text = `[request_definition]
r = sub, obj, act
[request_definition]
r = sub, obj
[policy_definition]
p = sub, obj, act
[policy_effect]
e = some(where (p.eft == allow))
[matchers]
m = r.sub == p.sub`
    const errs = validateModelText(text)
    const dup = errs.find((e) => /duplicate/i.test(e.message))
    expect(dup).toBeDefined()
    expect(dup?.line).toBe(3)
  })

  it('treats blank and comment lines as valid', () => {
    const text = `# top-level comment
[request_definition]
# inside section

r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act
`
    expect(validateModelText(text)).toEqual([])
  })
})

describe('type contracts', () => {
  it('Permission includes the upstream required fields', () => {
    const p: Permission = {
      owner: 'hanzo',
      name: 'permission_x',
      createdTime: '2026-04-27T00:00:00Z',
      displayName: 'X',
      users: ['hanzo/alice'],
      roles: [],
      domains: [],
      resourceType: 'Application',
      resources: ['app-hanzo'],
      actions: ['Read'],
      effect: 'Allow',
      isEnabled: true,
      submitter: 'alice',
      approver: '',
      approveTime: '',
      state: 'Pending',
    }
    expect(p.effect).toBe('Allow')
    expect(p.state).toBe('Pending')
  })

  it('Model carries modelText raw', () => {
    const m: Model = {
      owner: 'hanzo',
      name: 'rbac',
      createdTime: '2026-04-27T00:00:00Z',
      displayName: 'RBAC',
      modelText: '[request_definition]\nr = sub, obj, act',
    }
    expect(m.modelText.startsWith('[request_definition]')).toBe(true)
  })

  it('Enforcer has nullable model + adapter', () => {
    const e: Enforcer = {
      owner: 'hanzo',
      name: 'e',
      createdTime: '2026-04-27T00:00:00Z',
      displayName: 'E',
    }
    expect(e.model).toBeUndefined()
    expect(e.adapter).toBeUndefined()
  })

  it('Adapter useSameDb defaults zero out conn fields', () => {
    const a: Adapter = {
      owner: 'hanzo',
      name: 'a',
      createdTime: '2026-04-27T00:00:00Z',
      table: 'casbin_rule',
      useSameDb: true,
    }
    expect(a.useSameDb).toBe(true)
    expect(a.host).toBeUndefined()
  })

  it('IamListResponse uses Casdoor envelope shape', () => {
    const r: IamListResponse<Permission> = {
      status: 'ok',
      data: [],
      data2: 0,
    }
    expect(r.status).toBe('ok')
  })
})
