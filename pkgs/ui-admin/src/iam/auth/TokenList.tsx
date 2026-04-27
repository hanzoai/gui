// IAM Tokens list — port of upstream `web/src/TokenListPage.tsx`.
// Lists OAuth/OIDC tokens issued by IAM. Each row shows the
// app/org/user the token belongs to plus a truncated access-token
// preview. Click-through opens the edit page where the JWT is
// decoded for inspection.
//
// TODO(i18n): English literals only.

import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button, Text, XStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  DataTable,
  ErrorState,
  Loading,
  PageShell,
  type DataTableColumn,
} from '../..'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamListResponse, IamToken } from './types'
import { authUrl, listQuery } from './api'

const COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'Name', flex: 1.2 },
  { key: 'app', label: 'Application', flex: 1.2 },
  { key: 'org', label: 'Organization', flex: 1 },
  { key: 'user', label: 'User', flex: 1 },
  { key: 'accessToken', label: 'Access token', flex: 2 },
  { key: 'expires', label: 'Expires in', flex: 0.8 },
  { key: 'scope', label: 'Scope', flex: 0.8 },
  { key: 'actions', label: '', flex: 1 },
]

export interface TokenListProps {
  organizationName?: string
}

export function TokenList({ organizationName }: TokenListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20

  const url = `${authUrl('tokens')}${listQuery({
    page,
    pageSize,
    owner: organizationName,
  })}`

  const { data, error, isLoading, mutate } =
    useFetch<IamListResponse<IamToken>>(url)

  const rows = data?.data ?? []
  const total = data?.data2 ?? rows.length

  const onCreate = async () => {
    const suffix = Math.random().toString(36).slice(2, 8)
    const owner = organizationName ?? 'admin'
    const name = `token_${suffix}`
    await apiPost(authUrl(`tokens/${name}`), {
      owner,
      name,
      createdTime: new Date().toISOString(),
      application: 'app-hanzo',
      organization: owner,
      user: 'admin',
      accessToken: '',
      expiresIn: 7200,
      scope: 'read',
      tokenType: 'Bearer',
    })
    await mutate()
  }

  const onDelete = async (record: IamToken) => {
    if (!window.confirm(`Delete token "${record.name}"?`)) return
    await apiDelete(authUrl(`tokens/${record.name}`))
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
          Tokens
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
        <Loading label="Loading tokens" />
      ) : (
        <DataTable<IamToken>
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{
            title: 'No tokens',
            hint: 'Tokens are issued automatically when clients complete the OAuth flow.',
          }}
          renderRow={(record): ReactNode[] => [
            <Link key="name" to={`/iam/auth/tokens/${record.name}`}>
              <Text color="$color" fontWeight="500">
                {record.name}
              </Text>
            </Link>,
            <Link
              key="app"
              to={`/iam/auth/applications/${record.organization}/${record.application}`}
            >
              <Text color="$placeholderColor">{record.application}</Text>
            </Link>,
            <Link key="org" to={`/iam/orgs/${record.organization}`}>
              <Text color="$placeholderColor">{record.organization}</Text>
            </Link>,
            <Link
              key="user"
              to={`/iam/users/${record.organization}/${record.user}`}
            >
              <Text color="$placeholderColor">{record.user}</Text>
            </Link>,
            <Text
              key="at"
              fontSize="$1"
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              color="$placeholderColor"
              numberOfLines={1}
            >
              {record.accessToken
                ? `${record.accessToken.slice(0, 24)}…`
                : '—'}
            </Text>,
            <Text key="exp" color="$color" fontSize="$2">
              {record.expiresIn ?? '—'}
            </Text>,
            <Text key="scope" color="$placeholderColor" fontSize="$2">
              {record.scope || '—'}
            </Text>,
            <XStack key="actions" gap="$2" justify="flex-end">
              <Link to={`/iam/auth/tokens/${record.name}`}>
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
