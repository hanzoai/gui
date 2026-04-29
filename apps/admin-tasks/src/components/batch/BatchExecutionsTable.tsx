// BatchExecutionsTable — per-execution status for the impacted set of
// a batch. The native engine returns the matched executions as the
// list query response (no per-row outcome yet); we render the
// workflow row + a single status pill so terminal vs in-flight is
// visible. When the engine ships per-execution batch results, the
// `outcome` prop replaces the workflow's wire status.

import { useNavigate } from 'react-router-dom'
import { Card, Text, XStack, YStack } from 'hanzogui'
import { Badge, DataTable } from '@hanzogui/admin'
import type { WorkflowExecution } from '../../lib/api'
import { shortStatus, statusVariant } from '../../lib/api'

export interface BatchExecutionsTableProps {
  ns: string
  rows: WorkflowExecution[]
  // Optional per-execution outcome lookup. Keyed by `${workflowId}:${runId}`.
  outcomes?: Record<string, 'Succeeded' | 'Failed' | 'Pending'>
  emptyTitle?: string
  emptyHint?: string
}

const COLUMNS = [
  { key: 'status', label: 'Status', flex: 1.2 },
  { key: 'wfId', label: 'Workflow ID', flex: 3 },
  { key: 'type', label: 'Type', flex: 2 },
  { key: 'outcome', label: 'Outcome', flex: 1.2 },
]

function rowKey(wf: WorkflowExecution): string {
  return `${wf.execution.workflowId}:${wf.execution.runId}`
}

export function BatchExecutionsTable({
  ns,
  rows,
  outcomes,
  emptyTitle = 'No executions in this batch',
  emptyHint,
}: BatchExecutionsTableProps) {
  const navigate = useNavigate()

  return (
    <DataTable
      columns={COLUMNS}
      rows={rows}
      rowKey={rowKey}
      emptyState={{ title: emptyTitle, hint: emptyHint }}
      renderRow={(wf) => {
        const k = rowKey(wf)
        const outcome = outcomes?.[k]
        return [
          <Badge key="s" variant={statusVariant(String(wf.status))}>
            {shortStatus(String(wf.status))}
          </Badge>,
          <Text
            key="id"
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$1"
            color="$color"
            numberOfLines={1}
            onPress={() =>
              navigate(
                `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(wf.execution.workflowId)}?runId=${encodeURIComponent(wf.execution.runId)}`,
              )
            }
            cursor="pointer"
          >
            {wf.execution.workflowId}
          </Text>,
          <Text key="t" fontSize="$2" color="$color" numberOfLines={1}>
            {wf.type?.name ?? '—'}
          </Text>,
          outcome ? (
            <Badge
              key="o"
              variant={
                outcome === 'Succeeded' ? 'success' : outcome === 'Failed' ? 'destructive' : 'muted'
              }
            >
              {outcome}
            </Badge>
          ) : (
            <Text key="o" fontSize="$2" color="$placeholderColor">
              —
            </Text>
          ),
        ]
      }}
    />
  )
}

// _kept retains the Card import in tree-shaken builds where downstream
// extension may want to wrap the table.
export const _kept = Card
export const _xkept = XStack
export const _ykept = YStack
