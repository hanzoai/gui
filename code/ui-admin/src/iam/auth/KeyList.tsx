// IAM Keys list — port of upstream `web/src/KeyListPage.tsx`. Lists
// API access keys scoped to org/app/user/general types. Each row
// shows the public access key (copyable) but never the secret —
// secrets only appear on the edit page behind an explicit reveal.
//
// TODO(i18n): English literals only.

import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button, Text, XStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  Badge,
  CopyField,
  DataTable,
  ErrorState,
  Loading,
  PageShell,
  type DataTableColumn,
} from '../..'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamKey, IamListResponse } from './types'
import { authUrl, listQuery } from './api'

const COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'Name', flex: 1.2 },
  { key: 'owner', label: 'Organization', flex: 1 },
  { key: 'displayName', label: 'Display name', flex: 1.2 },
  { key: 'type', label: 'Type', flex: 0.8 },
  { key: 'accessKey', label: 'Access key', flex: 2 },
  { key: 'expires', label: 'Expires', flex: 1 },
  { key: 'state', label: 'State', flex: 0.8 },
  { key: 'actions', label: '', flex: 0.8 },
]

export interface KeyListProps {
  organizationName?: string
}

export function KeyList({ organizationName }: KeyListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20

  const url = `${authUrl('keys')}${listQuery({
    page,
    pageSize,
    owner: organizationName,
  })}`

  const { data, error, isLoading, mutate } =
    useFetch<IamListResponse<IamKey>>(url)

  const rows = data?.data ?? []
  const total = data?.data2 ?? rows.length

  const onCreate = async () => {
    const suffix = Math.random().toString(36).slice(2, 8)
    const owner = organizationName ?? 'admin'
    const name = `key_${suffix}`
    await apiPost(authUrl(`keys/${owner}/${name}`), {
      owner,
      name,
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString(),
      displayName: `New Key - ${suffix}`,
      type: 'Organization',
      organization: owner,
      accessKey: '',
      // Server generates the secret on create; never seed plaintext.
      state: 'Active',
    })
    await mutate()
  }

  const onDelete = async (record: IamKey) => {
    if (!window.confirm(`Delete key "${record.name}"?`)) return
    await apiDelete(authUrl(`keys/${record.owner}/${record.name}`))
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
          Keys
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
        <Loading label="Loading keys" />
      ) : (
        <DataTable<IamKey>
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{
            title: 'No keys',
            hint: 'Mint an access key to authenticate machine-to-machine traffic.',
          }}
          renderRow={(record): ReactNode[] => [
            <Link key="name" to={`/iam/auth/keys/${record.owner}/${record.name}`}>
              <Text color="$color" fontWeight="500">
                {record.name}
              </Text>
            </Link>,
            <Link key="owner" to={`/iam/orgs/${record.owner}`}>
              <Text color="$placeholderColor">{record.owner}</Text>
            </Link>,
            <Text key="display" color="$color">
              {record.displayName}
            </Text>,
            <Badge key="type" variant="info">
              {record.type}
            </Badge>,
            record.accessKey ? (
              <CopyField key="ak" value={record.accessKey} />
            ) : (
              <Text key="ak" color="$placeholderColor">
                —
              </Text>
            ),
            <Text key="exp" color="$placeholderColor" fontSize="$2">
              {record.expireTime
                ? new Date(record.expireTime).toLocaleString()
                : '—'}
            </Text>,
            <Badge
              key="state"
              variant={record.state === 'Active' ? 'success' : 'muted'}
            >
              {record.state}
            </Badge>,
            <XStack key="actions" gap="$2" justify="flex-end">
              <Link to={`/iam/auth/keys/${record.owner}/${record.name}`}>
                <Button size="$2" chromeless icon={<Pencil size={12} />} />
              </Link>
              <Button
                size="$2"
                chromeless
                onPress={() => onDelete(record)}
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
        </XStack>
      </XStack>
    </PageShell>
  )
}
