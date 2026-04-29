// CronEditor — 5-field standard cron + 6-field with seconds. Live
// describes the cron via `describeCron` and previews the next 5 fire
// times via `nextCronAfter`. Validation is pure so it can be unit-
// tested without rendering hanzogui primitives.

import { useMemo } from 'react'
import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import { describeCron, nextCronAfter } from '../../stores/schedule-recurrence'

export interface CronPreset {
  label: string
  value: string
}

export const CRON_PRESETS: CronPreset[] = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Hourly', value: '0 * * * *' },
  { label: 'Daily 00:00', value: '0 0 * * *' },
  { label: 'Weekdays 09:00', value: '0 9 * * 1-5' },
  { label: 'Weekly Mon 00:00', value: '0 0 * * 1' },
]

// Pure validator. Strips a leading "@alias", trims, accepts 5 or 6
// fields. Each field must be `*`, a number, range `a-b`, list
// `a,b,c`, or step `*/n`. Returns an error string on failure or null
// on success.
export function validateCron(input: string): string | null {
  const t = input.trim()
  if (!t) return 'cron required'
  if (t.startsWith('@')) {
    const alias = t.slice(1).toLowerCase()
    const ok = ['yearly', 'annually', 'monthly', 'weekly', 'daily', 'midnight', 'hourly'].includes(
      alias,
    )
    return ok ? null : `unknown @alias: ${t}`
  }
  const fields = t.split(/\s+/)
  if (fields.length !== 5 && fields.length !== 6) {
    return 'cron must have 5 fields, or 6 with seconds'
  }
  for (const f of fields) {
    if (!isValidField(f)) return `bad field: ${f}`
  }
  return null
}

function isValidField(field: string): boolean {
  for (const part of field.split(',')) {
    let p = part
    const slash = p.indexOf('/')
    if (slash >= 0) {
      const step = p.slice(slash + 1)
      if (!/^\d+$/.test(step) || Number(step) <= 0) return false
      p = p.slice(0, slash)
    }
    if (p === '*') continue
    const dash = p.indexOf('-')
    if (dash >= 0) {
      const a = p.slice(0, dash)
      const b = p.slice(dash + 1)
      if (!/^\d+$/.test(a) || !/^\d+$/.test(b)) return false
      if (Number(a) > Number(b)) return false
      continue
    }
    if (!/^\d+$/.test(p)) return false
  }
  return true
}

export interface CronEditorProps {
  value: string
  onChange: (next: string) => void
  // Anchor for next-fire previews; defaults to now.
  from?: Date
}

export function CronEditor({ value, onChange, from }: CronEditorProps) {
  const error = useMemo(() => validateCron(value), [value])
  const description = useMemo(
    () => (error ? '' : describeCron(value)),
    [value, error],
  )
  const upcoming = useMemo(() => {
    if (error) return []
    const out: string[] = []
    let t = (from ?? new Date()).getTime()
    for (let i = 0; i < 5; i++) {
      const next = nextCronAfter(value, t)
      if (next == null) break
      out.push(new Date(next).toISOString())
      t = next + 1000
    }
    return out
  }, [value, error, from])

  return (
    <YStack gap="$3">
      <YStack gap="$2">
        <Text fontSize="$2" fontWeight="500" color="$color">
          Cron expression
        </Text>
        <Input
          value={value}
          onChangeText={onChange}
          placeholder="0 9 * * 1-5"
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          aria-label="cron"
        />
        {error ? (
          <Text fontSize="$1" color={'#ef4444' as never} role="alert">
            {error}
          </Text>
        ) : description ? (
          <Text fontSize="$1" color="$placeholderColor">
            {description}
          </Text>
        ) : null}
      </YStack>

      <YStack gap="$1.5">
        <Text fontSize="$1" color="$placeholderColor">
          Common patterns
        </Text>
        <XStack gap="$2" flexWrap="wrap">
          {CRON_PRESETS.map((p) => (
            <Button
              key={p.value}
              size="$2"
              chromeless
              onPress={() => onChange(p.value)}
              borderWidth={1}
              borderColor="$borderColor"
            >
              <Text fontSize="$1" color="$color">
                {p.label}
              </Text>
            </Button>
          ))}
        </XStack>
      </YStack>

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
