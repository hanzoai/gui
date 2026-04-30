// ShardTable — per-shard breakdown. Default sort is lag desc so the
// worst offenders surface first. Pagination uses a simple "show
// more" since the engine returns shards in one envelope; we slice
// client-side in chunks of PAGE_SIZE rather than wiring the cursor
// pager — there is no token from the server.

import { useMemo, useState } from 'react'
import { Button, Card, H4, Text, XStack, YStack } from 'hanzogui'
import { Badge, Empty } from '@hanzogui/admin'
import type { ShardInfo } from '../../lib/api'

const PAGE_SIZE = 25

export interface ShardTableProps {
  shards: ShardInfo[] | undefined
}

export function ShardTable({ shards }: ShardTableProps) {
  const [shown, setShown] = useState(PAGE_SIZE)
  const sorted = useMemo(
    () => [...(shards ?? [])].sort((a, b) => b.replicationLagMs - a.replicationLagMs),
    [shards],
  )
  if (!shards || shards.length === 0) {
    return (
      <Empty
        title="No per-shard data"
        hint="The replicator is not emitting shard breakdowns. Aggregate replication lag is shown above."
      />
    )
  }
  const visible = sorted.slice(0, shown)
  const more = sorted.length - visible.length
  return (
    <YStack gap="$2">
      <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <XStack
          bg={'rgba(255,255,255,0.03)' as never}
          px="$4"
          py="$2"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <H4 flex={3} fontSize="$2" color="$placeholderColor" fontWeight="500">
            Shard key
          </H4>
          <H4 flex={2} fontSize="$2" color="$placeholderColor" fontWeight="500">
            Leader
          </H4>
          <H4 width={110} fontSize="$2" color="$placeholderColor" fontWeight="500">
            Lag
          </H4>
          <H4 width={90} fontSize="$2" color="$placeholderColor" fontWeight="500">
            State
          </H4>
        </XStack>
        {visible.map((s, i) => (
          <XStack
            key={s.shardKey}
            px="$4"
            py="$2.5"
            borderTopWidth={i === 0 ? 0 : 1}
            borderTopColor="$borderColor"
            items="center"
          >
            <Text flex={3} fontSize="$2" color="$color" numberOfLines={1}>
              {s.shardKey}
            </Text>
            <Text flex={2} fontSize="$2" color="$placeholderColor" numberOfLines={1}>
              {s.leader}
            </Text>
            <Text width={110} fontSize="$2" color={(s.replicationLagMs > 500 ? '#eab308' : '$placeholderColor') as never}>
              {Math.round(s.replicationLagMs)}ms
            </Text>
            <YStack width={90}>
              <Badge variant={(s.isOpen ? 'success' : 'muted') as never}>
                {s.isOpen ? 'open' : 'closed'}
              </Badge>
            </YStack>
          </XStack>
        ))}
      </Card>
      {more > 0 ? (
        <XStack justify="center">
          <Button size="$2" chromeless onPress={() => setShown((n) => n + PAGE_SIZE)}>
            <Text fontSize="$2" color="$placeholderColor">
              Show {Math.min(more, PAGE_SIZE)} more · {more} hidden
            </Text>
          </Button>
        </XStack>
      ) : null}
    </YStack>
  )
}
