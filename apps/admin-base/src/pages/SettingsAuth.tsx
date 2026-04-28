// SettingsAuth — OAuth2 / OIDC providers per auth collection. Replaces
// the legacy ui-react Tailwind/react-query version. Uses Hanzo GUI v7
// primitives + @hanzogui/admin useFetch.
//
// Source-of-truth: collection.oauth2 = { enabled, providers: [{ name,
// clientId, clientSecret, authURL, tokenURL, userInfoURL, displayName }] }

import { useState } from 'react'
import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import {
  authedFetcher,
  getCollection,
  updateCollection,
  type CollectionModel,
  type ListResult,
} from '../lib/api'
import { SectionCard } from '../components/SectionCard'

const knownProviders = [
  'google', 'github', 'apple', 'discord', 'microsoft', 'facebook',
  'gitlab', 'twitter', 'spotify', 'twitch', 'strava', 'kakao',
  'livechat', 'gitee', 'gitea', 'bitbucket', 'patreon', 'mailcow',
  'vk', 'yandex', 'oidc', 'oidc2', 'oidc3',
] as const

type Provider = string

interface ProviderConfig {
  name: string
  clientId?: string
  clientSecret?: string
  authURL?: string
  tokenURL?: string
  userInfoURL?: string
  displayName?: string
  [key: string]: unknown
}

interface OAuth2Block {
  enabled?: boolean
  providers?: ProviderConfig[]
  [key: string]: unknown
}

export function SettingsAuth() {
  const authCollections = useFetch<ListResult<CollectionModel>>(
    `/api/collections?perPage=200&filter=${encodeURIComponent("type='auth'")}`,
    { fetcher: authedFetcher as never },
  )

  const [editing, setEditing] = useState<string | null>(null)

  if (authCollections.isLoading) return <LoadingState />
  if (authCollections.error) return <ErrorState error={authCollections.error as Error} />

  const collections = (authCollections.data?.items ?? []).filter((c) => c.type === 'auth')

  return (
    <YStack gap="$4">
      <SectionCard
        title="OAuth2 providers"
        description="Configure OAuth2 / OIDC providers for auth collections."
      >
        {collections.length === 0 ? (
          <Text fontSize="$2" color="$placeholderColor">
            No auth collections found.
          </Text>
        ) : null}

        {collections.map((col) => {
          const oauth2 = (col.oauth2 as OAuth2Block | undefined) ?? {}
          const providers = oauth2.providers ?? []

          return (
            <YStack key={col.id} gap="$2.5" pb="$3">
              <XStack items="baseline" gap="$2">
                <Text fontSize="$3" color="$color" fontWeight="500">
                  {col.name}
                </Text>
                <Text fontSize="$1" color="$placeholderColor">
                  OAuth2 {oauth2.enabled ? 'enabled' : 'disabled'}
                </Text>
              </XStack>
              <XStack gap="$1.5" flexWrap="wrap">
                {knownProviders.map((provName) => {
                  const existing = providers.find((p) => p.name === provName)
                  const configured = Boolean(existing?.clientId)
                  const key = `${col.name}:${provName}`
                  const isEditing = editing === key
                  return (
                    <Button
                      key={provName}
                      size="$2"
                      onPress={() => setEditing(isEditing ? null : key)}
                      bg={configured ? ('rgba(34,197,94,0.10)' as never) : 'transparent'}
                      borderWidth={1}
                      borderColor={configured ? ('rgba(34,197,94,0.45)' as never) : '$borderColor'}
                    >
                      <Text
                        fontSize="$1"
                        color={configured ? ('$green10' as never) : '$placeholderColor'}
                      >
                        {provName}
                      </Text>
                    </Button>
                  )
                })}
              </XStack>
              {editing && editing.startsWith(col.name + ':') ? (
                <ProviderEditor
                  collectionId={col.id}
                  collectionName={col.name}
                  providerName={editing.split(':')[1]!}
                  existing={providers.find((p) => p.name === editing.split(':')[1])}
                  onClose={() => setEditing(null)}
                  onSaved={async () => {
                    await authCollections.mutate()
                    setEditing(null)
                  }}
                />
              ) : null}
            </YStack>
          )
        })}
      </SectionCard>
    </YStack>
  )
}

interface ProviderEditorProps {
  collectionId: string
  collectionName: string
  providerName: Provider
  existing: ProviderConfig | undefined
  onClose: () => void
  onSaved: () => void | Promise<void>
}

function ProviderEditor({
  collectionId,
  collectionName,
  providerName,
  existing,
  onClose,
  onSaved,
}: ProviderEditorProps) {
  const [clientId, setClientId] = useState((existing?.clientId as string) ?? '')
  const [clientSecret, setClientSecret] = useState((existing?.clientSecret as string) ?? '')
  const [authURL, setAuthURL] = useState((existing?.authURL as string) ?? '')
  const [tokenURL, setTokenURL] = useState((existing?.tokenURL as string) ?? '')
  const [userInfoURL, setUserInfoURL] = useState((existing?.userInfoURL as string) ?? '')
  const [displayName, setDisplayName] = useState(
    (existing?.displayName as string) ?? providerName,
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setSaving(true)
    setError('')
    try {
      const col = await getCollection(collectionId)
      const oauth2 = (col.oauth2 as OAuth2Block | undefined) ?? {}
      const providers = [...(oauth2.providers ?? [])]
      const idx = providers.findIndex((p) => p.name === providerName)
      const entry: ProviderConfig = {
        name: providerName,
        clientId,
        authURL,
        tokenURL,
        userInfoURL,
        displayName,
      }
      // Only send password-class field if changed (Base treats unchanged
      // secrets specially; same as legacy behaviour).
      if (clientSecret !== ((existing?.clientSecret as string) ?? '')) {
        entry.clientSecret = clientSecret
      }
      if (idx >= 0) providers[idx] = { ...providers[idx], ...entry }
      else providers.push(entry)
      await updateCollection(collectionId, {
        oauth2: { ...oauth2, enabled: true, providers },
      })
      await onSaved()
    } catch (err) {
      setError((err as Error)?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <YStack
      gap="$3"
      p="$4"
      mt="$2"
      bg={'rgba(255,255,255,0.02)' as never}
      borderWidth={1}
      borderColor="$borderColor"
      rounded="$3"
    >
      <XStack items="center" justify="space-between">
        <Text fontSize="$3" color="$color" fontWeight="500">
          {collectionName} / {providerName}
        </Text>
        <Button size="$1" chromeless onPress={onClose}>
          <Text fontSize="$1" color="$placeholderColor">
            Close
          </Text>
        </Button>
      </XStack>
      <XStack gap="$3" flexWrap="wrap">
        <YStack gap="$1.5" flex={1} minW={260}>
          <Text fontSize="$2" color="$placeholderColor">
            Client ID
          </Text>
          <Input value={clientId} onChangeText={setClientId} autoCapitalize="none" />
        </YStack>
        <YStack gap="$1.5" flex={1} minW={260}>
          <Text fontSize="$2" color="$placeholderColor">
            Client secret
          </Text>
          <Input
            value={clientSecret}
            onChangeText={setClientSecret}
            secureTextEntry
            autoComplete="off"
          />
        </YStack>
      </XStack>
      <XStack gap="$3" flexWrap="wrap">
        <YStack gap="$1.5" flex={1} minW={260}>
          <Text fontSize="$2" color="$placeholderColor">
            Auth URL
          </Text>
          <Input
            value={authURL}
            onChangeText={setAuthURL}
            placeholder="Auto-detected"
            autoCapitalize="none"
          />
        </YStack>
        <YStack gap="$1.5" flex={1} minW={260}>
          <Text fontSize="$2" color="$placeholderColor">
            Token URL
          </Text>
          <Input
            value={tokenURL}
            onChangeText={setTokenURL}
            placeholder="Auto-detected"
            autoCapitalize="none"
          />
        </YStack>
      </XStack>
      <YStack gap="$1.5">
        <Text fontSize="$2" color="$placeholderColor">
          User info URL
        </Text>
        <Input
          value={userInfoURL}
          onChangeText={setUserInfoURL}
          placeholder="Auto-detected"
          autoCapitalize="none"
        />
      </YStack>
      <YStack gap="$1.5">
        <Text fontSize="$2" color="$placeholderColor">
          Display name
        </Text>
        <Input value={displayName} onChangeText={setDisplayName} />
      </YStack>
      <XStack gap="$2" items="center" pt="$2">
        <Button
          size="$3"
          disabled={saving}
          onPress={save}
          bg={'#f2f2f2' as never}
          hoverStyle={{ background: '#ffffff' as never }}
        >
          <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
            {saving ? 'Saving…' : 'Save provider'}
          </Text>
        </Button>
        {error ? (
          <Text fontSize="$1" color="$red10">
            {error}
          </Text>
        ) : null}
      </XStack>
    </YStack>
  )
}
