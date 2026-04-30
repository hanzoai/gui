// TimeRangeFilterChip — picks a StartTime range. Presets cover the
// common cases (last hour / 24h / 7d) plus a Custom option that
// reveals two ISO datetime inputs.
//
// Emits two clauses: `StartTime >= <from>` and `StartTime <= <to>`.
// Either side may be absent; the parent strips clauses when neither
// is set.

import { useState } from 'react'
import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { FilterChip } from './FilterChip'

export interface TimeRange {
  from?: string
  to?: string
}

export interface TimeRangeFilterChipProps {
  value: TimeRange
  onChange: (next: TimeRange) => void
  onRemove?: () => void
}

const PRESETS: Array<{ id: string; label: string; ms: number }> = [
  { id: '1h', label: 'Last hour', ms: 60 * 60 * 1000 },
  { id: '24h', label: 'Last 24 hours', ms: 24 * 60 * 60 * 1000 },
  { id: '7d', label: 'Last 7 days', ms: 7 * 24 * 60 * 60 * 1000 },
]

function summary(value: TimeRange): string {
  if (!value.from && !value.to) return 'any'
  if (value.from && !value.to) {
    const since = new Date(value.from).getTime()
    const ms = Date.now() - since
    const preset = PRESETS.find((p) => Math.abs(p.ms - ms) < 60_000)
    if (preset) return preset.label
    return `since ${value.from.slice(0, 16).replace('T', ' ')}`
  }
  if (!value.from && value.to) return `until ${value.to.slice(0, 16).replace('T', ' ')}`
  return `${value.from?.slice(0, 10)} → ${value.to?.slice(0, 10)}`
}

export function TimeRangeFilterChip({ value, onChange, onRemove }: TimeRangeFilterChipProps) {
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState<TimeRange>(value)

  function applyPreset(ms: number) {
    const from = new Date(Date.now() - ms).toISOString()
    onChange({ from, to: undefined })
    setOpen(false)
  }

  return (
    <YStack position="relative">
      <FilterChip
        label="Start time"
        value={
          <XStack items="center" gap="$1">
            <Text fontSize="$2" color="$color">
              {summary(value)}
            </Text>
            <ChevronDown size={11} color="#7e8794" />
          </XStack>
        }
        onClick={() => setOpen((v) => !v)}
        onRemove={onRemove}
        testId="filter-chip-start-time"
      />
      {open ? (
        <YStack
          position="absolute"
          t={32}
          l={0}
          minW={300}
          bg="$background"
          borderWidth={1}
          borderColor="$borderColor"
          rounded="$3"
          z={20}
          p="$2"
          gap="$2"
        >
          {PRESETS.map((p) => (
            <Button
              key={p.id}
              size="$2"
              chromeless
              justify="flex-start"
              onPress={() => applyPreset(p.ms)}
            >
              <Text fontSize="$2" color="$color">
                {p.label}
              </Text>
            </Button>
          ))}
          <YStack pt="$2" gap="$1.5" borderTopWidth={1} borderTopColor="$borderColor">
            <Text fontSize="$1" color="$placeholderColor">
              Custom (ISO 8601)
            </Text>
            <XStack gap="$2" items="center">
              <Text fontSize="$1" color="$placeholderColor" width={32}>
                from
              </Text>
              <Input
                size="$2"
                flex={1}
                placeholder="2026-01-01T00:00:00Z"
                value={custom.from ?? ''}
                onChangeText={(v: string) => setCustom((c) => ({ ...c, from: v }))}
              />
            </XStack>
            <XStack gap="$2" items="center">
              <Text fontSize="$1" color="$placeholderColor" width={32}>
                to
              </Text>
              <Input
                size="$2"
                flex={1}
                placeholder="2026-12-31T23:59:59Z"
                value={custom.to ?? ''}
                onChangeText={(v: string) => setCustom((c) => ({ ...c, to: v }))}
              />
            </XStack>
            <XStack gap="$2" justify="flex-end">
              <Button size="$1" chromeless onPress={() => setOpen(false)}>
                <Text fontSize="$1" color="$placeholderColor">
                  Cancel
                </Text>
              </Button>
              <Button
                size="$1"
                onPress={() => {
                  onChange({
                    from: custom.from?.trim() || undefined,
                    to: custom.to?.trim() || undefined,
                  })
                  setOpen(false)
                }}
              >
                <Text fontSize="$1">Apply</Text>
              </Button>
            </XStack>
          </YStack>
        </YStack>
      ) : null}
    </YStack>
  )
}
