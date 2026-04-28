// Logs tail — the bot gateway's recent log entries.

import { Card, H2, Text, XStack, YStack } from 'hanzogui'
import { Badge, Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import type { LogEntry } from '../lib/api'

export function LogsPage() {
  const { data, error, isLoading } = useFetch<{ entries: LogEntry[] }>('/v1/bot/logs?limit=200')
  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const items = data?.entries ?? []
  if (items.length === 0) {
    return <Empty title="No logs" hint="The gateway hasn't logged anything in the recent window." />
  }
  return (
    <YStack gap="$4">
      <H2 size="$7" color="$color">
        Logs{' '}
        <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
          ({items.length})
        </Text>
      </H2>
      <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
        {items.map((e, i) => (
          <XStack
            key={`${e.ts}-${i}`}
            items="flex-start"
            gap="$3"
            p="$3"
            borderBottomWidth={i === items.length - 1 ? 0 : 1}
            borderColor="$borderColor"
          >
            <Badge tone={toneFor(e.level)}>{e.level}</Badge>
            <YStack flex={1}>
              <Text fontFamily="$mono" fontSize="$2">{e.msg}</Text>
              <Text fontSize="$1" color="$placeholderColor">
                {new Date(e.ts).toLocaleString()}{e.source ? ` · ${e.source}` : ''}
              </Text>
            </YStack>
          </XStack>
        ))}
      </Card>
    </YStack>
  )
}

function toneFor(level: LogEntry['level']) {
  switch (level) {
    case 'error': return 'danger'
    case 'warn': return 'warning'
    case 'info': return 'info'
    default: return 'neutral'
  }
}
