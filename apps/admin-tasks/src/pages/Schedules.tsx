// Schedules — list of recurring workflow specs. Streams realtime
// schedule.* events through useTaskEvents to revalidate the SWR
// cache. Each row surfaces the next-fire time computed locally from
// the recurrence helpers (info.futureActionTimes is used when the
// engine populates it).

import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, H2, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { DataTable, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { Schedules, type Schedule } from '../lib/api'
import { useTaskEvents } from '../lib/events'
import { describeSpec, nextOccurrences } from '../stores/schedule-recurrence'
import { ScheduleStatusPill } from '../components/schedule/ScheduleStatusPill'
import { formatTimestamp } from '../lib/format'

interface ListResp {
  schedules?: Schedule[]
}

const COLUMNS = [
  { key: 'status', label: 'Status', flex: 1 },
  { key: 'scheduleId', label: 'Schedule ID', flex: 2 },
  { key: 'workflowType', label: 'Workflow Type', flex: 2 },
  { key: 'recent', label: 'Runs', flex: 1 },
  { key: 'upcoming', label: 'Next fire', flex: 2 },
  { key: 'spec', label: 'Spec', flex: 2 },
]

export function SchedulesPage() {
  const { ns } = useParams()
  const namespace = ns!
  const url = Schedules.listUrl(namespace)
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
        <Link
          to={`/namespaces/${encodeURIComponent(namespace)}/schedules/create`}
          style={{ textDecoration: 'none' }}
        >
          <Button size="$2" bg={'#f2f2f2' as never}>
            <XStack items="center" gap="$1.5">
              <Plus size={14} color="#070b13" />
              <Text fontSize="$2" color={'#070b13' as never} fontWeight="500">
                New schedule
              </Text>
            </XStack>
          </Button>
        </Link>
      </XStack>

      <DataTable
        columns={COLUMNS}
        rows={rows}
        rowKey={(s) => s.scheduleId}
        renderRow={(s) => {
          const upcoming = upcomingFor(s)
          const idHref = `/namespaces/${encodeURIComponent(namespace)}/schedules/${encodeURIComponent(
            s.scheduleId,
          )}`
          return [
            <ScheduleStatusPill
              key="status"
              paused={s.state?.paused}
              pauseOnFailure={s.policies?.pauseOnFailure}
            />,
            <Link key="id" to={idHref} style={{ textDecoration: 'none' }}>
              <Text fontSize="$2" fontWeight="500" color="$color" numberOfLines={1}>
                {s.scheduleId}
              </Text>
            </Link>,
            <Text key="type" fontSize="$2" color="$color" numberOfLines={1}>
              {s.action?.workflowType?.name ?? '—'}
            </Text>,
            <Text key="recent" fontSize="$2" color="$placeholderColor">
              {s.info?.actionCount ?? 0}
            </Text>,
            <Text key="upcoming" fontSize="$1" color="$placeholderColor" numberOfLines={1}>
              {upcoming ? formatTimestamp(new Date(upcoming)) : '—'}
            </Text>,
            <Text key="spec" fontSize="$1" color="$placeholderColor" numberOfLines={1}>
              {describeSpec(s.spec)}
            </Text>,
          ]
        }}
        emptyState={{
          title: `No schedules in ${namespace}`,
          hint: 'Create one above or via the Hanzo Tasks SDK.',
        }}
      />
    </YStack>
  )
}

function upcomingFor(s: Schedule): string | null {
  if (s.state?.paused) return null
  const futures = s.info?.futureActionTimes
  if (futures && futures.length) return futures[0]
  const computed = nextOccurrences(s.spec, 1)
  return computed[0] ?? null
}
