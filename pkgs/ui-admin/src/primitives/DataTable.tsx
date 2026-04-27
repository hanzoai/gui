// DataTable — small primitive for the bordered, header-and-rows
// pattern used by every list page. The shape is the same across
// Workflows / Schedules / Batches / Deployments / TaskQueues, so we
// keep the markup in one place. Headers are always rendered, even at
// zero rows; the empty body shows a single hint row with the page's
// own copy.
//
// The columns API is intentionally tiny: each column has a flex weight
// and a label. Rows are opaque to the table — the caller renders the
// row content as a child function. This avoids forcing a per-row data
// shape on the call site.
//
// Optional selection: pass `selection` to enable a leading checkbox
// column (used by Workflows for batch operations). The table is
// agnostic to the selection model — the parent controls the Set of
// keys; the table only renders checkboxes and forwards toggle events.

import { useMemo, type ReactNode } from 'react'
import { Card, Checkbox, Text, XStack, YStack } from 'hanzogui'
import { Check } from '@hanzogui/lucide-icons-2/icons/Check'

export interface DataTableColumn {
  key: string
  label: ReactNode
  flex: number
}

export interface DataTableSelection<T> {
  // Keys (extracted via rowKey) of currently selected rows.
  selected: ReadonlySet<string>
  // Toggle a single row by key. The table calls this on every
  // checkbox change.
  onToggle: (key: string, row: T) => void
  // Toggle all currently visible rows. The table calls this when the
  // header checkbox is clicked.
  onToggleAll: (rows: T[], selectAll: boolean) => void
}

export interface DataTableProps<T> {
  columns: DataTableColumn[]
  rows: T[]
  // Renders the row's cells. Length must match columns. The table wraps
  // each cell in a YStack with the column's flex.
  renderRow: (row: T, idx: number) => ReactNode[]
  // Stable key extractor for row reconciliation. Also used as the key
  // for selection when `selection` is provided.
  rowKey: (row: T, idx: number) => string
  // Empty body copy when rows is zero-length. Title is bold; hint is
  // de-emphasized below.
  emptyState: { title: string; hint?: string }
  // When provided, prepends a checkbox column with select-all and
  // per-row toggles. Parent owns the Set of selected keys; this is
  // intentionally a controlled prop pair.
  selection?: DataTableSelection<T>
}

const SELECTION_COL_FLEX = 0.4

export function DataTable<T>({
  columns,
  rows,
  renderRow,
  rowKey,
  emptyState,
  selection,
}: DataTableProps<T>) {
  // Header checkbox state: indeterminate when some-but-not-all rows
  // are selected. The Checkbox primitive doesn't surface mixed state
  // directly; we render an empty box for "none" and a check for
  // "all" — partial selection visually defaults to "none" but the
  // click toggles to "all" first, which matches upstream.
  const allRowKeys = useMemo(
    () => (selection ? rows.map((r, i) => rowKey(r, i)) : []),
    [rows, rowKey, selection],
  )
  const allSelected =
    selection !== undefined &&
    rows.length > 0 &&
    allRowKeys.every((k) => selection.selected.has(k))

  return (
    <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <XStack
        bg={'rgba(255,255,255,0.03)' as never}
        px="$4"
        py="$2.5"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        {selection ? (
          <YStack flex={SELECTION_COL_FLEX} px="$2" items="center" justify="center">
            <Checkbox
              size="$2"
              checked={allSelected}
              onCheckedChange={(checked) =>
                selection.onToggleAll(rows, checked === true)
              }
              aria-label="Select all rows"
            >
              <Checkbox.Indicator>
                <Check size={12} />
              </Checkbox.Indicator>
            </Checkbox>
          </YStack>
        ) : null}
        {columns.map((c) => (
          <YStack key={c.key} flex={c.flex} px="$2">
            <Text fontSize="$1" fontWeight="500" color="$placeholderColor">
              {c.label}
            </Text>
          </YStack>
        ))}
      </XStack>
      {rows.length === 0 ? (
        <YStack px="$4" py="$5" items="center" gap="$1">
          <Text fontSize="$3" color="$color" fontWeight="500">
            {emptyState.title}
          </Text>
          {emptyState.hint ? (
            <Text fontSize="$2" color="$placeholderColor" text="center">
              {emptyState.hint}
            </Text>
          ) : null}
        </YStack>
      ) : (
        rows.map((row, i) => {
          const cells = renderRow(row, i)
          const k = rowKey(row, i)
          const isSelected = selection?.selected.has(k) ?? false
          return (
            <XStack
              key={k}
              px="$4"
              py="$2.5"
              borderBottomWidth={i === rows.length - 1 ? 0 : 1}
              borderBottomColor="$borderColor"
              hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
              bg={
                isSelected
                  ? ('rgba(59,130,246,0.06)' as never)
                  : ('transparent' as never)
              }
              items="center"
            >
              {selection ? (
                <YStack flex={SELECTION_COL_FLEX} px="$2" items="center" justify="center">
                  <Checkbox
                    size="$2"
                    checked={isSelected}
                    onCheckedChange={() => selection.onToggle(k, row)}
                    aria-label={`Select row ${k}`}
                  >
                    <Checkbox.Indicator>
                      <Check size={12} />
                    </Checkbox.Indicator>
                  </Checkbox>
                </YStack>
              ) : null}
              {columns.map((c, ci) => (
                <YStack key={c.key} flex={c.flex} px="$2">
                  {cells[ci]}
                </YStack>
              ))}
            </XStack>
          )
        })
      )}
    </Card>
  )
}
