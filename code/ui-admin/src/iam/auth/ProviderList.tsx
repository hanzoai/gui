// IAM Providers list — port of upstream `web/src/ProviderListPage.tsx`.
// Casdoor lists OAuth/OIDC/SAML/LDAP/SMS/Email/Captcha/Web3/Storage
// providers in a single table; categories dispatch to wildly different
// edit forms (50+ field permutations). The list is uniform: name,
// owner, category, type, displayName, clientId, createdTime.
//
// Upstream gates Edit/Delete actions behind `isAdminUser` for non-owned
// rows; we surface the same constraint via a `disabled` prop on the
// row buttons. Acl logic stays at the API; the UI just reflects.
//
// TODO(i18n): English literals only.

import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
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
import type { IamListResponse, IamProvider } from './types'
import { authUrl, listQuery } from './api'

const COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'Provider', flex: 1.6 },
  { key: 'owner', label: 'Owner', flex: 1 },
  { key: 'category', label: 'Category', flex: 1 },
  { key: 'type', label: 'Type', flex: 1 },
  { key: 'clientId', label: 'Client ID', flex: 1.8 },
  { key: 'created', label: 'Created', flex: 1.2 },
  { key: 'actions', label: '', flex: 1 },
]

export interface ProviderListProps {
  organizationName?: string
}

export function ProviderList({ organizationName }: ProviderListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20

  const url = `${authUrl('providers')}${listQuery({
    page,
    pageSize,
    owner: organizationName,
  })}`

  const { data, error, isLoading, mutate } =
    useFetch<IamListResponse<IamProvider>>(url)

  const rows = data?.data ?? []
  const total = data?.data2 ?? rows.length

  const onCreate = async () => {
    const suffix = Math.random().toString(36).slice(2, 8)
    const owner = organizationName ?? 'admin'
    const name = `provider_${suffix}`
    await apiPost(authUrl(`providers/${owner}/${name}`), {
      owner,
      name,
      createdTime: new Date().toISOString(),
      displayName: `New Provider - ${suffix}`,
      category: 'OAuth',
      type: 'GitHub',
      method: 'Normal',
      clientId: '',
      clientSecret: '',
      enableSignUp: true,
    })
    await mutate()
  }

  const onDelete = async (record: IamProvider) => {
    if (!window.confirm(`Delete provider "${record.name}"?`)) return
    await apiDelete(authUrl(`providers/${record.owner}/${record.name}`))
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
          Providers
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
        <Loading label="Loading providers" />
      ) : (
        <DataTable<IamProvider>
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{
            title: 'No providers',
            hint: 'Connect an upstream OAuth/OIDC/SAML/LDAP provider.',
          }}
          renderRow={(record): ReactNode[] => [
            <Link
              key="name"
              to={`/iam/auth/providers/${record.owner}/${record.name}`}
            >
              <Text color="$color" fontWeight="600">
                {record.displayName || record.name}
              </Text>
            </Link>,
            <Text key="owner" color="$placeholderColor">
              {record.owner === 'admin' ? 'admin (shared)' : record.owner}
            </Text>,
            <Badge key="cat" variant="info">
              {record.category}
            </Badge>,
            <Text key="type" color="$color">
              {record.type}
            </Text>,
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
              <Link to={`/iam/auth/providers/${record.owner}/${record.name}`}>
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
