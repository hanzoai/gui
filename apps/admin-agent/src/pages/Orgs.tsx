// Orgs page — list every org the caller has access to. The agentd
// HTTP shim returns one row per org from the gateway-supplied
// X-Org-Id; in solo mode the list collapses to a single 'default'
// org so the chrome stays consistent.

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Text } from 'hanzogui'
import {
  DataTable,
  Empty,
  ErrorState,
  useFetch,
  type DataTableColumn,
} from '@hanzogui/admin'
import type { Org } from '../lib/api'

const COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'Name', flex: 1.4 },
  { key: 'slug', label: 'Slug', flex: 1 },
  { key: 'members', label: 'Members', flex: 0.6 },
  { key: 'created', label: 'Created', flex: 1 },
]

export function OrgsPage() {
  const { data, error, isLoading } = useFetch<{ orgs: Org[] }>('/v1/agents/orgs')

  if (error) return <ErrorState error={error} />
  if (isLoading) return null
  const rows = data?.orgs ?? []
  if (rows.length === 0) {
    return (
      <Empty
        title="No organizations"
        hint="agentd is running solo. Wire hanzoai/gateway in front to enable multitenant orgs."
      />
    )
  }

  const renderRow = (o: Org): ReactNode[] => [
    <Link key="name" to={`/orgs/${encodeURIComponent(o.slug)}/members`}>{o.name}</Link>,
    <Text key="slug">{o.slug}</Text>,
    <Text key="members">{o.memberCount}</Text>,
    <Text key="created">{o.createdAt}</Text>,
  ]

  return (
    <DataTable
      columns={COLUMNS}
      rows={rows}
      renderRow={renderRow}
      rowKey={(o) => o.slug}
    emptyState={{ title: 'No organizations', hint: 'agentd is running solo.' }}
    />
  )
}
