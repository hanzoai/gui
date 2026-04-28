// Token options — per-auth-collection token duration and secret
// rotation. Auth collections are read from /api/collections; updates
// are PATCH /api/collections/:id with the field nested under one of
// the well-known token keys.

import { useEffect, useState } from 'react'
import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import {
  authedFetcher,
  updateCollection,
  type CollectionModel,
  type ListResult,
} from '../lib/api'
import { SectionCard } from '../components/SectionCard'

const tokenTypes = [
  { key: 'authToken', label: 'Auth' },
  { key: 'verificationToken', label: 'Verification' },
  { key: 'passwordResetToken', label: 'Password reset' },
  { key: 'emailChangeToken', label: 'Email change' },
  { key: 'fileToken', label: 'File' },
] as const

type TokenKey = (typeof tokenTypes)[number]['key']

export function SettingsTokens() {
  const collectionsRes = useFetch<ListResult<CollectionModel>>(
    `/api/collections?perPage=500&filter=${encodeURIComponent("type='auth'")}`,
    { fetcher: authedFetcher as never },
  )

  const collections = collectionsRes.data?.items ?? []

  const [selectedId, setSelectedId] = useState('')
  const [activeToken, setActiveToken] = useState<TokenKey>('authToken')
  const [duration, setDuration] = useState(0)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(0)
  const [saveError, setSaveError] = useState('')
  const [rotating, setRotating] = useState(false)
  const [rotatedAt, setRotatedAt] = useState(0)

  // Default selection once collections load.
  useEffect(() => {
    if (!selectedId && collections.length > 0) {
      setSelectedId(collections[0].id)
    }
  }, [collections, selectedId])

  const collection = collections.find((c) => c.id === selectedId)
  const tokenConfig = collection
    ? ((collection as Record<string, unknown>)[activeToken] as
        | { duration?: number; secret?: string }
        | undefined)
    : undefined

  // Sync duration when active token / collection changes (only if
  // the user hasn't started editing).
  useEffect(() => {
    if (!dirty) {
      setDuration(tokenConfig?.duration ?? 0)
    }
  }, [tokenConfig, dirty])

  async function save() {
    if (!selectedId) return
    setSaving(true)
    setSaveError('')
    try {
      await updateCollection(selectedId, { [activeToken]: { duration } })
      await collectionsRes.mutate()
      setDirty(false)
      setSavedAt(Date.now())
    } catch (err) {
      setSaveError((err as Error)?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function rotate() {
    if (!selectedId) return
    if (
      !confirm(
        'Regenerate secret? All existing tokens of this kind will be invalidated.',
      )
    ) {
      return
    }
    setRotating(true)
    try {
      const buf = new Uint8Array(32)
      crypto.getRandomValues(buf)
      const secret = Array.from(buf)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      await updateCollection(selectedId, { [activeToken]: { secret } })
      await collectionsRes.mutate()
      setRotatedAt(Date.now())
    } finally {
      setRotating(false)
    }
  }

  if (collectionsRes.isLoading) return <LoadingState />
  if (collectionsRes.error) return <ErrorState error={collectionsRes.error as Error} />
  if (collections.length === 0) {
    return (
      <Text fontSize="$3" color="$placeholderColor">
        No auth collections found.
      </Text>
    )
  }

  return (
    <YStack gap="$4">
      <SectionCard
        title="Token options"
        description="Configure token duration and secrets per auth collection."
      >
        <XStack gap="$1.5" flexWrap="wrap">
          {collections.map((c) => {
            const active = c.id === selectedId
            return (
              <Button
                key={c.id}
                size="$2"
                onPress={() => {
                  setSelectedId(c.id)
                  setDirty(false)
                }}
                bg={active ? ('#f2f2f2' as never) : 'transparent'}
                borderWidth={1}
                borderColor={active ? ('#f2f2f2' as never) : '$borderColor'}
              >
                <Text fontSize="$2" color={active ? ('#070b13' as never) : '$color'}>
                  {c.name}
                </Text>
              </Button>
            )
          })}
        </XStack>

        <XStack gap="$1.5" flexWrap="wrap">
          {tokenTypes.map((t) => {
            const active = t.key === activeToken
            return (
              <Button
                key={t.key}
                size="$2"
                onPress={() => {
                  setActiveToken(t.key)
                  setDirty(false)
                }}
                bg={active ? '$color3' : 'transparent'}
                borderWidth={1}
                borderColor={active ? '$borderColor' : 'transparent'}
              >
                <Text fontSize="$2" color={active ? '$color' : '$placeholderColor'}>
                  {t.label}
                </Text>
              </Button>
            )
          })}
        </XStack>

        <YStack gap="$2" maxW={320}>
          <Text fontSize="$2" color="$placeholderColor">
            Duration (seconds)
          </Text>
          <Input
            value={String(duration)}
            onChangeText={(v: string) => {
              setDuration(Number(v) || 0)
              setDirty(true)
            }}
            keyboardType="number-pad"
          />
          <Text fontSize="$1" color="$placeholderColor">
            0 = use system default
          </Text>
        </YStack>

        {tokenConfig?.secret ? (
          <XStack gap="$2" items="center">
            <Text fontSize="$2" color="$placeholderColor">
              Secret:
            </Text>
            <Text fontSize="$1" fontFamily="$mono" color="$color">
              {tokenConfig.secret.slice(0, 8)}…
            </Text>
          </XStack>
        ) : null}

        <XStack gap="$2" items="center" pt="$2">
          <Button
            size="$3"
            disabled={!dirty || saving}
            onPress={save}
            bg={'#f2f2f2' as never}
            hoverStyle={{ background: '#ffffff' as never }}
          >
            <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
              {saving ? 'Saving…' : 'Save duration'}
            </Text>
          </Button>
          <Button size="$3" theme="red" disabled={rotating} onPress={rotate}>
            {rotating ? 'Rotating…' : 'Rotate secret'}
          </Button>
          {savedAt > 0 && !dirty ? (
            <Text fontSize="$1" color="$green10">
              Saved.
            </Text>
          ) : null}
          {rotatedAt > 0 ? (
            <Text fontSize="$1" color="$green10">
              Secret rotated.
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
