// EnforcerEdit — port of upstream EnforcerEditPage.
//
// Upstream's bottom half is a PolicyTable that lets admins CRUD
// `p` and `g` rows directly. We expose a minimal placeholder for
// that surface — the full inline policy editor is out of scope
// for this bucket (it depends on resolving modelCfg server-side
// to compute column counts). Admins can still edit policies via
// the Adapter the enforcer points at.

import { useEffect, useMemo, useState } from 'react'
import { Button, H3, Input, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ErrorState } from '../../primitives/Empty'
import { useFetch, apiPost } from '../../data/useFetch'
import type {
  Adapter,
  Enforcer,
  IamItemResponse,
  IamListResponse,
  Model,
} from './types'

export interface EnforcerEditProps {
  owner: string
  name: string
  builtIns?: ReadonlySet<string>
  onClose: (saved: boolean) => void
  fetcher?: (url: string) => Promise<unknown>
}

const DEFAULT_BUILTINS = new Set<string>()

export function EnforcerEdit({
  owner,
  name,
  builtIns = DEFAULT_BUILTINS,
  onClose,
  fetcher,
}: EnforcerEditProps) {
  const url = `/v1/iam/enforcers/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
  const { data, error, isLoading } = useFetch<IamItemResponse<Enforcer>>(url, { fetcher })
  const [draft, setDraft] = useState<Enforcer | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Models + Adapters for the select dropdowns. Filter to the
  // enforcer's owner so we don't show cross-org options.
  const modelsUrl = useMemo(
    () => `/v1/iam/models?owner=${encodeURIComponent(owner)}&p=1&pageSize=200`,
    [owner],
  )
  const adaptersUrl = useMemo(
    () => `/v1/iam/adapters?owner=${encodeURIComponent(owner)}&p=1&pageSize=200`,
    [owner],
  )
  const { data: modelsData } = useFetch<IamListResponse<Model>>(modelsUrl, { fetcher })
  const { data: adaptersData } = useFetch<IamListResponse<Adapter>>(adaptersUrl, { fetcher })

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
  const models = modelsData?.data ?? []
  const adapters = adaptersData?.data ?? []

  function update<K extends keyof Enforcer>(key: K, value: Enforcer[K]) {
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
          {isBuiltIn ? 'View Enforcer' : 'Edit Enforcer'}
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

      <Field label="Model">
        <PickList
          value={draft.model ?? ''}
          options={models.map((m) => `${m.owner}/${m.name}`)}
          onPick={(v) => update('model', v)}
          disabled={isBuiltIn}
        />
      </Field>
      <Field label="Adapter">
        <PickList
          value={draft.adapter ?? ''}
          options={adapters.map((a) => `${a.owner}/${a.name}`)}
          onPick={(v) => update('adapter', v)}
          disabled={isBuiltIn}
        />
      </Field>

      <Field label="Policies" align="top">
        <YStack
          rounded="$2"
          borderWidth={1}
          borderColor="$borderColor"
          p="$3"
          bg={'rgba(0,0,0,0.15)' as never}
        >
          <Text fontSize="$2" color="$placeholderColor">
            Edit policies via the linked Adapter. Inline editing is not enabled
            in this view.
          </Text>
        </YStack>
      </Field>
    </YStack>
  )
}

function PickList({
  value,
  options,
  onPick,
  disabled,
}: {
  value: string
  options: string[]
  onPick: (v: string) => void
  disabled?: boolean
}) {
  return (
    <XStack gap="$2" flexWrap={'wrap' as never}>
      {options.length === 0 ? (
        <Text fontSize="$2" color="$placeholderColor">
          —
        </Text>
      ) : (
        options.map((opt) => (
          <Button
            key={opt}
            size="$2"
            disabled={disabled}
            theme={(value === opt ? 'blue' : undefined) as never}
            onPress={() => onPick(opt)}
          >
            {opt}
          </Button>
        ))
      )}
    </XStack>
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
