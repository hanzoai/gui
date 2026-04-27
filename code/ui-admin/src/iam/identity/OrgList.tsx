// IAM organizations — list view. Ports `web/src/OrganizationListPage.tsx`
// (Ant Design `<Table>` + `BaseListPage` class) to a @hanzo/gui v7
// composition: `<PageShell>` wraps a header row + `<DataTable>`.
//
// The upstream page also handled add/delete from the list; that lives
// here too via small inline handlers. The "Create" button POSTs a
// minimum viable Organization shape — the heavy nested defaults
// (accountItems, theme, etc.) belong to the edit page; the server can
// fill them in if needed.
//
// We use `useFetch` from `@hanzogui/admin/data` for revalidation. The
// upstream class component used `componentWillMount` + manual
// `setState({loading})`; the hook handles both for us.

import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Anchor, Button, Spinner, Text, XStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Users } from '@hanzogui/lucide-icons-2/icons/Users'
import { FolderTree } from '@hanzogui/lucide-icons-2/icons/FolderTree'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  Badge,
  DataTable,
  ErrorState,
  Loading,
  PageShell,
  type DataTableColumn,
} from '../..'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamListResponse, Organization } from './types'
import { iamUrl, listQuery } from './api'

export interface OrgListProps {
  // Upstream passed `account` for admin gating; we keep it optional
  // and default to "allow create" — gating is the parent shell's job.
  canCreate?: boolean
}

const COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'Name', flex: 1.2 },
  { key: 'displayName', label: 'Display name', flex: 1.5 },
  { key: 'website', label: 'Website', flex: 1.4 },
  { key: 'passwordType', label: 'Password type', flex: 0.9 },
  { key: 'softDeletion', label: 'Soft deletion', flex: 0.7 },
  { key: 'actions', label: '', flex: 1.6 },
]

export function OrgList({ canCreate = true }: OrgListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20
  const url = `${iamUrl('organizations')}${listQuery({
    owner: 'admin',
    page,
    pageSize,
  })}`

  const { data, error, isLoading, mutate } =
    useFetch<IamListResponse<Organization>>(url)

  const onCreate = async () => {
    const ts = new Date().toISOString()
    const suffix = Math.random().toString(36).slice(2, 8)
    await apiPost(iamUrl('organizations'), {
      owner: 'admin',
      name: `organization_${suffix}`,
      createdTime: ts,
      displayName: `New Organization - ${suffix}`,
      websiteUrl: 'https://example.com',
      passwordType: 'argon2id',
    })
    await mutate()
  }

  const onDelete = async (org: Organization) => {
    if (!window.confirm(`Delete organization "${org.displayName || org.name}"?`)) {
      return
    }
    await apiDelete(`${iamUrl(`organizations/${org.name}`)}`)
    await mutate()
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
          Organizations
        </Text>
        <Button
          size="$3"
          onPress={onCreate}
          disabled={!canCreate || isLoading}
          icon={<Plus size={14} />}
        >
          Create organization
        </Button>
      </XStack>

      {isLoading && rows.length === 0 ? (
        <Loading label="Loading organizations" />
      ) : (
        <DataTable<Organization>
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => r.name}
          emptyState={{
            title: 'No organizations',
            hint: 'Create your first organization to start onboarding users.',
          }}
          renderRow={(o): ReactNode[] => [
            <Link key="n" to={`/iam/orgs/${o.name}`}>
              <Text color="$color" fontWeight="500">
                {o.name}
              </Text>
            </Link>,
            <Text key="d" color="$color">
              {o.displayName}
            </Text>,
            o.websiteUrl ? (
              <Anchor key="w" href={o.websiteUrl} target="_blank" rel="noreferrer">
                <Text color="$placeholderColor">{o.websiteUrl}</Text>
              </Anchor>
            ) : (
              <Text key="w" color="$placeholderColor">
                —
              </Text>
            ),
            <Text key="p" color="$color">
              {o.passwordType}
            </Text>,
            <Badge key="s" variant={o.enableSoftDeletion ? 'success' : 'muted'}>
              {o.enableSoftDeletion ? 'ON' : 'OFF'}
            </Badge>,
            <XStack key="a" gap="$2" justify="flex-end">
              <Link to={`/iam/orgs/${o.name}/groups`}>
                <Button size="$2" chromeless icon={<FolderTree size={12} />}>
                  Groups
                </Button>
              </Link>
              <Link to={`/iam/orgs/${o.name}/users`}>
                <Button size="$2" chromeless icon={<Users size={12} />}>
                  Users
                </Button>
              </Link>
              <Link to={`/iam/orgs/${o.name}`}>
                <Button size="$2" chromeless icon={<Pencil size={12} />}>
                  Edit
                </Button>
              </Link>
              <Button
                size="$2"
                chromeless
                onPress={() => onDelete(o)}
                disabled={o.name === 'built-in'}
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
