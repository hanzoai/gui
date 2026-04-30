// StatusFilterChip — multi-select dropdown over WORKFLOW_STATUSES.
// Emits `ExecutionStatus IN ("Running","Failed",…)` when any are
// selected, or removes the clause when none remain.

import { useState } from 'react'
import { Button, Text, XStack, YStack } from 'hanzogui'
import { Check } from '@hanzogui/lucide-icons-2/icons/Check'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import {
  WORKFLOW_STATUSES,
  type WorkflowStatus,
} from '../../lib/types'
import { FilterChip } from './FilterChip'

export interface StatusFilterChipProps {
  selected: WorkflowStatus[]
  onChange: (next: WorkflowStatus[]) => void
  onRemove?: () => void
}

export function StatusFilterChip({ selected, onChange, onRemove }: StatusFilterChipProps) {
  const [open, setOpen] = useState(false)

  const valueText =
    selected.length === 0
      ? 'any'
      : selected.length === 1
      ? selected[0]
      : `${selected.length} statuses`

  return (
    <YStack position="relative">
      <FilterChip
        label="Status"
        value={
          <XStack items="center" gap="$1">
            <Text fontSize="$2" color="$color">
              {valueText}
            </Text>
            <ChevronDown size={11} color="#7e8794" />
          </XStack>
        }
        onClick={() => setOpen((v) => !v)}
        onRemove={onRemove}
        testId="filter-chip-status"
      />
      {open ? (
        <YStack
          position="absolute"
          t={32}
          l={0}
          minW={200}
          bg="$background"
          borderWidth={1}
          borderColor="$borderColor"
          rounded="$3"
          z={20}
          py="$1"
        >
          {WORKFLOW_STATUSES.filter((s) => s !== 'Unspecified').map((s) => {
            const isOn = selected.includes(s)
            return (
              <Button
                key={s}
                size="$2"
                chromeless
                justify="flex-start"
                onPress={() => {
                  onChange(isOn ? selected.filter((x) => x !== s) : [...selected, s])
                }}
              >
                <XStack items="center" gap="$2" flex={1}>
                  <YStack width={14} items="center" justify="center">
                    {isOn ? <Check size={12} color="#86efac" /> : null}
                  </YStack>
                  <Text fontSize="$2" color="$color">
                    {s}
                  </Text>
                </XStack>
              </Button>
            )
          })}
          <XStack px="$2" py="$1.5" justify="space-between" gap="$2">
            <Button size="$1" chromeless onPress={() => onChange([])}>
              <Text fontSize="$1" color="$placeholderColor">
                Clear
              </Text>
            </Button>
            <Button size="$1" chromeless onPress={() => setOpen(false)}>
              <Text fontSize="$1" color="$placeholderColor">
                Close
              </Text>
            </Button>
          </XStack>
        </YStack>
      ) : null}
    </YStack>
  )
}
