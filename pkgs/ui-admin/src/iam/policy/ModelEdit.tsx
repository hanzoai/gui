// ModelEdit — port of upstream ModelEditPage.
//
// One textarea-driven editor (AuthzEditor) does the work. We keep
// owner/name/displayName/description as ordinary fields and gate
// the model body behind read-only when the model is built-in.

import { useEffect, useState } from 'react'
import { Button, H3, Input, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ErrorState } from '../../primitives/Empty'
import { useFetch, apiPost } from '../../data/useFetch'
import { AuthzEditor } from './AuthzEditor'
import type { IamItemResponse, Model } from './types'

export interface ModelEditProps {
  owner: string
  name: string
  builtIns?: ReadonlySet<string>
  onClose: (saved: boolean) => void
  fetcher?: (url: string) => Promise<unknown>
}

const DEFAULT_BUILTINS = new Set([
  'user-model-built-in',
  'api-model-built-in',
  'app-model-built-in',
  'default-model',
])

export function ModelEdit({
  owner,
  name,
  builtIns = DEFAULT_BUILTINS,
  onClose,
  fetcher,
}: ModelEditProps) {
  const url = `/v1/iam/models/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
  const { data, error, isLoading } = useFetch<IamItemResponse<Model>>(url, { fetcher })
  const [draft, setDraft] = useState<Model | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (data?.data) setDraft(data.data)
  }, [data])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !draft)
    return (
      <XStack p="$5" items="center" justify="center">
        <Spinner size="small" />
      </XStack>
    )

  const isBuiltIn = builtIns.has(draft.name)

  function update<K extends keyof Model>(key: K, value: Model[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  async function save(exit: boolean) {
    if (!draft) return
    setSaving(true)
    setSaveError(null)
    try {
      await apiPost(url, draft)
      if (exit) onClose(true)
    } catch (e) {
      setSaveError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <H3 size="$6" color="$color">
          {isBuiltIn ? 'View Model' : 'Edit Model'}
        </H3>
        <XStack gap="$2">
          <Button onPress={() => save(false)} disabled={saving || isBuiltIn}>
            Save
          </Button>
          <Button
            onPress={() => save(true)}
            disabled={saving || isBuiltIn}
            theme={'blue' as never}
          >
            Save & Exit
          </Button>
          <Button onPress={() => onClose(false)} disabled={saving} variant="outlined">
            Cancel
          </Button>
        </XStack>
      </XStack>

      {saveError ? (
        <YStack
          rounded="$2"
          borderWidth={1}
          borderColor={'#7f1d1d' as never}
          bg={'rgba(239,68,68,0.10)' as never}
          p="$3"
        >
          <Text fontSize="$2" color="#fca5a5">
            {saveError}
          </Text>
        </YStack>
      ) : null}

      <Field label="Organization">
        <Input value={draft.owner} editable={false} />
      </Field>
      <Field label="Name">
        <Input
          value={draft.name}
          editable={!isBuiltIn}
          onChangeText={(v: string) => update('name', v)}
        />
      </Field>
      <Field label="Display name">
        <Input
          value={draft.displayName}
          onChangeText={(v: string) => update('displayName', v)}
        />
      </Field>
      <Field label="Description">
        <Input
          value={draft.description ?? ''}
          onChangeText={(v: string) => update('description', v)}
        />
      </Field>

      <Field label="Model text" align="top">
        <AuthzEditor
          value={draft.modelText}
          onChange={(v) => update('modelText', v)}
          readOnly={isBuiltIn}
          height={500}
        />
      </Field>
    </YStack>
  )
}

function Field({
  label,
  children,
  align = 'center',
}: {
  label: string
  children: React.ReactNode
  align?: 'center' | 'top'
}) {
  return (
    <XStack
      gap="$4"
      items={align === 'top' ? ('flex-start' as never) : ('center' as never)}
    >
      <YStack width={160} pt={align === 'top' ? '$2' : 0}>
        <Text fontSize="$2" color="$placeholderColor">
          {label}
        </Text>
      </YStack>
      <YStack flex={1}>{children}</YStack>
    </XStack>
  )
}
