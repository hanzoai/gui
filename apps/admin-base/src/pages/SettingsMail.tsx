// SettingsMail — per-collection email template editor (verification,
// password-reset, email-change). Live HTML preview in a sandboxed
// <iframe>. Source-of-truth: collection.<templateKey> = { subject,
// body, actionUrl }.

import { useMemo, useState } from 'react'
import { Button, Input, Text, TextArea, XStack, YStack } from 'hanzogui'
import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import {
  authedFetcher,
  updateCollection,
  type CollectionModel,
  type ListResult,
} from '../lib/api'
import { SectionCard } from '../components/SectionCard'

const templateKeys = [
  { key: 'verificationTemplate', label: 'Verification' },
  { key: 'resetPasswordTemplate', label: 'Password reset' },
  { key: 'confirmEmailChangeTemplate', label: 'Email change' },
] as const

type TemplateKey = (typeof templateKeys)[number]['key']

interface Template {
  subject?: string
  body?: string
  actionUrl?: string
}

export function SettingsMail() {
  const authCollections = useFetch<ListResult<CollectionModel>>(
    `/api/collections?perPage=200&filter=${encodeURIComponent("type='auth'")}`,
    { fetcher: authedFetcher as never },
  )

  const collections = (authCollections.data?.items ?? []).filter((c) => c.type === 'auth')

  const [selectedId, setSelectedId] = useState<string>('')
  const [activeKey, setActiveKey] = useState<TemplateKey>('verificationTemplate')

  const collectionId = selectedId || collections[0]?.id || ''
  const collection = collections.find((c) => c.id === collectionId)
  const templateData = collection
    ? ((collection as Record<string, unknown>)[activeKey] as Template | undefined)
    : undefined

  // Edit form (keyed on collection+template — if either changes we reset).
  const formKey = `${collectionId}::${activeKey}`
  const [editKey, setEditKey] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [actionUrl, setActionUrl] = useState('')

  if (editKey !== formKey) {
    setEditKey(formKey)
    setSubject(templateData?.subject ?? '')
    setBody(templateData?.body ?? '')
    setActionUrl(templateData?.actionUrl ?? '')
  }

  const dirty =
    subject !== (templateData?.subject ?? '') ||
    body !== (templateData?.body ?? '') ||
    actionUrl !== (templateData?.actionUrl ?? '')

  const previewHtml = useMemo(() => {
    return body
      .replace(/\{APP_NAME\}/g, 'App Name')
      .replace(/\{APP_URL\}/g, 'https://example.com')
      .replace(/\{TOKEN\}/g, 'test-token-xxx')
      .replace(/\{ACTION_URL\}/g, '#')
      .replace(/\{OTP\}/g, '123456')
      .replace(/\{RECORD:.*?\}/g, 'value')
  }, [body])

  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(0)
  const [saveErr, setSaveErr] = useState('')

  async function save() {
    if (!collectionId) return
    setSaving(true)
    setSaveErr('')
    try {
      await updateCollection(collectionId, {
        [activeKey]: { subject, body, actionUrl },
      })
      await authCollections.mutate()
      setSavedAt(Date.now())
    } catch (err) {
      setSaveErr((err as Error)?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (authCollections.isLoading) return <LoadingState />
  if (authCollections.error) return <ErrorState error={authCollections.error as Error} />
  if (collections.length === 0) {
    return (
      <YStack gap="$4">
        <SectionCard title="Mail templates" description="Edit email templates for auth collections.">
          <Text fontSize="$2" color="$placeholderColor">
            No auth collections found.
          </Text>
        </SectionCard>
      </YStack>
    )
  }

  return (
    <YStack gap="$4">
      <SectionCard
        title="Mail templates"
        description="Edit email templates for auth collections."
      >
        <XStack items="center" gap="$3" flexWrap="wrap">
          <YStack gap="$1.5" minW={220}>
            <Text fontSize="$2" color="$placeholderColor">
              Auth collection
            </Text>
            <XStack gap="$1.5" flexWrap="wrap">
              {collections.map((c) => {
                const active = c.id === collectionId
                return (
                  <Button
                    key={c.id}
                    size="$2"
                    onPress={() => setSelectedId(c.id)}
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
          </YStack>
          <YStack gap="$1.5">
            <Text fontSize="$2" color="$placeholderColor">
              Template
            </Text>
            <XStack gap="$1.5">
              {templateKeys.map((t) => {
                const active = t.key === activeKey
                return (
                  <Button
                    key={t.key}
                    size="$2"
                    onPress={() => setActiveKey(t.key)}
                    bg={active ? ('#f2f2f2' as never) : 'transparent'}
                    borderWidth={1}
                    borderColor={active ? ('#f2f2f2' as never) : '$borderColor'}
                  >
                    <Text fontSize="$2" color={active ? ('#070b13' as never) : '$color'}>
                      {t.label}
                    </Text>
                  </Button>
                )
              })}
            </XStack>
          </YStack>
        </XStack>

        <XStack gap="$3" flexWrap="wrap">
          <YStack gap="$3" flex={1} minW={360}>
            <YStack gap="$1.5">
              <Text fontSize="$2" color="$placeholderColor">
                Subject
              </Text>
              <Input value={subject} onChangeText={setSubject} />
            </YStack>
            <YStack gap="$1.5">
              <Text fontSize="$2" color="$placeholderColor">
                Action URL
              </Text>
              <Input
                value={actionUrl}
                onChangeText={setActionUrl}
                placeholder="https://…"
                autoCapitalize="none"
              />
            </YStack>
            <YStack gap="$1.5">
              <Text fontSize="$2" color="$placeholderColor">
                Body (HTML)
              </Text>
              <TextArea
                value={body}
                onChangeText={setBody}
                rows={14}
                spellCheck={false}
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$1"
              />
            </YStack>
            <Text fontSize="$1" color="$placeholderColor">
              Placeholders: {'{APP_NAME}'}, {'{APP_URL}'}, {'{TOKEN}'}, {'{ACTION_URL}'},{' '}
              {'{OTP}'}
            </Text>
          </YStack>
          <YStack gap="$1.5" flex={1} minW={360}>
            <Text fontSize="$2" color="$placeholderColor">
              Preview
            </Text>
            <YStack
              flex={1}
              minH={320}
              bg={'#ffffff' as never}
              borderWidth={1}
              borderColor="$borderColor"
              rounded="$2"
              overflow="hidden"
            >
              <iframe
                sandbox=""
                srcDoc={previewHtml}
                title="Mail preview"
                style={{ width: '100%', height: '100%', minHeight: 320, border: 0 }}
              />
            </YStack>
          </YStack>
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
              {saving ? 'Saving…' : 'Save template'}
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
      </SectionCard>
    </YStack>
  )
}
