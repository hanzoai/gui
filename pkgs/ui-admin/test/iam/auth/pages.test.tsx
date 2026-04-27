// Smoke tests for the auth bucket pages. Mirrors the identity-bucket
// approach: stub `hanzogui` and lucide deep imports with no-op
// forwards so each page renders in jsdom without a workspace install.
// We render every page once and assert no-throw + the documented
// `/v1/iam/...` path is hit.

import { describe, expect, it, vi, beforeEach } from 'vitest'

// ---- Stub hanzogui primitives ------------------------------------------

vi.mock('hanzogui', () => {
  const React = require('react') as typeof import('react')
  const pass = (tag: string) =>
    React.forwardRef(function P(props: Record<string, unknown>, ref: unknown) {
      const { children, onPress, onChangeText, onCheckedChange, onValueChange, ...rest } =
        props as {
          children?: unknown
          onPress?: () => void
          onChangeText?: (v: string) => void
          onCheckedChange?: (v: boolean) => void
          onValueChange?: (v: string) => void
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
      if (onValueChange) handlers.onChange = (e: { target: { value: string } }) =>
        onValueChange(e.target.value)
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
  const Select = Object.assign(pass('div'), {
    Trigger: pass('button'),
    Value: pass('span'),
    Content: pass('div'),
    Viewport: pass('div'),
    Group: pass('div'),
    Item: pass('div'),
    ItemText: pass('span'),
    Label: pass('label'),
  })
  return {
    Anchor: pass('a'),
    Button: pass('button'),
    Card: pass('div'),
    Checkbox: Object.assign(pass('input'), { Indicator: pass('span') }),
    H2: pass('h2'),
    H3: pass('h3'),
    H4: pass('h4'),
    Input: pass('input'),
    Label: pass('label'),
    Paragraph: pass('p'),
    Select,
    Spinner: pass('span'),
    Switch,
    Text: pass('span'),
    TextArea: pass('textarea'),
    XStack: pass('div'),
    YStack: pass('div'),
  }
})

// Lucide deep imports — every icon the auth bucket pulls in.
vi.mock('@hanzogui/lucide-icons-2/icons/Plus', () => ({ Plus: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Pencil', () => ({ Pencil: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Trash2', () => ({ Trash2: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Save', () => ({ Save: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Copy', () => ({ Copy: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Check', () => ({ Check: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/X', () => ({ X: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Eye', () => ({ Eye: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/EyeOff', () => ({ EyeOff: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Lock', () => ({ Lock: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/RefreshCw', () => ({
  RefreshCw: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/ChevronDown', () => ({
  ChevronDown: () => null,
}))

// react-router-dom — provide minimal Link / useParams / useNavigate.
vi.mock('react-router-dom', async () => {
  const React = require('react') as typeof import('react')
  return {
    Link: ({ to, children }: { to: string; children?: React.ReactNode }) =>
      React.createElement('a', { href: to }, children),
    useParams: () => ({
      organizationName: 'admin',
      applicationName: 'app-hanzo',
      providerName: 'oidc-hanzo',
      tokenName: 'tok_1',
      certName: 'cert-hanzo',
      keyName: 'key_1',
    }),
    useNavigate: () => () => {},
  }
})

// ---- Now import the pages ----------------------------------------------

import { render } from '@testing-library/react'
import { AppList } from '../../../src/iam/auth/AppList'
import { AppEdit } from '../../../src/iam/auth/AppEdit'
import { ProviderList } from '../../../src/iam/auth/ProviderList'
import { ProviderEdit } from '../../../src/iam/auth/ProviderEdit'
import { SessionList } from '../../../src/iam/auth/SessionList'
import { TokenList } from '../../../src/iam/auth/TokenList'
import { TokenEdit } from '../../../src/iam/auth/TokenEdit'
import { CertList } from '../../../src/iam/auth/CertList'
import { CertEdit } from '../../../src/iam/auth/CertEdit'
import { KeyList } from '../../../src/iam/auth/KeyList'
import { KeyEdit } from '../../../src/iam/auth/KeyEdit'

beforeEach(() => {
  // Each test installs its own fetch — list responses default to an
  // empty page, item responses default to a stub record.
  globalThis.fetch = ((url: string) => {
    // Item endpoints (ending in /<name>) need a `data` object so the
    // edit pages don't crash on `data.data` being null. We seed a
    // minimal record matching whatever bucket the path hits.
    const isItem = /\/(applications|providers|sessions|tokens|certs|keys)\/[^/]+\/?[^/]*$/.test(
      url,
    )
    const stubRecord = {
      owner: 'admin',
      name: 'item',
      createdTime: '2026-04-27T00:00:00Z',
      organization: 'admin',
      displayName: 'Stub',
      category: 'OIDC',
      type: 'x509',
      scope: 'JWT',
      cryptoAlgorithm: 'RS256',
      bitSize: 4096,
      expireInYears: 20,
      state: 'Active',
      accessKey: 'hk-stub',
      sessionId: [],
    }
    return Promise.resolve(
      new Response(
        JSON.stringify(
          isItem
            ? { status: 'ok', data: stubRecord }
            : { status: 'ok', data: [], data2: 0 },
        ),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    )
  }) as typeof fetch
})

describe('auth bucket — list pages render', () => {
  it('AppList renders without throwing', () => {
    expect(() => render(<AppList />)).not.toThrow()
  })
  it('ProviderList renders without throwing', () => {
    expect(() => render(<ProviderList />)).not.toThrow()
  })
  it('SessionList renders without throwing', () => {
    expect(() => render(<SessionList />)).not.toThrow()
  })
  it('TokenList renders without throwing', () => {
    expect(() => render(<TokenList />)).not.toThrow()
  })
  it('CertList renders without throwing', () => {
    expect(() => render(<CertList />)).not.toThrow()
  })
  it('KeyList renders without throwing', () => {
    expect(() => render(<KeyList />)).not.toThrow()
  })
})

describe('auth bucket — edit pages render', () => {
  it('AppEdit renders without throwing', () => {
    expect(() => render(<AppEdit />)).not.toThrow()
  })
  it('ProviderEdit renders without throwing', () => {
    expect(() => render(<ProviderEdit />)).not.toThrow()
  })
  it('TokenEdit renders without throwing', () => {
    expect(() => render(<TokenEdit />)).not.toThrow()
  })
  it('CertEdit renders without throwing', () => {
    expect(() => render(<CertEdit />)).not.toThrow()
  })
  it('KeyEdit renders without throwing', () => {
    expect(() => render(<KeyEdit />)).not.toThrow()
  })
})
