// Rate limits settings — toggle + per-route rule editor.
// Source-of-truth: settings.rateLimits in the Base settings store.

import { useState } from 'react'
import { Button, Card, Input, Text, XStack, YStack } from 'hanzogui'
import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { authedFetcher, updateSettings } from '../lib/api'
import { SectionCard } from '../components/SectionCard'

interface RateLimitRule {
  label: string
  maxRequests: number
  duration: number
  audience: string
}

interface RateLimitsSettings {
  enabled?: boolean
  rules?: RateLimitRule[]
}

const audienceOptions = [
  { value: '', label: 'All' },
  { value: '@guest', label: 'Guest' },
  { value: '@auth', label: 'Auth' },
]

export function SettingsRateLimits() {
  const settings = useFetch<{ rateLimits?: RateLimitsSettings }>(
    '/api/settings',
    { fetcher: authedFetcher as never },
  )

  const initial = settings.data?.rateLimits

  const [enabled, setEnabled] = useState<boolean>(false)
  const [rules, setRules] = useState<RateLimitRule[]>([])
  const [synced, setSynced] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(0)
  const [saveError, setSaveError] = useState('')

  if (initial && !synced) {
    setSynced(true)
    setEnabled(initial.enabled ?? false)
    setRules(initial.rules ?? [])
  }

  function addRule() {
    setRules([...rules, { label: '', maxRequests: 300, duration: 10, audience: '' }])
    setDirty(true)
    if (rules.length === 0) setEnabled(true)
  }

  function removeRule(i: number) {
    const next = rules.filter((_, idx) => idx !== i)
    setRules(next)
    setDirty(true)
    if (next.length === 0) setEnabled(false)
  }

  function updateRule<K extends keyof RateLimitRule>(i: number, field: K, value: RateLimitRule[K]) {
    const next = [...rules]
    next[i] = { ...next[i], [field]: value }
    setRules(next)
    setDirty(true)
  }

  async function save() {
    setSaving(true)
    setSaveError('')
    try {
      await updateSettings({ rateLimits: { enabled, rules } })
      await settings.mutate()
      setDirty(false)
      setSavedAt(Date.now())
    } catch (err) {
      setSaveError((err as Error)?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (settings.isLoading) return <LoadingState />
  if (settings.error) return <ErrorState error={settings.error as Error} />

  return (
    <YStack gap="$4">
      <SectionCard title="Rate limits" description="Configure per-route request rate limiting.">
        <XStack items="center" gap="$2">
          <Button
            size="$2"
            onPress={() => {
              setEnabled(!enabled)
              setDirty(true)
            }}
            bg={enabled ? ('#f2f2f2' as never) : 'transparent'}
            borderWidth={1}
            borderColor={enabled ? ('#f2f2f2' as never) : '$borderColor'}
          >
            <Text fontSize="$2" color={enabled ? ('#070b13' as never) : '$color'}>
              {enabled ? 'Enabled' : 'Disabled'}
            </Text>
          </Button>
          <Text fontSize="$1" color="$placeholderColor">
            (experimental)
          </Text>
        </XStack>

        {rules.length > 0 ? (
          <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
            <XStack px="$3" py="$2" gap="$3" borderBottomWidth={1} borderBottomColor="$borderColor">
              <Text fontSize="$1" color="$placeholderColor" flex={2}>
                Label
              </Text>
              <Text fontSize="$1" color="$placeholderColor" width={100}>
                Max req
              </Text>
              <Text fontSize="$1" color="$placeholderColor" width={100}>
                Interval (s)
              </Text>
              <Text fontSize="$1" color="$placeholderColor" width={210}>
                Audience
              </Text>
              <YStack width={70} />
            </XStack>
            {rules.map((rule, i) => (
              <XStack
                key={i}
                px="$3"
                py="$2"
                gap="$3"
                items="center"
                borderTopWidth={i === 0 ? 0 : 1}
                borderTopColor="$borderColor"
              >
                <Input
                  flex={2}
                  size="$3"
                  value={rule.label}
                  onChangeText={(v: string) => updateRule(i, 'label', v)}
                  placeholder="tag or /path/"
                />
                <Input
                  width={100}
                  size="$3"
                  value={String(rule.maxRequests)}
                  onChangeText={(v: string) =>
                    updateRule(i, 'maxRequests', parseInt(v, 10) || 1)
                  }
                  keyboardType="number-pad"
                />
                <Input
                  width={100}
                  size="$3"
                  value={String(rule.duration)}
                  onChangeText={(v: string) =>
                    updateRule(i, 'duration', parseInt(v, 10) || 1)
                  }
                  keyboardType="number-pad"
                />
                <XStack width={210} gap="$1.5">
                  {audienceOptions.map((o) => {
                    const active = rule.audience === o.value
                    return (
                      <Button
                        key={o.value}
                        size="$2"
                        onPress={() => updateRule(i, 'audience', o.value)}
                        bg={active ? ('#f2f2f2' as never) : 'transparent'}
                        borderWidth={1}
                        borderColor={active ? ('#f2f2f2' as never) : '$borderColor'}
                      >
                        <Text fontSize="$1" color={active ? ('#070b13' as never) : '$color'}>
                          {o.label}
                        </Text>
                      </Button>
                    )
                  })}
                </XStack>
                <Button size="$2" theme="red" onPress={() => removeRule(i)}>
                  <Text fontSize="$1">Remove</Text>
                </Button>
              </XStack>
            ))}
          </Card>
        ) : null}

        <XStack gap="$2" items="center">
          <Button size="$3" onPress={addRule}>
            Add rule
          </Button>
          <Button size="$3" themeInverse disabled={!dirty || saving} onPress={save}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
          {savedAt > 0 && !dirty ? (
            <Text fontSize="$1" color="$green10">
              Saved.
            </Text>
          ) : null}
          {saveError ? (
            <Text fontSize="$1" color="$red10">
              {saveError}
            </Text>
          ) : null}
        </XStack>
      </SectionCard>
    </YStack>
  )
}
