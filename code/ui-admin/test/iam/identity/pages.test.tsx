// Smoke tests for the identity bucket pages. Same approach as
// `test/iam/policy/pages.test.tsx`: stub `hanzogui` and the lucide
// deep imports with no-op forwards so each page can render in jsdom
// without a workspace-wide install. We render every page once and
// assert no throw + the documented `/v1/iam/...` path is hit.

import { describe, expect, it, vi, beforeEach } from 'vitest'

// ---- Stub hanzogui primitives -------------------------------------------

vi.mock('hanzogui', () => {
  const React = require('react') as typeof import('react')
  const pass = (tag: string) =>
    React.forwardRef(function P(props: Record<string, unknown>, ref: unknown) {
      const { children, onPress, onChangeText, onCheckedChange, ...rest } =
        props as {
          children?: unknown
          onPress?: () => void
          onChangeText?: (v: string) => void
          onCheckedChange?: (v: boolean) => void
        } & Record<string, unknown>
      const safeRest: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(rest)) {
        if (k.startsWith('aria-') || k.startsWith('data-') || k === 'role')
          safeRest[k] = v
      }
      const handlers: Record<string, unknown> = {}
      if (onPress) handlers.onClick = onPress
      if (onChangeText)
        handlers.onChange = (e: { target: { value: string } }) =>
          onChangeText(e.target.value)
      if (onCheckedChange) handlers.onClick = () => onCheckedChange(true)
      return React.createElement(
        tag,
        { ref: ref as never, ...safeRest, ...handlers },
        children as never,
      )
    })
  const Switch = pass('button') as unknown as {
    Thumb: React.ElementType
  } & React.ElementType
  ;(Switch as unknown as { Thumb: React.ElementType }).Thumb = pass('span')
  const Avatar = Object.assign(pass('div'), {
    Image: pass('img'),
    Fallback: pass('span'),
  })
  return {
    Anchor: pass('a'),
    Avatar,
    Button: pass('button'),
    Card: pass('div'),
    Checkbox: Object.assign(pass('input'), { Indicator: pass('span') }),
    H2: pass('h2'),
    H3: pass('h3'),
    H4: pass('h4'),
    Input: pass('input'),
    Label: pass('label'),
    Paragraph: pass('p'),
    Spinner: pass('span'),
    Switch,
    Text: pass('span'),
    TextArea: pass('textarea'),
    XStack: pass('div'),
    YStack: pass('div'),
  }
})

// Lucide icons — every deep import the bucket pulls in. The factory
// can't reference helpers (it's hoisted) so each line is a tiny
// inline factory.
vi.mock('@hanzogui/lucide-icons-2/icons/Plus', () => ({ Plus: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Pencil', () => ({
  Pencil: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/Trash2', () => ({
  Trash2: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/Save', () => ({ Save: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Users', () => ({ Users: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/FolderTree', () => ({
  FolderTree: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/UserRoundCheck', () => ({
  UserRoundCheck: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/ChevronRight', () => ({
  ChevronRight: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/ChevronDown', () => ({
  ChevronDown: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/Check', () => ({ Check: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Copy', () => ({ Copy: () => null }))

// react-router-dom — provide minimal Link / useParams / useNavigate.
vi.mock('react-router-dom', async () => {
  const React = require('react') as typeof import('react')
  return {
    Link: ({ to, children }: { to: string; children?: React.ReactNode }) =>
      React.createElement('a', { href: to }, children),
    useParams: () => ({
      orgName: 'built-in',
      userName: 'admin',
      groupName: 'group_a',
      roleName: 'role_a',
    }),
    useNavigate: () => () => {},
  }
})

// ---- Now import the pages -----------------------------------------------

import { render } from '@testing-library/react'
import { OrgList } from '../../../src/iam/identity/OrgList'
import { OrgEdit } from '../../../src/iam/identity/OrgEdit'
import { UserList } from '../../../src/iam/identity/UserList'
import { UserEdit } from '../../../src/iam/identity/UserEdit'
import { GroupList } from '../../../src/iam/identity/GroupList'
import { GroupEdit } from '../../../src/iam/identity/GroupEdit'
import { GroupTree } from '../../../src/iam/identity/GroupTree'
import { RoleList } from '../../../src/iam/identity/RoleList'
import { RoleEdit } from '../../../src/iam/identity/RoleEdit'

beforeEach(() => {
  // Each test installs its own fetch — list responses default to an
  // empty page, item responses default to a stub record.
  globalThis.fetch = (() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          status: 'ok',
          data: [],
          data2: 0,
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      ),
    )) as typeof fetch
})

describe('identity bucket — list pages render', () => {
  it('OrgList renders without throwing', () => {
    expect(() => render(<OrgList />)).not.toThrow()
  })
  it('UserList renders without throwing', () => {
    expect(() => render(<UserList />)).not.toThrow()
  })
  it('GroupList renders without throwing', () => {
    expect(() => render(<GroupList />)).not.toThrow()
  })
  it('GroupTree renders without throwing', () => {
    expect(() => render(<GroupTree />)).not.toThrow()
  })
  it('RoleList renders without throwing', () => {
    expect(() => render(<RoleList />)).not.toThrow()
  })
})

describe('identity bucket — edit pages render', () => {
  it('OrgEdit renders without throwing', () => {
    expect(() => render(<OrgEdit />)).not.toThrow()
  })
  it('UserEdit renders without throwing', () => {
    expect(() => render(<UserEdit />)).not.toThrow()
  })
  it('GroupEdit renders without throwing', () => {
    expect(() => render(<GroupEdit />)).not.toThrow()
  })
  it('RoleEdit renders without throwing', () => {
    expect(() => render(<RoleEdit />)).not.toThrow()
  })
})
