// Agents list — ACP-based agent processes spawned by the bot gateway.

import { Card, H2, Text, XStack, YStack } from 'hanzogui'
import { Badge, Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import type { AgentsListResult } from '../lib/api'

export function AgentsPage() {
  const { data, error, isLoading } = useFetch<AgentsListResult>('/v1/bot/agents')
  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const items = data?.agents ?? []
  if (items.length === 0) {
    return <Empty title="No agents" hint="Spawn one with `bot agent` or via the gateway RPC." />
  }
  return (
    <YStack gap="$4">
      <H2 size="$7" color="$color">
        Agents{' '}
        <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
          ({items.length})
        </Text>
      </H2>
      <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
        {items.map((a, i) => (
          <XStack
            key={a.id}
            items="center"
            justify="space-between"
            p="$3"
            borderBottomWidth={i === items.length - 1 ? 0 : 1}
            borderColor="$borderColor"
          >
            <YStack>
              <Text fontWeight="600">{a.id}</Text>
              <Text fontSize="$2" color="$placeholderColor">
                {a.modelProvider ?? '—'} / {a.modelName ?? '—'}
              </Text>
            </YStack>
            <Badge tone={a.status === 'ready' ? 'success' : 'neutral'}>{a.status}</Badge>
          </XStack>
        ))}
      </Card>
    </YStack>
  )
}
