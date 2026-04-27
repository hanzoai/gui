// InvitationList — port of upstream InvitationListPage.

import { useState, type ReactNode } from 'react'
import { Button, H3, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { DataTable } from '../../primitives/DataTable'
import { Loading, ErrorState } from '../../primitives/Empty'
import { useFetch, apiPost, apiDelete } from '../../data/useFetch'
import { formatTimestamp } from '../../data/format'
import type { IamListResponse, Invitation } from './types'

export interface InvitationListProps {
  organizationName?: string
  onOpenInvitation?: (i: Invitation) => void
  onAdded?: (i: Invitation) => void
}

const PAGE_SIZE = 10

export function InvitationList({
  organizationName = '',
  onOpenInvitation,
  onAdded,
}: InvitationListProps) {
  const [page, setPage] = useState(1)
  const [busy, setBusy] = useState(false)
  const params = new URLSearchParams({
    p: String(page),
    pageSize: String(PAGE_SIZE),
    organization: organizationName,
  })
  const url = `/v1/iam/invitations?${params.toString()}`
  const { data, error, isLoading, mutate } = useFetch<IamListResponse<Invitation>>(url)

  if (isLoading) return <Loading label="Loading invitations" />
  if (error) return <ErrorState error={error} />

  const rows = data?.data ?? []
  const total = data?.data2 ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const addInvitation = async () => {
    setBusy(true)
    try {
      const code = Math.random().toString(36).slice(-10)
      const fresh: Partial<Invitation> = {
        owner: organizationName || 'admin',
        displayName: 'New Invitation',
        code,
        defaultCode: code,
        quota: 1,
        usedCount: 0,
        application: 'All',
        username: '',
        email: '',
        phone: '',
        signupGroup: '',
        state: 'Active',
      }
      const r = await apiPost<{ status: string; data: Invitation }>('/v1/iam/invitations', fresh)
      await mutate()
      if (r.data) onAdded?.(r.data)
    } finally {
      setBusy(false)
    }
  }

  const deleteInvitation = async (i: Invitation) => {
    if (!window.confirm(`Delete invitation "${i.name}"?`)) return
    setBusy(true)
    try {
      await apiDelete(
        `/v1/iam/invitations/${encodeURIComponent(i.owner)}/${encodeURIComponent(i.name)}`,
      )
      if (rows.length === 1 && page > 1) setPage(page - 1)
      await mutate()
    } finally {
      setBusy(false)
    }
  }

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <H3 size="$5" color="$color">
          Invitations
        </H3>
        <XStack items="center" gap="$3">
          <Text fontSize="$2" color="$placeholderColor">
            {total} in total
          </Text>
          <Button size="$3" disabled={busy} onPress={addInvitation}>
            <Plus size={14} /> Add
          </Button>
        </XStack>
      </XStack>

      <DataTable<Invitation>
        columns={[
          { key: 'name', label: 'Name', flex: 1.2 },
          { key: 'org', label: 'Organization', flex: 1 },
          { key: 'displayName', label: 'Display name', flex: 1.2 },
          { key: 'code', label: 'Code', flex: 1 },
          { key: 'quota', label: 'Quota', flex: 0.6 },
          { key: 'used', label: 'Used', flex: 0.6 },
          { key: 'application', label: 'Application', flex: 1 },
          { key: 'state', label: 'State', flex: 0.6 },
          { key: 'createdTime', label: 'Created', flex: 1 },
          { key: 'actions', label: '', flex: 1 },
        ]}
        rows={rows}
        rowKey={(r) => `${r.owner}/${r.name}`}
        emptyState={{ title: 'No invitations', hint: 'Add an invitation to gate sign-up.' }}
        renderRow={(i) =>
          [
            <Text key="n" onPress={() => onOpenInvitation?.(i)} cursor="pointer" color="#60a5fa">
              {i.name}
            </Text>,
            <Text key="o" color="$color">
              {i.owner}
            </Text>,
            <Text key="d" color="$color">
              {i.displayName}
            </Text>,
            <Text key="c" color="$color" fontFamily={'ui-monospace, monospace' as never}>
              {i.code}
            </Text>,
            <Text key="q" color="$color">
              {i.quota}
            </Text>,
            <Text key="u" color="$color">
              {i.usedCount}
            </Text>,
            <Text key="a" color="$color">
              {i.application}
            </Text>,
            <Text key="s" color={i.state === 'Active' ? '#4ade80' : '$placeholderColor'}>
              {i.state}
            </Text>,
            <Text key="ct" fontSize="$1" color="$placeholderColor">
              {formatTimestamp(i.createdTime)}
            </Text>,
            <XStack key="ax" gap="$1.5">
              <Button size="$2" variant="outlined" onPress={() => onOpenInvitation?.(i)}>
                <Pencil size={12} />
              </Button>
              <Button
                size="$2"
                variant="outlined"
                disabled={busy}
                onPress={() => deleteInvitation(i)}
              >
                <Trash2 size={12} />
              </Button>
            </XStack>,
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
