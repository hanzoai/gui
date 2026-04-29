// IntervalEditor — every N (s|m|h|d) with optional phase offset.
// Outputs IntervalSpec with proto-style duration strings.

import { useMemo } from 'react'
import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import type { IntervalSpec } from '../../lib/types'
import { describeInterval, nextOccurrences } from '../../stores/schedule-recurrence'

export type IntervalUnit = 's' | 'm' | 'h' | 'd'

export const INTERVAL_UNITS: ReadonlyArray<{ unit: IntervalUnit; label: string }> = [
  { unit: 's', label: 'seconds' },
  { unit: 'm', label: 'minutes' },
  { unit: 'h', label: 'hours' },
  { unit: 'd', label: 'days' },
]

const UNIT_TO_SECONDS: Record<IntervalUnit, number> = { s: 1, m: 60, h: 3600, d: 86400 }

export function buildIntervalSpec(
  every: number,
  unit: IntervalUnit,
  phase: number,
  phaseUnit: IntervalUnit,
): IntervalSpec {
  const seconds = Math.max(1, Math.floor(every) * UNIT_TO_SECONDS[unit])
  const phaseSeconds = Math.max(0, Math.floor(phase) * UNIT_TO_SECONDS[phaseUnit])
  return {
    interval: `${seconds}s`,
    phase: phaseSeconds > 0 ? `${phaseSeconds}s` : undefined,
  }
}

export interface IntervalEditorProps {
  every: number
  unit: IntervalUnit
  phase: number
  phaseUnit: IntervalUnit
  onChange: (state: { every: number; unit: IntervalUnit; phase: number; phaseUnit: IntervalUnit }) => void
}

export function IntervalEditor({ every, unit, phase, phaseUnit, onChange }: IntervalEditorProps) {
  const spec = useMemo(
    () => buildIntervalSpec(every, unit, phase, phaseUnit),
    [every, unit, phase, phaseUnit],
  )
  const description = useMemo(() => describeInterval(spec), [spec])
  const upcoming = useMemo(() => nextOccurrences({ interval: [spec] }, 5), [spec])

  return (
    <YStack gap="$3">
      <YStack gap="$2">
        <Text fontSize="$2" fontWeight="500" color="$color">
          Every
        </Text>
        <XStack gap="$2" items="center">
          <Input
            value={String(every)}
            onChangeText={(v) =>
              onChange({ every: clampInt(v, 1), unit, phase, phaseUnit })
            }
            width={96}
            keyboardType="numeric"
          />
          <UnitPicker
            value={unit}
            onChange={(u) => onChange({ every, unit: u, phase, phaseUnit })}
          />
        </XStack>
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$2" fontWeight="500" color="$color">
          Phase offset
        </Text>
        <XStack gap="$2" items="center">
          <Input
            value={String(phase)}
            onChangeText={(v) =>
              onChange({ every, unit, phase: clampInt(v, 0), phaseUnit })
            }
            width={96}
            keyboardType="numeric"
          />
          <UnitPicker
            value={phaseUnit}
            onChange={(u) => onChange({ every, unit, phase, phaseUnit: u })}
          />
          <Text fontSize="$1" color="$placeholderColor">
            optional · shifts each fire from the epoch tick
          </Text>
        </XStack>
      </YStack>

      <Text fontSize="$1" color="$placeholderColor">
        {description}
      </Text>

      {upcoming.length > 0 ? (
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Next fire times (UTC)
          </Text>
          {upcoming.map((iso) => (
            <Text
              key={iso}
              fontSize="$1"
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              color="$color"
            >
              {iso}
            </Text>
          ))}
        </YStack>
      ) : null}
    </YStack>
  )
}

function clampInt(v: string, min: number): number {
  const n = Number(v.replace(/[^\d]/g, ''))
  if (!Number.isFinite(n)) return min
  return Math.max(min, Math.floor(n))
}

function UnitPicker({
  value,
  onChange,
}: {
  value: IntervalUnit
  onChange: (u: IntervalUnit) => void
}) {
  return (
    <XStack gap="$1">
      {INTERVAL_UNITS.map(({ unit, label }) => (
        <Button
          key={unit}
          size="$2"
          chromeless={value !== unit}
          onPress={() => onChange(unit)}
          borderWidth={1}
          borderColor={value === unit ? ('#f2f2f2' as never) : '$borderColor'}
          bg={value === unit ? ('#f2f2f2' as never) : 'transparent'}
        >
          <Text fontSize="$1" color={value === unit ? ('#070b13' as never) : '$color'}>
            {label}
          </Text>
        </Button>
      ))}
    </XStack>
  )
}
