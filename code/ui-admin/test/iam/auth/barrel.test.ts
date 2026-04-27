// Verify the auth bucket barrel exports the documented surface. The
// admin shell consumer imports from `@hanzogui/admin/iam/auth` (or
// the relative path), so a missing/renamed export must surface here
// before downstream apps light up red.

import { describe, expect, it, vi } from 'vitest'

vi.mock('hanzogui', () => ({
  // We don't render anything in this test, but ESM-loading the page
  // modules pulls hanzogui into the import graph. Stub everything as
  // a no-op forward.
  Anchor: () => null,
  Button: () => null,
  Card: () => null,
  Checkbox: Object.assign(() => null, { Indicator: () => null }),
  H2: () => null,
  H3: () => null,
  H4: () => null,
  Input: () => null,
  Label: () => null,
  Paragraph: () => null,
  Select: Object.assign(() => null, {
    Trigger: () => null,
    Value: () => null,
    Content: () => null,
    Viewport: () => null,
    Group: () => null,
    Item: () => null,
    ItemText: () => null,
    Label: () => null,
  }),
  Spinner: () => null,
  Switch: Object.assign(() => null, { Thumb: () => null }),
  Text: () => null,
  TextArea: () => null,
  XStack: () => null,
  YStack: () => null,
}))
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
vi.mock('react-router-dom', () => ({
  Link: () => null,
  useParams: () => ({}),
  useNavigate: () => () => {},
}))

import * as Auth from '../../../src/iam/auth'

describe('auth bucket barrel', () => {
  it('exports every page', () => {
    expect(Auth.AppList).toBeDefined()
    expect(Auth.AppEdit).toBeDefined()
    expect(Auth.ProviderList).toBeDefined()
    expect(Auth.ProviderEdit).toBeDefined()
    expect(Auth.SessionList).toBeDefined()
    expect(Auth.TokenList).toBeDefined()
    expect(Auth.TokenEdit).toBeDefined()
    expect(Auth.CertList).toBeDefined()
    expect(Auth.CertEdit).toBeDefined()
    expect(Auth.KeyList).toBeDefined()
    expect(Auth.KeyEdit).toBeDefined()
  })

  it('exports url helpers + form primitives', () => {
    expect(Auth.authUrl).toBeTypeOf('function')
    expect(Auth.listQuery).toBeTypeOf('function')
    expect(Auth.Field).toBeTypeOf('function')
    expect(Auth.ToggleField).toBeTypeOf('function')
    expect(Auth.SelectField).toBeTypeOf('function')
  })
})
