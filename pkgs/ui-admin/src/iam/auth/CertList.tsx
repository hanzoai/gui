// IAM Certs list — port of upstream `web/src/CertListPage.tsx`.
// Certs are JWT signing keys (x509, scope=JWT) or SSL certs for
// custom domains. The upstream UI has an SSL-only "Refresh" action
// that fetches updated domain expiry; we surface it identically.
//
// TODO(i18n): English literals only.

import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button, Text, XStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import {
  Badge,
  DataTable,
  ErrorState,
  Loading,
  PageShell,
  type DataTableColumn,
} from '../..'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamCert, IamListResponse } from './types'
import { authUrl, listQuery } from './api'

const COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'Name', flex: 1.4 },
  { key: 'owner', label: 'Owner', flex: 1 },
  { key: 'scope', label: 'Scope', flex: 0.7 },
  { key: 'type', label: 'Type', flex: 0.8 },
  { key: 'algo', label: 'Algorithm', flex: 1 },
  { key: 'bits', label: 'Bits', flex: 0.6 },
  { key: 'expires', label: 'Expires', flex: 1 },
  { key: 'actions', label: '', flex: 1.4 },
]

export interface CertListProps {
  organizationName?: string
}

export function CertList({ organizationName }: CertListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20

  const url = `${authUrl('certs')}${listQuery({
    page,
    pageSize,
    owner: organizationName,
  })}`

  const { data, error, isLoading, mutate } =
    useFetch<IamListResponse<IamCert>>(url)

  const rows = data?.data ?? []
  const total = data?.data2 ?? rows.length

  const onCreate = async () => {
    const suffix = Math.random().toString(36).slice(2, 8)
    const owner = organizationName ?? 'admin'
    const name = `cert_${suffix}`
    await apiPost(authUrl(`certs/${owner}/${name}`), {
      owner,
      name,
      createdTime: new Date().toISOString(),
      displayName: `New Cert - ${suffix}`,
      scope: 'JWT',
      type: 'x509',
      cryptoAlgorithm: 'RS256',
      bitSize: 4096,
      expireInYears: 20,
    })
    await mutate()
  }

  const onDelete = async (record: IamCert) => {
    if (!window.confirm(`Delete cert "${record.name}"?`)) return
    await apiDelete(authUrl(`certs/${record.owner}/${record.name}`))
    await mutate()
  }

  const onRefreshSsl = async (record: IamCert) => {
    // Casdoor's `/refresh-domain-expire` action — only meaningful for
    // SSL certs that wrap custom domains.
    await apiPost(
      authUrl(`certs/${record.owner}/${record.name}/refresh-domain-expire`),
      {},
    )
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
          Certs
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
        <Loading label="Loading certs" />
      ) : (
        <DataTable<IamCert>
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{
            title: 'No certs',
            hint: 'Add a JWT signing cert or an SSL cert for a custom domain.',
          }}
          renderRow={(record): ReactNode[] => [
            <Link
              key="name"
              to={`/iam/auth/certs/${record.owner}/${record.name}`}
            >
              <Text color="$color" fontWeight="500">
                {record.displayName || record.name}
              </Text>
            </Link>,
            <Text key="owner" color="$placeholderColor">
              {record.owner === 'admin' ? 'admin (shared)' : record.owner}
            </Text>,
            <Badge
              key="scope"
              variant={record.scope === 'JWT' ? 'info' : 'muted'}
            >
              {record.scope}
            </Badge>,
            <Text key="type" color="$color">
              {record.type}
            </Text>,
            <Text key="algo" color="$color" fontSize="$2">
              {record.cryptoAlgorithm}
            </Text>,
            <Text key="bits" color="$placeholderColor" fontSize="$2">
              {record.bitSize ?? '—'}
            </Text>,
            <Text key="exp" color="$placeholderColor" fontSize="$2">
              {record.expireTime
                ? new Date(record.expireTime).toLocaleDateString()
                : record.expireInYears
                  ? `${record.expireInYears}y`
                  : '—'}
            </Text>,
            <XStack key="actions" gap="$2" justify="flex-end">
              {record.type === 'SSL' ? (
                <Button
                  size="$2"
                  chromeless
                  onPress={() => onRefreshSsl(record)}
                  icon={<RefreshCw size={12} />}
                />
              ) : null}
              <Link to={`/iam/auth/certs/${record.owner}/${record.name}`}>
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
