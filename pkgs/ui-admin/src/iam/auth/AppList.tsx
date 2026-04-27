// IAM Applications list — port of upstream `web/src/ApplicationListPage.tsx`.
// Casdoor's UI surfaced an Add/Edit/Copy/Delete row-action triplet against
// an Ant Design `<Table>`; we render the same data through the
// @hanzogui/admin `<DataTable>` primitive. No Ant Design.
//
// Pagination is server-side via Casdoor's `p`/`pageSize` query params.
// We render 1-indexed page numbers to match upstream semantics.
//
// TODO(i18n): the upstream uses i18next; literals here are English-only
// until the admin shell ships an i18n hook.

import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Copy as CopyIcon } from '@hanzogui/lucide-icons-2/icons/Copy'
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
import type { IamApplication, IamListResponse } from './types'
import { authUrl, listQuery } from './api'

// Built-in app — upstream guards against deleting `app-hanzo`.
const PROTECTED_APP = 'app-hanzo'

const COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'Application', flex: 2 },
  { key: 'org', label: 'Organization', flex: 1.2 },
  { key: 'category', label: 'Category', flex: 1 },
  { key: 'clientId', label: 'Client ID', flex: 2 },
  { key: 'created', label: 'Created', flex: 1.2 },
  { key: 'actions', label: '', flex: 1.6 },
]

export interface AppListProps {
  // When set, scope the list to a single org via `?owner=`. Mirrors
  // upstream's "default org selected" branch.
  organizationName?: string
}

export function AppList({ organizationName }: AppListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20

  const url = `${authUrl('applications')}${listQuery({
    page,
    pageSize,
    owner: organizationName,
  })}`

  const { data, error, isLoading, mutate } =
    useFetch<IamListResponse<IamApplication>>(url)

  const rows = data?.data ?? []
  const total = data?.data2 ?? rows.length

  const onCreate = async () => {
    const suffix = Math.random().toString(36).slice(2, 8)
    const owner = organizationName ?? 'admin'
    const name = `${owner.toLowerCase()}-${suffix}`
    await apiPost(authUrl(`applications/${owner}/${name}`), {
      owner,
      name,
      organization: owner,
      createdTime: new Date().toISOString(),
      displayName: `New Application - ${suffix}`,
      category: 'Default',
      type: 'All',
      enablePassword: true,
      enableSignUp: true,
    })
    await mutate()
  }

  const onCopy = async (record: IamApplication) => {
    const orgPrefix = (record.organization || '').toLowerCase()
    const suffix = Math.random().toString(36).slice(2, 8)
    const name = `${orgPrefix}-copy-${suffix}`
    await apiPost(authUrl(`applications/${record.owner}/${name}`), {
      ...record,
      name,
      createdTime: new Date().toISOString(),
      displayName: `Copy Application - ${name}`,
      clientId: '',
      clientSecret: '',
    })
    await mutate()
  }

  const onDelete = async (record: IamApplication) => {
    if (record.name === PROTECTED_APP) return
    if (!window.confirm(`Delete application "${record.name}"?`)) return
    await apiDelete(authUrl(`applications/${record.owner}/${record.name}`))
    await mutate()
  }

  if (error) {
    return (
      <PageShell>
        <ErrorState error={error} />
      </PageShell>
    )
  }

  return (
    <PageShell>
      <XStack items="center" justify="space-between">
        <Text fontSize="$8" fontWeight="700" color="$color">
          Applications
        </Text>
        <Button
          size="$3"
          onPress={onCreate}
          disabled={isLoading}
          icon={<Plus size={14} />}
        >
          Add
        </Button>
      </XStack>

      {isLoading && rows.length === 0 ? (
        <Loading label="Loading applications" />
      ) : (
        <DataTable<IamApplication>
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{
            title: 'No applications',
            hint: 'Register an OAuth client to get started.',
          }}
          renderRow={(record): ReactNode[] => [
            <Link
              key="name"
              to={`/iam/auth/applications/${record.organization}/${record.name}`}
            >
              <Text color="$color" fontWeight="600">
                {record.displayName || record.name}
              </Text>
            </Link>,
            <Text key="org" color="$placeholderColor">
              {record.organization || record.owner}
            </Text>,
            <Badge
              key="cat"
              variant={record.category === 'Agent' ? 'success' : 'muted'}
            >
              {record.category || 'Default'}
            </Badge>,
            <Text
              key="clientId"
              fontSize="$1"
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              color="$placeholderColor"
              numberOfLines={1}
            >
              {record.clientId || '—'}
            </Text>,
            <Text key="created" color="$placeholderColor" fontSize="$2">
              {record.createdTime
                ? new Date(record.createdTime).toLocaleString()
                : '—'}
            </Text>,
            <XStack key="actions" gap="$2" justify="flex-end">
              <Link
                to={`/iam/auth/applications/${record.organization}/${record.name}`}
              >
                <Button size="$2" chromeless icon={<Pencil size={12} />}>
                  Edit
                </Button>
              </Link>
              <Button
                size="$2"
                chromeless
                onPress={() => onCopy(record)}
                icon={<CopyIcon size={12} />}
              >
                Copy
              </Button>
              <Button
                size="$2"
                chromeless
                onPress={() => onDelete(record)}
                disabled={record.name === PROTECTED_APP}
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
        <YStack>
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
          </XStack>
        </YStack>
      </XStack>
    </PageShell>
  )
}
