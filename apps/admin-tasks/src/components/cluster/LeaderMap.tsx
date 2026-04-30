// LeaderMap — visualisation of the (org/ns/taskQueue → nodeId)
// routing map the replicator publishes. The wire payload is a flat
// dictionary; we split keys on the first '/' and group by the
// prefix so an operator can see "this entire org/namespace lives on
// node-3" at a glance. Each group is collapsible.

import { useMemo, useState } from 'react'
import { Card, Text, XStack, YStack } from 'hanzogui'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { Badge, Empty } from '@hanzogui/admin'

export interface LeaderMapProps {
  leaderFor: Record<string, string>
}

interface Group {
  prefix: string
  entries: Array<{ key: string; nodeId: string }>
  // Distinct nodes leading any key in this group. When the group
  // collapses to one node, we render a single chip; otherwise a
  // "split across N" hint.
  nodes: string[]
}

function group(map: Record<string, string>): Group[] {
  const buckets = new Map<string, Group>()
  for (const [key, nodeId] of Object.entries(map)) {
    const slash = key.indexOf('/')
    const prefix = slash === -1 ? key : key.slice(0, slash)
    let g = buckets.get(prefix)
    if (!g) {
      g = { prefix, entries: [], nodes: [] }
      buckets.set(prefix, g)
    }
    g.entries.push({ key, nodeId })
    if (!g.nodes.includes(nodeId)) g.nodes.push(nodeId)
  }
  // Sort groups by entry count desc, then alpha — the heaviest
  // groups deserve top placement, ties broken stably.
  return Array.from(buckets.values()).sort((a, b) => {
    if (b.entries.length !== a.entries.length) return b.entries.length - a.entries.length
    return a.prefix.localeCompare(b.prefix)
  })
}

export function LeaderMap({ leaderFor }: LeaderMapProps) {
  const groups = useMemo(() => group(leaderFor), [leaderFor])
  const [open, setOpen] = useState<Record<string, boolean>>({})
  if (groups.length === 0) {
    return (
      <Empty
        title="No leader mapping"
        hint="The replicator has not yet emitted any shard ownership records."
      />
    )
  }
  return (
    <YStack gap="$2">
      {groups.map((g) => {
        const isOpen = open[g.prefix] === true
        return (
          <Card key={g.prefix} bg="$background" borderColor="$borderColor" borderWidth={1} overflow="hidden">
            <XStack
              px="$4"
              py="$3"
              items="center"
              gap="$3"
              cursor="pointer"
              onPress={() => setOpen((m) => ({ ...m, [g.prefix]: !isOpen }))}
              hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
            >
              {isOpen ? <ChevronDown size={14} color="#7e8794" /> : <ChevronRight size={14} color="#7e8794" />}
              <Text flex={1} fontSize="$3" fontWeight="500" color="$color">
                {g.prefix}
              </Text>
              <Text fontSize="$1" color="$placeholderColor">
                {g.entries.length} {g.entries.length === 1 ? 'shard' : 'shards'}
              </Text>
              {g.nodes.length === 1 ? (
                <Badge variant="muted">{g.nodes[0]}</Badge>
              ) : (
                <Badge variant={'warning' as never}>split · {g.nodes.length} nodes</Badge>
              )}
            </XStack>
            {isOpen ? (
              <YStack borderTopWidth={1} borderTopColor="$borderColor">
                {g.entries.map((e, i) => (
                  <XStack
                    key={e.key}
                    px="$5"
                    py="$2"
                    items="center"
                    borderTopWidth={i === 0 ? 0 : 1}
                    borderTopColor="$borderColor"
                  >
                    <Text flex={1} fontSize="$2" color="$placeholderColor" numberOfLines={1}>
                      {e.key}
                    </Text>
                    <Badge variant="muted">{e.nodeId}</Badge>
                  </XStack>
                ))}
              </YStack>
            ) : null}
          </Card>
        )
      })}
    </YStack>
  )
}
