// Orgs page — list every org the caller has access to. The agentd
// HTTP shim returns one row per org from the gateway-supplied
// X-Org-Id; in solo mode the list collapses to a single 'default'
// org so the chrome stays consistent.

import { Link } from 'react-router-dom'
import { DataTable, EmptyState, ErrorBanner, useFetch } from '@hanzogui/admin'
import type { Org } from '../lib/api'

export function OrgsPage() {
  const { data, error, isLoading } = useFetch<{ orgs: Org[] }>('/v1/agents/orgs')

  if (error) return <ErrorBanner error={error} />
  if (isLoading) return null
  const rows = data?.orgs ?? []
  if (rows.length === 0) {
    return (
      <EmptyState
        title="No organizations"
        description="agentd is running solo. Wire hanzoai/gateway in front to enable multitenant orgs."
      />
    )
  }

  return (
    <DataTable
      title="Organizations"
      rows={rows}
      columns={[
        {
          header: 'Name',
          render: (o) => (
            <Link to={`/orgs/${encodeURIComponent(o.slug)}/members`}>{o.name}</Link>
          ),
        },
        { header: 'Slug', render: (o) => o.slug },
        { header: 'Members', render: (o) => o.memberCount },
        { header: 'Created', render: (o) => o.createdAt },
      ]}
    />
  )
}
