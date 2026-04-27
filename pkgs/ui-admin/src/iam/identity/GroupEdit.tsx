// IAM group — edit view. Ports `web/src/GroupEditPage.tsx`. The
// upstream page is much simpler than User/Org (no tabs, no nested
// tables) so this port is a direct mapping.

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, H2, Text, XStack, YStack } from 'hanzogui'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { Alert, ErrorState, Loading } from '../../primitives'
import { PageShell } from '../../shell'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { Group, IamItemResponse } from './types'
import { iamUrl } from './api'
import { Field, ToggleField } from './Field'

interface RouteParams {
  orgName: string
  groupName: string
  [key: string]: string | undefined
}

interface FormErrors {
  name?: string
  displayName?: string
  parentId?: string
}

function validate(g: Group): FormErrors {
  const errs: FormErrors = {}
  if (!g.name.trim()) errs.name = 'Name is required'
  if (!g.displayName.trim()) errs.displayName = 'Display name is required'
  if (!g.isTopGroup && !g.parentId.trim()) {
    errs.parentId = 'Parent is required for non-root groups'
  }
  return errs
}

export function GroupEdit() {
  const { orgName, groupName } = useParams() as RouteParams
  const nav = useNavigate()
  const url =
    orgName && groupName ? iamUrl(`groups/${orgName}/${groupName}`) : null

  const { data, error, isLoading, mutate } =
    useFetch<IamItemResponse<Group>>(url)

  const [draft, setDraft] = useState<Group | null>(null)
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
        <Loading label="Loading group" />
      </PageShell>
    )
  }

  const set = <K extends keyof Group>(k: K, v: Group[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d))

  const onSave = async () => {
    const v = validate(draft)
    setErrs(v)
    if (Object.keys(v).length > 0) return
    setSaving(true)
    setSaveErr(null)
    try {
      await apiPost(iamUrl(`groups/${draft.owner}/${draft.name}`), draft)
      await mutate()
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!window.confirm(`Delete "${draft.displayName || draft.name}"?`)) return
    await apiDelete(iamUrl(`groups/${draft.owner}/${draft.name}`))
    nav('/iam/groups')
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
          id="group-name"
          label="Name (slug)"
          value={draft.name}
          onChangeText={(v) => set('name', v)}
          required
          error={errs.name}
        />
        <Field
          id="group-display"
          label="Display name"
          value={draft.displayName}
          onChangeText={(v) => set('displayName', v)}
          required
          error={errs.displayName}
        />
        <Field
          id="group-type"
          label="Type"
          value={draft.type}
          onChangeText={(v) =>
            set('type', v === 'Physical' ? 'Physical' : 'Virtual')
          }
          hint='"Virtual" or "Physical".'
        />
        <ToggleField
          id="group-top"
          label="Is top-level group"
          value={draft.isTopGroup}
          onChange={(v) => set('isTopGroup', v)}
        />
        {!draft.isTopGroup ? (
          <Field
            id="group-parent"
            label="Parent ID"
            value={draft.parentId}
            onChangeText={(v) => set('parentId', v)}
            error={errs.parentId}
            hint="Slug of the parent group within this organization."
          />
        ) : null}
        <ToggleField
          id="group-enabled"
          label="Enabled"
          value={draft.isEnabled}
          onChange={(v) => set('isEnabled', v)}
        />
      </YStack>

      <Alert title="Membership management TODO">
        <Text fontSize="$2" color="$placeholderColor">
          Adding/removing users to this group lives on the user list
          (scoped via `groupName`). The upstream page also exposed an
          inline membership editor — port that as a follow-up if the
          tree view is not enough.
        </Text>
        <Text fontSize="$1" color="$placeholderColor" mt="$2">
          Owner: {draft.owner} | Created: {draft.createdTime}
        </Text>
      </Alert>
    </PageShell>
  )
}
