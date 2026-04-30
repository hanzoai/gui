// ActivityHistoryPane — fetches the per-activity event history and
// reuses the workflow HistoryTree adapter. The wire envelope is the
// same `events` shape the workflow history endpoint emits, so the same
// renderer works without a second tree implementation. When the engine
// returns no rows (worker SDK not yet emitting), surface an honest
// empty state.

import { YStack } from 'hanzogui'
import { Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { Activities } from '../../lib/api'
import type { GetWorkflowExecutionHistoryResponse } from '../../lib/api'
import { HistoryTree } from '../workflow/HistoryTree'

export interface ActivityHistoryPaneProps {
  ns: string
  activityId: string
  runId: string
}

export function ActivityHistoryPane({ ns, activityId, runId }: ActivityHistoryPaneProps) {
  const url = Activities.historyUrl(ns, activityId, runId)
  const { data, error, isLoading } = useFetch<GetWorkflowExecutionHistoryResponse>(url)

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  const events = data.events ?? data.history?.events ?? []

  return (
    <YStack gap="$3">
      {/* HistoryTree expects (ns, workflowId, runId) — the activity
          variant reuses the same component because the rendered event
          rows are the same shape. The path it builds for "see event"
          links points at /workflows/{id} which is wrong here; until the
          backend emits per-activity event-detail routes the link would
          404. Ship the tree without per-event drilldown for now. */}
      {events.length === 0 ? (
        <Empty
          title="No events recorded yet"
          hint="History rows appear once the worker SDK runtime starts emitting ActivityTask events."
        />
      ) : (
        <HistoryTree
          ns={ns}
          workflowId={activityId}
          runId={runId}
          events={events}
        />
      )}
    </YStack>
  )
}
