// Pending activities pane — list of running activities with attempt
// count, scheduled time, and last failure. The native engine doesn't
// yet record activity progress (worker SDK runtime is the next phase),
// so the data field is honest about being absent. When the engine
// starts emitting wf.pendingActivities, this pane already binds it.

import { Card, Text, XStack, YStack } from 'hanzogui'
import { Alert, Badge, Empty } from '@hanzogui/admin'
import type { PendingActivity, WorkflowExecution } from '../../lib/api'

export function PendingActivitiesPane({ wf }: { wf: WorkflowExecution }) {
  const rows = sorted(wf.pendingActivities ?? [])

  if (rows.length === 0) {
    return (
      <YStack gap="$3">
        <Alert title="Activity tracking not yet wired">
          Pending-activity records land when the worker SDK runtime ships.
          Until then the engine returns no activity state — that is the
          honest answer rather than a fabricated row.
        </Alert>
        <Empty
          title="No pending activities"
          hint="Once a worker registers and starts polling, every running activity for this workflow will appear here with attempt count, schedule-to-close timeout, and last failure."
        />
      </YStack>
    )
  }

  return (
    <YStack gap="$3">
      {rows.map((a) => (
        <Card
          key={a.activityId}
          p="$4"
          bg="$background"
          borderColor="$borderColor"
          borderWidth={1}
        >
          <YStack gap="$2.5">
            <XStack items="center" gap="$3" justify="space-between">
              <XStack items="center" gap="$2">
                <Badge variant={badgeFor(a.state)}>{shortState(a.state)}</Badge>
                <Text fontSize="$3" fontWeight="500" color="$color">
                  {typeName(a.activityType)}
                </Text>
              </XStack>
              <Text fontSize="$1" color="$placeholderColor">
                ID {a.activityId}
              </Text>
            </XStack>
            <XStack flexWrap="wrap" gap="$4">
              <Field label="Attempt">
                {a.attempt ?? 1}
                {a.maximumAttempts ? ` of ${a.maximumAttempts}` : ''}
              </Field>
              <Field label="Schedule-to-close">
                {a.scheduleToCloseTimeout ?? '—'}
              </Field>
              <Field label="Scheduled">
                {a.scheduledTime ? new Date(a.scheduledTime).toLocaleString() : '—'}
              </Field>
              <Field label="Last started">
                {a.lastStartedTime ? new Date(a.lastStartedTime).toLocaleString() : '—'}
              </Field>
            </XStack>
            {a.lastFailure?.message ? (
              <Card p="$3" bg={'#1f1213' as never} borderColor="#7f1d1d" borderWidth={1}>
                <Text fontSize="$2" color="#fca5a5">
                  {a.lastFailure.message}
                </Text>
              </Card>
            ) : null}
          </YStack>
        </Card>
      ))}
    </YStack>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <YStack gap="$0.5" minW={140}>
      <Text fontSize="$1" color="$placeholderColor">
        {label}
      </Text>
      <Text fontSize="$2" color="$color">
        {children}
      </Text>
    </YStack>
  )
}

function sorted(list: PendingActivity[]): PendingActivity[] {
  return [...list].sort((a, b) => {
    const an = parseInt(a.activityId, 10)
    const bn = parseInt(b.activityId, 10)
    if (Number.isNaN(an) || Number.isNaN(bn)) {
      return a.activityId.localeCompare(b.activityId)
    }
    return an - bn
  })
}

function typeName(t: PendingActivity['activityType']): string {
  if (!t) return 'activity'
  return typeof t === 'string' ? t : t.name
}

function shortState(s?: string): string {
  if (!s) return 'pending'
  return s.replace(/^PENDING_ACTIVITY_STATE_/, '').toLowerCase()
}

function badgeFor(s?: string): 'success' | 'destructive' | 'warning' | 'muted' {
  switch (s) {
    case 'PENDING_ACTIVITY_STATE_STARTED':
      return 'success'
    case 'PENDING_ACTIVITY_STATE_CANCEL_REQUESTED':
      return 'warning'
    case 'PENDING_ACTIVITY_STATE_SCHEDULED':
    default:
      return 'muted'
  }
}
