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
import { Anchor, Avatar, Button, Spinner, Text, XStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { UserRoundCheck } from '@hanzogui/lucide-icons-2/icons/UserRoundCheck'
import {
  Badge,
  DataTable,
  ErrorState,
  Loading,
  PageShell,
  type DataTableColumn,
} from '../../primitives'
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

  const onImpersonate = async (u: User) => {
    if (!window.confirm(`Impersonate "${u.displayName || u.name}"?`)) return
    await apiPost(iamUrl(`impersonate-user`), `${u.owner}/${u.name}`)
    // Caller's shell handles re-routing on success.
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
                <Avatar.Fallback bg={'$borderColor' as never} />
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
                onPress={() => onImpersonate(u)}
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
    </PageShell>
  )
}
