// Smoke tests for the policy bucket pages. We stub `hanzogui`
// and the lucide deep imports with no-op forwards so the pages
// can render in jsdom without a workspace-wide install. Tests
// assert the URL contract (each list page hits the documented
// /v1/iam/* path) and the "valid model = no errors banner"
// invariant for AuthzEditor.

import { describe, expect, it, vi, beforeEach } from 'vitest'

// ---- Stub hanzogui primitives -------------------------------------------
//
// Each primitive renders a div with role + data-testid so RTL
// assertions can find it. Forwarded refs are honoured for
// AuthzEditor's textarea ref.

vi.mock('hanzogui', () => {
  const React = require('react') as typeof import('react')
  const passthrough = (tag: string) =>
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
      if (onCheckedChange)
        handlers.onClick = () => onCheckedChange(true)
      return React.createElement(
        tag,
        { ref: ref as never, ...safeRest, ...handlers },
        children as never,
      )
    })
  const Switch = passthrough('button') as unknown as {
    Thumb: React.ElementType
  } & React.ElementType
  ;(Switch as unknown as { Thumb: React.ElementType }).Thumb = passthrough('span')
  return {
    Button: passthrough('button'),
    H3: passthrough('h3'),
    Input: passthrough('input'),
    Spinner: passthrough('span'),
    Switch,
    TextArea: passthrough('textarea'),
    Text: passthrough('span'),
    XStack: passthrough('div'),
    YStack: passthrough('div'),
    Card: passthrough('div'),
    Checkbox: Object.assign(passthrough('input'), {
      Indicator: passthrough('span'),
    }),
    Paragraph: passthrough('p'),
    Popover: Object.assign(passthrough('div'), {
      Trigger: passthrough('div'),
      Content: passthrough('div'),
    }),
  }
})

// Lucide icons — render nothing. Each factory is self-contained
// because vi.mock hoists; closure over a top-level helper is not
// allowed.
vi.mock('@hanzogui/lucide-icons-2/icons/Plus', () => ({ Plus: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Pencil', () => ({ Pencil: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Trash2', () => ({ Trash2: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/ChevronLeft', () => ({
  ChevronLeft: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/ChevronRight', () => ({
  ChevronRight: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/AlertTriangle', () => ({
  AlertTriangle: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/CheckCircle2', () => ({
  CheckCircle2: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/Search', () => ({ Search: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/HelpCircle', () => ({
  HelpCircle: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/Check', () => ({ Check: () => null }))

// ---- Now import the pages -----------------------------------------------

import { render, screen } from '@testing-library/react'
import { AdapterList } from '../../../src/iam/policy/AdapterList'
import { AuthzEditor } from '../../../src/iam/policy/AuthzEditor'
import { EnforcerList } from '../../../src/iam/policy/EnforcerList'
import { ModelList } from '../../../src/iam/policy/ModelList'
import { PermissionList } from '../../../src/iam/policy/PermissionList'

// Track every URL the page asks for so we can assert routing.
let lastUrl: string | null = null
function makeFetcher(payload: unknown) {
  return (url: string): Promise<unknown> => {
    lastUrl = url
    return Promise.resolve(payload)
  }
}

beforeEach(() => {
  lastUrl = null
})

describe('list pages — URL contract', () => {
  it('PermissionList hits /v1/iam/permissions', async () => {
    const fetcher = makeFetcher({ status: 'ok', data: [], data2: 0 })
    render(
      <PermissionList
        owner="hanzo"
        onEdit={() => {}}
        onAdd={() => {}}
        fetcher={fetcher}
      />,
    )
    await screen.findByText(/Permissions/)
    expect(lastUrl).toMatch(/^\/v1\/iam\/permissions\?/)
    expect(lastUrl).toContain('owner=hanzo')
  })

  it('ModelList hits /v1/iam/models', async () => {
    const fetcher = makeFetcher({ status: 'ok', data: [], data2: 0 })
    render(
      <ModelList
        owner="hanzo"
        onEdit={() => {}}
        onAdd={() => {}}
        fetcher={fetcher}
      />,
    )
    await screen.findByText(/Models/)
    expect(lastUrl).toMatch(/^\/v1\/iam\/models\?/)
  })

  it('EnforcerList hits /v1/iam/enforcers', async () => {
    const fetcher = makeFetcher({ status: 'ok', data: [], data2: 0 })
    render(
      <EnforcerList
        owner="hanzo"
        onEdit={() => {}}
        onAdd={() => {}}
        fetcher={fetcher}
      />,
    )
    await screen.findByText(/Enforcers/)
    expect(lastUrl).toMatch(/^\/v1\/iam\/enforcers\?/)
  })

  it('AdapterList hits /v1/iam/adapters', async () => {
    const fetcher = makeFetcher({ status: 'ok', data: [], data2: 0 })
    render(
      <AdapterList
        owner="hanzo"
        onEdit={() => {}}
        onAdd={() => {}}
        fetcher={fetcher}
      />,
    )
    await screen.findByText(/Adapters/)
    expect(lastUrl).toMatch(/^\/v1\/iam\/adapters\?/)
  })
})

describe('AuthzEditor', () => {
  const VALID = `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act`

  it('renders OK banner for a valid model', () => {
    render(<AuthzEditor value={VALID} onChange={() => {}} />)
    expect(screen.getByText(/Model OK/)).toBeTruthy()
  })

  it('renders error banner with count for invalid input', () => {
    render(<AuthzEditor value="garbage" onChange={() => {}} />)
    // Plain "garbage" violates: outside-section + 4 missing sections
    // = at least 1 issue; banner reads "N issues".
    const banner = screen.getByText(/issue/i)
    expect(banner.textContent).toMatch(/\d+ issue/)
  })
})
