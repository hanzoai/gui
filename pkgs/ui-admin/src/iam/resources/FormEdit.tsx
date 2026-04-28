// Form editor — single form definition. Upstream embeds a preview of
// the underlying list page (UserListPage / ApplicationListPage / ...);
// in the admin shell those preview components live in their own
// buckets, so this port keeps the editor focused on the form
// definition itself. The schema editor (`FormItemTable` upstream) is
// a separate primitive — we render a placeholder inline so callers
// know where to drop it.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Input,
  Select,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { useFetch } from '../../data/useFetch'
import {
  FormUrls,
  type FormDefinition,
  type ItemResponse,
} from './api'
import { type AdminAccount, type FormType } from './types'

const FORM_TYPES: { id: FormType; label: string }[] = [
  { id: 'users', label: 'Users' },
  { id: 'applications', label: 'Applications' },
  { id: 'providers', label: 'Providers' },
  { id: 'organizations', label: 'Organizations' },
]

export interface FormEditProps {
  account: AdminAccount
}

export function FormEdit({ account }: FormEditProps) {
  void account
  const nav = useNavigate()
  const params = useParams<{ owner: string; formName: string }>()
  const owner = params.owner ?? ''
  const formNameFromUrl = params.formName ?? ''

  const url = useMemo(
    () => FormUrls.one(owner, formNameFromUrl),
    [owner, formNameFromUrl],
  )
  const { data, isLoading, error } = useFetch<ItemResponse<FormDefinition>>(url)

  const [form, setForm] = useState<FormDefinition | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (data?.data) setForm(data.data)
  }, [data])

  const update = useCallback(
    <K extends keyof FormDefinition>(key: K, value: FormDefinition[K]) => {
      setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
    },
    [],
  )

  const submitEdit = useCallback(
    async (exit: boolean) => {
      if (!form) return
      setSaving(true)
      setSaveError(null)
      try {
        const res = await fetch(FormUrls.update(owner, formNameFromUrl), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error(`save failed: ${res.status}`)
        if (exit) nav('/forms')
        else nav(`/forms/${form.owner}/${form.name}`)
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : 'save failed')
      } finally {
        setSaving(false)
      }
    },
    [form, formNameFromUrl, nav, owner],
  )

  if (isLoading || !form) {
    return (
      <YStack p="$4">
        <Text color="$placeholderColor">
          {error ? `Could not load: ${error.message}` : 'Loading form...'}
        </Text>
      </YStack>
    )
  }

  return (
    <YStack gap="$4">
      <XStack
        items="center"
        justify="space-between"
        p="$4"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Text fontSize="$6" fontWeight="600" color="$color">
          Edit Form
        </Text>
        <XStack gap="$2">
          <Button
            disabled={saving}
            onPress={() => submitEdit(false)}
          >
            Save
          </Button>
          <Button
            theme="blue"
            disabled={saving}
            onPress={() => submitEdit(true)}
          >
            Save &amp; Exit
          </Button>
        </XStack>
      </XStack>

      {saveError ? (
        <Text fontSize="$2" color="#fca5a5" px="$4">
          {saveError}
        </Text>
      ) : null}

      <YStack p="$4" gap="$4">
        <Field label="Name">
          <Input value={form.name} disabled />
        </Field>
        <Field label="Display name">
          <Input
            value={form.displayName}
            onChangeText={(v) => update('displayName', v)}
          />
        </Field>
        <Field label="Type">
          <Select
            value={form.type || ''}
            onValueChange={(v) => update('type', v as FormType)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select form type" />
            </Select.Trigger>
            <Select.Content>
              {FORM_TYPES.map((opt, i) => (
                <Select.Item key={opt.id} value={opt.id} index={i}>
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </Field>
        <Field label="Tag">
          <Input
            value={form.tag ?? ''}
            onChangeText={(v) => update('tag', v)}
          />
        </Field>
        <Field label="Form items">
          <YStack
            p="$3"
            borderWidth={1}
            borderColor="$borderColor"
            rounded="$2"
            gap="$2"
          >
            <Text fontSize="$2" color="$placeholderColor">
              {form.formItems.length} items configured.
            </Text>
            {/* TODO(iam-resources): port FormItemTable from upstream
                table/FormItemTable.tsx — depends on the lower-level
                column-row primitive that's not yet in @hanzogui/admin. */}
          </YStack>
        </Field>
      </YStack>
    </YStack>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <XStack gap="$3" items="center">
      <YStack width={160}>
        <Text fontSize="$2" color="$placeholderColor">
          {label}
        </Text>
      </YStack>
      <YStack flex={1}>{children}</YStack>
    </XStack>
  )
}
