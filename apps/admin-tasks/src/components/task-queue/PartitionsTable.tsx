// PartitionsTable — per-partition rows for a task queue. The detail
// page polls /partitions every 10s; this component just renders the
// snapshot it's handed and shows compact backlog bars.

import { Card, Text, XStack, YStack } from 'hanzogui'
import { Empty } from '@hanzogui/admin'
import type { TaskQueuePartition } from '../../lib/api'

export interface PartitionRow extends TaskQueuePartition {
  backlogCount?: number
  oldestBacklogAgeSec?: number
}

export interface PartitionsTableProps {
  partitions: PartitionRow[]
}

export function PartitionsTable({ partitions }: PartitionsTableProps) {
  if (partitions.length === 0) {
    return (
      <Empty
        title="No partitions reported"
        hint="The matching service has not surfaced partition stats for this queue yet."
      />
    )
  }
  const maxBacklog = Math.max(1, ...partitions.map((p) => p.backlogCount ?? 0))
  return (
    <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <XStack
        bg={'rgba(255,255,255,0.03)' as never}
        px="$4"
        py="$2.5"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <HeaderCell flex={1}>#</HeaderCell>
        <HeaderCell flex={3}>Owner</HeaderCell>
        <HeaderCell flex={1}>Backlog</HeaderCell>
        <HeaderCell flex={3}>Oldest age</HeaderCell>
      </XStack>
      {partitions.map((p, i) => {
        const count = p.backlogCount ?? 0
        const pct = Math.round((count / maxBacklog) * 100)
        return (
          <XStack
            key={`p-${p.partitionId}`}
            px="$4"
            py="$2.5"
            borderBottomWidth={i === partitions.length - 1 ? 0 : 1}
            borderBottomColor="$borderColor"
            items="center"
          >
            <YStack flex={1} px="$2">
              <Text fontSize="$2" color="$color">
                {p.partitionId}
              </Text>
            </YStack>
            <YStack flex={3} px="$2">
              <Text
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$2"
                color="$color"
                numberOfLines={1}
              >
                {p.ownerHostId || '—'}
                {p.forwarded ? ' (forwarded)' : ''}
              </Text>
            </YStack>
            <YStack flex={1} px="$2">
              <Text fontSize="$2" color={count > 0 ? ('$color' as never) : '$placeholderColor'}>
                {count}
              </Text>
            </YStack>
            <YStack flex={3} px="$2" gap="$1">
              <YStack
                width={`${pct}%` as never}
                height={4}
                bg={count > 0 ? ('#86efac' as never) : ('rgba(255,255,255,0.08)' as never)}
                style={{ borderRadius: 2 }}
              />
              <Text fontSize="$1" color="$placeholderColor">
                {p.oldestBacklogAgeSec ? `${p.oldestBacklogAgeSec}s` : '—'}
              </Text>
            </YStack>
          </XStack>
        )
      })}
    </Card>
  )
}

function HeaderCell({ children, flex }: { children: React.ReactNode; flex: number }) {
  return (
    <YStack flex={flex} px="$2">
      <Text fontSize="$1" fontWeight="500" color="$placeholderColor">
        {children}
      </Text>
    </YStack>
  )
}
