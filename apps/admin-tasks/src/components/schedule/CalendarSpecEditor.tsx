// CalendarSpecEditor — structured calendar field editor. Each field
// accepts the same syntax as a cron field (`*`, numbers, ranges,
// lists). Comment is free-text. Used for both calendar and exclude-
// calendar rules.

import { Input, Text, XStack, YStack } from 'hanzogui'
import type { CalendarSpec } from '../../lib/types'

export interface CalendarSpecEditorProps {
  value: CalendarSpec
  onChange: (next: CalendarSpec) => void
  exclude?: boolean
}

const FIELDS: Array<{ key: keyof CalendarSpec; label: string; placeholder: string }> = [
  { key: 'second', label: 'Second', placeholder: '0' },
  { key: 'minute', label: 'Minute', placeholder: '0' },
  { key: 'hour', label: 'Hour', placeholder: '*' },
  { key: 'dayOfMonth', label: 'Day of month', placeholder: '*' },
  { key: 'month', label: 'Month', placeholder: '*' },
  { key: 'dayOfWeek', label: 'Day of week', placeholder: '*' },
  { key: 'year', label: 'Year', placeholder: '*' },
]

export function CalendarSpecEditor({ value, onChange, exclude }: CalendarSpecEditorProps) {
  const set = (k: keyof CalendarSpec, v: string) => onChange({ ...value, [k]: v })
  return (
    <YStack gap="$2">
      <Text fontSize="$2" fontWeight="500" color="$color">
        {exclude ? 'Exclude calendar' : 'Calendar'}
      </Text>
      <XStack gap="$2" flexWrap="wrap">
        {FIELDS.map(({ key, label, placeholder }) => (
          <YStack key={key} gap="$1" width={140}>
            <Text fontSize="$1" color="$placeholderColor">
              {label}
            </Text>
            <Input
              value={String(value[key] ?? '')}
              onChangeText={(v) => set(key, v)}
              placeholder={placeholder}
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            />
          </YStack>
        ))}
      </XStack>
      <YStack gap="$1">
        <Text fontSize="$1" color="$placeholderColor">
          Comment
        </Text>
        <Input
          value={value.comment ?? ''}
          onChangeText={(v) => set('comment', v)}
          placeholder="optional"
        />
      </YStack>
    </YStack>
  )
}
