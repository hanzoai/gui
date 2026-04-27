// IAM groups — list view. Ports `web/src/GroupListPage.tsx`. Drops
// the .xlsx upload/template buttons (operator can call the bulk
// endpoint directly). Adds a link to the GroupTree page since groups
// are inherently hierarchical.

import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button, Spinner, Text, XStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { FolderTree } from '@hanzogui/lucide-icons-2/icons/FolderTree'
import {
  Badge,
  DataTable,
  ErrorState,
  Loading,
  PageShell,
  type DataTableColumn,
} from '../..'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { Group, IamListResponse } from './types'
import { iamUrl, listQuery } from './api'

export interface GroupListProps {
  organizationName?: string
}

const COLUMNS: DataTableColumn[] = [
  { key: 'org', label: 'Organization', flex: 1 },
  { key: 'name', label: 'Name', flex: 1.1 },
  { key: 'displayName', label: 'Display name', flex: 1.4 },
  { key: 'type', label: 'Type', flex: 0.7 },
  { key: 'parent', label: 'Parent', flex: 1 },
  { key: 'enabled', label: 'Enabled', flex: 0.7 },
  { key: 'actions', label: '', flex: 1.4 },
]

export function GroupList({ organizationName }: GroupListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20
  const url = `${iamUrl('groups')}${listQuery({
    owner: organizationName ?? '',
    page,
    pageSize,
  })}`

  const { data, error, isLoading, mutate } =
    useFetch<IamListResponse<Group>>(url)

  const onCreate = async () => {
    const owner = organizationName ?? 'built-in'
    const suffix = Math.random().toString(36).slice(2, 8)
    await apiPost(iamUrl('groups'), {
      owner,
      name: `group_${suffix}`,
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString(),
      displayName: `New Group - ${suffix}`,
      type: 'Virtual',
      parentId: owner,
      isTopGroup: true,
      isEnabled: true,
    })
    await mutate()
  }

  const onDelete = async (g: Group) => {
    if (!window.confirm(`Delete group "${g.displayName || g.name}"?`)) return
    await apiDelete(iamUrl(`groups/${g.owner}/${g.name}`))
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
          Groups
          {organizationName ? (
            <Text fontSize="$5" color="$placeholderColor" fontWeight="400">
              {' '}
              · {organizationName}
            </Text>
          ) : null}
        </Text>
        <XStack gap="$2">
          {organizationName ? (
            <Link to={`/iam/orgs/${organizationName}/groups/tree`}>
              <Button size="$3" chromeless icon={<FolderTree size={14} />}>
                Tree view
              </Button>
            </Link>
          ) : null}
          <Button
            size="$3"
            onPress={onCreate}
            disabled={isLoading}
            icon={<Plus size={14} />}
          >
            Create group
          </Button>
        </XStack>
      </XStack>

      {isLoading && rows.length === 0 ? (
        <Loading label="Loading groups" />
      ) : (
        <DataTable<Group>
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{
            title: 'No groups',
            hint: 'Create a group to organize users into virtual collections.',
          }}
          renderRow={(g): ReactNode[] => [
            <Text key="o" color="$color">
              {g.owner}
            </Text>,
            <Link key="n" to={`/iam/groups/${g.owner}/${g.name}`}>
              <Text color="$color" fontWeight="500">
                {g.name}
              </Text>
            </Link>,
            <Text key="d" color="$color">
              {g.displayName}
            </Text>,
            <Badge key="t" variant={g.type === 'Physical' ? 'success' : 'muted'}>
              {g.type}
            </Badge>,
            <Text key="p" color="$placeholderColor">
              {g.isTopGroup ? '— (root)' : g.parentId}
            </Text>,
            <Badge key="en" variant={g.isEnabled ? 'success' : 'muted'}>
              {g.isEnabled ? 'ON' : 'OFF'}
            </Badge>,
            <XStack key="a" gap="$2" justify="flex-end">
              <Link to={`/iam/groups/${g.owner}/${g.name}`}>
                <Button size="$2" chromeless icon={<Pencil size={12} />}>
                  Edit
                </Button>
              </Link>
              <Button
                size="$2"
                chromeless
                onPress={() => onDelete(g)}
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
