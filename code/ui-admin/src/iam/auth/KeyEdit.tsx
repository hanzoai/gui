// IAM Key edit — port of upstream `web/src/KeyEditPage.tsx`. Casdoor
// renders the access key (read-only) and a masked-then-toggleable
// access secret (`Input.Password`). We follow the same model — but
// only show the secret once via a "Reveal" toggle and never log it.
// On the list page, only the public access key is shown.
//
// TODO(i18n): English literals only.

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, H2, Text, XStack, YStack } from 'hanzogui'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { Eye } from '@hanzogui/lucide-icons-2/icons/Eye'
import { EyeOff } from '@hanzogui/lucide-icons-2/icons/EyeOff'
import {
  Alert,
  CopyField,
  ErrorState,
  Loading,
  PageShell,
} from '../..'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamItemResponse, IamKey } from './types'
import { authUrl } from './api'
import { Field, SelectField, ToggleField } from './components'

interface RouteParams {
  organizationName: string
  keyName: string
  [key: string]: string | undefined
}

const KEY_TYPES: Array<{ value: IamKey['type']; label: string }> = [
  { value: 'Organization', label: 'Organization' },
  { value: 'Application', label: 'Application' },
  { value: 'User', label: 'User' },
  { value: 'General', label: 'General' },
]

export function KeyEdit() {
  const { organizationName, keyName } = useParams() as RouteParams
  const nav = useNavigate()
  const url =
    organizationName && keyName
      ? authUrl(`keys/${organizationName}/${keyName}`)
      : null

  const { data, error, isLoading, mutate } =
    useFetch<IamItemResponse<IamKey>>(url)

  const [draft, setDraft] = useState<IamKey | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [revealSecret, setRevealSecret] = useState(false)

  useEffect(() => {
    if (data?.data) setDraft({ ...data.data })
  }, [data?.data])

  if (error) {
    return (
      <PageShell>
        <ErrorState error={error} />
      </PageShell>
    )
  }

  if (isLoading || !draft) {
    return (
      <PageShell>
        <Loading label="Loading key" />
      </PageShell>
    )
  }

  const set = <K extends keyof IamKey>(k: K, v: IamKey[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d))

  const onSave = async () => {
    setSaving(true)
    setSaveErr(null)
    try {
      await apiPost(authUrl(`keys/${draft.owner}/${draft.name}`), draft)
      await mutate()
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!window.confirm(`Delete key "${draft.name}"?`)) return
    await apiDelete(authUrl(`keys/${draft.owner}/${draft.name}`))
    nav('/iam/auth/keys')
  }

  return (
    <PageShell>
      <XStack items="center" justify="space-between">
        <H2 size="$8" color="$color">
          {draft.displayName || draft.name}
        </H2>
        <XStack gap="$2">
          <Button
            size="$3"
            onPress={onSave}
            disabled={saving}
            icon={<Save size={14} />}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button
            size="$3"
            chromeless
            onPress={onDelete}
            icon={<Trash2 size={14} />}
          >
            Delete
          </Button>
        </XStack>
      </XStack>

      {saveErr ? (
        <Alert variant="destructive" title="Could not save">
          {saveErr}
        </Alert>
      ) : null}

      <YStack gap="$4" maxW={720}>
        <Field
          id="key-name"
          label="Name"
          value={draft.name}
          onChangeText={(v) => set('name', v)}
          required
        />
        <Field
          id="key-display"
          label="Display name"
          value={draft.displayName}
          onChangeText={(v) => set('displayName', v)}
        />
        <Field
          id="key-org"
          label="Organization"
          value={draft.owner}
          onChangeText={(v) => set('owner', v)}
        />
        <SelectField
          id="key-type"
          label="Type"
          value={draft.type}
          onChange={(v) => set('type', v)}
          options={KEY_TYPES}
        />
        {draft.type === 'Application' ? (
          <Field
            id="key-app"
            label="Application"
            value={draft.application ?? ''}
            onChangeText={(v) => set('application', v)}
          />
        ) : null}
        {draft.type === 'User' ? (
          <Field
            id="key-user"
            label="User"
            value={draft.user ?? ''}
            onChangeText={(v) => set('user', v)}
          />
        ) : null}

        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="600" color="$color">
            Access key
          </Text>
          {draft.accessKey ? (
            <CopyField value={draft.accessKey} />
          ) : (
            <Text color="$placeholderColor" fontSize="$2">
              Server generates the access key on first save.
            </Text>
          )}
        </YStack>

        <YStack gap="$2">
          <XStack items="center" justify="space-between">
            <Text fontSize="$3" fontWeight="600" color="$color">
              Access secret
            </Text>
            <Button
              size="$2"
              chromeless
              onPress={() => setRevealSecret((s) => !s)}
              icon={revealSecret ? <EyeOff size={12} /> : <Eye size={12} />}
            >
              {revealSecret ? 'Hide' : 'Reveal'}
            </Button>
          </XStack>
          {draft.accessSecret && revealSecret ? (
            <CopyField value={draft.accessSecret} />
          ) : (
            <Text color="$placeholderColor" fontSize="$2">
              Hidden — click Reveal to see and copy. Treat this value
              as sensitive: rotate immediately if exposed.
            </Text>
          )}
        </YStack>

        <Field
          id="key-expire"
          label="Expire time (ISO 8601)"
          value={draft.expireTime ?? ''}
          onChangeText={(v) => set('expireTime', v)}
          placeholder="2027-04-27T00:00:00Z"
          hint="Leave empty for non-expiring keys (not recommended)."
        />

        <ToggleField
          id="key-active"
          label="Active"
          value={draft.state === 'Active'}
          onChange={(v) => set('state', v ? 'Active' : 'Inactive')}
          hint="Inactive keys cannot authenticate. Use to revoke without deleting."
        />
      </YStack>
    </PageShell>
  )
}
