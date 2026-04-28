// SettingsLogs — log retention + minimum log level + IP logging.
// Source-of-truth: settings.logs = { maxDays, minLevel, logIP }.

import { useState } from 'react'
import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { authedFetcher, updateSettings } from '../lib/api'
import { SectionCard } from '../components/SectionCard'

interface LogsSettings {
  maxDays?: number
  minLevel?: number
  logIP?: boolean
}

const logLevels = [
  { value: 0, label: 'Default' },
  { value: -4, label: 'DEBUG (-4)' },
  { value: 4, label: 'WARN (4)' },
  { value: 8, label: 'ERROR (8)' },
] as const

export function SettingsLogs() {
  const settings = useFetch<{ logs?: LogsSettings }>('/api/settings', {
    fetcher: authedFetcher as never,
  })

  const initial = settings.data?.logs

  const [form, setForm] = useState<LogsSettings | null>(null)
  const vals: LogsSettings = form ?? {
    maxDays: initial?.maxDays ?? 7,
    minLevel: initial?.minLevel ?? 0,
    logIP: initial?.logIP ?? true,
  }
  const dirty = form !== null

  function set<K extends keyof LogsSettings>(k: K, v: LogsSettings[K]) {
    setForm({ ...vals, [k]: v })
  }

  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(0)
  const [saveErr, setSaveErr] = useState('')

  async function save() {
    setSaving(true)
    setSaveErr('')
    try {
      await updateSettings({ logs: vals })
      await settings.mutate()
      setForm(null)
      setSavedAt(Date.now())
    } catch (err) {
      setSaveErr((err as Error)?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (settings.isLoading) return <LoadingState />
  if (settings.error) return <ErrorState error={settings.error as Error} />

  return (
    <YStack gap="$4">
      <SectionCard
        title="Log settings"
        description="Configure log retention and minimum log level."
      >
        <YStack gap="$3" maxW={420}>
          <YStack gap="$1.5">
            <Text fontSize="$2" color="$placeholderColor">
              Log retention (days)
            </Text>
            <Input
              value={String(vals.maxDays ?? 7)}
              onChangeText={(v: string) => set('maxDays', Math.max(0, Number(v) || 0))}
              keyboardType="number-pad"
            />
            <Text fontSize="$1" color="$placeholderColor">
              0 = keep indefinitely
            </Text>
          </YStack>

          <YStack gap="$1.5">
            <Text fontSize="$2" color="$placeholderColor">
              Minimum log level
            </Text>
            <XStack gap="$1.5" flexWrap="wrap">
              {logLevels.map((l) => {
                const active = (vals.minLevel ?? 0) === l.value
                return (
                  <Button
                    key={l.value}
                    size="$2"
                    onPress={() => set('minLevel', l.value)}
                    bg={active ? ('#f2f2f2' as never) : 'transparent'}
                    borderWidth={1}
                    borderColor={active ? ('#f2f2f2' as never) : '$borderColor'}
                  >
                    <Text fontSize="$2" color={active ? ('#070b13' as never) : '$color'}>
                      {l.label}
                    </Text>
                  </Button>
                )
              })}
            </XStack>
          </YStack>

          <XStack items="center" gap="$2">
            <Button
              size="$2"
              onPress={() => set('logIP', !vals.logIP)}
              bg={vals.logIP ? ('#f2f2f2' as never) : 'transparent'}
              borderWidth={1}
              borderColor={vals.logIP ? ('#f2f2f2' as never) : '$borderColor'}
            >
              <Text fontSize="$2" color={vals.logIP ? ('#070b13' as never) : '$color'}>
                {vals.logIP ? 'Log client IPs' : 'Skip client IPs'}
              </Text>
            </Button>
          </XStack>

          <XStack gap="$2" items="center" pt="$2">
            <Button
              size="$3"
              disabled={!dirty || saving}
              onPress={save}
              bg={'#f2f2f2' as never}
              hoverStyle={{ background: '#ffffff' as never }}
            >
              <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
                {saving ? 'Saving…' : 'Save log settings'}
              </Text>
            </Button>
            {savedAt > 0 && !dirty ? (
              <Text fontSize="$1" color="$green10">
                Saved.
              </Text>
            ) : null}
            {saveErr ? (
              <Text fontSize="$1" color="$red10">
                {saveErr}
              </Text>
            ) : null}
          </XStack>
        </YStack>
      </SectionCard>
    </YStack>
  )
}
