// RetentionEditor — slider + numeric (days). Wire shape is the proto
// duration string ("Ns" / "Nh"); the editor reports days back to the
// caller and serialises to seconds at submit time.

import { Input, Text, XStack, YStack } from 'hanzogui'

export interface RetentionEditorProps {
  // Days. Controlled.
  days: number
  onChange: (days: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export function RetentionEditor({
  days,
  onChange,
  min = 1,
  max = 90,
  disabled,
}: RetentionEditorProps) {
  const clamped = Math.max(min, Math.min(max, Number.isFinite(days) ? days : min))
  return (
    <YStack gap="$2">
      <XStack items="center" gap="$3">
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={clamped}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
          style={{ flex: 1 }}
          aria-label="Retention days"
        />
        <Input
          width={80}
          size="$2"
          value={String(clamped)}
          disabled={disabled}
          onChangeText={(v) => {
            const n = parseInt(v, 10)
            if (Number.isFinite(n)) onChange(n)
          }}
        />
        <Text fontSize="$2" color="$placeholderColor">
          days
        </Text>
      </XStack>
      <Text fontSize="$1" color="$placeholderColor">
        Workflow execution history is purged after {clamped} day{clamped === 1 ? '' : 's'}.
      </Text>
    </YStack>
  )
}

// Helpers — wire form is "Ns" seconds or "Nh" hours.
export function durationToDays(raw?: string): number {
  if (!raw) return 1
  if (raw.endsWith('h')) {
    const h = parseInt(raw, 10)
    return Number.isFinite(h) ? Math.max(1, Math.round(h / 24)) : 1
  }
  if (raw.endsWith('s')) {
    const s = parseInt(raw, 10)
    return Number.isFinite(s) ? Math.max(1, Math.round(s / 86400)) : 1
  }
  const n = parseInt(raw, 10)
  return Number.isFinite(n) ? n : 1
}

export function daysToDuration(days: number): string {
  return `${Math.max(1, Math.round(days)) * 86400}s`
}
