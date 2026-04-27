// GroupTree cycle-safety tests. The recursive <TreeNode> renderer
// must not crash when the backend returns a self-referential or
// otherwise cyclic group hierarchy (a → b → a). Without protection,
// React unwinds the stack on render. With protection, we render a
// `cycle detected` marker once we revisit a node on the current
// path. The 100-level depth cap is the second line of defence.

import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'

// ---- Stub hanzogui primitives ------------------------------------------

vi.mock('hanzogui', () => {
  const React = require('react') as typeof import('react')
  const pass = (tag: string) =>
    React.forwardRef(function P(props: Record<string, unknown>, ref: unknown) {
      const { children, onPress, onChangeText, ...rest } = props as {
        children?: unknown
        onPress?: () => void
        onChangeText?: (v: string) => void
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
      return React.createElement(
        tag,
        { ref: ref as never, ...safeRest, ...handlers },
        children as never,
      )
    })
  return {
    Button: pass('button'),
    Text: pass('span'),
    XStack: pass('div'),
    YStack: pass('div'),
  }
})

// Lucide icons used by GroupTree.
vi.mock('@hanzogui/lucide-icons-2/icons/Plus', () => ({ Plus: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/Trash2', () => ({ Trash2: () => null }))
vi.mock('@hanzogui/lucide-icons-2/icons/ChevronRight', () => ({
  ChevronRight: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/ChevronDown', () => ({
  ChevronDown: () => null,
}))
vi.mock('@hanzogui/lucide-icons-2/icons/Users', () => ({ Users: () => null }))

// ---- Build cyclic test data -------------------------------------------

import type { Group } from '../../../src/iam/identity/types'
import { TreeNode } from '../../../src/iam/identity/GroupTree'

function makeGroup(name: string, displayName: string, children?: Group[]): Group {
  return {
    owner: 'admin',
    name,
    createdTime: '2026-04-27T00:00:00Z',
    displayName,
    type: 'Virtual',
    parentId: '',
    isTopGroup: false,
    isEnabled: true,
    children,
  }
}

describe('GroupTree.TreeNode cycle handling', () => {
  it('renders a cyclic tree (a → b → a) without stack overflow and emits "cycle detected"', () => {
    // Build a → b → a. Mutate `a.children` after `b` exists so the
    // structural reference forms a true cycle.
    const a = makeGroup('a', 'A')
    const b = makeGroup('b', 'B')
    a.children = [b]
    b.children = [a]

    const expanded = new Set<string>(['admin/a', 'admin/b'])
    const noop = () => {}

    let html = ''
    expect(() => {
      const { container } = render(
        <TreeNode
          node={a}
          depth={0}
          expanded={expanded}
          selected={null}
          onToggle={noop}
          onSelect={noop}
          onAddChild={noop}
          onDelete={noop}
          orgName="admin"
          visited={new Set<string>()}
        />,
      )
      html = container.innerHTML
    }).not.toThrow()

    // The cycle-detected sentinel renders exactly once for the
    // re-entrant `a` node nested under `b`.
    expect(html).toContain('cycle detected')
    expect(html.match(/cycle detected/g)?.length).toBe(1)
  })

  it('flags self-referential nodes (a → a) with "cycle detected"', () => {
    const a = makeGroup('a', 'A')
    a.children = [a]

    const expanded = new Set<string>(['admin/a'])
    const noop = () => {}
    let html = ''

    expect(() => {
      const { container } = render(
        <TreeNode
          node={a}
          depth={0}
          expanded={expanded}
          selected={null}
          onToggle={noop}
          onSelect={noop}
          onAddChild={noop}
          onDelete={noop}
          orgName="admin"
          visited={new Set<string>()}
        />,
      )
      html = container.innerHTML
    }).not.toThrow()

    expect(html).toContain('cycle detected')
  })

  it('truncates linear trees that exceed MAX_DEPTH (100) with "tree truncated"', () => {
    // Build a 105-deep linear chain. Without the cap, this still
    // renders OK because there's no cycle — but the cap is our
    // defence-in-depth against runaway depths from corrupt data or
    // a malicious backend.
    const chain: Group[] = []
    for (let i = 0; i < 105; i++) {
      chain.push(makeGroup(`g${i}`, `G${i}`))
    }
    for (let i = 0; i < chain.length - 1; i++) {
      chain[i]!.children = [chain[i + 1]!]
    }
    const root = chain[0]!

    // Expand every node so the recursion descends fully.
    const expanded = new Set<string>(chain.map((g) => `admin/${g.name}`))
    const noop = () => {}
    let html = ''

    expect(() => {
      const { container } = render(
        <TreeNode
          node={root}
          depth={0}
          expanded={expanded}
          selected={null}
          onToggle={noop}
          onSelect={noop}
          onAddChild={noop}
          onDelete={noop}
          orgName="admin"
          visited={new Set<string>()}
        />,
      )
      html = container.innerHTML
    }).not.toThrow()

    expect(html).toContain('tree truncated')
  })

  it('does NOT emit cycle detected for legitimate sibling subtrees', () => {
    // Sibling rule: distinct nodes at the same depth must not see
    // each other in `visited`. Each sibling carries its own copy of
    // the visited Set; the parent's path is shared, but neither
    // sibling is an ancestor of the other.
    const sib1 = makeGroup('sib1', 'Sib1')
    const sib2 = makeGroup('sib2', 'Sib2')
    const root = makeGroup('root', 'Root', [sib1, sib2])

    const expanded = new Set<string>(['admin/root', 'admin/sib1', 'admin/sib2'])
    const noop = () => {}
    let html = ''

    expect(() => {
      const { container } = render(
        <TreeNode
          node={root}
          depth={0}
          expanded={expanded}
          selected={null}
          onToggle={noop}
          onSelect={noop}
          onAddChild={noop}
          onDelete={noop}
          orgName="admin"
          visited={new Set<string>()}
        />,
      )
      html = container.innerHTML
    }).not.toThrow()

    // Sibling subtrees are independent — never a cycle.
    expect(html).not.toContain('cycle detected')
  })
})
