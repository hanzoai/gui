// PollerTable — workers currently polling a task queue. Driven from
// DescribeTaskQueueResponse.pollers. Empty state inline when no rows.

import { Card, Text, XStack, YStack } from 'hanzogui'
import { Badge, Empty, formatTimestamp } from '@hanzogui/admin'
import type { Worker } from '../../lib/api'

export interface PollerTableProps {
  pollers: Worker[]
  emptyHint?: string
}

export function PollerTable({ pollers, emptyHint }: PollerTableProps) {
  if (pollers.length === 0) {
    return (
      <Empty
        title="No active pollers"
        hint={emptyHint ?? 'Workers register on connect; reconnect to repopulate.'}
      />
    )
  }
  return (
    <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <XStack
        bg={'rgba(255,255,255,0.03)' as never}
        px="$4"
        py="$2.5"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <HeaderCell flex={3}>Identity</HeaderCell>
        <HeaderCell flex={1}>Kind</HeaderCell>
        <HeaderCell flex={2}>Build ID</HeaderCell>
        <HeaderCell flex={2}>Last poll</HeaderCell>
      </XStack>
      {pollers.map((p, i) => (
        <XStack
          key={`${p.identity}-${i}`}
          px="$4"
          py="$2.5"
          borderBottomWidth={i === pollers.length - 1 ? 0 : 1}
          borderBottomColor="$borderColor"
          items="center"
        >
          <YStack flex={3} px="$2">
            <Text
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              fontSize="$2"
              color="$color"
              numberOfLines={1}
            >
              {p.identity || '—'}
            </Text>
          </YStack>
          <YStack flex={1} px="$2">
            {p.pollerKind ? (
              <Badge variant="info">{p.pollerKind}</Badge>
            ) : (
              <Text fontSize="$2" color="$placeholderColor">
                —
              </Text>
            )}
          </YStack>
          <YStack flex={2} px="$2">
            <Text
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              fontSize="$2"
              color="$color"
              numberOfLines={1}
            >
              {p.buildId || '—'}
            </Text>
          </YStack>
          <YStack flex={2} px="$2">
            <Text fontSize="$2" color="$placeholderColor">
              {p.lastAccessTime ? formatTimestamp(new Date(p.lastAccessTime)) : '—'}
            </Text>
          </YStack>
        </XStack>
      ))}
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
