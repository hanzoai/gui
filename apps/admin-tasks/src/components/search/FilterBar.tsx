// FilterBar — chip row that builds the workflow visibility query.
// Reads/writes the same `query` string the search input uses; chips
// are derived from the parsed AST so the bar and the raw input
// stay in sync. Anything in the query the bar can't represent
// (custom clauses, OR, STARTS_WITH …) is preserved untouched and
// re-emitted on every change.
//
// Built-in chips:
//   • Status — multi-select over WORKFLOW_STATUSES (ExecutionStatus IN …)
//   • Start time — preset / custom range (StartTime >= / <=)
// Add-on chips:
//   • Attribute — keyspace-aware single-attribute filter

import { useCallback, useMemo, useState } from 'react'
import { Button, Text, XStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import {
  WORKFLOW_STATUSES,
  type WorkflowStatus,
} from '../../lib/types'
import type { QueryClause } from '../../lib/format'
import {
  clausesFromQuery,
  clausesToQuery,
  removeClauses,
  setClause,
} from './clauses'
import { StatusFilterChip } from './StatusFilterChip'
import { TimeRangeFilterChip, type TimeRange } from './TimeRangeFilterChip'
import { SearchAttributeFilterChip } from './SearchAttributeFilterChip'
import { FilterChip } from './FilterChip'

export interface FilterBarProps {
  namespace: string
  query: string
  onChange: (next: string) => void
  // Disable the keyspace-aware attribute chip when advanced
  // visibility is off (cluster cannot evaluate the clause).
  advancedVisibilityEnabled?: boolean
}

export function FilterBar({
  namespace,
  query,
  onChange,
  advancedVisibilityEnabled = true,
}: FilterBarProps) {
  const clauses = useMemo(() => clausesFromQuery(query), [query])
  const [pendingAttrChip, setPendingAttrChip] = useState<{ id: string } | null>(null)

  // Derive built-in chip state from the clause list.
  const status = useMemo(() => extractStatus(clauses), [clauses])
  const timeRange = useMemo(() => extractTimeRange(clauses), [clauses])
  const attrClauses = useMemo(() => extractCustom(clauses), [clauses])

  const emit = useCallback(
    (next: QueryClause[]) => onChange(clausesToQuery(next)),
    [onChange],
  )

  function setStatuses(values: WorkflowStatus[]) {
    let next = removeClauses(
      clauses,
      (c) => c.field === 'ExecutionStatus' && (c.op === '=' || c.op === 'IN'),
    )
    if (values.length === 1) {
      next = setClause(next, {
        type: 'clause',
        field: 'ExecutionStatus',
        op: '=',
        value: values[0],
      })
    } else if (values.length > 1) {
      next = setClause(next, {
        type: 'clause',
        field: 'ExecutionStatus',
        op: 'IN',
        value: values.slice(),
      })
    }
    emit(next)
  }

  function setRange(range: TimeRange) {
    let next = removeClauses(
      clauses,
      (c) => c.field === 'StartTime' && (c.op === '>=' || c.op === '<='),
    )
    if (range.from) {
      next.push({ type: 'clause', field: 'StartTime', op: '>=', value: range.from })
    }
    if (range.to) {
      next.push({ type: 'clause', field: 'StartTime', op: '<=', value: range.to })
    }
    emit(next)
  }

  function upsertAttribute(prev: QueryClause | undefined, nextClause: QueryClause | null) {
    let next = clauses
    if (prev) {
      next = removeClauses(
        next,
        (c) => c.field === prev.field && c.op === prev.op && sameValue(c.value, prev.value),
      )
    }
    if (nextClause) next = [...next, nextClause]
    emit(next)
  }

  return (
    <XStack gap="$2" items="center" flexWrap="wrap">
      <StatusFilterChip
        selected={status}
        onChange={setStatuses}
        onRemove={status.length > 0 ? () => setStatuses([]) : undefined}
      />
      <TimeRangeFilterChip
        value={timeRange}
        onChange={setRange}
        onRemove={timeRange.from || timeRange.to ? () => setRange({}) : undefined}
      />
      {attrClauses.map((c, i) => (
        <SearchAttributeFilterChip
          key={`${c.field}-${i}`}
          namespace={namespace}
          initial={c}
          enabled={advancedVisibilityEnabled}
          onChange={(next) => upsertAttribute(c, next)}
          onRemove={() => upsertAttribute(c, null)}
        />
      ))}
      {pendingAttrChip ? (
        <SearchAttributeFilterChip
          namespace={namespace}
          enabled={advancedVisibilityEnabled}
          onChange={(next) => {
            setPendingAttrChip(null)
            if (next) upsertAttribute(undefined, next)
          }}
          onRemove={() => setPendingAttrChip(null)}
        />
      ) : null}
      <Button
        size="$2"
        chromeless
        onPress={() => setPendingAttrChip({ id: String(Date.now()) })}
        aria-label="Add attribute filter"
        disabled={!advancedVisibilityEnabled}
        opacity={advancedVisibilityEnabled ? 1 : 0.5}
      >
        <XStack items="center" gap="$1">
          <Plus size={12} color="#7e8794" />
          <Text fontSize="$1" color="$placeholderColor">
            Add filter
          </Text>
        </XStack>
      </Button>
      {!advancedVisibilityEnabled ? (
        <FilterChip label="Advanced visibility off" disabled />
      ) : null}
    </XStack>
  )
}

function extractStatus(clauses: QueryClause[]): WorkflowStatus[] {
  for (const c of clauses) {
    if (c.field !== 'ExecutionStatus') continue
    if (c.op === '=' && typeof c.value === 'string' && isStatus(c.value)) {
      return [c.value]
    }
    if (c.op === 'IN' && Array.isArray(c.value)) {
      return c.value.filter((v): v is WorkflowStatus => typeof v === 'string' && isStatus(v))
    }
  }
  return []
}

function isStatus(s: string): s is WorkflowStatus {
  return (WORKFLOW_STATUSES as readonly string[]).includes(s)
}

function extractTimeRange(clauses: QueryClause[]): TimeRange {
  let from: string | undefined
  let to: string | undefined
  for (const c of clauses) {
    if (c.field !== 'StartTime') continue
    if (c.op === '>=' && typeof c.value === 'string') from = c.value
    if (c.op === '<=' && typeof c.value === 'string') to = c.value
  }
  return { from, to }
}

// Anything that isn't a built-in chip's clause is treated as a
// custom-attribute filter and surfaced as its own SearchAttributeFilterChip.
function extractCustom(clauses: QueryClause[]): QueryClause[] {
  return clauses.filter((c) => {
    if (c.field === 'ExecutionStatus' && (c.op === '=' || c.op === 'IN')) return false
    if (c.field === 'StartTime' && (c.op === '>=' || c.op === '<=')) return false
    return true
  })
}

function sameValue(a: QueryClause['value'], b: QueryClause['value']): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((v, i) => v === b[i])
  }
  return a === b
}
