// ModelList — port of upstream ModelListPage.
//
// Models are Casbin .conf definitions. Built-in models can be
// edited (display fields) but not deleted, matching upstream's
// builtInObject() guard.

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
import type { IamListResponse, Model } from './types'

export interface ModelListProps {
  owner: string
  onEdit: (owner: string, name: string) => void
  onAdd: () => void
  // Models flagged as built-in (e.g. user-default-model). Names
  // listed here disable the Delete button. Defaults to the four
  // upstream builtins.
  builtIns?: ReadonlySet<string>
  fetcher?: (url: string) => Promise<unknown>
}

const PAGE_SIZE = 10
const DEFAULT_BUILTINS = new Set([
  'user-model-built-in',
  'api-model-built-in',
  'app-model-built-in',
  'default-model',
])

export function ModelList({
  owner,
  onEdit,
  onAdd,
  builtIns = DEFAULT_BUILTINS,
  fetcher,
}: ModelListProps) {
  const [page, setPage] = useState(1)
  const url = useMemo(
    () => `/v1/iam/models?owner=${encodeURIComponent(owner)}&p=${page}&pageSize=${PAGE_SIZE}`,
    [owner, page],
  )
  const { data, error, isLoading, mutate } = useFetch<IamListResponse<Model>>(url, {
    fetcher,
  })

  const rows = data?.data ?? []
  const total = data?.data2 ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  async function handleDelete(m: Model) {
    if (!window.confirm(`Delete model "${m.name}"?`)) return
    try {
      await apiDelete(
        `/v1/iam/models/${encodeURIComponent(m.owner)}/${encodeURIComponent(m.name)}`,
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
          Models
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
        <DataTable<Model>
          columns={[
            { key: 'name', label: 'Name', flex: 1 },
            { key: 'owner', label: 'Organization', flex: 1 },
            { key: 'createdTime', label: 'Created', flex: 1.2 },
            { key: 'displayName', label: 'Display name', flex: 1.2 },
            { key: 'modelText', label: 'Model text', flex: 2 },
            { key: 'rowActions', label: '', flex: 1 },
          ]}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{
            title: 'No models',
            hint: 'Click Add to create a Casbin model.',
          }}
          renderRow={(m) => [
            <Text key="n" fontSize="$2" color="$color">
              {m.name}
            </Text>,
            <Text key="o" fontSize="$2" color="$placeholderColor">
              {m.owner}
            </Text>,
            <Text key="c" fontSize="$2" color="$color">
              {m.createdTime}
            </Text>,
            <Text key="d" fontSize="$2" color="$color">
              {m.displayName}
            </Text>,
            <Text
              key="t"
              fontSize="$1"
              color="$placeholderColor"
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              numberOfLines={1}
            >
              {m.modelText.split('\n')[0]}
            </Text>,
            <XStack key="row-actions" gap="$2">
              <Button size="$2" onPress={() => onEdit(m.owner, m.name)} icon={Pencil}>
                Edit
              </Button>
              <Button
                size="$2"
                theme={'red' as never}
                disabled={builtIns.has(m.name)}
                onPress={() => handleDelete(m)}
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
