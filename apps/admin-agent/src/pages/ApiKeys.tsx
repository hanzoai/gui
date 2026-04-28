// API keys for one org. Keys follow the canonical Hanzo prefix
// shape `hk-<uuid>` (per ~/work/hanzo/CLAUDE.md). The full secret
// is never returned by /v1/agents/orgs/.../api-keys — only the
// prefix and metadata. New-key flow returns the secret once at
// creation time, rendered in a toast.

import { useParams } from 'react-router-dom'
import { DataTable, EmptyState, ErrorBanner, useFetch } from '@hanzogui/admin'
import type { ApiKey } from '../lib/api'

export function ApiKeysPage() {
  const { org } = useParams()
  const { data, error, isLoading } = useFetch<{ keys: ApiKey[] }>(
    org ? `/v1/agents/orgs/${encodeURIComponent(org)}/api-keys` : null,
  )

  if (!org) return <EmptyState title="Pick an organization" />
  if (error) return <ErrorBanner error={error} />
  if (isLoading) return null
  const rows = data?.keys ?? []

  return (
    <DataTable
      title={`API keys for ${org}`}
      rows={rows}
      columns={[
        { header: 'Name', render: (k) => k.name },
        { header: 'Prefix', render: (k) => k.prefix },
        { header: 'Scopes', render: (k) => k.scopes.join(', ') },
        { header: 'Last used', render: (k) => k.lastUsedAt ?? '—' },
        { header: 'Created', render: (k) => k.createdAt },
      ]}
    />
  )
}
