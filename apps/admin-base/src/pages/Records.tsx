// Records — list view for a single collection. Replaces
// ui-react/pages/Records.tsx (react-query + Tailwind) with @hanzogui/admin
// DataTable + useFetch.
//
// Filter is server-side (Base's filter syntax); paging is server-side via
// /api/collections/:id/records?page=&perPage=. Bulk delete is best-effort
// parallel — same as the legacy implementation.

import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, H1, Input, Text, XStack, YStack } from 'hanzogui'
import {
  DataTable,
  Empty,
  ErrorState,
  LoadingState,
  useFetch,
  type DataTableColumn,
} from '@hanzogui/admin'
import {
  authedFetcher,
  deleteRecord,
  type CollectionField,
  type CollectionModel,
  type ListResult,
  type RecordModel,
} from '../lib/api'

const PER_PAGE = 40

export function Records({ id }: { id: string }) {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('-created')
  const [filter, setFilter] = useState('')
  const [filterInput, setFilterInput] = useState('')
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set())

  const collectionUrl = `/api/collections/${encodeURIComponent(id)}`
  const collection = useFetch<CollectionModel>(collectionUrl, {
    fetcher: authedFetcher as never,
  })

  const collectionName = collection.data?.name ?? id
  const isView = collection.data?.type === 'view'
  const visibleFields = (collection.data?.fields ?? []).filter(
    (f: CollectionField) => !f.hidden,
  )

  const recordsUrl = collection.data
    ? `/api/collections/${encodeURIComponent(collectionName)}/records?page=${page}&perPage=${PER_PAGE}&sort=${encodeURIComponent(sort)}${
        filter ? `&filter=${encodeURIComponent(filter)}` : ''
      }`
    : null
  const records = useFetch<ListResult<RecordModel>>(recordsUrl, {
    fetcher: authedFetcher as never,
  })

  const onSubmitFilter = useCallback(() => {
    setFilter(filterInput)
    setPage(1)
  }, [filterInput])

  const onClearFilter = useCallback(() => {
    setFilter('')
    setFilterInput('')
    setPage(1)
  }, [])

  const handleDelete = useCallback(
    async (recordId: string) => {
      if (!confirm(`Delete record "${recordId}"?`)) return
      try {
        await deleteRecord(collectionName, recordId)
        await records.mutate()
      } catch (err) {
        alert((err as Error)?.message ?? 'Delete failed')
      }
    },
    [collectionName, records],
  )

  const handleBulkDelete = useCallback(async () => {
    const ids = Array.from(bulkSelected)
    if (ids.length === 0) return
    if (!confirm(`Delete ${ids.length} record${ids.length > 1 ? 's' : ''}?`)) return
    await Promise.all(ids.map((rid) => deleteRecord(collectionName, rid).catch(() => null)))
    setBulkSelected(new Set())
    await records.mutate()
  }, [bulkSelected, collectionName, records])

  if (collection.isLoading) return <LoadingState />
  if (collection.error) return <ErrorState error={collection.error as Error} />

  const cols: DataTableColumn[] = [
    ...visibleFields.map((f) => ({
      key: f.name,
      label: (
        <Text
          fontSize="$1"
          color="$placeholderColor"
          onPress={() =>
            setSort((p) => (p === f.name ? `-${f.name}` : f.name))
          }
        >
          {f.name}
          {sort === f.name ? ' ↑' : sort === `-${f.name}` ? ' ↓' : ''}
        </Text>
      ),
      flex: 1.5,
    })),
    { key: 'actions', label: '', flex: 1 },
  ]

  const rows = records.data?.items ?? []
  const totalPages = records.data?.totalPages ?? 0

  const selection = isView
    ? undefined
    : {
        selected: bulkSelected,
        onToggle: (key: string) =>
          setBulkSelected((prev) => {
            const next = new Set(prev)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
          }),
        onToggleAll: (allRows: RecordModel[], selectAll: boolean) =>
          setBulkSelected(selectAll ? new Set(allRows.map((r) => r.id)) : new Set()),
      }

  return (
    <YStack gap="$4" flex={1} px="$6" py="$5">
      <XStack items="baseline" gap="$3">
        <Link to="/collections" style={{ textDecoration: 'none' }}>
          <Text fontSize="$3" color="$placeholderColor">
            Collections
          </Text>
        </Link>
        <Text fontSize="$3" color="$placeholderColor">
          /
        </Text>
        <H1 size="$9" fontWeight="600" color="$color">
          {collectionName}
        </H1>
        <Text fontSize="$1" color="$placeholderColor">
          {records.data?.totalItems ?? 0} record{(records.data?.totalItems ?? 0) === 1 ? '' : 's'}
        </Text>
      </XStack>

      <XStack gap="$2" items="center">
        <Input
          flex={1}
          maxW={520}
          size="$3"
          value={filterInput}
          onChangeText={setFilterInput}
          placeholder='Filter (e.g. name = "test")'
          onSubmitEditing={onSubmitFilter}
        />
        <Button size="$3" onPress={onSubmitFilter}>
          <Text fontSize="$2">Filter</Text>
        </Button>
        {filter ? (
          <Button size="$3" chromeless onPress={onClearFilter}>
            <Text fontSize="$2" color="$placeholderColor">
              Clear
            </Text>
          </Button>
        ) : null}
      </XStack>

      {bulkSelected.size > 0 ? (
        <XStack gap="$3" items="center" px="$3" py="$2" bg={'rgba(255,255,255,0.04)' as never} rounded="$2">
          <Text fontSize="$2" color="$color">
            {bulkSelected.size} selected
          </Text>
          <Button size="$2" chromeless onPress={() => setBulkSelected(new Set())}>
            <Text fontSize="$1">Deselect</Text>
          </Button>
          <Button size="$2" theme="red" onPress={handleBulkDelete}>
            <Text fontSize="$1">Delete selected</Text>
          </Button>
        </XStack>
      ) : null}

      {records.isLoading ? (
        <LoadingState />
      ) : records.error ? (
        <ErrorState error={records.error as Error} />
      ) : rows.length === 0 ? (
        <Empty title="No records" hint={filter ? 'Nothing matches the filter.' : 'Create one through the API.'} />
      ) : (
        <DataTable
          columns={cols}
          rows={rows}
          rowKey={(r) => r.id}
          selection={selection}
          emptyState={{ title: 'No records' }}
          renderRow={(r) => [
            ...visibleFields.map((f) => (
              <CellValue key={f.id} record={r} field={f} />
            )),
            <XStack key="a" gap="$2" justify="flex-end">
              {!isView ? (
                <Button size="$2" theme="red" onPress={() => handleDelete(r.id)}>
                  <Text fontSize="$1">Delete</Text>
                </Button>
              ) : null}
            </XStack>,
          ]}
        />
      )}

      {totalPages > 1 ? (
        <XStack gap="$2" items="center" justify="center" pt="$2">
          <Button
            size="$2"
            disabled={page <= 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
          >
            <Text fontSize="$2">Prev</Text>
          </Button>
          <Text fontSize="$2" color="$placeholderColor">
            Page {page} of {totalPages}
          </Text>
          <Button
            size="$2"
            disabled={page >= totalPages}
            onPress={() => setPage((p) => p + 1)}
          >
            <Text fontSize="$2">Next</Text>
          </Button>
        </XStack>
      ) : null}
    </YStack>
  )
}

function CellValue({ record, field }: { record: RecordModel; field: CollectionField }) {
  const val = record[field.name]
  if (val === null || val === undefined) {
    return (
      <Text fontSize="$2" color="$placeholderColor">
        —
      </Text>
    )
  }
  switch (field.type) {
    case 'bool':
      return <Text fontSize="$2" color="$color">{val ? 'true' : 'false'}</Text>
    case 'json':
      return (
        <Text
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          fontSize="$1"
          color="$color"
          numberOfLines={1}
        >
          {JSON.stringify(val).slice(0, 80)}
        </Text>
      )
    case 'file':
      return (
        <Text fontSize="$2" color="$color">
          {Array.isArray(val) ? `${val.length} file(s)` : String(val)}
        </Text>
      )
    case 'relation':
      return (
        <Text fontSize="$2" color="$color">
          {Array.isArray(val) ? val.join(', ') : String(val)}
        </Text>
      )
    default:
      return (
        <Text fontSize="$2" color="$color" numberOfLines={1}>
          {String(val)}
        </Text>
      )
  }
}
