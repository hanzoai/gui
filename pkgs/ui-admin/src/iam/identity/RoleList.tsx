// IAM roles — list view. Ports `web/src/RoleListPage.tsx`. The
// upstream page is already a function component (not BaseListPage),
// so the port is a near-1:1 swap of Ant Design `<Table>` for
// `<DataTable>` and the lucide-react buttons for hanzogui Buttons.

import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button, Spinner, Text, XStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  Badge,
  DataTable,
  ErrorState,
  Loading,
  type DataTableColumn,
} from '../../primitives'
import { PageShell } from '../../shell'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamListResponse, Role } from './types'
import { iamUrl, listQuery } from './api'

export interface RoleListProps {
  organizationName?: string
}

const COLUMNS: DataTableColumn[] = [
  { key: 'org', label: 'Organization', flex: 1 },
  { key: 'name', label: 'Name', flex: 1.1 },
  { key: 'displayName', label: 'Display name', flex: 1.4 },
  { key: 'users', label: 'Users', flex: 0.6 },
  { key: 'groups', label: 'Groups', flex: 0.6 },
  { key: 'enabled', label: 'Enabled', flex: 0.7 },
  { key: 'actions', label: '', flex: 1.2 },
]

export function RoleList({ organizationName }: RoleListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20
  const url = `${iamUrl('roles')}${listQuery({
    owner: organizationName ?? '',
    page,
    pageSize,
  })}`

  const { data, error, isLoading, mutate } =
    useFetch<IamListResponse<Role>>(url)

  const onCreate = async () => {
    const owner = organizationName ?? 'built-in'
    const suffix = Math.random().toString(36).slice(2, 8)
    await apiPost(iamUrl('roles'), {
      owner,
      name: `role_${suffix}`,
      createdTime: new Date().toISOString(),
      displayName: `New Role - ${suffix}`,
      users: [],
      groups: [],
      roles: [],
      domains: [],
      isEnabled: true,
    })
    await mutate()
  }

  const onDelete = async (r: Role) => {
    if (!window.confirm(`Delete role "${r.displayName || r.name}"?`)) return
    await apiDelete(iamUrl(`roles/${r.owner}/${r.name}`))
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
          Roles
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
          Create role
        </Button>
      </XStack>

      {isLoading && rows.length === 0 ? (
        <Loading label="Loading roles" />
      ) : (
        <DataTable<Role>
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{
            title: 'No roles',
            hint: 'Create a role to grant a named bundle of permissions.',
          }}
          renderRow={(r): ReactNode[] => [
            <Text key="o" color="$color">
              {r.owner}
            </Text>,
            <Link key="n" to={`/iam/roles/${r.owner}/${r.name}`}>
              <Text color="$color" fontWeight="500">
                {r.name}
              </Text>
            </Link>,
            <Text key="d" color="$color">
              {r.displayName}
            </Text>,
            <Text key="u" color="$placeholderColor">
              {r.users?.length ?? 0}
            </Text>,
            <Text key="g" color="$placeholderColor">
              {r.groups?.length ?? 0}
            </Text>,
            <Badge key="en" variant={r.isEnabled ? 'success' : 'muted'}>
              {r.isEnabled ? 'ON' : 'OFF'}
            </Badge>,
            <XStack key="a" gap="$2" justify="flex-end">
              <Link to={`/iam/roles/${r.owner}/${r.name}`}>
                <Button size="$2" chromeless icon={<Pencil size={12} />}>
                  Edit
                </Button>
              </Link>
              <Button
                size="$2"
                chromeless
                onPress={() => onDelete(r)}
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
