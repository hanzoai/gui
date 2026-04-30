// WorkflowTable — list rendering for workflow executions. Thin
// wrapper around @hanzogui/admin's WorkflowsTable that maps the
// tasks-API WorkflowExecution shape onto WorkflowsTableRow and wires
// the row click into navigation. Sorting is client-side because the
// API does not yet expose a sort-key.
//
// `selectable` opts the leading checkbox column into the row. The
// caller owns the Set of selected keys (rowKey is `<id>/<runId>`)
// so the parent can mount a bulk-action toolbar without coupling
// the table to it.

import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  WorkflowsTable,
  sortRows,
  type WorkflowsTableRow,
  type WorkflowSort,
} from '@hanzogui/admin'
import type { WorkflowExecution } from '../../lib/api'

export interface WorkflowTableProps {
  ns: string
  rows: WorkflowExecution[]
  sort?: WorkflowSort
  onSortChange?: (next: WorkflowSort) => void
  emptyState?: { title: string; hint?: string }
  // Selection — when provided, the table renders a checkbox column.
  // `selected` is the Set of row keys (`workflowId/runId`); parent
  // owns toggle state. Keep these props together so the type system
  // forces all-three-or-none.
  selectable?: boolean
  selected?: ReadonlySet<string>
  onToggle?: (rowKey: string) => void
  onToggleAll?: (rowKeys: string[], selectAll: boolean) => void
}

// rowKey — must match the internal extractor in @hanzogui/admin's
// WorkflowsTable (`${workflowId}::${runId}`). Selection sets are
// keyed by this string so the table's per-row checkbox toggles map
// 1:1 to the parent's `selected` Set.
export function rowKey(workflowId: string, runId: string): string {
  return `${workflowId}::${runId}`
}

export function WorkflowTable({
  ns,
  rows,
  sort,
  onSortChange,
  emptyState,
  selectable,
  selected,
  onToggle,
  onToggleAll,
}: WorkflowTableProps) {
  const navigate = useNavigate()

  const tableRows = useMemo<WorkflowsTableRow[]>(() => {
    const mapped = rows.map((wf) => ({
      workflowId: wf.execution.workflowId,
      runId: wf.execution.runId,
      status: String(wf.status),
      type: wf.type?.name ?? '',
      startTime: wf.startTime,
      closeTime: wf.closeTime,
      historyLength: typeof wf.historyLength === 'number' ? wf.historyLength : undefined,
    }))
    return sort ? sortRows(mapped, sort) : mapped
  }, [rows, sort])

  const selection = useMemo(() => {
    if (!selectable) return undefined
    const empty: ReadonlySet<string> = new Set<string>()
    return {
      selected: selected ?? empty,
      onToggle: (key: string) => onToggle?.(key),
      onToggleAll: (visibleRows: WorkflowsTableRow[], selectAll: boolean) => {
        const keys = visibleRows.map((r) => rowKey(r.workflowId, r.runId))
        onToggleAll?.(keys, selectAll)
      },
    }
  }, [selectable, selected, onToggle, onToggleAll])

  return (
    <WorkflowsTable
      rows={tableRows}
      sort={sort}
      onSortChange={onSortChange}
      onRowClick={useCallback(
        (r: WorkflowsTableRow) =>
          navigate(
            `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(r.workflowId)}?runId=${encodeURIComponent(r.runId)}`,
          ),
        [navigate, ns],
      )}
      emptyState={emptyState}
      selection={selection}
    />
  )
}
