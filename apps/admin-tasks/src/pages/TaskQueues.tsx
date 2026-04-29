// Task queues — list of queues with kind, backlog, partition count.
// Server aggregates queues from workflows; backlog/partitions arrive
// as a best-effort enrichment when the matching service exposes them.

import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, H1, Spinner, Text, XStack, YStack } from 'hanzogui'
import { Layers } from '@hanzogui/lucide-icons-2/icons/Layers'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import { Badge, Empty, ErrorState, formatTimestamp } from '@hanzogui/admin'
import { TaskQueues } from '../lib/api'
import type { NextPageToken } from '../lib/types'
import { useCursorPager, type PageResult } from '../stores/pagination-cursor'
import { useTaskEvents } from '../lib/events'

interface TaskQueueRow {
  name: string
  kind?: 'Normal' | 'Sticky' | 'Unspecified' | string
  workflows: number
  running: number
  backlog?: number
  partitions?: number
  latestStart?: string
}

export function TaskQueuesPage() {
  const { ns } = useParams()
  const namespace = ns!

  const fetchPage = useCallback(
    async (_token: NextPageToken): Promise<PageResult<TaskQueueRow>> => {
      const res = await fetch(TaskQueues.listUrl(namespace), {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const body = (await res.json()) as { taskQueues?: TaskQueueRow[]; nextPageToken?: NextPageToken }
      return { items: body.taskQueues ?? [], nextPageToken: body.nextPageToken ?? null }
    },
    [namespace],
  )

  const pager = useCursorPager<TaskQueueRow>(fetchPage, [namespace])

  useTaskEvents(namespace, useCallback(() => void pager.refresh(), [pager]), [
    'workflow.started',
    'workflow.canceled',
    'workflow.terminated',
  ])

  if (pager.error) return <ErrorState error={pager.error} />

  const rows = pager.items
  return (
    <YStack flex={1} bg="$background" minH="100%" gap="$4">
      <XStack px="$6" py="$5" justify="space-between" items="center">
        <XStack items="baseline" gap="$3">
          <H1 size="$8" fontWeight="600" color="$color">
            {rows.length}
            {pager.hasMore ? '+' : ''} Task queue{rows.length === 1 ? '' : 's'}
          </H1>
          <Button
            size="$2"
            chromeless
            onPress={() => void pager.refresh()}
            disabled={pager.loading}
            aria-label="Refresh"
          >
            {pager.loading ? <Spinner size="small" /> : <RefreshCw size={14} color="#7e8794" />}
          </Button>
        </XStack>
      </XStack>

      <YStack px="$6" pb="$6" gap="$3">
        {rows.length === 0 ? (
          <Empty
            title={`No task queues in ${namespace}`}
            hint="A task queue is created the first time a workflow targets it. Start a workflow to see queues here."
          />
        ) : (
          <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
            <XStack
              bg={'rgba(255,255,255,0.03)' as never}
              px="$4"
              py="$2.5"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
            >
              <HeaderCell flex={3}>Name</HeaderCell>
              <HeaderCell flex={1}>Kind</HeaderCell>
              <HeaderCell flex={1}>Workflows</HeaderCell>
              <HeaderCell flex={1}>Running</HeaderCell>
              <HeaderCell flex={1}>Backlog</HeaderCell>
              <HeaderCell flex={1}>Parts</HeaderCell>
              <HeaderCell flex={2}>Latest start</HeaderCell>
            </XStack>
            {rows.map((q, i) => (
              <XStack
                key={q.name}
                px="$4"
                py="$2.5"
                borderBottomWidth={i === rows.length - 1 ? 0 : 1}
                borderBottomColor="$borderColor"
                hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
                items="center"
              >
                <YStack flex={3} px="$2">
                  <Link
                    to={`/namespaces/${encodeURIComponent(namespace)}/task-queues/${encodeURIComponent(q.name)}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <XStack items="center" gap="$2">
                      <Layers size={14} color="#86efac" />
                      <Text fontSize="$2" color={'#86efac' as never}>
                        {q.name}
                      </Text>
                    </XStack>
                  </Link>
                </YStack>
                <YStack flex={1} px="$2">
                  <Text fontSize="$2" color="$placeholderColor">
                    {q.kind ?? 'Normal'}
                  </Text>
                </YStack>
                <YStack flex={1} px="$2">
                  <Text fontSize="$2" color="$color">{q.workflows}</Text>
                </YStack>
                <YStack flex={1} px="$2">
                  {q.running > 0 ? (
                    <Badge variant="success">{q.running}</Badge>
                  ) : (
                    <Text fontSize="$2" color="$placeholderColor">0</Text>
                  )}
                </YStack>
                <YStack flex={1} px="$2">
                  {(q.backlog ?? 0) > 0 ? (
                    <Badge variant="warning">{q.backlog}</Badge>
                  ) : (
                    <Text fontSize="$2" color="$placeholderColor">0</Text>
                  )}
                </YStack>
                <YStack flex={1} px="$2">
                  <Text fontSize="$2" color="$placeholderColor">
                    {q.partitions ?? '—'}
                  </Text>
                </YStack>
                <YStack flex={2} px="$2">
                  <Text fontSize="$2" color="$placeholderColor">
                    {q.latestStart ? formatTimestamp(new Date(q.latestStart)) : '—'}
                  </Text>
                </YStack>
              </XStack>
            ))}
          </Card>
        )}

        {pager.hasMore ? (
          <XStack justify="center" py="$3">
            <Button size="$2" onPress={() => void pager.loadMore()} disabled={pager.loading}>
              {pager.loading ? <Spinner size="small" /> : <Text fontSize="$2">Load more</Text>}
            </Button>
          </XStack>
        ) : null}
      </YStack>
    </YStack>
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
