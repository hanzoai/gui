// WorkersPane — pollers attached to this workflow's task queue. Lists
// workers from /v1/tasks/namespaces/{ns}/workers filtered by queue.
// Empty list rendered honestly when no heartbeats are recorded.

import { Link } from 'react-router-dom'
import { Text, XStack, YStack } from 'hanzogui'
import { Layers } from '@hanzogui/lucide-icons-2/icons/Layers'
import { ListChecks } from '@hanzogui/lucide-icons-2/icons/ListChecks'
import {
  Empty,
  ErrorState,
  LoadingState,
  useFetch,
} from '@hanzogui/admin'
import { Workers, type Worker } from '../../lib/api'
import { PollerTable } from '../../components/task-queue/PollerTable'

interface WorkersResp {
  workers?: Worker[]
}

export function WorkersPane({
  ns,
  taskQueue,
}: {
  ns: string
  taskQueue?: string
}) {
  const { data, error, isLoading } = useFetch<WorkersResp>(Workers.listUrl(ns))

  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />

  const all = data?.workers ?? []
  const matched = taskQueue ? all.filter((w) => w.taskQueue === taskQueue) : all

  return (
    <YStack gap="$3">
      <XStack items="center" justify="space-between" gap="$2">
        <XStack items="center" gap="$2">
          {taskQueue ? <Layers size={14} color="#7e8794" /> : null}
          <Text fontSize="$2" color="$placeholderColor">
            {taskQueue ? `Pollers for ${taskQueue}` : 'Pollers in namespace'}
          </Text>
        </XStack>
        <Link
          to={`/namespaces/${encodeURIComponent(ns)}/workers`}
          style={{ textDecoration: 'none' }}
        >
          <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
            <ListChecks size={14} color="#86efac" />
            <Text fontSize="$2" color={'#86efac' as never}>All workers</Text>
          </XStack>
        </Link>
      </XStack>

      {matched.length === 0 ? (
        <Empty
          title={taskQueue ? `No workers polling ${taskQueue}` : 'No workers polling'}
          hint="Once a worker registers, its identity, build ID, and last-heartbeat will appear here."
        />
      ) : (
        <PollerTable pollers={matched} />
      )}
    </YStack>
  )
}
