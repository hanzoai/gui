// IAM groups — tree view. Ports `web/src/GroupTreePage.tsx`. The
// upstream page used Ant Design `<Tree>`, which we don't have in
// hanzogui. We render an indented list of recursive `<TreeNode>`
// components — same affordances (expand/collapse, select, add child,
// delete) without the framework dependency.
//
// Cycle handling: the backend builds the tree from `parentId`
// pointers; a malformed or compromised response can produce a self-
// referential cycle (a → b → a) that would blow the JS stack on
// recursive render. We pass a `visited` set down through the
// recursion and refuse to descend into a node whose key we've
// already seen on the path. A 100-level depth cap is the second
// line of defence (real org trees never go that deep).

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { Users } from '@hanzogui/lucide-icons-2/icons/Users'
import { Empty, ErrorState, Loading } from '../../primitives'
import { PageShell } from '../../shell'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { Group, IamListResponse } from './types'
import { iamUrl, listQuery } from './api'

// MAX_DEPTH — defence-in-depth alongside cycle detection. A real
// IAM group tree never goes 100 levels; anything deeper is server
// corruption or a probe. Stop rendering, surface a one-line marker.
const MAX_DEPTH = 100

interface RouteParams {
  orgName: string
  [key: string]: string | undefined
}

// Exported so the cycle/depth-cap behaviour can be unit-tested
// without booting the react-router + IAM API stack.
export function TreeNode({
  node,
  depth,
  expanded,
  selected,
  onToggle,
  onSelect,
  onAddChild,
  onDelete,
  orgName,
  visited,
}: {
  node: Group
  depth: number
  expanded: ReadonlySet<string>
  selected: string | null
  onToggle: (key: string) => void
  onSelect: (key: string) => void
  onAddChild: (parent: Group) => void
  onDelete: (g: Group) => void
  orgName: string
  visited: ReadonlySet<string>
}) {
  const key = `${node.owner}/${node.name}`
  const isOpen = expanded.has(key)
  const isSelected = selected === key
  const children = node.children ?? []

  // Cycle: this key already appears on the current path. Render an
  // inline marker and stop — never recurse, never crash the page.
  if (visited.has(key)) {
    return (
      <Text
        py="$1.5"
        pl={`${12 + depth * 18}px` as never}
        color="$placeholderColor"
        fontSize="$2"
      >
        cycle detected
      </Text>
    )
  }

  // Depth cap: the recursion exceeded what any real tree can be.
  // Stop here. If a server keeps producing depth-101 trees, the
  // operator notices the marker.
  if (depth >= MAX_DEPTH) {
    return (
      <Text
        py="$1.5"
        pl={`${12 + depth * 18}px` as never}
        color="$placeholderColor"
        fontSize="$2"
      >
        tree truncated
      </Text>
    )
  }

  // New Set per descent so siblings don't see each other in `visited`.
  // Only nodes on the current path (root → this node) belong there.
  const childVisited = new Set(visited)
  childVisited.add(key)

  return (
    <YStack>
      <XStack
        items="center"
        gap="$2"
        py="$1.5"
        px="$2"
        rounded="$2"
        bg={
          isSelected
            ? ('rgba(59,130,246,0.06)' as never)
            : ('transparent' as never)
        }
        hoverStyle={{ background: 'rgba(255,255,255,0.04)' }}
        pl={`${12 + depth * 18}px` as never}
      >
        <Button
          size="$1"
          chromeless
          onPress={() => onToggle(key)}
          disabled={children.length === 0}
        >
          {children.length === 0 ? (
            <Text width={14} color="$placeholderColor">
              ·
            </Text>
          ) : isOpen ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )}
        </Button>
        <Text
          flex={1}
          color="$color"
          fontWeight={isSelected ? '600' : '400'}
          onPress={() => onSelect(key)}
          cursor="pointer"
        >
          {node.displayName || node.name}
        </Text>
        <Button
          size="$1"
          chromeless
          onPress={() => onSelect(key)}
          icon={<Users size={12} />}
          aria-label="View users in group"
        />
        <Button
          size="$1"
          chromeless
          onPress={() => onAddChild(node)}
          icon={<Plus size={12} />}
          aria-label="Add child group"
        />
        <Button
          size="$1"
          chromeless
          onPress={() => onDelete(node)}
          icon={<Trash2 size={12} />}
          aria-label="Delete group"
        />
      </XStack>
      {isOpen && children.length > 0 ? (
        <YStack>
          {children.map((c) => (
            <TreeNode
              key={`${c.owner}/${c.name}`}
              node={c}
              depth={depth + 1}
              expanded={expanded}
              selected={selected}
              onToggle={onToggle}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onDelete={onDelete}
              orgName={orgName}
              visited={childVisited}
            />
          ))}
        </YStack>
      ) : null}
    </YStack>
  )
}

export function GroupTree() {
  const { orgName } = useParams() as RouteParams
  const nav = useNavigate()
  const url = orgName
    ? `${iamUrl('groups')}${listQuery({ owner: orgName, page: 1, pageSize: 500 })}&withTree=true`
    : null

  const { data, error, isLoading, mutate } =
    useFetch<IamListResponse<Group>>(url)

  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<string | null>(null)

  const onToggle = (k: string) =>
    setExpanded((s) => {
      const next = new Set(s)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })

  const onAddChild = async (parent: Group | null) => {
    if (!orgName) return
    const suffix = Math.random().toString(36).slice(2, 8)
    const isRoot = parent === null
    await apiPost(iamUrl('groups'), {
      owner: orgName,
      name: `group_${suffix}`,
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString(),
      displayName: `New Group - ${suffix}`,
      type: 'Virtual',
      parentId: isRoot ? orgName : parent.name,
      isTopGroup: isRoot,
      isEnabled: true,
    })
    await mutate()
  }

  const onDelete = async (g: Group) => {
    if (!window.confirm(`Delete group "${g.displayName || g.name}"?`)) return
    await apiDelete(iamUrl(`groups/${g.owner}/${g.name}`))
    await mutate()
  }

  if (error) {
    return (
      <PageShell>
        <ErrorState error={error} />
      </PageShell>
    )
  }

  if (isLoading || !data) {
    return (
      <PageShell>
        <Loading label="Loading group tree" />
      </PageShell>
    )
  }

  const tree = data.data ?? []

  return (
    <PageShell>
      <XStack items="center" justify="space-between">
        <Text fontSize="$8" fontWeight="700" color="$color">
          Group tree
          <Text fontSize="$5" color="$placeholderColor" fontWeight="400">
            {' '}
            · {orgName}
          </Text>
        </Text>
        <XStack gap="$2">
          <Button
            size="$3"
            onPress={() => onAddChild(null)}
            icon={<Plus size={14} />}
          >
            Add root group
          </Button>
          <Button
            size="$3"
            chromeless
            onPress={() => nav(`/iam/orgs/${orgName}/groups`)}
          >
            Flat view
          </Button>
        </XStack>
      </XStack>

      {tree.length === 0 ? (
        <Empty
          title="No groups yet"
          hint={`Add your first group to "${orgName}".`}
        />
      ) : (
        <YStack gap="$1" borderWidth={1} borderColor="$borderColor" rounded="$3" p="$2">
          {tree.map((n) => (
            <TreeNode
              key={`${n.owner}/${n.name}`}
              node={n}
              depth={0}
              expanded={expanded}
              selected={selected}
              onToggle={onToggle}
              onSelect={setSelected}
              onAddChild={(p) => onAddChild(p)}
              onDelete={onDelete}
              orgName={orgName ?? ''}
              visited={new Set<string>()}
            />
          ))}
        </YStack>
      )}
    </PageShell>
  )
}
