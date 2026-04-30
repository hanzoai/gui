// TimelinePane — Gantt-style activity timeline tab on the workflow
// detail page. Distinct from HistoryStrip (which is a compact
// classification ribbon at the top of every tab): this view fans out
// every activity / timer / child-workflow group as its own bar so the
// reader can see overlap, attempts, and gaps at a glance.
//
// Data flow:
//   1. Fetch the workflow describe envelope to pick up pending
//      activities + pending nexus operations (in-flight rows).
//   2. Fetch the workflow history (paginated by the backend; we pull
//      the first page only — long histories truncate gracefully and
//      the user can fall back to the full history page).
//   3. Aggregate via groupEvents — same primitive used by
//      HistoryCompact / HistoryTimeline.
//   4. Filter to category bands worth plotting (activity / timer /
//      child-workflow / nexus) and order by start time so the visual
//      reads top-down chronologically.
//
// Pending bars extend to "now" and refresh every 5s while the pane
// is open so the user can watch activities tick along.

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Text, XStack, YStack } from 'hanzogui'
import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import {
  Workflows,
  type HistoryEvent,
  type PendingActivity,
  type PendingNexusOperation,
  type WorkflowExecution,
} from '../../lib/api'
import { groupEvents } from '../../stores/event-aggregation'
import {
  TimelineGantt,
  type TimelineGanttRow,
} from '../../components/workflow/TimelineGantt'
import type { EventGroup, EventTypeCategory } from '../../lib/types'

const POLL_MS = 5000

// Categories worth plotting on the Gantt. Workflow-level lifecycle
// events are a single bar per workflow (the histogram on top), so
// they don't add value here.
const PLOT_CATEGORIES: ReadonlySet<EventTypeCategory> = new Set([
  'activity',
  'timer',
  'child-workflow',
  'nexus',
])

interface DescribeResp {
  workflowExecutionInfo?: WorkflowExecution
  pendingActivities?: PendingActivity[]
  pendingNexusOperations?: PendingNexusOperation[]
}

interface HistoryResp {
  events?: HistoryEvent[]
}

export interface TimelinePaneProps {
  wf: WorkflowExecution
  ns?: string
}

export function TimelinePane({ wf, ns }: TimelinePaneProps) {
  const { ns: nsParam } = useParams()
  const namespace = ns ?? nsParam ?? ''
  const workflowId = wf.execution.workflowId
  const runId = wf.execution.runId

  const describeUrl = namespace
    ? Workflows.describeUrl(namespace, workflowId, runId)
    : null
  const historyUrl = namespace
    ? Workflows.historyUrl(namespace, workflowId, runId || undefined)
    : null

  const { data: describe, mutate: mutateDescribe } =
    useFetch<DescribeResp>(describeUrl)
  const {
    data: history,
    error: historyErr,
    isLoading: historyLoading,
    mutate: mutateHistory,
  } = useFetch<HistoryResp>(historyUrl)

  // Live tick — re-fetch describe + history every 5s while the pane
  // is mounted so in-flight bars track real time, and re-render every
  // second so the rightmost edge ("now") moves.
  useEffect(() => {
    if (!describeUrl) return
    const id = window.setInterval(() => {
      void mutateDescribe()
      void mutateHistory()
    }, POLL_MS)
    return () => window.clearInterval(id)
  }, [describeUrl, mutateDescribe, mutateHistory])

  const [, setTick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  const events = history?.events ?? []
  const pendingActivities =
    describe?.workflowExecutionInfo?.pendingActivities ??
    describe?.pendingActivities ??
    wf.pendingActivities ??
    []
  const pendingNexus =
    describe?.workflowExecutionInfo?.pendingNexusOperations ??
    describe?.pendingNexusOperations ??
    wf.pendingNexusOperations ??
    []

  const aggregated = useMemo(
    () => groupEvents(events, pendingActivities, pendingNexus),
    [events, pendingActivities, pendingNexus],
  )

  const { rows, spanStartMs, spanEndMs } = useMemo(
    () => buildRows(aggregated.groups),
    // Tick on the second so pending bars extend to "now". The
    // aggregated dependency captures real data changes; the second-
    // tick state forces a re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [aggregated, Math.floor(Date.now() / 1000)],
  )

  if (historyErr) return <ErrorState error={historyErr as Error} />
  if (historyLoading && !history) return <LoadingState />

  const baseHref = `/namespaces/${encodeURIComponent(namespace)}/workflows/${encodeURIComponent(workflowId)}`
  const runQs = runId ? `?runId=${encodeURIComponent(runId)}` : ''
  const hrefForRow = (row: TimelineGanttRow) => {
    // Latest event in the group is the canonical click target — if
    // the activity completed, that's the Completed event; if it's
    // still running we link to the most recent Started / Scheduled.
    const last = row.group.events[row.group.events.length - 1] ?? row.group.initialEvent
    return `${baseHref}/events/${encodeURIComponent(last.eventId)}${runQs}`
  }

  return (
    <YStack gap="$3">
      <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <XStack flexWrap="wrap" gap="$4">
          <Legend color="#86efac" label="Completed / Activity" />
          <Legend color="#fca5a5" label="Failed / Terminated" />
          <Legend color="#fdba74" label="Timed out" />
          <Legend color="#7dd3fc" label="Started" />
          <Legend color="#fcd34d" label="Timer / Fired" />
          <Legend color="#a5b4fc" label="Child workflow" />
          <Legend color="#f0abfc" label="Nexus" />
          <LegendPending />
        </XStack>
      </Card>

      <TimelineGantt
        rows={rows}
        spanStartMs={spanStartMs}
        spanEndMs={spanEndMs}
        hrefForRow={hrefForRow}
        emptyTitle="No activity timeline yet"
        emptyHint="Once activities, timers, or child workflows record their start times they appear here as Gantt bars."
      />
    </YStack>
  )
}

// buildRows — turns an EventGroup[] into the row array consumed by
// TimelineGantt. Filters down to plot-worthy categories, attaches the
// time bounds, and indents child-workflow rows under their parent.
//
// Exported for unit tests; the page wires it inline.
export function buildRows(groups: EventGroup[]): {
  rows: TimelineGanttRow[]
  spanStartMs: number
  spanEndMs: number
} {
  const now = Date.now()
  const filtered = groups.filter((g) => PLOT_CATEGORIES.has(g.category))
  const built: TimelineGanttRow[] = []
  let min = Infinity
  let max = -Infinity
  for (const g of filtered) {
    const startMs = g.startTime ? new Date(g.startTime).getTime() : NaN
    if (!Number.isFinite(startMs)) continue
    const endMs = g.endTime
      ? new Date(g.endTime).getTime()
      : g.isPending
        ? now
        : startMs
    const indent = g.category === 'child-workflow' ? 1 : 0
    built.push({
      group: g,
      startMs,
      endMs,
      durationMs: Math.max(0, endMs - startMs),
      pending: g.isPending,
      indent,
    })
    if (startMs < min) min = startMs
    if (endMs > max) max = endMs
  }
  // Sort by start, then by group id so the order is deterministic
  // when two activities scheduled in the same millisecond appear.
  built.sort((a, b) => {
    if (a.startMs !== b.startMs) return a.startMs - b.startMs
    const an = parseInt(a.group.id, 10)
    const bn = parseInt(b.group.id, 10)
    return Number.isFinite(an) && Number.isFinite(bn)
      ? an - bn
      : a.group.id.localeCompare(b.group.id)
  })
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { rows: built, spanStartMs: now, spanEndMs: now + 1000 }
  }
  // Pad span by 2% on each side so leading/trailing bars don't sit
  // flush against the gutter.
  const pad = Math.max(1, (max - min) * 0.02)
  return {
    rows: built,
    spanStartMs: min - pad,
    spanEndMs: max + pad,
  }
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <XStack items="center" gap="$1.5">
      <YStack width={10} height={10} rounded="$1" bg={color as never} />
      <Text fontSize="$1" color="$placeholderColor">
        {label}
      </Text>
    </XStack>
  )
}

function LegendPending() {
  return (
    <XStack items="center" gap="$1.5">
      <YStack
        width={10}
        height={10}
        rounded="$1"
        bg={'#86efac' as never}
        opacity={0.55}
      />
      <Text fontSize="$1" color="$placeholderColor">
        in flight
      </Text>
    </XStack>
  )
}
