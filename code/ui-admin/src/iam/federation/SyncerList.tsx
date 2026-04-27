// SyncerList — port of upstream SyncerListPage.
//
// The upstream paged grid is replaced with the shared `DataTable`
// primitive. Pagination state lives locally; the URL fingerprint
// includes page + size so `useFetch` revalidates on change. Run /
// edit / delete actions emit callbacks; the parent decides routes.

import { useState, type ReactNode } from 'react'
import { Button, H3, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { DataTable } from '../../primitives/DataTable'
import { Loading, ErrorState } from '../../primitives/Empty'
import { useFetch, apiPost, apiDelete } from '../../data/useFetch'
import { formatTimestamp } from '../../data/format'
import type { IamListResponse, Syncer } from './types'

export interface SyncerListProps {
  organizationName?: string
  onOpenSyncer?: (s: Syncer) => void
  onAdded?: (s: Syncer) => void
}

const PAGE_SIZE = 10

export function SyncerList({ organizationName = '', onOpenSyncer, onAdded }: SyncerListProps) {
  const [page, setPage] = useState(1)
  const [busy, setBusy] = useState(false)
  const params = new URLSearchParams({
    p: String(page),
    pageSize: String(PAGE_SIZE),
    organization: organizationName,
  })
  const url = `/v1/iam/syncers?${params.toString()}`
  const { data, error, isLoading, mutate } = useFetch<IamListResponse<Syncer>>(url)

  if (isLoading) return <Loading label="Loading syncers" />
  if (error) return <ErrorState error={error} />

  const rows = data?.data ?? []
  const total = data?.data2 ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const addSyncer = async () => {
    setBusy(true)
    try {
      const fresh: Partial<Syncer> = {
        owner: 'admin',
        organization: organizationName,
        type: 'Database',
        databaseType: 'mysql',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'dbName',
        table: 'table_name',
        tableColumns: [],
        affiliationTable: '',
        avatarBaseUrl: '',
        syncInterval: 10,
        isReadOnly: false,
        isEnabled: false,
      }
      const r = await apiPost<{ status: string; data: Syncer }>('/v1/iam/syncers', fresh)
      await mutate()
      if (r.data) onAdded?.(r.data)
    } finally {
      setBusy(false)
    }
  }

  const runSyncer = async (s: Syncer) => {
    setBusy(true)
    try {
      await apiPost(`/v1/iam/syncers/${encodeURIComponent(s.owner)}/${encodeURIComponent(s.name)}/run`, {})
      await mutate()
    } finally {
      setBusy(false)
    }
  }

  const deleteSyncer = async (s: Syncer) => {
    if (!window.confirm(`Delete syncer "${s.name}"?`)) return
    setBusy(true)
    try {
      await apiDelete(`/v1/iam/syncers/${encodeURIComponent(s.owner)}/${encodeURIComponent(s.name)}`)
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
          Syncers
        </H3>
        <XStack items="center" gap="$3">
          <Text fontSize="$2" color="$placeholderColor">
            {total} in total
          </Text>
          <Button size="$3" disabled={busy} onPress={addSyncer}>
            <Plus size={14} /> Add
          </Button>
        </XStack>
      </XStack>

      <DataTable<Syncer>
        columns={[
          { key: 'name', label: 'Name', flex: 1.4 },
          { key: 'org', label: 'Organization', flex: 1 },
          { key: 'type', label: 'Type', flex: 0.9 },
          { key: 'host', label: 'Host', flex: 1.1 },
          { key: 'interval', label: 'Sync interval', flex: 0.7 },
          { key: 'enabled', label: 'Enabled', flex: 0.5 },
          { key: 'createdTime', label: 'Created', flex: 1.1 },
          { key: 'actions', label: '', flex: 1.4 },
        ]}
        rows={rows}
        rowKey={(r) => `${r.owner}/${r.name}`}
        emptyState={{ title: 'No syncers', hint: 'Add a syncer to mirror users from another directory.' }}
        renderRow={(r) =>
          [
            <Link key="n" onPress={() => onOpenSyncer?.(r)}>
              {r.name}
            </Link>,
            <Text key="o" color="$color">
              {r.organization}
            </Text>,
            <Text key="t" color="$color">
              {r.type}
            </Text>,
            <Text key="h" color="$color">
              {r.host}
            </Text>,
            <Text key="i" color="$color">
              {r.syncInterval}
            </Text>,
            <Text key="e" color={r.isEnabled ? '#4ade80' : '$placeholderColor'}>
              {r.isEnabled ? 'ON' : 'OFF'}
            </Text>,
            <Text key="c" color="$placeholderColor" fontSize="$1">
              {formatTimestamp(r.createdTime)}
            </Text>,
            <XStack key="a" gap="$1.5">
              <Button size="$2" disabled={busy} onPress={() => runSyncer(r)}>
                <RefreshCw size={12} /> Sync
              </Button>
              <Button size="$2" variant="outlined" onPress={() => onOpenSyncer?.(r)}>
                <Pencil size={12} />
              </Button>
              <Button
                size="$2"
                variant="outlined"
                disabled={busy}
                onPress={() => deleteSyncer(r)}
              >
                <Trash2 size={12} />
              </Button>
            </XStack>,
          ] as ReactNode[]
        }
      />

      {totalPages > 1 && (
        <XStack justify="flex-end" gap="$2" items="center">
          <Button
            size="$2"
            variant="outlined"
            disabled={page <= 1}
            onPress={() => setPage(page - 1)}
          >
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

function Link({ onPress, children }: { onPress: () => void; children: ReactNode }) {
  return (
    <Text
      onPress={onPress}
      cursor="pointer"
      color="#60a5fa"
      hoverStyle={{ color: '#93c5fd' }}
    >
      {children}
    </Text>
  )
}
