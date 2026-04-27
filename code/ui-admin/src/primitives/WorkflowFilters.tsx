// WorkflowFilters — port of upstream temporalio/ui
// workflow-filters.svelte. Compact filter band that emits a
// `WorkflowQuery` object the parent feeds back into the API call.
//
// Two modes:
//  - basic: 4 controls (workflowId, workflowType, timeRange, status)
//    that compose into a Temporal-SQL query string at the call site.
//  - advanced: a single SearchInput accepting raw query text.
//
// The mode toggle is a controlled prop; the filter band is stateless
// otherwise. Callers own the WorkflowQuery and emit URL writes, which
// keeps deep-linking trivial (one round-trip: query → URL → query).

import { Input, Select, Text, XStack, YStack } from 'hanzogui'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { SearchInput } from './SearchInput'
import type { WorkflowStatus } from '../data/format'

// Time-range presets from upstream `to-duration.ts`. The string is
// passed through as-is to the API; the API parses it into a
// "now - duration" lower-bound on StartTime.
export const WORKFLOW_TIME_RANGES = [
  'All',
  '15 minutes',
  '1 hour',
  '3 hours',
  '24 hours',
  '3 days',
  '7 days',
  '30 days',
  '3 months',
] as const
export type WorkflowTimeRange = (typeof WORKFLOW_TIME_RANGES)[number]

// Status options — `null` means "any status". Matches upstream's
// statuses object where `All` is null.
export const WORKFLOW_STATUS_OPTIONS: ReadonlyArray<{
  label: string
  value: WorkflowStatus | null
}> = [
  { label: 'All', value: null },
  { label: 'Running', value: 'Running' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Canceled', value: 'Canceled' },
  { label: 'Terminated', value: 'Terminated' },
  { label: 'Continued as New', value: 'ContinuedAsNew' },
  { label: 'Timed Out', value: 'TimedOut' },
]

// WorkflowQuery — the shape the filter band produces. Parent owns
// it; the band edits it. Empty/null values mean "no filter on this
// field". Keep the shape minimal; advanced users use the rawQuery
// path via the search-input mode.
export interface WorkflowQuery {
  workflowId: string
  workflowType: string
  timeRange: WorkflowTimeRange
  status: WorkflowStatus | null
}

export const EMPTY_WORKFLOW_QUERY: WorkflowQuery = {
  workflowId: '',
  workflowType: '',
  timeRange: 'All',
  status: null,
}

export interface WorkflowFiltersProps {
  mode: 'basic' | 'advanced'
  onModeChange: (next: 'basic' | 'advanced') => void
  // Basic-mode inputs. Always provided; the parent toggles which
  // half of the band is rendered via `mode`.
  query: WorkflowQuery
  onQueryChange: (next: WorkflowQuery) => void
  // Advanced-mode raw query text. Distinct from the basic-mode
  // structured query so users can flip back without losing state.
  rawQuery: string
  onRawQueryChange: (next: string) => void
  onSubmit?: () => void
}

export function WorkflowFilters({
  mode,
  onModeChange,
  query,
  onQueryChange,
  rawQuery,
  onRawQueryChange,
  onSubmit,
}: WorkflowFiltersProps) {
  return (
    <YStack gap="$2">
      <XStack justify="flex-end">
        <ModeLink
          mode={mode === 'advanced' ? 'basic' : 'advanced'}
          onPress={() => onModeChange(mode === 'advanced' ? 'basic' : 'advanced')}
        />
      </XStack>
      {mode === 'advanced' ? (
        <SearchInput
          value={rawQuery}
          onChange={onRawQueryChange}
          onSubmit={onSubmit}
          placeholder='WorkflowType="MyWorkflow" AND ExecutionStatus="Running"'
        />
      ) : (
        <XStack gap="$2" flexWrap="wrap">
          <Input
            size="$3"
            flex={1}
            minWidth={140}
            placeholder="Workflow ID"
            value={query.workflowId}
            onChangeText={(workflowId: string) => onQueryChange({ ...query, workflowId })}
            aria-label="Workflow ID"
          />
          <Input
            size="$3"
            flex={1}
            minWidth={140}
            placeholder="Workflow Type"
            value={query.workflowType}
            onChangeText={(workflowType: string) =>
              onQueryChange({ ...query, workflowType })
            }
            aria-label="Workflow Type"
          />
          <Select
            value={query.timeRange}
            onValueChange={(timeRange: string) =>
              onQueryChange({ ...query, timeRange: timeRange as WorkflowTimeRange })
            }
          >
            <Select.Trigger
              minWidth={140}
              size="$3"
              iconAfter={ChevronDown as never}
              aria-label="Time range"
            >
              <Select.Value placeholder="Time" />
            </Select.Trigger>
            <Select.Content>
              <Select.Viewport>
                <Select.Group>
                  <Select.Label>Time range</Select.Label>
                  {WORKFLOW_TIME_RANGES.map((tr, i) => (
                    <Select.Item key={tr} index={i} value={tr}>
                      <Select.ItemText>{tr}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>
            </Select.Content>
          </Select>
          <Select
            value={query.status === null ? '__all__' : query.status}
            onValueChange={(s: string) =>
              onQueryChange({
                ...query,
                status: s === '__all__' ? null : (s as WorkflowStatus),
              })
            }
          >
            <Select.Trigger
              minWidth={140}
              size="$3"
              iconAfter={ChevronDown as never}
              aria-label="Status"
            >
              <Select.Value placeholder="Status" />
            </Select.Trigger>
            <Select.Content>
              <Select.Viewport>
                <Select.Group>
                  <Select.Label>Status</Select.Label>
                  {WORKFLOW_STATUS_OPTIONS.map((opt, i) => (
                    <Select.Item
                      key={opt.value ?? '__all__'}
                      index={i}
                      value={opt.value ?? '__all__'}
                    >
                      <Select.ItemText>{opt.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>
            </Select.Content>
          </Select>
        </XStack>
      )}
    </YStack>
  )
}

function ModeLink({
  mode,
  onPress,
}: {
  mode: 'basic' | 'advanced'
  onPress: () => void
}) {
  return (
    <Text
      fontSize="$1"
      color={'#93c5fd' as never}
      cursor={'pointer' as never}
      hoverStyle={{ textDecorationLine: 'underline' as never }}
      onPress={onPress}
      role={'link' as never}
    >
      {mode === 'advanced' ? 'Advanced search' : 'Basic search'}
    </Text>
  )
}

// toListWorkflowQuery — serializes a WorkflowQuery into the
// Temporal-SQL string the API expects. Mirrors upstream
// `to-list-workflow-query.ts` shape so URLs round-trip identically.
//
// Empty fields are dropped. `All` time range and `null` status
// produce no clause.
export function toListWorkflowQuery(q: WorkflowQuery): string {
  const clauses: string[] = []
  if (q.workflowId.trim()) clauses.push(`WorkflowId="${escape(q.workflowId.trim())}"`)
  if (q.workflowType.trim()) clauses.push(`WorkflowType="${escape(q.workflowType.trim())}"`)
  if (q.status !== null) clauses.push(`ExecutionStatus="${q.status}"`)
  if (q.timeRange !== 'All') {
    const since = sinceFromRange(q.timeRange)
    if (since) clauses.push(`StartTime >= "${since}"`)
  }
  return clauses.join(' AND ')
}

const ESCAPE_PATTERN = /["\\]/g
function escape(v: string): string {
  return v.replace(ESCAPE_PATTERN, (m) => `\\${m}`)
}

const RANGE_TO_MS: Record<Exclude<WorkflowTimeRange, 'All'>, number> = {
  '15 minutes': 15 * 60_000,
  '1 hour': 60 * 60_000,
  '3 hours': 3 * 60 * 60_000,
  '24 hours': 24 * 60 * 60_000,
  '3 days': 3 * 24 * 60 * 60_000,
  '7 days': 7 * 24 * 60 * 60_000,
  '30 days': 30 * 24 * 60 * 60_000,
  '3 months': 90 * 24 * 60 * 60_000,
}

function sinceFromRange(r: WorkflowTimeRange, now: Date = new Date()): string | null {
  if (r === 'All') return null
  const ms = RANGE_TO_MS[r]
  return new Date(now.getTime() - ms).toISOString()
}

// Exported for tests — converts a range to the absolute lower bound.
export { sinceFromRange as workflowTimeRangeLowerBound }
