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

import type { ReactNode } from 'react'
import { Card, Text, XStack, YStack } from 'hanzogui'

export interface DataTableColumn {
  key: string
  label: ReactNode
  flex: number
}

export interface DataTableProps<T> {
  columns: DataTableColumn[]
  rows: T[]
  // Renders the row's cells. Length must match columns. The table wraps
  // each cell in a YStack with the column's flex.
  renderRow: (row: T, idx: number) => ReactNode[]
  // Stable key extractor for row reconciliation.
  rowKey: (row: T, idx: number) => string
  // Empty body copy when rows is zero-length. Title is bold; hint is
  // de-emphasized below.
  emptyState: { title: string; hint?: string }
}

export function DataTable<T>({
  columns,
  rows,
  renderRow,
  rowKey,
  emptyState,
}: DataTableProps<T>) {
  return (
    <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <XStack
        bg={'rgba(255,255,255,0.03)' as never}
        px="$4"
        py="$2.5"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
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
          return (
            <XStack
              key={rowKey(row, i)}
              px="$4"
              py="$2.5"
              borderBottomWidth={i === rows.length - 1 ? 0 : 1}
              borderBottomColor="$borderColor"
              hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
              items="center"
            >
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
