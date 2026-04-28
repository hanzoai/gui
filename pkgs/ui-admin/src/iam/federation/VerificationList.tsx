// VerificationList — port of upstream VerificationListPage.
//
// Verifications are read-only audit records: phone/email
// challenges issued for sign-in / password reset. The list is a
// straight tabular view with pagination — no add / edit / delete.

import { useState, type ReactNode } from 'react'
import { Button, H3, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { DataTable } from '../../primitives/DataTable'
import { Loading, ErrorState } from '../../primitives/Empty'
import { useFetch } from '../../data/useFetch'
import { formatTimestamp } from '../../data/format'
import type { IamListResponse, Verification } from './types'

export interface VerificationListProps {
  organizationName?: string
}

const PAGE_SIZE = 10

export function VerificationList({ organizationName = '' }: VerificationListProps) {
  const [page, setPage] = useState(1)
  const params = new URLSearchParams({
    p: String(page),
    pageSize: String(PAGE_SIZE),
    organization: organizationName,
  })
  const url = `/v1/iam/verifications?${params.toString()}`
  const { data, error, isLoading } = useFetch<IamListResponse<Verification>>(url)

  if (isLoading) return <Loading label="Loading verifications" />
  if (error) return <ErrorState error={error} />

  const rows = data?.data ?? []
  const total = data?.data2 ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <H3 size="$5" color="$color">
          Verifications
        </H3>
        <Text fontSize="$2" color="$placeholderColor">
          {total} in total
        </Text>
      </XStack>

      <DataTable<Verification>
        columns={[
          { key: 'org', label: 'Organization', flex: 1 },
          { key: 'name', label: 'Name', flex: 1.4 },
          { key: 'created', label: 'Created', flex: 1.1 },
          { key: 'type', label: 'Type', flex: 0.6 },
          { key: 'user', label: 'User', flex: 1 },
          { key: 'provider', label: 'Provider', flex: 1 },
          { key: 'ip', label: 'Client IP', flex: 1 },
          { key: 'receiver', label: 'Receiver', flex: 1.2 },
          { key: 'code', label: 'Code', flex: 0.8 },
          { key: 'used', label: 'Used', flex: 0.5 },
        ]}
        rows={rows}
        rowKey={(r) => `${r.owner}/${r.name}`}
        emptyState={{ title: 'No verifications', hint: 'Phone/email challenges show up here.' }}
        renderRow={(r) =>
          [
            <Text key="o" color="$color">
              {r.owner === 'admin' ? '(empty)' : r.owner}
            </Text>,
            <Text key="n" color="$color">
              {r.name}
            </Text>,
            <Text key="c" fontSize="$1" color="$placeholderColor">
              {formatTimestamp(new Date(r.createdTime))}
            </Text>,
            <Text key="t" color="$color">
              {r.type}
            </Text>,
            <Text key="u" color="$color">
              {r.user}
            </Text>,
            <Text key="p" color="$color">
              {r.provider}
            </Text>,
            <Text key="ip" color="$color" fontFamily={'ui-monospace, monospace' as never}>
              {r.remoteAddr?.replace(/: $/, '')}
            </Text>,
            <Text key="r" color="$color">
              {r.receiver}
            </Text>,
            <Text key="cd" color="$color" fontFamily={'ui-monospace, monospace' as never}>
              {r.code}
            </Text>,
            <Text key="us" color={r.isUsed ? '#4ade80' : '$placeholderColor'}>
              {r.isUsed ? 'ON' : 'OFF'}
            </Text>,
          ] as ReactNode[]
        }
      />

      {totalPages > 1 && (
        <XStack justify="flex-end" gap="$2" items="center">
          <Button size="$2" variant="outlined" disabled={page <= 1} onPress={() => setPage(page - 1)}>
            <ChevronLeft size={14} />
          </Button>
          <Text fontSize="$2" color="$placeholderColor">
            {page} / {totalPages}
          </Text>
          <Button
            size="$2"
            variant="outlined"
            disabled={page >= totalPages}
            onPress={() => setPage(page + 1)}
          >
            <ChevronRight size={14} />
          </Button>
        </XStack>
      )}
    </YStack>
  )
}
