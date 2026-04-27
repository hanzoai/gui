// Schedules — list of recurring workflow specs. Read-only for now;
// the upstream UI surfaces a create dialog but the native engine
// ships writes via the SDK first.

import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { H2, Text, XStack, YStack } from 'hanzogui'
import { DataTable, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import type { Schedule } from '../lib/api'
import { useTaskEvents } from '../lib/events'

interface ListResp {
  schedules?: Schedule[]
}

const COLUMNS = [
  { key: 'status', label: 'Status', flex: 1 },
  { key: 'scheduleId', label: 'Schedule ID', flex: 2 },
  { key: 'workflowType', label: 'Workflow Type', flex: 2 },
  { key: 'recent', label: 'Recent Runs', flex: 1 },
  { key: 'upcoming', label: 'Upcoming Runs', flex: 1 },
  { key: 'spec', label: 'Schedule Spec', flex: 2 },
]

export function SchedulesPage() {
  const { ns } = useParams()
  const namespace = ns!
  const url = `/v1/tasks/namespaces/${encodeURIComponent(namespace)}/schedules`
  const { data, error, isLoading, mutate } = useFetch<ListResp>(url)

  const onEvent = useCallback(() => {
    void mutate()
  }, [mutate])

  useTaskEvents(namespace, onEvent, [
    'schedule.created',
    'schedule.paused',
    'schedule.resumed',
    'schedule.deleted',
  ])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const rows = data?.schedules ?? []

  return (
    <YStack gap="$4">
      <XStack items="baseline" justify="space-between">
        <H2 size="$7" color="$color">
          Schedules{' '}
          <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
            ({rows.length})
          </Text>
        </H2>
      </XStack>

      <DataTable
        columns={COLUMNS}
        rows={rows}
        rowKey={(s) => s.scheduleId}
        renderRow={(s) => [
          <Text key="status" fontSize="$2" color="$placeholderColor">
            {s.state?.paused ? 'paused' : 'active'}
          </Text>,
          <Text key="id" fontSize="$2" fontWeight="500" color="$color" numberOfLines={1}>
            {s.scheduleId}
          </Text>,
          <Text key="type" fontSize="$2" color="$color" numberOfLines={1}>
            {s.action?.workflowType?.name ?? '—'}
          </Text>,
          <Text key="recent" fontSize="$2" color="$placeholderColor">
            {s.info?.actionCount ?? 0}
          </Text>,
          <Text key="upcoming" fontSize="$2" color="$placeholderColor">
            —
          </Text>,
          <Text key="spec" fontSize="$1" color="$placeholderColor" numberOfLines={1}>
            {describeSpec(s)}
          </Text>,
        ]}
        emptyState={{
          title: `No schedules in ${namespace}`,
          hint: 'Create one with the Hanzo Tasks SDK; the UI surface is read-only for now.',
        }}
      />
    </YStack>
  )
}

function describeSpec(s: Schedule): string {
  const spec = s.spec
  if (!spec) return 'no spec'
  if (spec.cronString?.length) return `cron: ${spec.cronString.join(', ')}`
  if (spec.interval?.length)
    return `every ${spec.interval.map((i) => i.interval).join(', ')}`
  return 'custom'
}
