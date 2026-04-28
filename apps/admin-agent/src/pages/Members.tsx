// Members of one org. Roles map onto the Hanzo IAM Casdoor model:
// owner > admin > member. Membership flows through hanzo.id; this
// surface is read-only until the IAM v1 admin endpoints stabilize.

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
import type { Member } from '../lib/api'

const COLUMNS: DataTableColumn[] = [
  { key: 'email', label: 'Email', flex: 1.5 },
  { key: 'role', label: 'Role', flex: 0.7 },
  { key: 'joined', label: 'Joined', flex: 1 },
]

export function MembersPage() {
  const { org } = useParams()
  const { data, error, isLoading } = useFetch<{ members: Member[] }>(
    org ? `/v1/agents/orgs/${encodeURIComponent(org)}/members` : null,
  )

  if (!org) return <Empty title="Pick an organization" />
  if (error) return <ErrorState error={error} />
  if (isLoading) return null
  const rows = data?.members ?? []

  const renderRow = (m: Member): ReactNode[] => [
    <Text key="email">{m.email}</Text>,
    <Text key="role">{m.role}</Text>,
    <Text key="joined">{m.joinedAt}</Text>,
  ]

  return (
    <DataTable
      columns={COLUMNS}
      rows={rows}
      renderRow={renderRow}
      rowKey={(m) => m.email}
    emptyState={{ title: 'No members', hint: 'Invite a teammate via hanzo.id.' }}
    />
  )
}
