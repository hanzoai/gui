// ActivityTable — list rendering for standalone activities. The chrome
// library does not yet expose an ActivitiesTable primitive, so this is
// a hand-rolled DataTable in the same style as the workflow table:
// status pill, type, task queue, attempt, schedule time, row click
// navigates to the detail view.

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Text, XStack, YStack } from 'hanzogui'
import { Empty } from '@hanzogui/admin'
import type { Activity } from '../../lib/api'
import { formatTimestamp } from '../../lib/format'
import { ActivityStatusPill } from './ActivityStatusPill'

export interface ActivityTableProps {
  ns: string
  rows: Activity[]
  emptyState?: { title: string; hint?: string }
}

export function ActivityTable({ ns, rows, emptyState }: ActivityTableProps) {
  const navigate = useNavigate()

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const at = a.scheduledTime ? Date.parse(a.scheduledTime) : 0
      const bt = b.scheduledTime ? Date.parse(b.scheduledTime) : 0
      return bt - at
    })
  }, [rows])

  if (sorted.length === 0) {
    return <Empty title={emptyState?.title ?? 'No activities'} hint={emptyState?.hint} />
  }

  return (
    <Card bg="$background" borderColor="$borderColor" borderWidth={1} overflow="hidden">
      <YStack>
        <XStack
          px="$4"
          py="$2.5"
          gap="$3"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          bg={'$backgroundHover' as never}
        >
          <Header width={120}>Status</Header>
          <Header flex={2}>Activity ID / Type</Header>
          <Header flex={1}>Task queue</Header>
          <Header width={100}>Attempt</Header>
          <Header flex={1}>Scheduled</Header>
        </XStack>
        {sorted.map((a) => (
          <XStack
            key={`${a.activityId}/${a.runId}`}
            px="$4"
            py="$3"
            gap="$3"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
            hoverStyle={{ background: '#0c111a' as never }}
            cursor="pointer"
            onPress={() =>
              navigate(
                `/namespaces/${encodeURIComponent(ns)}/activities/${encodeURIComponent(a.activityId)}/${encodeURIComponent(a.runId)}`,
              )
            }
          >
            <YStack width={120} justify="center">
              <ActivityStatusPill status={String(a.status)} />
            </YStack>
            <YStack flex={2} gap="$0.5">
              <Text fontSize="$2" fontWeight="500" color="$color">
                {a.activityId}
              </Text>
              <Text
                fontSize="$1"
                color="$placeholderColor"
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              >
                {typeName(a.activityType)}
              </Text>
            </YStack>
            <YStack flex={1} justify="center">
              <Text fontSize="$2" color="$color">
                {queueName(a.taskQueue)}
              </Text>
            </YStack>
            <YStack width={100} justify="center">
              <Text fontSize="$2" color="$color">
                {a.attempt ?? 1}
                {a.maximumAttempts ? ` / ${a.maximumAttempts}` : ''}
              </Text>
            </YStack>
            <YStack flex={1} justify="center">
              <Text fontSize="$2" color="$color">
                {a.scheduledTime ? formatTimestamp(new Date(a.scheduledTime)) : '—'}
              </Text>
            </YStack>
          </XStack>
        ))}
      </YStack>
    </Card>
  )
}

function Header({ children, flex, width }: { children: React.ReactNode; flex?: number; width?: number }) {
  return (
    <YStack flex={flex} width={width}>
      <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
        {String(children).toUpperCase()}
      </Text>
    </YStack>
  )
}

function typeName(t: Activity['activityType']): string {
  if (!t) return '—'
  return typeof t === 'string' ? t : t.name
}

function queueName(t: Activity['taskQueue']): string {
  if (!t) return '—'
  return typeof t === 'string' ? t : t.name
}
