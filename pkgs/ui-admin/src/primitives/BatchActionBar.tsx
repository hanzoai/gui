// BatchActionBar — port of upstream temporalio/ui
// workflows-summary-configurable-table/batch-actions.svelte. Renders
// the bulk-action strip that appears when 1+ rows are selected:
// Cancel, Terminate, Reset. Visibility is controlled by the parent
// (it knows the selection size); this component is dumb.
//
// Each action surfaces an `enabled` flag so callers can gate by
// permission (workflowCancelEnabled / workflowTerminateEnabled /
// workflowResetEnabled in upstream — out-of-scope here, default
// true). Handlers are stubs at the call site for now; wiring them
// to the API is a follow-up batch operation patch.

import type { ReactNode } from 'react'
import { Button, Text, XStack } from 'hanzogui'
import { CircleX } from '@hanzogui/lucide-icons-2/icons/CircleX'
import { Power } from '@hanzogui/lucide-icons-2/icons/Power'
import { RotateCcw } from '@hanzogui/lucide-icons-2/icons/RotateCcw'

export interface BatchAction {
  label: string
  onPress: () => void
  enabled?: boolean
  destructive?: boolean
  icon?: ReactNode
  testId?: string
}

export interface BatchActionBarProps {
  // Number of currently-selected rows. Drives the "N selected" copy.
  selectedCount: number
  // Total visible rows in the table. Lets us render "select all N"
  // when only the visible page is selected — matches upstream's
  // copy.
  totalCount?: number
  actions: BatchAction[]
  // Optional clear-selection affordance. Rendered to the right of
  // the action buttons.
  onClear?: () => void
}

export function BatchActionBar({
  selectedCount,
  totalCount,
  actions,
  onClear,
}: BatchActionBarProps) {
  if (selectedCount === 0) return null
  return (
    <XStack
      px="$4"
      py="$2"
      borderWidth={1}
      borderColor={'rgba(59,130,246,0.4)' as never}
      bg={'rgba(59,130,246,0.08)' as never}
      rounded="$3"
      items="center"
      justify="space-between"
      gap="$3"
      role={'toolbar' as never}
      aria-label="Bulk actions"
    >
      <Text fontSize="$2" color="$color" fontWeight="500">
        {selectedCount} selected
        {totalCount !== undefined && totalCount > selectedCount ? (
          <Text fontSize="$2" color="$placeholderColor">
            {' '}
            of {totalCount}
          </Text>
        ) : null}
      </Text>
      <XStack gap="$2" items="center">
        {actions.map((a) => (
          <Button
            key={a.label}
            size="$2"
            chromeless
            disabled={a.enabled === false}
            onPress={a.onPress}
            data-testid={a.testId}
            aria-label={a.label}
          >
            <XStack items="center" gap="$1.5">
              {a.icon}
              <Text
                fontSize="$2"
                fontWeight="500"
                color={
                  a.destructive
                    ? ('#fca5a5' as never)
                    : a.enabled === false
                    ? '$placeholderColor'
                    : '$color'
                }
              >
                {a.label}
              </Text>
            </XStack>
          </Button>
        ))}
        {onClear ? (
          <Button size="$2" chromeless onPress={onClear} aria-label="Clear selection">
            <Text fontSize="$2" color="$placeholderColor">
              Clear
            </Text>
          </Button>
        ) : null}
      </XStack>
    </XStack>
  )
}

// Default action presets — Cancel, Terminate, Reset — wire only the
// onPress handlers at the call site. Icons + destructive flag fixed.
export interface WorkflowBatchHandlers {
  onCancel?: () => void
  onTerminate?: () => void
  onReset?: () => void
  cancelEnabled?: boolean
  terminateEnabled?: boolean
  resetEnabled?: boolean
}

export function workflowBatchActions(h: WorkflowBatchHandlers): BatchAction[] {
  const out: BatchAction[] = []
  if (h.onCancel) {
    out.push({
      label: 'Cancel',
      onPress: h.onCancel,
      enabled: h.cancelEnabled ?? true,
      icon: <CircleX size={14} color="#cbd5e1" />,
      testId: 'bulk-cancel-button',
    })
  }
  if (h.onReset) {
    out.push({
      label: 'Reset',
      onPress: h.onReset,
      enabled: h.resetEnabled ?? true,
      icon: <RotateCcw size={14} color="#cbd5e1" />,
      testId: 'bulk-reset-button',
    })
  }
  if (h.onTerminate) {
    out.push({
      label: 'Terminate',
      onPress: h.onTerminate,
      enabled: h.terminateEnabled ?? true,
      destructive: true,
      icon: <Power size={14} color="#fca5a5" />,
      testId: 'bulk-terminate-button',
    })
  }
  return out
}
