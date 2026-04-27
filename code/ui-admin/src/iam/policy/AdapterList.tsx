// AdapterList — port of upstream AdapterListPage.
//
// Adapters are storage backends for Casbin policies. Most ship as
// `useSameDb=true` (reuse IAM's platform DB); custom adapters
// connect to a separate database.

import { useMemo, useState } from 'react'
import { Button, H3, Spinner, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { DataTable } from '../../primitives/DataTable'
import { Badge } from '../../primitives/Badge'
import { ErrorState } from '../../primitives/Empty'
import { useFetch, apiDelete } from '../../data/useFetch'
import type { Adapter, IamListResponse } from './types'

export interface AdapterListProps {
  owner: string
  onEdit: (owner: string, name: string) => void
  onAdd: () => void
  builtIns?: ReadonlySet<string>
  fetcher?: (url: string) => Promise<unknown>
}

const PAGE_SIZE = 10
const DEFAULT_BUILTINS = new Set<string>()

export function AdapterList({
  owner,
  onEdit,
  onAdd,
  builtIns = DEFAULT_BUILTINS,
  fetcher,
}: AdapterListProps) {
  const [page, setPage] = useState(1)
  const url = useMemo(
    () =>
      `/v1/iam/adapters?owner=${encodeURIComponent(owner)}&p=${page}&pageSize=${PAGE_SIZE}`,
    [owner, page],
  )
  const { data, error, isLoading, mutate } = useFetch<IamListResponse<Adapter>>(url, {
    fetcher,
  })

  const rows = data?.data ?? []
  const total = data?.data2 ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  async function handleDelete(a: Adapter) {
    if (!window.confirm(`Delete adapter "${a.name}"?`)) return
    try {
      await apiDelete(
        `/v1/iam/adapters/${encodeURIComponent(a.owner)}/${encodeURIComponent(a.name)}`,
      )
      await mutate()
    } catch (e) {
      window.alert(`Delete failed: ${(e as Error).message}`)
    }
  }

  if (error) return <ErrorState error={error as Error} />

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <H3 size="$6" color="$color">
          Adapters
        </H3>
        <XStack gap="$2" items="center">
          <Text fontSize="$2" color="$placeholderColor">
            {total} in total
          </Text>
          <Button size="$3" onPress={onAdd} icon={Plus}>
            Add
          </Button>
        </XStack>
      </XStack>

      {isLoading && rows.length === 0 ? (
        <XStack p="$5" items="center" justify="center">
          <Spinner size="small" />
        </XStack>
      ) : (
        <DataTable<Adapter>
          columns={[
            { key: 'name', label: 'Name', flex: 1 },
            { key: 'owner', label: 'Organization', flex: 1 },
            { key: 'createdTime', label: 'Created', flex: 1.2 },
            { key: 'table', label: 'Table', flex: 1 },
            { key: 'useSameDb', label: 'Same DB', flex: 0.7 },
            { key: 'databaseType', label: 'DB type', flex: 0.9 },
            { key: 'host', label: 'Host', flex: 1 },
            { key: 'port', label: 'Port', flex: 0.6 },
            { key: 'rowActions', label: '', flex: 1 },
          ]}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{
            title: 'No adapters',
            hint: 'Click Add to create a Casbin storage adapter.',
          }}
          renderRow={(a) => [
            <Text key="n" fontSize="$2" color="$color">
              {a.name}
            </Text>,
            <Text key="o" fontSize="$2" color="$placeholderColor">
              {a.owner}
            </Text>,
            <Text key="c" fontSize="$2" color="$color">
              {a.createdTime}
            </Text>,
            <Text key="t" fontSize="$2" color="$color">
              {a.table}
            </Text>,
            <Badge variant={a.useSameDb ? 'success' : 'muted'}>
              {a.useSameDb ? 'ON' : 'OFF'}
            </Badge>,
            <Text key="db" fontSize="$2" color="$color">
              {a.databaseType ?? '—'}
            </Text>,
            <Text key="h" fontSize="$2" color="$color">
              {a.host || '—'}
            </Text>,
            <Text key="p" fontSize="$2" color="$color">
              {a.port ? String(a.port) : '—'}
            </Text>,
            <XStack key="row-actions" gap="$2">
              <Button size="$2" onPress={() => onEdit(a.owner, a.name)} icon={Pencil}>
                Edit
              </Button>
              <Button
                size="$2"
                theme={'red' as never}
                disabled={builtIns.has(a.name)}
                onPress={() => handleDelete(a)}
                icon={Trash2}
              >
                Delete
              </Button>
            </XStack>,
          ]}
        />
      )}

      {totalPages > 1 ? (
        <XStack items="center" justify="flex-end" gap="$2">
          <Button
            size="$2"
            disabled={page <= 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            icon={ChevronLeft}
          />
          <Text fontSize="$2" color="$placeholderColor">
            {page} / {totalPages}
          </Text>
          <Button
            size="$2"
            disabled={page >= totalPages}
            onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
            icon={ChevronRight}
          />
        </XStack>
      ) : null}
    </YStack>
  )
}
