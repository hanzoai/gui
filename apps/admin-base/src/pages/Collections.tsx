// Collections — list view of every Base collection. The legacy
// ui-react/Collections.tsx used react-query + a Tailwind table; this
// rewrite uses @hanzogui/admin DataTable + useFetch (one path).
//
// Click row -> /collections/:id/records.

import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, H1, Input, Text, XStack, YStack } from 'hanzogui'
import {
  DataTable,
  Empty,
  ErrorState,
  LoadingState,
  formatTimestamp,
  useFetch,
  type DataTableColumn,
} from '@hanzogui/admin'
import { authedFetcher, deleteCollection, type CollectionModel, type ListResult } from '../lib/api'

const cols: DataTableColumn[] = [
  { key: 'name', label: 'Name', flex: 3 },
  { key: 'type', label: 'Type', flex: 1.2 },
  { key: 'system', label: 'System', flex: 0.8 },
  { key: 'fields', label: 'Fields', flex: 0.8 },
  { key: 'actions', label: '', flex: 1 },
]

export function Collections() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('')
  const [fetchedAt, setFetchedAt] = useState(new Date())

  const url = `/api/collections?perPage=500&sort=name`
  const { data, error, isLoading, mutate } = useFetch<ListResult<CollectionModel>>(url, {
    fetcher: authedFetcher as never,
  })

  const all = data?.items ?? []
  const rows = filter
    ? all.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()))
    : all

  const handleDelete = useCallback(
    async (c: CollectionModel) => {
      if (!confirm(`Delete collection "${c.name}"?`)) return
      try {
        await deleteCollection(c.id)
        await mutate()
        setFetchedAt(new Date())
      } catch (err) {
        alert((err as Error)?.message ?? 'Delete failed')
      }
    },
    [mutate],
  )

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error as Error} />

  return (
    <YStack gap="$4" flex={1}>
      <XStack items="baseline" gap="$3">
        <H1 size="$9" fontWeight="600" color="$color">
          {rows.length} Collection{rows.length === 1 ? '' : 's'}
        </H1>
        <Text fontSize="$1" color="$placeholderColor">
          {formatTimestamp(fetchedAt)}
        </Text>
      </XStack>

      <XStack gap="$2" items="center">
        <Input
          flex={1}
          maxW={420}
          size="$3"
          value={filter}
          onChangeText={setFilter}
          placeholder="Filter by name…"
        />
      </XStack>

      {rows.length === 0 ? (
        <Empty
          title="No collections"
          hint={filter ? 'Nothing matches the filter.' : 'Create one through the Base API.'}
        />
      ) : (
        <DataTable
          columns={cols}
          rows={rows}
          rowKey={(c) => c.id}
          emptyState={{ title: 'No collections', hint: '' }}
          renderRow={(c) => [
            <Text key="n" fontSize="$3" color="$color">
              {c.name}
            </Text>,
            <Text key="t" fontSize="$2" color="$placeholderColor">
              {c.type}
            </Text>,
            <Text key="s" fontSize="$2" color="$placeholderColor">
              {c.system ? 'yes' : 'no'}
            </Text>,
            <Text key="f" fontSize="$2" color="$placeholderColor">
              {c.fields?.length ?? 0}
            </Text>,
            <XStack key="a" gap="$2" justify="flex-end">
              <Button
                size="$2"
                onPress={() => navigate(`/collections/${c.id}/records`)}
              >
                <Text fontSize="$1">Records</Text>
              </Button>
              <Button
                size="$2"
                theme="red"
                disabled={c.system}
                onPress={() => handleDelete(c)}
              >
                <Text fontSize="$1">Delete</Text>
              </Button>
            </XStack>,
          ]}
        />
      )}
    </YStack>
  )
}
