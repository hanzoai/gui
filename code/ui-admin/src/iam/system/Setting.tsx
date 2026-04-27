// Setting — admin Setting page (preferences subset). The upstream
// `Setting.tsx` is 80k lines of mixed concerns: helpers, theme,
// formatting, account preferences, and ~30 utility functions used
// from every other page. This port surfaces only the *user-facing*
// settings page (preferences). All the helper functions migrated to
// `util.ts` next door.
//
// Original at `~/work/hanzo/iam/web/src/Setting.tsx`. The @hanzo/gui v7
// shape: a single card per group, each row is `<XStack>` with a
// label, control, and short description.

import { useState } from 'react'
import { Card, H3, H4, Input, Paragraph, Switch, Text, XStack, YStack } from 'hanzogui'

export interface SettingPreferences {
  // Two-letter language code: `en`, `zh`, `de`, etc. Empty = follow
  // browser default.
  language: string
  // Theme algorithm name: `light`, `dark`, or `compact-dark` etc.
  themeAlgorithm: string
  // Per-account toggle to show the GitHub corner ribbon. Top-level
  // gating still respected by Conf.ShowGithubCorner.
  showGithubCorner: boolean
  // Show the in-app product tour on next visit.
  enableTour: boolean
}

export interface SettingProps {
  initial: SettingPreferences
  onSave: (next: SettingPreferences) => Promise<void> | void
}

export function Setting({ initial, onSave }: SettingProps) {
  const [prefs, setPrefs] = useState<SettingPreferences>(initial)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const setField = <K extends keyof SettingPreferences>(key: K, value: SettingPreferences[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }))
  }

  const onSubmit = async () => {
    setSaving(true)
    try {
      await onSave(prefs)
      setSavedAt(Date.now())
    } finally {
      setSaving(false)
    }
  }

  return (
    <YStack gap="$4" p="$4">
      <H3 size="$6">Settings</H3>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$3">
          <H4 size="$4">Language & Theme</H4>
          <XStack gap="$3" items="center">
            <Text width={140}>Language</Text>
            <Input
              flex={1}
              value={prefs.language}
              onChangeText={(t) => setField('language', t)}
              placeholder="en"
            />
            <Paragraph color="$placeholderColor" fontSize="$1">
              ISO 639-1 code, blank = browser default.
            </Paragraph>
          </XStack>
          <XStack gap="$3" items="center">
            <Text width={140}>Theme</Text>
            <Input
              flex={1}
              value={prefs.themeAlgorithm}
              onChangeText={(t) => setField('themeAlgorithm', t)}
              placeholder="dark"
            />
          </XStack>
        </YStack>
      </Card>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$3">
          <H4 size="$4">UI</H4>
          <XStack gap="$3" items="center">
            <Text width={220}>Show GitHub corner ribbon</Text>
            <Switch
              checked={prefs.showGithubCorner}
              onCheckedChange={(v) => setField('showGithubCorner', Boolean(v))}
            >
              <Switch.Thumb />
            </Switch>
          </XStack>
          <XStack gap="$3" items="center">
            <Text width={220}>Show product tour</Text>
            <Switch
              checked={prefs.enableTour}
              onCheckedChange={(v) => setField('enableTour', Boolean(v))}
            >
              <Switch.Thumb />
            </Switch>
          </XStack>
        </YStack>
      </Card>

      <XStack gap="$3" items="center">
        <Text
          tag="button"
          {...({ type: 'button' } as never)}
          px="$4"
          py="$2"
          rounded="$2"
          bg={'#3b82f6' as never}
          color="#ffffff"
          opacity={saving ? 0.5 : 1}
          onPress={() => void onSubmit()}
          disabled={saving}
          cursor={saving ? 'progress' : 'pointer'}
        >
          {saving ? 'Saving…' : 'Save'}
        </Text>
        {savedAt !== null ? (
          <Paragraph color="#86efac" fontSize="$2">
            Saved.
          </Paragraph>
        ) : null}
      </XStack>
    </YStack>
  )
}
