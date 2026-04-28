// API keys for one org. Keys follow the canonical Hanzo prefix
// shape `hk-<uuid>` (per ~/work/hanzo/CLAUDE.md). The full secret
// is never returned by /v1/agents/orgs/.../api-keys — only the
// prefix and metadata. New-key flow returns the secret once at
// creation time, rendered in a toast.

import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Text } from 'hanzogui'
import {
  DataTable,
  Empty,
  ErrorState,
  useFetch,
  type DataTableColumn,
} from '@hanzogui/admin'
import type { ApiKey } from '../lib/api'

const COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'Name', flex: 1.2 },
  { key: 'prefix', label: 'Prefix', flex: 0.8 },
  { key: 'scopes', label: 'Scopes', flex: 1.6 },
  { key: 'lastUsed', label: 'Last used', flex: 1 },
  { key: 'created', label: 'Created', flex: 1 },
]

export function ApiKeysPage() {
  const { org } = useParams()
  const { data, error, isLoading } = useFetch<{ keys: ApiKey[] }>(
    org ? `/v1/agents/orgs/${encodeURIComponent(org)}/api-keys` : null,
  )

  if (!org) return <Empty title="Pick an organization" />
  if (error) return <ErrorState error={error} />
  if (isLoading) return null
  const rows = data?.keys ?? []

  const renderRow = (k: ApiKey): ReactNode[] => [
    <Text key="name">{k.name}</Text>,
    <Text key="prefix">{k.prefix}</Text>,
    <Text key="scopes">{k.scopes.join(', ')}</Text>,
    <Text key="lastUsed">{k.lastUsedAt ?? '—'}</Text>,
    <Text key="created">{k.createdAt}</Text>,
  ]

  return (
    <DataTable
      columns={COLUMNS}
      rows={rows}
      renderRow={renderRow}
      rowKey={(k) => k.prefix}
    emptyState={{ title: 'No API keys', hint: 'Create a key to authenticate from clients.' }}
    />
  )
}
