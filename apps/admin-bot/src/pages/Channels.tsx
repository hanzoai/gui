// Channels list — Discord, Slack, Telegram, iMessage, Nostr, etc.
// Mirrors the legacy Lit channels view at a single page.

import { Card, H2, Text, XStack, YStack } from 'hanzogui'
import { Badge, Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import type { ChannelsListResult } from '../lib/api'

export function ChannelsPage() {
  const { data, error, isLoading } = useFetch<ChannelsListResult>('/v1/bot/channels')
  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const items = data?.channels ?? []
  if (items.length === 0) {
    return <Empty title="No channels configured" hint="Add a channel in Config or via the bot CLI." />
  }
  return (
    <YStack gap="$4">
      <XStack items="baseline" justify="space-between">
        <H2 size="$7" color="$color">
          Channels{' '}
          <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
            ({items.length})
          </Text>
        </H2>
      </XStack>
      <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
        {items.map((c, i) => (
          <XStack
            key={c.id}
            items="center"
            justify="space-between"
            p="$3"
            borderBottomWidth={i === items.length - 1 ? 0 : 1}
            borderColor="$borderColor"
          >
            <YStack>
              <Text fontWeight="600">{c.id}</Text>
              <Text fontSize="$2" color="$placeholderColor">{c.kind}</Text>
            </YStack>
            <Badge tone={c.status === 'connected' ? 'success' : c.status === 'error' ? 'danger' : 'neutral'}>
              {c.status}
            </Badge>
          </XStack>
        ))}
      </Card>
    </YStack>
  )
}
