// PermissionEdit — port of upstream PermissionEditPage.
//
// Permissions edit pulls four upstream concerns into one form:
//   1. Owner/identity (org, name, displayName, description)
//   2. Subjects (users + roles + domains — at least one of users
//      or roles must be non-empty)
//   3. Object (resourceType + resources, where resourceType pivots
//      the actions option list and clears resources on change)
//   4. Effect + workflow (Allow/Deny + Approved/Pending state)
//
// We keep the "submitter / approver" workflow because it backs
// non-admin permission proposals — without it, ATS/BD/TA admins
// can't gate which scopes a desk-level admin can grant. Submitter
// is set on create from the current account; approver/approveTime
// flip when the state moves to Approved.

import { useEffect, useMemo, useState } from 'react'
import { Button, H3, Input, Spinner, Switch, Text, TextArea, XStack, YStack } from 'hanzogui'
import { ErrorState } from '../../primitives/Empty'
import { useFetch, apiPost } from '../../data/useFetch'
import type {
  IamItemResponse,
  Permission,
  PermissionEffect,
  PermissionState,
  ResourceType,
} from './types'

export interface PermissionEditProps {
  owner: string
  name: string
  // Current account name — used for submitter on add and approver
  // on Approve transitions.
  currentUser: string
  // True iff the current account is a local admin. Controls which
  // fields are editable (owner, state).
  isAdmin: boolean
  // Save & Exit / Cancel navigation back to the list.
  onClose: (saved: boolean) => void
  // Optional fetcher seam for tests.
  fetcher?: (url: string) => Promise<unknown>
}

const RESOURCE_TYPES: ResourceType[] = ['Application', 'TreeNode', 'Custom', 'API']

function actionsForType(t: ResourceType): string[] {
  return t === 'API' ? ['POST', 'GET'] : ['Read', 'Write', 'Admin']
}

export function PermissionEdit({
  owner,
  name,
  currentUser,
  isAdmin,
  onClose,
  fetcher,
}: PermissionEditProps) {
  const url = `/v1/iam/permissions/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
  const { data, error, isLoading } = useFetch<IamItemResponse<Permission>>(url, { fetcher })
  const [draft, setDraft] = useState<Permission | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (data?.data) setDraft(data.data)
  }, [data])

  const actionOptions = useMemo(
    () => (draft ? actionsForType(draft.resourceType) : []),
    [draft],
  )

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !draft)
    return (
      <XStack p="$5" items="center" justify="center">
        <Spinner size="small" />
      </XStack>
    )

  function update<K extends keyof Permission>(key: K, value: Permission[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  function setLines(key: 'users' | 'roles' | 'domains' | 'resources', text: string) {
    update(key, text.split('\n').map((s) => s.trim()).filter(Boolean))
  }

  async function save(exit: boolean) {
    if (!draft) return
    if (draft.users.length === 0 && (draft.roles?.length ?? 0) === 0) {
      setSaveError('Users and roles cannot both be empty.')
      return
    }
    if (draft.resources.length === 0) {
      setSaveError('Resources cannot be empty.')
      return
    }
    if (draft.actions.length === 0) {
      setSaveError('Actions cannot be empty.')
      return
    }
    if (!isAdmin && draft.submitter !== currentUser) {
      setSaveError('Only the original submitter can modify a non-admin permission.')
      return
    }
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

  const isApproveTransition = (next: PermissionState) =>
    draft.state !== next ? next : null

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <H3 size="$6" color="$color">
          {draft.name === name ? 'Edit Permission' : 'New Permission'}
        </H3>
        <XStack gap="$2">
          <Button onPress={() => save(false)} disabled={saving}>
            Save
          </Button>
          <Button onPress={() => save(true)} disabled={saving} theme={'blue' as never}>
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
        <Input
          value={draft.owner}
          editable={isAdmin}
          onChangeText={(v: string) => update('owner', v)}
        />
      </Field>
      <Field label="Name">
        <Input value={draft.name} onChangeText={(v: string) => update('name', v)} />
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
        <Input
          value={draft.model ?? ''}
          onChangeText={(v: string) => update('model', v)}
          placeholder="org/model"
        />
      </Field>

      <Field label="Sub users" align="top">
        <TextArea
          value={(draft.users ?? []).join('\n')}
          onChangeText={(v: string) => setLines('users', v)}
          placeholder="org/username or *"
          height={88}
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
        />
      </Field>
      <Field label="Sub roles" align="top">
        <TextArea
          value={(draft.roles ?? []).join('\n')}
          onChangeText={(v: string) => setLines('roles', v)}
          placeholder="org/role or *"
          height={88}
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
        />
      </Field>
      <Field label="Sub domains" align="top">
        <TextArea
          value={(draft.domains ?? []).join('\n')}
          onChangeText={(v: string) => setLines('domains', v)}
          placeholder="domain or *"
          height={64}
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
        />
      </Field>

      <Field label="Resource type">
        <XStack gap="$2" flexWrap={'wrap' as never}>
          {RESOURCE_TYPES.map((rt) => (
            <Button
              key={rt}
              size="$2"
              theme={(draft.resourceType === rt ? 'blue' : undefined) as never}
              onPress={() => {
                update('resourceType', rt)
                update('resources', [])
                update('actions', [])
              }}
            >
              {rt}
            </Button>
          ))}
        </XStack>
      </Field>

      <Field label="Resources" align="top">
        <TextArea
          value={(draft.resources ?? []).join('\n')}
          onChangeText={(v: string) => setLines('resources', v)}
          placeholder="resource or *"
          height={64}
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
        />
      </Field>

      <Field label="Actions">
        <XStack gap="$3" flexWrap={'wrap' as never}>
          {actionOptions.map((opt) => {
            const checked = draft.actions.includes(opt)
            return (
              <XStack key={opt} items="center" gap="$2">
                <Switch
                  size="$2"
                  checked={checked}
                  onCheckedChange={(v: boolean) => {
                    const next = new Set(draft.actions)
                    if (v) next.add(opt)
                    else next.delete(opt)
                    update('actions', Array.from(next))
                  }}
                >
                  <Switch.Thumb animation="quick" />
                </Switch>
                <Text fontSize="$2" color="$color">
                  {opt}
                </Text>
              </XStack>
            )
          })}
        </XStack>
      </Field>

      <Field label="Effect">
        <XStack gap="$2">
          {(['Allow', 'Deny'] as PermissionEffect[]).map((e) => (
            <Button
              key={e}
              size="$2"
              theme={(draft.effect === e ? (e === 'Allow' ? 'green' : 'red') : undefined) as never}
              onPress={() => update('effect', e)}
            >
              {e}
            </Button>
          ))}
        </XStack>
      </Field>

      <Field label="Enabled">
        <Switch
          checked={draft.isEnabled}
          onCheckedChange={(v: boolean) => update('isEnabled', v)}
        >
          <Switch.Thumb animation="quick" />
        </Switch>
      </Field>

      <Field label="Submitter">
        <Input value={draft.submitter} editable={false} />
      </Field>
      <Field label="Approver">
        <Input value={draft.approver} editable={false} />
      </Field>
      <Field label="Approve time">
        <Input value={draft.approveTime} editable={false} />
      </Field>
      <Field label="State">
        <XStack gap="$2">
          {(['Approved', 'Pending'] as PermissionState[]).map((s) => (
            <Button
              key={s}
              size="$2"
              disabled={!isAdmin}
              theme={(draft.state === s ? (s === 'Approved' ? 'green' : 'orange') : undefined) as never}
              onPress={() => {
                const transition = isApproveTransition(s)
                if (transition === 'Approved') {
                  update('approver', currentUser)
                  update('approveTime', new Date().toISOString())
                } else if (transition === 'Pending') {
                  update('approver', '')
                  update('approveTime', '')
                }
                update('state', s)
              }}
            >
              {s}
            </Button>
          ))}
        </XStack>
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
