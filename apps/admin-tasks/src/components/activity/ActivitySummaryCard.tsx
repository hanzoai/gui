// ActivitySummaryCard — top-level facts about an activity. Mirrors the
// workflow detail SummaryPane: type, status, task queue, attempt,
// timeouts, scheduled / started times. Worker identity links into the
// workers list when present.

import { Link } from 'react-router-dom'
import { Card, Text, XStack, YStack } from 'hanzogui'
import type { Activity } from '../../lib/api'
import { ActivityStatusPill } from './ActivityStatusPill'
import { formatDuration } from '../../lib/format'

export interface ActivitySummaryCardProps {
  ns: string
  activity: Activity
}

export function ActivitySummaryCard({ ns, activity }: ActivitySummaryCardProps) {
  const tq = queueName(activity.taskQueue)
  const tn = typeName(activity.activityType)
  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$3">
        <Field label="Type">
          <Text fontSize="$2" color="$color">
            {tn}
          </Text>
        </Field>
        <Field label="Status">
          <ActivityStatusPill status={String(activity.status)} />
        </Field>
        <Field label="Task queue">
          {tq ? (
            <Link
              to={`/namespaces/${encodeURIComponent(ns)}/task-queues/${encodeURIComponent(tq)}`}
              style={{ textDecoration: 'none' }}
            >
              <Text fontSize="$2" color={'#86efac' as never}>
                {tq}
              </Text>
            </Link>
          ) : (
            <Text fontSize="$2" color="$color">
              —
            </Text>
          )}
        </Field>
        <Field label="Attempt">
          <Text fontSize="$2" color="$color">
            {activity.attempt ?? 1}
            {activity.maximumAttempts ? ` of ${activity.maximumAttempts}` : ''}
          </Text>
        </Field>
        <Field label="Schedule-to-close">
          <Text fontSize="$2" color="$color">
            {activity.scheduleToCloseTimeout
              ? formatDuration(activity.scheduleToCloseTimeout)
              : '—'}
          </Text>
        </Field>
        <Field label="Schedule-to-start">
          <Text fontSize="$2" color="$color">
            {activity.scheduleToStartTimeout
              ? formatDuration(activity.scheduleToStartTimeout)
              : '—'}
          </Text>
        </Field>
        <Field label="Start-to-close">
          <Text fontSize="$2" color="$color">
            {activity.startToCloseTimeout
              ? formatDuration(activity.startToCloseTimeout)
              : '—'}
          </Text>
        </Field>
        <Field label="Heartbeat timeout">
          <Text fontSize="$2" color="$color">
            {activity.heartbeatTimeout ? formatDuration(activity.heartbeatTimeout) : '—'}
          </Text>
        </Field>
        <Field label="Scheduled">
          <Text fontSize="$2" color="$color">
            {activity.scheduledTime ? new Date(activity.scheduledTime).toLocaleString() : '—'}
          </Text>
        </Field>
        <Field label="Started">
          <Text fontSize="$2" color="$color">
            {activity.startedTime ? new Date(activity.startedTime).toLocaleString() : '—'}
          </Text>
        </Field>
        <Field label="Closed">
          <Text fontSize="$2" color="$color">
            {activity.closeTime ? new Date(activity.closeTime).toLocaleString() : 'running'}
          </Text>
        </Field>
        <Field label="Last heartbeat">
          <Text fontSize="$2" color="$color">
            {activity.lastHeartbeatTime ? new Date(activity.lastHeartbeatTime).toLocaleString() : '—'}
          </Text>
        </Field>
        {activity.workerIdentity ? (
          <Field label="Worker">
            <Link
              to={`/namespaces/${encodeURIComponent(ns)}/workers/${encodeURIComponent(activity.workerIdentity)}`}
              style={{ textDecoration: 'none' }}
            >
              <Text fontSize="$2" color={'#86efac' as never}>
                {activity.workerIdentity}
              </Text>
            </Link>
          </Field>
        ) : null}
        {activity.lastFailure?.message ? (
          <Card p="$3" bg={'#1f1213' as never} borderColor="#7f1d1d" borderWidth={1}>
            <YStack gap="$2">
              <Text fontSize="$1" color="#fca5a5" fontWeight="600" letterSpacing={0.4}>
                LAST FAILURE
              </Text>
              <Text fontSize="$2" color="#fca5a5">
                {activity.lastFailure.message}
              </Text>
              {activity.lastFailure.stackTrace ? (
                <Text
                  fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                  fontSize="$1"
                  color="#fca5a5"
                  whiteSpace={'pre-wrap' as never}
                >
                  {activity.lastFailure.stackTrace}
                </Text>
              ) : null}
            </YStack>
          </Card>
        ) : null}
      </YStack>
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <XStack items="center" gap="$3">
      <Text width={160} fontSize="$2" color="$placeholderColor">
        {label}
      </Text>
      <YStack flex={1}>{children}</YStack>
    </XStack>
  )
}

function typeName(t: Activity['activityType']): string {
  if (!t) return '—'
  return typeof t === 'string' ? t : t.name
}

function queueName(t: Activity['taskQueue']): string | null {
  if (!t) return null
  return typeof t === 'string' ? t : t.name
}
