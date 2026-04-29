// WorkerCard — compact tile for one worker poller. Identity, build ID,
// kind, and last heartbeat. Used on Workers list and on workflow tab.

import { Card, Text, XStack, YStack } from 'hanzogui'
import { Badge, formatTimestamp } from '@hanzogui/admin'
import type { Worker } from '../../lib/api'

export interface WorkerCardProps {
  worker: Worker
}

export function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <Card
      p="$3"
      bg="$background"
      borderColor="$borderColor"
      borderWidth={1}
      gap="$2"
    >
      <XStack items="center" justify="space-between" gap="$2">
        <Text
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          fontSize="$2"
          fontWeight="500"
          color="$color"
          numberOfLines={1}
        >
          {worker.identity || '—'}
        </Text>
        {worker.pollerKind ? (
          <Badge variant="info">{worker.pollerKind}</Badge>
        ) : null}
      </XStack>
      <YStack gap="$1">
        {worker.buildId ? (
          <XStack gap="$2" items="center">
            <Text fontSize="$1" color="$placeholderColor">
              build
            </Text>
            <Text
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              fontSize="$1"
              color="$color"
              numberOfLines={1}
            >
              {worker.buildId}
            </Text>
          </XStack>
        ) : null}
        {worker.taskQueue ? (
          <XStack gap="$2" items="center">
            <Text fontSize="$1" color="$placeholderColor">
              queue
            </Text>
            <Text fontSize="$1" color="$color" numberOfLines={1}>
              {worker.taskQueue}
            </Text>
          </XStack>
        ) : null}
        {worker.lastAccessTime ? (
          <Text fontSize="$1" color="$placeholderColor">
            last poll {formatTimestamp(new Date(worker.lastAccessTime))}
          </Text>
        ) : null}
      </YStack>
    </Card>
  )
}
