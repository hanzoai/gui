// WorkflowTable — list rendering for workflow executions. Thin
// wrapper around @hanzogui/admin's WorkflowsTable that maps the
// tasks-API WorkflowExecution shape onto WorkflowsTableRow and wires
// the row click into navigation. Sorting is client-side because the
// API does not yet expose a sort-key.

import { useMemo } from 'react'
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
}

export function WorkflowTable({ ns, rows, sort, onSortChange, emptyState }: WorkflowTableProps) {
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

  return (
    <WorkflowsTable
      rows={tableRows}
      sort={sort}
      onSortChange={onSortChange}
      onRowClick={(r: WorkflowsTableRow) =>
        navigate(
          `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(r.workflowId)}?runId=${encodeURIComponent(r.runId)}`,
        )
      }
      emptyState={emptyState}
    />
  )
}
