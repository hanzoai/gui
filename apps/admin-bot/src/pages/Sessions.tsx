// Sessions list — open chat sessions across all channels and agents.

import { Card, H2, Text, XStack, YStack } from 'hanzogui'
import { Badge, Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import type { SessionsListResult } from '../lib/api'

export function SessionsPage() {
  const { data, error, isLoading } = useFetch<SessionsListResult>('/v1/bot/sessions')
  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const items = data?.sessions ?? []
  if (items.length === 0) {
    return <Empty title="No active sessions" hint="Sessions appear when channels deliver messages." />
  }
  return (
    <YStack gap="$4">
      <H2 size="$7" color="$color">
        Sessions{' '}
        <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
          ({items.length})
        </Text>
      </H2>
      <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
        {items.map((s, i) => (
          <XStack
            key={s.id}
            items="center"
            justify="space-between"
            p="$3"
            borderBottomWidth={i === items.length - 1 ? 0 : 1}
            borderColor="$borderColor"
          >
            <YStack>
              <Text fontWeight="600">{s.id}</Text>
              <Text fontSize="$2" color="$placeholderColor">
                {s.channelId ?? '—'} → {s.agentId ?? '—'} ({s.messageCount ?? 0} msgs)
              </Text>
            </YStack>
            <Badge variant={s.status === 'open' ? 'success' : 'muted'}>{s.status}</Badge>
          </XStack>
        ))}
      </Card>
    </YStack>
  )
}
