// EnforcerList — port of upstream EnforcerListPage.
//
// Enforcers wire a Model to an Adapter to produce a runtime Casbin
// engine. The list shows model + adapter linkage so admins can
// trace "which model + which storage" produced an enforcement.

import { useMemo, useState } from 'react'
import { Button, H3, Spinner, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { DataTable } from '../../primitives/DataTable'
import { ErrorState } from '../../primitives/Empty'
import { useFetch, apiDelete } from '../../data/useFetch'
import type { Enforcer, IamListResponse } from './types'

export interface EnforcerListProps {
  owner: string
  onEdit: (owner: string, name: string) => void
  onAdd: () => void
  builtIns?: ReadonlySet<string>
  fetcher?: (url: string) => Promise<unknown>
}

const PAGE_SIZE = 10
const DEFAULT_BUILTINS = new Set<string>()

export function EnforcerList({
  owner,
  onEdit,
  onAdd,
  builtIns = DEFAULT_BUILTINS,
  fetcher,
}: EnforcerListProps) {
  const [page, setPage] = useState(1)
  const url = useMemo(
    () =>
      `/v1/iam/enforcers?owner=${encodeURIComponent(owner)}&p=${page}&pageSize=${PAGE_SIZE}`,
    [owner, page],
  )
  const { data, error, isLoading, mutate } = useFetch<IamListResponse<Enforcer>>(url, {
    fetcher,
  })

  const rows = data?.data ?? []
  const total = data?.data2 ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  async function handleDelete(e: Enforcer) {
    if (!window.confirm(`Delete enforcer "${e.name}"?`)) return
    try {
      await apiDelete(
        `/v1/iam/enforcers/${encodeURIComponent(e.owner)}/${encodeURIComponent(e.name)}`,
      )
      await mutate()
    } catch (err) {
      window.alert(`Delete failed: ${(err as Error).message}`)
    }
  }

  if (error) return <ErrorState error={error as Error} />

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <H3 size="$6" color="$color">
          Enforcers
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
        <DataTable<Enforcer>
          columns={[
            { key: 'name', label: 'Name', flex: 1 },
            { key: 'owner', label: 'Organization', flex: 1 },
            { key: 'createdTime', label: 'Created', flex: 1.2 },
            { key: 'displayName', label: 'Display name', flex: 1.2 },
            { key: 'model', label: 'Model', flex: 1.2 },
            { key: 'adapter', label: 'Adapter', flex: 1.2 },
            { key: 'rowActions', label: '', flex: 1 },
          ]}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{
            title: 'No enforcers',
            hint: 'An enforcer wires a model to an adapter.',
          }}
          renderRow={(e) => [
            <Text key="n" fontSize="$2" color="$color">
              {e.name}
            </Text>,
            <Text key="o" fontSize="$2" color="$placeholderColor">
              {e.owner}
            </Text>,
            <Text key="c" fontSize="$2" color="$color">
              {e.createdTime}
            </Text>,
            <Text key="d" fontSize="$2" color="$color">
              {e.displayName}
            </Text>,
            <Text key="m" fontSize="$2" color="$color">
              {e.model || '—'}
            </Text>,
            <Text key="a" fontSize="$2" color="$color">
              {e.adapter || '—'}
            </Text>,
            <XStack key="row-actions" gap="$2">
              <Button size="$2" onPress={() => onEdit(e.owner, e.name)} icon={Pencil}>
                Edit
              </Button>
              <Button
                size="$2"
                theme={'red' as never}
                disabled={builtIns.has(e.name)}
                onPress={() => handleDelete(e)}
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
