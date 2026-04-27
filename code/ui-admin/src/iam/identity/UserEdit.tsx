// IAM user — edit view. The upstream `UserEditPage.tsx` is ~1500
// lines of Ant Design `<Form>` + tabs + sub-tables (MFA, addresses,
// WebAuthn, OAuth widgets, managed accounts, face ID). This port
// keeps just the identity-core fields. Auxiliary tables get a TODO
// alert so the operator knows where to look. Password resets are NOT
// done from this form — that surface lives in the IAM password-reset
// flow (always argon2id, never plaintext POST from the admin UI).

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, H2, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { Alert, ErrorState, Loading, PageShell } from '../..'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamItemResponse, User } from './types'
import { iamUrl } from './api'
import { Field, ToggleField } from './Field'

interface RouteParams {
  orgName: string
  userName: string
  [key: string]: string | undefined
}

interface FormErrors {
  name?: string
  displayName?: string
  email?: string
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

function validate(u: User): FormErrors {
  const errs: FormErrors = {}
  if (!u.name.trim()) errs.name = 'Name is required'
  if (!u.displayName.trim()) errs.displayName = 'Display name is required'
  if (!isEmail(u.email)) errs.email = 'Email is required'
  return errs
}

export function UserEdit() {
  const { orgName, userName } = useParams() as RouteParams
  const nav = useNavigate()
  const url =
    orgName && userName ? iamUrl(`users/${orgName}/${userName}`) : null

  const { data, error, isLoading, mutate } =
    useFetch<IamItemResponse<User>>(url)

  const [draft, setDraft] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [errs, setErrs] = useState<FormErrors>({})

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
        <Loading label="Loading user" />
      </PageShell>
    )
  }

  const set = <K extends keyof User>(k: K, v: User[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d))

  const onSave = async () => {
    const v = validate(draft)
    setErrs(v)
    if (Object.keys(v).length > 0) return
    setSaving(true)
    setSaveErr(null)
    try {
      await apiPost(iamUrl(`users/${draft.owner}/${draft.name}`), draft)
      await mutate()
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!window.confirm(`Delete "${draft.displayName || draft.name}"?`)) return
    await apiDelete(iamUrl(`users/${draft.owner}/${draft.name}`))
    nav('/iam/users')
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
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="$3"
            chromeless
            onPress={onDelete}
            disabled={draft.owner === 'built-in' && draft.name === 'admin'}
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
          id="user-name"
          label="Username"
          value={draft.name}
          onChangeText={(v) => set('name', v)}
          required
          error={errs.name}
        />
        <Field
          id="user-display"
          label="Display name"
          value={draft.displayName}
          onChangeText={(v) => set('displayName', v)}
          required
          error={errs.displayName}
        />
        <Field
          id="user-first"
          label="First name"
          value={draft.firstName ?? ''}
          onChangeText={(v) => set('firstName', v)}
        />
        <Field
          id="user-last"
          label="Last name"
          value={draft.lastName ?? ''}
          onChangeText={(v) => set('lastName', v)}
        />
        <Field
          id="user-email"
          label="Email"
          type="email"
          value={draft.email}
          onChangeText={(v) => set('email', v)}
          required
          error={errs.email}
        />
        <Field
          id="user-phone"
          label="Phone"
          value={draft.phone ?? ''}
          onChangeText={(v) => set('phone', v)}
        />
        <Field
          id="user-avatar"
          label="Avatar URL"
          type="url"
          value={draft.avatar ?? ''}
          onChangeText={(v) => set('avatar', v)}
        />
        <Field
          id="user-affiliation"
          label="Affiliation"
          value={draft.affiliation ?? ''}
          onChangeText={(v) => set('affiliation', v)}
        />
        <Field
          id="user-tag"
          label="Tag"
          value={draft.tag ?? ''}
          onChangeText={(v) => set('tag', v)}
        />
        <Field
          id="user-region"
          label="Region"
          value={draft.region ?? ''}
          onChangeText={(v) => set('region', v)}
        />
        <ToggleField
          id="user-admin"
          label="Is admin"
          value={draft.isAdmin ?? false}
          onChange={(v) => set('isAdmin', v)}
        />
        <ToggleField
          id="user-verified"
          label="Email verified"
          value={draft.isVerified ?? false}
          onChange={(v) => set('isVerified', v)}
        />
        <ToggleField
          id="user-forbidden"
          label="Is forbidden"
          value={draft.isForbidden ?? false}
          onChange={(v) => set('isForbidden', v)}
          hint="Forbidden users cannot sign in."
        />
      </YStack>

      <Alert title="Password & MFA">
        <Paragraph color="$placeholderColor" fontSize="$2">
          Password resets are not performed from this form — admins
          must trigger a password-reset email via the IAM
          password-reset flow. argon2id only; no plaintext POST is ever
          accepted by the server. MFA enrolment, WebAuthn credentials,
          managed accounts, and OAuth links are deferred to a follow-up
          bucket.
        </Paragraph>
        <Text fontSize="$1" color="$placeholderColor" mt="$2">
          Owner: {draft.owner} | Created: {draft.createdTime}
        </Text>
      </Alert>
    </PageShell>
  )
}
