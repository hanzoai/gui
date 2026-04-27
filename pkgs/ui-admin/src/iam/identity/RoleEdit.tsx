// IAM role — edit view. Ports `web/src/RoleEditPage.tsx`. Upstream
// has `users[]`, `groups[]`, `roles[]`, `domains[]` membership
// editors built from custom Select-multi widgets — here we surface
// them as comma-separated text inputs. That's a deliberate
// simplification for this port; richer multi-select bindings can
// land alongside the IAM Application/Adapter port.

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, H2, Text, XStack, YStack } from 'hanzogui'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { Alert, ErrorState, Loading } from '../../primitives'
import { PageShell } from '../../shell'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamItemResponse, Role } from './types'
import { iamUrl } from './api'
import { Field, ToggleField } from './Field'

interface RouteParams {
  orgName: string
  roleName: string
  [key: string]: string | undefined
}

interface FormErrors {
  name?: string
  displayName?: string
}

function validate(r: Role): FormErrors {
  const errs: FormErrors = {}
  if (!r.name.trim()) errs.name = 'Name is required'
  if (!r.displayName.trim()) errs.displayName = 'Display name is required'
  return errs
}

function listToCsv(xs: string[] | undefined): string {
  return (xs ?? []).join(', ')
}

function csvToList(s: string): string[] {
  return s
    .split(',')
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
}

export function RoleEdit() {
  const { orgName, roleName } = useParams() as RouteParams
  const nav = useNavigate()
  const url =
    orgName && roleName
      ? iamUrl(`roles/${orgName}/${decodeURIComponent(roleName)}`)
      : null

  const { data, error, isLoading, mutate } =
    useFetch<IamItemResponse<Role>>(url)

  const [draft, setDraft] = useState<Role | null>(null)
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
        <Loading label="Loading role" />
      </PageShell>
    )
  }

  const set = <K extends keyof Role>(k: K, v: Role[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d))

  const onSave = async () => {
    const v = validate(draft)
    setErrs(v)
    if (Object.keys(v).length > 0) return
    setSaving(true)
    setSaveErr(null)
    try {
      await apiPost(iamUrl(`roles/${draft.owner}/${draft.name}`), draft)
      await mutate()
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!window.confirm(`Delete "${draft.displayName || draft.name}"?`)) return
    await apiDelete(iamUrl(`roles/${draft.owner}/${draft.name}`))
    nav('/iam/roles')
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
          id="role-name"
          label="Name (slug)"
          value={draft.name}
          onChangeText={(v) => set('name', v)}
          required
          error={errs.name}
        />
        <Field
          id="role-display"
          label="Display name"
          value={draft.displayName}
          onChangeText={(v) => set('displayName', v)}
          required
          error={errs.displayName}
        />
        <Field
          id="role-description"
          label="Description"
          value={draft.description ?? ''}
          onChangeText={(v) => set('description', v)}
        />
        <Field
          id="role-users"
          label="Users"
          value={listToCsv(draft.users)}
          onChangeText={(v) => set('users', csvToList(v))}
          hint="Comma-separated owner/name pairs (e.g. built-in/admin, hanzo/alice)."
        />
        <Field
          id="role-groups"
          label="Groups"
          value={listToCsv(draft.groups)}
          onChangeText={(v) => set('groups', csvToList(v))}
          hint="Comma-separated owner/name group pairs."
        />
        <Field
          id="role-roles"
          label="Sub-roles"
          value={listToCsv(draft.roles)}
          onChangeText={(v) => set('roles', csvToList(v))}
          hint="Roles that this role inherits from."
        />
        <Field
          id="role-domains"
          label="Domains"
          value={listToCsv(draft.domains)}
          onChangeText={(v) => set('domains', csvToList(v))}
          hint="Domains where this role applies."
        />
        <ToggleField
          id="role-enabled"
          label="Enabled"
          value={draft.isEnabled}
          onChange={(v) => set('isEnabled', v)}
        />
      </YStack>

      <Alert title="Membership editors deferred">
        <Text fontSize="$2" color="$placeholderColor">
          Upstream uses tag-style multi-selects with autocomplete. The
          comma-separated text inputs above are a port placeholder.
          Wire them to a proper picker (probably hanzogui&apos;s Combobox
          + autocompletion-from-IAM) once the Application/Adapter
          buckets land.
        </Text>
        <Text fontSize="$1" color="$placeholderColor" mt="$2">
          Owner: {draft.owner} | Created: {draft.createdTime}
        </Text>
      </Alert>
    </PageShell>
  )
}
