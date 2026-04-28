// IAM users — list view. Ports `web/src/UserListPage.tsx`. Upstream
// supports two contexts: `/users` (global) and
// `/organizations/:orgName/users` (scoped). We honour both via the
// optional `organizationName` prop. The Ant Design `<Upload>` (.xlsx
// import) and the `XLSX`-based template download are intentionally
// dropped — they were a tool for the legacy admin and don't belong
// in this bucket. If the operator needs bulk import, they can call
// `POST /v1/iam/upload-users` directly.

import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Anchor,
  Avatar,
  Button,
  Dialog,
  Input,
  Label,
  Paragraph,
  Spinner,
  Text,
  TextArea,
  XStack,
  YStack,
} from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { UserRoundCheck } from '@hanzogui/lucide-icons-2/icons/UserRoundCheck'
import {
  Badge,
  DataTable,
  ErrorState,
  Loading,
  type DataTableColumn,
} from '../../primitives'
import { PageShell } from '../../shell'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamListResponse, User } from './types'
import { iamUrl, listQuery } from './api'

export interface UserListProps {
  // When unset, the page lists global users via /users. When set, it
  // lists users scoped to that organization via /organizations/:org/users.
  organizationName?: string
  // Optional group scope (used by the GroupTree page).
  groupName?: string
}

const COLUMNS: DataTableColumn[] = [
  { key: 'org', label: 'Organization', flex: 1 },
  { key: 'name', label: 'Name', flex: 1.1 },
  { key: 'displayName', label: 'Display name', flex: 1.2 },
  { key: 'avatar', label: 'Avatar', flex: 0.5 },
  { key: 'email', label: 'Email', flex: 1.4 },
  { key: 'phone', label: 'Phone', flex: 0.9 },
  { key: 'isAdmin', label: 'Admin', flex: 0.6 },
  { key: 'actions', label: '', flex: 1.4 },
]

// ImpersonateDraft — local dialog state. Decoupled from the
// `target` user so closing the dialog discards both the typed
// confirmation and the reason cleanly. Submit is gated on a
// non-empty reason AND a typed username that exactly matches the
// target's `name` (case-sensitive, no whitespace tolerance).
interface ImpersonateDraft {
  target: User
  typedName: string
  reason: string
  submitting: boolean
  error: string | null
}

export function UserList({ organizationName, groupName }: UserListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20
  const path = organizationName
    ? `organizations/${organizationName}/users`
    : 'users'
  const url = `${iamUrl(path)}${listQuery({
    page,
    pageSize,
    groupName,
  })}`

  const { data, error, isLoading, mutate } =
    useFetch<IamListResponse<User>>(url)

  const [impersonate, setImpersonate] = useState<ImpersonateDraft | null>(null)

  const onCreate = async () => {
    const owner = organizationName ?? 'built-in'
    const suffix = Math.random().toString(36).slice(2, 8)
    await apiPost(iamUrl('users'), {
      owner,
      name: `user_${suffix}`,
      createdTime: new Date().toISOString(),
      type: 'normal-user',
      // Password is supplied by the user on first login; never seed
      // plaintext "123" like the upstream did. Server should require
      // a reset on first login.
      displayName: `New User - ${suffix}`,
      email: `${suffix}@example.com`,
      groups: groupName ? [`${owner}/${groupName}`] : [],
      isVerified: false,
    })
    await mutate()
  }

  const onDelete = async (u: User) => {
    if (!window.confirm(`Delete user "${u.displayName || u.name}"?`)) return
    await apiDelete(iamUrl(`users/${u.owner}/${u.name}`))
    await mutate()
  }

  // Impersonation requires explicit, audit-grade ceremony. The
  // operator must (a) type the target username verbatim and
  // (b) supply a free-text reason that gets persisted to the audit
  // log. window.confirm() was insufficient — a single misclick on
  // a dense table row could elevate. The dialog is the only entry
  // point; there is no prompt-based fallback. Backend may ignore
  // `reason` until the audit field lands; we send it regardless so
  // wiring is one-shot when the server catches up.
  const openImpersonate = (u: User) => {
    setImpersonate({
      target: u,
      typedName: '',
      reason: '',
      submitting: false,
      error: null,
    })
  }

  const submitImpersonate = async () => {
    if (!impersonate) return
    const { target, typedName, reason } = impersonate
    if (typedName !== target.name || reason.trim().length === 0) return
    setImpersonate({ ...impersonate, submitting: true, error: null })
    try {
      await apiPost(iamUrl('impersonate-user'), {
        target: `${target.owner}/${target.name}`,
        reason: reason.trim(),
      })
      setImpersonate(null)
      // Caller's shell handles re-routing on success.
    } catch (e) {
      setImpersonate({
        ...impersonate,
        submitting: false,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  if (error) {
    return (
      <PageShell>
        <ErrorState error={error} />
      </PageShell>
    )
  }

  const rows = data?.data ?? []
  const total = data?.data2 ?? rows.length

  return (
    <PageShell>
      <XStack items="center" justify="space-between">
        <Text fontSize="$8" fontWeight="700" color="$color">
          Users
          {organizationName ? (
            <Text fontSize="$5" color="$placeholderColor" fontWeight="400">
              {' '}
              · {organizationName}
            </Text>
          ) : null}
        </Text>
        <Button
          size="$3"
          onPress={onCreate}
          disabled={isLoading}
          icon={<Plus size={14} />}
        >
          Create user
        </Button>
      </XStack>

      {isLoading && rows.length === 0 ? (
        <Loading label="Loading users" />
      ) : (
        <DataTable<User>
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{
            title: 'No users',
            hint: organizationName
              ? `Create a user in "${organizationName}" to get started.`
              : 'Create a user, or pick an organization to scope this list.',
          }}
          renderRow={(u): ReactNode[] => [
            <Link key="o" to={`/iam/orgs/${u.owner}`}>
              <Text color="$color">{u.owner}</Text>
            </Link>,
            <Link key="n" to={`/iam/users/${u.owner}/${u.name}`}>
              <Text color="$color" fontWeight="500">
                {u.name}
              </Text>
            </Link>,
            <Text key="d" color="$color">
              {u.displayName}
            </Text>,
            u.avatar ? (
              <Avatar key="av" circular size="$2">
                <Avatar.Image src={u.avatar} />
                <Avatar.Fallback bg="$borderColor" />
              </Avatar>
            ) : (
              <Text key="av" color="$placeholderColor">
                —
              </Text>
            ),
            <Anchor key="e" href={`mailto:${u.email}`}>
              <Text color="$placeholderColor">{u.email}</Text>
            </Anchor>,
            <Text key="p" color="$placeholderColor">
              {u.phone ?? '—'}
            </Text>,
            <Badge key="a" variant={u.isAdmin ? 'success' : 'muted'}>
              {u.isAdmin ? 'YES' : 'NO'}
            </Badge>,
            <XStack key="ac" gap="$2" justify="flex-end">
              <Button
                size="$2"
                chromeless
                onPress={() => openImpersonate(u)}
                icon={<UserRoundCheck size={12} />}
              >
                Impersonate
              </Button>
              <Link to={`/iam/users/${u.owner}/${u.name}`}>
                <Button size="$2" chromeless icon={<Pencil size={12} />}>
                  Edit
                </Button>
              </Link>
              <Button
                size="$2"
                chromeless
                onPress={() => onDelete(u)}
                disabled={u.owner === 'built-in' && u.name === 'admin'}
                icon={<Trash2 size={12} />}
              />
            </XStack>,
          ]}
        />
      )}

      <XStack justify="space-between" items="center">
        <Text fontSize="$2" color="$placeholderColor">
          {total} total
        </Text>
        <XStack gap="$2" items="center">
          <Button
            size="$2"
            chromeless
            disabled={page <= 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Text fontSize="$2" color="$color">
            {page}
          </Text>
          <Button
            size="$2"
            chromeless
            disabled={page * pageSize >= total}
            onPress={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
          {isLoading ? <Spinner size="small" /> : null}
        </XStack>
      </XStack>

      <ImpersonateDialog
        draft={impersonate}
        onClose={() => setImpersonate(null)}
        onSubmit={submitImpersonate}
        onChange={(next) =>
          setImpersonate((d) => (d ? { ...d, ...next } : d))
        }
      />
    </PageShell>
  )
}

interface ImpersonateDialogProps {
  draft: ImpersonateDraft | null
  onClose: () => void
  onSubmit: () => void | Promise<void>
  onChange: (next: Partial<ImpersonateDraft>) => void
}

// ImpersonateDialog — adversarial review pinned that
// `window.confirm()` is too weak a gate for an authority that
// elevates one principal to act as another. The two-factor UX
// (typed username + free-text reason) trades two seconds of
// operator friction for an audit trail and an interlock against
// dense-table misclicks. The submit button is disabled until both
// factors are present; there is no keyboard shortcut to bypass.
export function ImpersonateDialog({
  draft,
  onClose,
  onSubmit,
  onChange,
}: ImpersonateDialogProps) {
  const open = draft !== null
  const target = draft?.target ?? null
  const typedName = draft?.typedName ?? ''
  const reason = draft?.reason ?? ''
  const submitting = draft?.submitting ?? false
  const err = draft?.error ?? null
  const canSubmit =
    target !== null &&
    typedName === target.name &&
    reason.trim().length > 0 &&
    !submitting

  return (
    <Dialog
      modal
      open={open}
      onOpenChange={(next: boolean) => {
        if (!next) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay key="overlay" opacity={0.6} />
        <Dialog.Content
          bordered
          elevate
          key="content"
          gap="$3"
          width={520}
        >
          <Dialog.Title>
            Impersonate {target?.displayName || target?.name || ''}
          </Dialog.Title>
          <Dialog.Description>
            You will act as {target?.owner}/{target?.name} until you sign out.
            This is logged to the audit ledger.
          </Dialog.Description>
          <YStack gap="$2">
            <Label htmlFor="impersonate-confirm">
              Type the username{' '}
              <Text color="$color" fontWeight="700">
                {target?.name ?? ''}
              </Text>{' '}
              to confirm
            </Label>
            <Input
              id="impersonate-confirm"
              value={typedName}
              onChangeText={(v: string) => onChange({ typedName: v })}
              placeholder={target?.name}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </YStack>
          <YStack gap="$2">
            <Label htmlFor="impersonate-reason">
              Reason for impersonation (logged to audit)
            </Label>
            <TextArea
              id="impersonate-reason"
              value={reason}
              onChangeText={(v: string) => onChange({ reason: v })}
              placeholder="e.g. user-reported login issue, ticket #1234"
              minH={80}
            />
          </YStack>
          {err ? (
            <Paragraph color="#fca5a5" fontSize="$2">
              {err}
            </Paragraph>
          ) : null}
          <XStack gap="$2" justify="flex-end">
            <Button size="$3" variant="outlined" onPress={onClose}>
              Cancel
            </Button>
            <Button size="$3" disabled={!canSubmit} onPress={() => onSubmit()}>
              {submitting ? 'Submitting…' : 'Impersonate'}
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
