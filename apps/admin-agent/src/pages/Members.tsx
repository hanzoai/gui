// Members of one org. Roles map onto the Hanzo IAM Casdoor model:
// owner > admin > member. Membership flows through hanzo.id; this
// surface is read-only until the IAM v1 admin endpoints stabilize.

import { useParams } from 'react-router-dom'
import { DataTable, EmptyState, ErrorBanner, useFetch } from '@hanzogui/admin'
import type { Member } from '../lib/api'

export function MembersPage() {
  const { org } = useParams()
  const { data, error, isLoading } = useFetch<{ members: Member[] }>(
    org ? `/v1/agents/orgs/${encodeURIComponent(org)}/members` : null,
  )

  if (!org) return <EmptyState title="Pick an organization" />
  if (error) return <ErrorBanner error={error} />
  if (isLoading) return null
  const rows = data?.members ?? []

  return (
    <DataTable
      title={`Members of ${org}`}
      rows={rows}
      columns={[
        { header: 'Email', render: (m) => m.email },
        { header: 'Role', render: (m) => m.role },
        { header: 'Joined', render: (m) => m.joinedAt },
      ]}
    />
  )
}
