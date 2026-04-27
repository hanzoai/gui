// IAM Sessions list — port of upstream `web/src/SessionListPage.tsx`.
// Casdoor stores one row per (org, user, application) tuple; the
// `sessionId` array holds active cookie/JWT IDs. The upstream UI lets
// you revoke a single ID or the whole row; we expose the same two
// actions but reuse a single confirm prompt instead of upstream's
// Ant Design `<Popconfirm>`.
//
// TODO(i18n): English literals only.

import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button, Text, XStack } from 'hanzogui'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { X } from '@hanzogui/lucide-icons-2/icons/X'
import {
  Badge,
  DataTable,
  ErrorState,
  Loading,
  PageShell,
  type DataTableColumn,
} from '../..'
import { useFetch, apiDelete } from '../../data'
import type { IamListResponse, IamSession } from './types'
import { authUrl, listQuery } from './api'

const COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'User', flex: 1.4 },
  { key: 'org', label: 'Organization', flex: 1.2 },
  { key: 'app', label: 'Application', flex: 1.2 },
  { key: 'activeIds', label: 'Active IDs', flex: 0.8 },
  { key: 'sessionIds', label: 'Session IDs', flex: 2 },
  { key: 'created', label: 'Created', flex: 1.2 },
  { key: 'actions', label: '', flex: 0.8 },
]

export interface SessionListProps {
  organizationName?: string
}

export function SessionList({ organizationName }: SessionListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20

  const url = `${authUrl('sessions')}${listQuery({
    page,
    pageSize,
    owner: organizationName,
  })}`

  const { data, error, isLoading, mutate } =
    useFetch<IamListResponse<IamSession>>(url)

  const rows = data?.data ?? []
  const total = data?.data2 ?? rows.length

  const revokeAll = async (record: IamSession) => {
    if (!window.confirm(`Revoke all sessions for "${record.name}"?`)) return
    await apiDelete(authUrl(`sessions/${record.owner}/${record.name}`))
    await mutate()
  }

  const revokeOne = async (record: IamSession, sid: string) => {
    if (!window.confirm(`Revoke session ID "${sid}"?`)) return
    // Casdoor accepts the session ID as a query param to scope the
    // delete; upstream calls SessionBackend.deleteSession with sid as
    // the second arg, which the backend forwards as `sessionId=`.
    const u =
      authUrl(`sessions/${record.owner}/${record.name}`) +
      `?sessionId=${encodeURIComponent(sid)}`
    await apiDelete(u)
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
          Sessions
        </Text>
        <Text fontSize="$2" color="$placeholderColor">
          {total} active
        </Text>
      </XStack>

      {isLoading && rows.length === 0 ? (
        <Loading label="Loading sessions" />
      ) : (
        <DataTable<IamSession>
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{
            title: 'No active sessions',
            hint: 'Sessions appear here when users sign in.',
          }}
          renderRow={(record): ReactNode[] => {
            const ids = record.sessionId ?? []
            return [
              <Text key="name" color="$color" fontWeight="500">
                {record.name}
              </Text>,
              <Link key="org" to={`/iam/orgs/${record.owner}`}>
                <Text color="$placeholderColor">{record.owner}</Text>
              </Link>,
              <Text key="app" color="$placeholderColor">
                {record.application}
              </Text>,
              <Badge key="count" variant={ids.length > 0 ? 'success' : 'muted'}>
                {String(ids.length)}
              </Badge>,
              <XStack key="ids" gap="$1" flexWrap="wrap">
                {ids.map((sid) => (
                  <XStack
                    key={sid}
                    gap="$1"
                    items="center"
                    px="$2"
                    py="$1"
                    rounded="$2"
                    bg={'rgba(255,255,255,0.04)' as never}
                  >
                    <Text
                      fontSize="$1"
                      color="$placeholderColor"
                      fontFamily={
                        'ui-monospace, SFMono-Regular, monospace' as never
                      }
                    >
                      {sid.length > 12 ? `${sid.slice(0, 8)}…` : sid}
                    </Text>
                    <Button
                      size="$1"
                      chromeless
                      onPress={() => revokeOne(record, sid)}
                      aria-label={`Revoke ${sid}`}
                    >
                      <X size={10} />
                    </Button>
                  </XStack>
                ))}
              </XStack>,
              <Text key="created" color="$placeholderColor" fontSize="$2">
                {record.createdTime
                  ? new Date(record.createdTime).toLocaleString()
                  : '—'}
              </Text>,
              <XStack key="actions" justify="flex-end">
                <Button
                  size="$2"
                  chromeless
                  onPress={() => revokeAll(record)}
                  icon={<Trash2 size={12} />}
                >
                  Revoke
                </Button>
              </XStack>,
            ]
          }}
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
