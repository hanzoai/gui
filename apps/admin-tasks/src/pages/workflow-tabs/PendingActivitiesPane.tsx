// Pending activities pane — table with attempts, schedule-to-close
// countdown, heartbeat age, and an expandable last-failure block.
// Polls the workflow describe every 5s while the pane is mounted so
// running activity timers stay live without manual refresh.

import { useEffect, useState } from 'react'
import { Button, Card, Text, XStack, YStack } from 'hanzogui'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { Badge, Empty, useFetch } from '@hanzogui/admin'
import { useParams } from 'react-router-dom'
import { Workflows, type PendingActivity, type WorkflowExecution } from '../../lib/api'

const POLL_MS = 5000

export interface PendingActivitiesPaneProps {
  wf: WorkflowExecution
  ns?: string
}

export function PendingActivitiesPane({ wf, ns }: PendingActivitiesPaneProps) {
  const { ns: nsParam } = useParams()
  const namespace = ns ?? nsParam ?? ''

  // Re-fetch the describe envelope on a 5s tick so timers stay live.
  // Falls back to the prop on first render and whenever the request
  // is in flight, so the user never sees an empty table mid-refresh.
  const url = namespace
    ? Workflows.describeUrl(namespace, wf.execution.workflowId, wf.execution.runId)
    : null
  const { data, mutate } = useFetch<{ workflowExecutionInfo?: WorkflowExecution; pendingActivities?: PendingActivity[] }>(url)

  useEffect(() => {
    if (!url) return
    const id = window.setInterval(() => {
      void mutate()
    }, POLL_MS)
    return () => window.clearInterval(id)
  }, [url, mutate])

  const live = data?.workflowExecutionInfo?.pendingActivities ?? data?.pendingActivities
  const rows = sorted(live ?? wf.pendingActivities ?? [])

  // Heartbeat-age tick — re-render every second so the relative
  // labels stay accurate without re-fetching from the server.
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  if (rows.length === 0) {
    return (
      <Empty
        title="No pending activities"
        hint="Once a worker registers and starts polling, every running activity for this workflow will appear here with attempt count, schedule-to-close timeout, and last failure."
      />
    )
  }

  const now = Date.now()
  return (
    <YStack gap="$3">
      {rows.map((a) => (
        <ActivityRow key={a.activityId} a={a} now={now} />
      ))}
    </YStack>
  )
}

function ActivityRow({ a, now }: { a: PendingActivity; now: number }) {
  const [showFail, setShowFail] = useState(false)
  const heartbeatAgeMs = lastHeartbeatMs(a, now)
  const closeRemainingMs = scheduleToCloseRemainingMs(a, now)

  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
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
            {closeRemainingMs == null
              ? a.scheduleToCloseTimeout ?? '—'
              : closeRemainingMs <= 0
                ? 'expired'
                : `${formatDuration(closeRemainingMs)} left`}
          </Field>
          <Field label="Heartbeat">
            {heartbeatAgeMs == null ? '—' : `${formatDuration(heartbeatAgeMs)} ago`}
          </Field>
          <Field label="Scheduled">
            {a.scheduledTime ? new Date(a.scheduledTime).toLocaleString() : '—'}
          </Field>
          <Field label="Last started">
            {a.lastStartedTime ? new Date(a.lastStartedTime).toLocaleString() : '—'}
          </Field>
        </XStack>
        {a.lastFailure?.message ? (
          <YStack gap="$2">
            <Button
              size="$2"
              chromeless
              self="flex-start"
              onPress={() => setShowFail((v) => !v)}
            >
              <XStack items="center" gap="$1.5">
                {showFail ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <Text fontSize="$2" color={'#fca5a5' as never}>
                  Last failure
                </Text>
              </XStack>
            </Button>
            {showFail ? (
              <Card p="$3" bg={'#1f1213' as never} borderColor="#7f1d1d" borderWidth={1}>
                <YStack gap="$2">
                  <Text fontSize="$2" color="#fca5a5">
                    {a.lastFailure.message}
                  </Text>
                  {a.lastFailure.stackTrace ? (
                    <Text
                      fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                      fontSize="$1"
                      color="#fca5a5"
                      whiteSpace={'pre-wrap' as never}
                    >
                      {a.lastFailure.stackTrace}
                    </Text>
                  ) : null}
                </YStack>
              </Card>
            ) : null}
          </YStack>
        ) : null}
      </YStack>
    </Card>
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
    case 'Started':
      return 'success'
    case 'PENDING_ACTIVITY_STATE_CANCEL_REQUESTED':
    case 'CancelRequested':
      return 'warning'
    case 'PENDING_ACTIVITY_STATE_SCHEDULED':
    case 'Scheduled':
    default:
      return 'muted'
  }
}

// "12.34s" / "12s" / "5m" → ms. Returns null on unparseable input.
function durationToMs(d?: string | null): number | null {
  if (!d) return null
  const m = /^([0-9]+(?:\.[0-9]+)?)([smh])$/.exec(d.trim())
  if (!m) return null
  const n = parseFloat(m[1])
  if (!Number.isFinite(n)) return null
  switch (m[2]) {
    case 's':
      return n * 1000
    case 'm':
      return n * 60_000
    case 'h':
      return n * 3_600_000
  }
  return null
}

function lastHeartbeatMs(a: PendingActivity, now: number): number | null {
  // The wire shape exposes lastHeartbeatTime on Temporal's proto but
  // our typed interface only carries lastStartedTime. Use that as a
  // floor — once heartbeat plumbing lands the field swap is local.
  const t = a.lastStartedTime ? Date.parse(a.lastStartedTime) : NaN
  if (!Number.isFinite(t)) return null
  return Math.max(0, now - t)
}

function scheduleToCloseRemainingMs(a: PendingActivity, now: number): number | null {
  const startedMs = a.scheduledTime ? Date.parse(a.scheduledTime) : NaN
  const ttl = durationToMs(a.scheduleToCloseTimeout ?? null)
  if (!Number.isFinite(startedMs) || ttl == null) return null
  return startedMs + ttl - now
}

function formatDuration(ms: number): string {
  const abs = Math.abs(ms)
  if (abs < 1000) return `${Math.round(abs)}ms`
  const s = Math.round(abs / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const rs = s % 60
  if (m < 60) return rs ? `${m}m ${rs}s` : `${m}m`
  const h = Math.floor(m / 60)
  const rm = m % 60
  return rm ? `${h}h ${rm}m` : `${h}h`
}
