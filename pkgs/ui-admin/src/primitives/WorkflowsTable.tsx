// WorkflowsTable — port of upstream temporalio/ui
// workflows-summary-configurable-table.svelte. Composes DataTable +
// WorkflowStatusBadge + selection model into the canonical workflow
// list rendering.
//
// Columns (mirrors upstream defaults):
//   Status · Workflow ID · Run ID · Type · Start · End
//
// Sortable headers: Workflow ID, Type, Start, End, History Length.
// Sort is client-side over the supplied rows; for server-side sort
// the parent passes pre-sorted rows and ignores `sort`.
//
// Virtualization: when rows.length > VIRTUALIZE_THRESHOLD (200), only
// the visible window is rendered. Implemented via a fixed-height
// scroll container with a sliding render slice — no react-window
// dep, since rows are small primitives and the column shape is fixed
// (uniform row height). Adds ~30 lines vs ~3 KB of dep code.

import { useCallback, useMemo, useState } from 'react'
import type { ReactNode, UIEvent } from 'react'
import { Text, XStack, YStack } from 'hanzogui'
import { ArrowDown } from '@hanzogui/lucide-icons-2/icons/ArrowDown'
import { ArrowUp } from '@hanzogui/lucide-icons-2/icons/ArrowUp'
import { DataTable, type DataTableColumn, type DataTableSelection } from './DataTable'
import { WorkflowStatusBadge } from './WorkflowStatusBadge'
import { formatTimestamp } from '../data/format'

// Wire-shape we care about — duplicates the consumer's WorkflowExecution
// just enough that the table can stay decoupled from the tasks API
// types. Callers map their own shape onto this; no upstream coupling.
export interface WorkflowsTableRow {
  workflowId: string
  runId: string
  status: string
  type: string
  startTime?: string
  closeTime?: string
  historyLength?: number
}

export type WorkflowSortKey =
  | 'workflowId'
  | 'type'
  | 'startTime'
  | 'closeTime'
  | 'historyLength'

export interface WorkflowSort {
  key: WorkflowSortKey
  direction: 'asc' | 'desc'
}

export interface WorkflowsTableProps {
  rows: WorkflowsTableRow[]
  // Click handler for a row — typically navigates to detail. Receives
  // the row so the caller can build the URL itself.
  onRowClick?: (row: WorkflowsTableRow) => void
  // Optional select-all + per-row selection state. When omitted, the
  // table renders without checkboxes.
  selection?: DataTableSelection<WorkflowsTableRow>
  // Controlled sort. When provided, the table renders sort affordances
  // on sortable column headers. The caller is responsible for
  // returning rows in the correct order — sorting itself is parent's
  // job (server-side or via `sortRows` helper below).
  sort?: WorkflowSort
  onSortChange?: (next: WorkflowSort) => void
  emptyState?: { title: string; hint?: string }
}

export const WORKFLOWS_TABLE_DEFAULT_EMPTY = {
  title: 'No workflows yet',
  hint: 'Start one with the button above, or run a worker that registers a workflow type.',
}

// Threshold beyond which rows are virtualized. Below this we render
// the full list — the cost of windowing the small case isn't worth
// the complexity.
export const VIRTUALIZE_THRESHOLD = 200
const ROW_HEIGHT_PX = 44
const VIRTUALIZE_VIEWPORT_PX = 720
const VIRTUALIZE_OVERSCAN = 6

export function WorkflowsTable({
  rows,
  onRowClick,
  selection,
  sort,
  onSortChange,
  emptyState = WORKFLOWS_TABLE_DEFAULT_EMPTY,
}: WorkflowsTableProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const virtualize = rows.length > VIRTUALIZE_THRESHOLD

  const visibleSlice = useMemo(() => {
    if (!virtualize) return { start: 0, end: rows.length, padTop: 0, padBottom: 0 }
    const start = Math.max(
      0,
      Math.floor(scrollTop / ROW_HEIGHT_PX) - VIRTUALIZE_OVERSCAN,
    )
    const visibleCount = Math.ceil(VIRTUALIZE_VIEWPORT_PX / ROW_HEIGHT_PX)
    const end = Math.min(rows.length, start + visibleCount + VIRTUALIZE_OVERSCAN * 2)
    return {
      start,
      end,
      padTop: start * ROW_HEIGHT_PX,
      padBottom: (rows.length - end) * ROW_HEIGHT_PX,
    }
  }, [virtualize, rows.length, scrollTop])

  const slicedRows = useMemo(
    () => (virtualize ? rows.slice(visibleSlice.start, visibleSlice.end) : rows),
    [virtualize, rows, visibleSlice],
  )

  const requestSort = useCallback(
    (key: WorkflowSortKey) => {
      if (!onSortChange) return
      const direction: 'asc' | 'desc' =
        sort?.key === key && sort.direction === 'asc' ? 'desc' : 'asc'
      onSortChange({ key, direction })
    },
    [onSortChange, sort],
  )

  const columns: DataTableColumn[] = useMemo(
    () => [
      { key: 'status', label: 'Status', flex: 1.2 },
      {
        key: 'workflowId',
        label: <SortableHeader label="Workflow ID" k="workflowId" sort={sort} requestSort={requestSort} sortable={!!onSortChange} />,
        flex: 3,
      },
      { key: 'runId', label: 'Run ID', flex: 1.5 },
      {
        key: 'type',
        label: <SortableHeader label="Type" k="type" sort={sort} requestSort={requestSort} sortable={!!onSortChange} />,
        flex: 2,
      },
      {
        key: 'startTime',
        label: <SortableHeader label="Start" k="startTime" sort={sort} requestSort={requestSort} sortable={!!onSortChange} />,
        flex: 2,
      },
      {
        key: 'closeTime',
        label: <SortableHeader label="End" k="closeTime" sort={sort} requestSort={requestSort} sortable={!!onSortChange} />,
        flex: 2,
      },
    ],
    [sort, requestSort, onSortChange],
  )

  const renderRow = useCallback(
    (row: WorkflowsTableRow): ReactNode[] => {
      const id = row.workflowId
      return [
        <WorkflowStatusBadge key="s" status={row.status} />,
        <Text
          key="wfid"
          fontSize="$2"
          color={onRowClick ? ('#86efac' as never) : '$color'}
          numberOfLines={1}
          cursor={onRowClick ? ('pointer' as never) : undefined}
          onPress={onRowClick ? () => onRowClick(row) : undefined}
          role={onRowClick ? ('link' as never) : undefined}
        >
          {id}
        </Text>,
        <Text
          key="run"
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          fontSize="$1"
          color="$placeholderColor"
        >
          {row.runId.slice(0, 8)}
        </Text>,
        <Text key="t" fontSize="$2" color="$color">
          {row.type}
        </Text>,
        <Text key="st" fontSize="$2" color="$placeholderColor">
          {row.startTime ? formatTimestamp(new Date(row.startTime)) : '—'}
        </Text>,
        <Text key="end" fontSize="$2" color="$placeholderColor">
          {row.closeTime ? formatTimestamp(new Date(row.closeTime)) : '—'}
        </Text>,
      ]
    },
    [onRowClick],
  )

  const rowKey = useCallback(
    (r: WorkflowsTableRow) => `${r.workflowId}::${r.runId}`,
    [],
  )

  const tableNode = (
    <DataTable
      columns={columns}
      rows={slicedRows}
      renderRow={renderRow}
      rowKey={rowKey}
      emptyState={emptyState}
      selection={selection}
    />
  )

  if (!virtualize) return tableNode

  // Virtualized path — wrap in a fixed-height scroller and pad above/
  // below the visible slice so the scrollbar reflects the full list.
  return (
    <YStack
      maxH={VIRTUALIZE_VIEWPORT_PX}
      overflow="scroll"
      onScroll={(e: UIEvent<HTMLDivElement>) =>
        setScrollTop(e.currentTarget.scrollTop)
      }
    >
      {visibleSlice.padTop > 0 ? (
        <YStack height={visibleSlice.padTop} aria-hidden />
      ) : null}
      {tableNode}
      {visibleSlice.padBottom > 0 ? (
        <YStack height={visibleSlice.padBottom} aria-hidden />
      ) : null}
    </YStack>
  )
}

// sortRows — small client-side sort over the table's known keys.
// Stable sort (Array.prototype.sort with explicit fallback to index)
// so equal keys preserve insertion order.
export function sortRows(
  rows: WorkflowsTableRow[],
  sort: WorkflowSort,
): WorkflowsTableRow[] {
  const indexed = rows.map((r, i) => ({ r, i }))
  const dir = sort.direction === 'asc' ? 1 : -1
  indexed.sort((a, b) => {
    const av = pluckSort(a.r, sort.key)
    const bv = pluckSort(b.r, sort.key)
    if (av === bv) return a.i - b.i
    if (av === undefined) return 1
    if (bv === undefined) return -1
    return av < bv ? -dir : dir
  })
  return indexed.map(({ r }) => r)
}

function pluckSort(r: WorkflowsTableRow, k: WorkflowSortKey): string | number | undefined {
  switch (k) {
    case 'workflowId':
      return r.workflowId
    case 'type':
      return r.type
    case 'startTime':
      return r.startTime ? new Date(r.startTime).getTime() : undefined
    case 'closeTime':
      return r.closeTime ? new Date(r.closeTime).getTime() : undefined
    case 'historyLength':
      return r.historyLength
  }
}

function SortableHeader({
  label,
  k,
  sort,
  requestSort,
  sortable,
}: {
  label: string
  k: WorkflowSortKey
  sort: WorkflowSort | undefined
  requestSort: (k: WorkflowSortKey) => void
  sortable: boolean
}) {
  if (!sortable) {
    return (
      <Text fontSize="$1" fontWeight="500" color="$placeholderColor">
        {label}
      </Text>
    )
  }
  const active = sort?.key === k
  return (
    <XStack
      gap="$1"
      items="center"
      cursor={'pointer' as never}
      role={'button' as never}
      aria-label={`Sort by ${label}`}
      onPress={() => requestSort(k)}
    >
      <Text
        fontSize="$1"
        fontWeight={active ? '600' : '500'}
        color={active ? '$color' : '$placeholderColor'}
      >
        {label}
      </Text>
      {active ? (
        sort?.direction === 'asc' ? (
          <ArrowUp size={10} color="#cbd5e1" />
        ) : (
          <ArrowDown size={10} color="#cbd5e1" />
        )
      ) : null}
    </XStack>
  )
}
