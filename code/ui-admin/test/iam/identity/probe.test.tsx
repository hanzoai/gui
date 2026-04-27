import { describe, it, vi } from 'vitest'
vi.mock('hanzogui', () => {
  const React = require('react') as typeof import('react')
  const pass = (tag: string) =>
    React.forwardRef(function P(props: Record<string, unknown>, ref: unknown) {
      const { children } = props
      return React.createElement(tag, { ref: ref as never }, children as never)
    })
  const Switch = pass('button') as unknown as { Thumb: React.ElementType } & React.ElementType
  ;(Switch as unknown as { Thumb: React.ElementType }).Thumb = pass('span')
  const Avatar = Object.assign(pass('div'), { Image: pass('img'), Fallback: pass('span') })
  return { Anchor: pass('a'), Avatar, Button: pass('button'), Card: pass('div'), Checkbox: Object.assign(pass('input'), { Indicator: pass('span') }), H2: pass('h2'), H3: pass('h3'), H4: pass('h4'), Input: pass('input'), Label: pass('label'), Paragraph: pass('p'), Spinner: pass('span'), Switch, Text: pass('span'), TextArea: pass('textarea'), XStack: pass('div'), YStack: pass('div') }
})
vi.mock('@hanzogui/lucide-icons-2/icons/Plus', () => ({ Plus: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Pencil', () => ({ Pencil: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Trash2', () => ({ Trash2: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Users', () => ({ Users: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/FolderTree', () => ({ FolderTree: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Check', () => ({ Check: () => null }))
vi.mock('react-router-dom', async () => {
  const React = require('react') as typeof import('react')
  return { Link: ({ to, children }: any) => React.createElement('a', { href: to }, children), useNavigate: () => () => {}, useParams: () => ({}) }
})
import { render } from '@testing-library/react'
import { OrgList } from '../../../src/iam/identity/OrgList'
describe('probe', () => {
  it('renders OrgList', () => {
    globalThis.fetch = (() => Promise.resolve(new Response(JSON.stringify({ status: 'ok', data: [], data2: 0 }), { status: 200, headers: { 'content-type': 'application/json' } }))) as any
    try { render(<OrgList />); console.log('OK'); } catch (e) { console.log('THREW:', String(e)); throw e }
  })
})
