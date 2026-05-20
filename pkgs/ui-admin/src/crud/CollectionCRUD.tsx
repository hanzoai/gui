// CollectionCRUD — drop-in admin page for any hanzoai/base collection.
// One component, schema-driven: fetches the collection definition,
// derives table columns from visible fields, paginates records, opens
// a detail sheet on row click, and exposes a Create button that posts
// a form generated from the schema.
//
// Phase 1 = list + detail-view + create. Edit + delete are Phase 2;
// the underlying BaseClient already exposes updateRecord/deleteRecord
// so the next iteration is purely UI.
//
// Consumer:
//   <CollectionCRUD collection="flows"/>
//
// Requires <BaseClientProvider> + <HanzoguiProvider> ancestors.

import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  H1,
  Input,
  Label,
  ScrollView,
  Sheet,
  Switch,
  Text,
  TextArea,
  XStack,
  YStack,
} from 'hanzogui'
import { X } from '@hanzogui/lucide-icons-2/icons/X'
import { useFetch } from '../data/useFetch'
import {
  useBaseClient,
  makeAuthedFetcher,
  type CollectionField,
  type CollectionModel,
  type ListResult,
  type RecordModel,
} from '../data/baseClient'
import { DataTable, type DataTableColumn } from '../primitives/DataTable'
import { Empty, ErrorState, LoadingState } from '../primitives/Empty'

const PER_PAGE = 40

export interface CollectionCRUDProps {
  /** Collection id or name (e.g. "flows", "_superusers"). */
  collection: string
  /** Optional human page heading override. Defaults to the collection name. */
  title?: string
  /** Override per-page row count. */
  perPage?: number
}

export function CollectionCRUD({ collection, title, perPage = PER_PAGE }: CollectionCRUDProps) {
  const client = useBaseClient()
  const fetcher = useMemo(() => makeAuthedFetcher(client), [client])

  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('-created')
  const [filter, setFilter] = useState('')
  const [filterInput, setFilterInput] = useState('')
  const [openRecord, setOpenRecord] = useState<RecordModel | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const schemaUrl = client.path(`/collections/${encodeURIComponent(collection)}`)
  const schema = useFetch<CollectionModel>(schemaUrl, { fetcher: fetcher as never })

  const collectionName = schema.data?.name ?? collection
  const isView = schema.data?.type === 'view'
  const visibleFields = useMemo(
    () => (schema.data?.fields ?? []).filter((f: CollectionField) => !f.hidden && !f.system),
    [schema.data]
  )

  const recordsUrl = schema.data
    ? client.path(
        `/collections/${encodeURIComponent(collectionName)}/records?page=${page}&perPage=${perPage}&sort=${encodeURIComponent(sort)}${
          filter ? `&filter=${encodeURIComponent(filter)}` : ''
        }`
      )
    : null
  const records = useFetch<ListResult<RecordModel>>(recordsUrl, { fetcher: fetcher as never })

  const onSubmitFilter = useCallback(() => {
    setFilter(filterInput.trim())
    setPage(1)
  }, [filterInput])

  const onClearFilter = useCallback(() => {
    setFilter('')
    setFilterInput('')
    setPage(1)
  }, [])

  const handleCreated = useCallback(async () => {
    setCreateOpen(false)
    await records.mutate()
  }, [records])

  if (schema.isLoading) return <LoadingState />
  if (schema.error) return <ErrorState error={schema.error as Error} />
  if (!schema.data) return <Empty title={`Collection ${collection} not found`} />

  const cols: DataTableColumn[] = [
    ...visibleFields.map((f) => ({
      key: f.name,
      label: (
        <Text
          fontSize="$1"
          color="$placeholderColor"
          onPress={() => setSort((p) => (p === f.name ? `-${f.name}` : f.name))}
        >
          {f.name}
          {sort === f.name ? ' ↑' : sort === `-${f.name}` ? ' ↓' : ''}
        </Text>
      ),
      flex: 1.5,
    })),
  ]

  const rows = records.data?.items ?? []
  const totalPages = records.data?.totalPages ?? 0

  return (
    <YStack gap="$4" flex={1}>
      <XStack items="baseline" justify="space-between" gap="$3">
        <XStack items="baseline" gap="$3">
          <H1 size="$9" fontWeight="600" color="$color">
            {title ?? collectionName}
          </H1>
          <Text fontSize="$1" color="$placeholderColor">
            {records.data?.totalItems ?? 0} record
            {(records.data?.totalItems ?? 0) === 1 ? '' : 's'}
          </Text>
        </XStack>
        {!isView ? (
          <Button size="$3" theme="blue" onPress={() => setCreateOpen(true)}>
            <Text fontSize="$2">Create</Text>
          </Button>
        ) : null}
      </XStack>

      <XStack gap="$2" items="center">
        <Input
          flex={1}
          maxW={520}
          size="$3"
          value={filterInput}
          onChangeText={setFilterInput}
          placeholder='Filter (e.g. name = "example")'
          onSubmitEditing={onSubmitFilter}
        />
        <Button size="$3" onPress={onSubmitFilter}>
          <Text fontSize="$2">Filter</Text>
        </Button>
        {filter ? (
          <Button size="$3" chromeless onPress={onClearFilter}>
            <Text fontSize="$2" color="$placeholderColor">Clear</Text>
          </Button>
        ) : null}
      </XStack>

      {records.isLoading ? (
        <LoadingState />
      ) : records.error ? (
        <ErrorState error={records.error as Error} />
      ) : rows.length === 0 ? (
        <Empty
          title="No records"
          hint={filter ? 'Nothing matches the filter.' : `Create the first ${collectionName} record.`}
        />
      ) : (
        <DataTable
          columns={cols}
          rows={rows}
          rowKey={(r) => r.id}
          emptyState={{ title: 'No records' }}
          renderRow={(r) =>
            visibleFields.map((f) => (
              <Text
                key={f.id}
                fontSize="$2"
                color="$color"
                numberOfLines={1}
                onPress={() => setOpenRecord(r)}
              >
                {formatCell(r[f.name], f.type)}
              </Text>
            ))
          }
        />
      )}

      {totalPages > 1 ? (
        <XStack gap="$2" items="center" justify="center" pt="$2">
          <Button size="$2" disabled={page <= 1} onPress={() => setPage((p) => Math.max(1, p - 1))}>
            <Text fontSize="$2">Prev</Text>
          </Button>
          <Text fontSize="$2" color="$placeholderColor">Page {page} of {totalPages}</Text>
          <Button size="$2" disabled={page >= totalPages} onPress={() => setPage((p) => p + 1)}>
            <Text fontSize="$2">Next</Text>
          </Button>
        </XStack>
      ) : null}

      <RecordDetail
        record={openRecord}
        fields={visibleFields}
        onClose={() => setOpenRecord(null)}
      />

      <CreateRecordDialog
        open={createOpen}
        collection={collectionName}
        fields={visibleFields}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
    </YStack>
  )
}

// ---------------------------------------------------------------------------
// Cell formatter — minimal, type-aware
// ---------------------------------------------------------------------------

function formatCell(val: unknown, type: string): string {
  if (val === null || val === undefined || val === '') return '—'
  switch (type) {
    case 'bool':
      return val ? 'true' : 'false'
    case 'json':
      return JSON.stringify(val).slice(0, 80)
    case 'file':
      return Array.isArray(val) ? `${val.length} file(s)` : String(val)
    case 'relation':
      return Array.isArray(val) ? val.join(', ') : String(val)
    case 'date':
      return typeof val === 'string' ? val : String(val)
    default:
      return String(val).slice(0, 120)
  }
}

// ---------------------------------------------------------------------------
// Detail sheet — read-only
// ---------------------------------------------------------------------------

interface RecordDetailProps {
  record: RecordModel | null
  fields: CollectionField[]
  onClose: () => void
}

function RecordDetail({ record, fields, onClose }: RecordDetailProps) {
  return (
    <Sheet
      modal
      open={record !== null}
      onOpenChange={(open: boolean) => {
        if (!open) onClose()
      }}
      snapPoints={[80]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay />
      <Sheet.Frame p="$4">
        <Sheet.Handle />
        {record ? (
          <ScrollView>
            <YStack gap="$3">
              <XStack items="center" justify="space-between">
                <H1 size="$7" fontWeight="600">{record.id}</H1>
                <Button size="$2" chromeless onPress={onClose} icon={<X size={16} />} />
              </XStack>
              <YStack gap="$2">
                <FieldRow label="created" value={record.created} />
                <FieldRow label="updated" value={record.updated} />
                {fields.map((f) => (
                  <FieldRow
                    key={f.id}
                    label={f.name}
                    value={formatCell(record[f.name], f.type)}
                  />
                ))}
              </YStack>
            </YStack>
          </ScrollView>
        ) : null}
      </Sheet.Frame>
    </Sheet>
  )
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <XStack gap="$3" items="flex-start">
      <Text fontSize="$2" color="$placeholderColor" width={140}>{label}</Text>
      <Text fontSize="$2" color="$color" flex={1}>{value}</Text>
    </XStack>
  )
}

// ---------------------------------------------------------------------------
// Create dialog — form generated from schema
// ---------------------------------------------------------------------------

interface CreateRecordDialogProps {
  open: boolean
  collection: string
  fields: CollectionField[]
  onClose: () => void
  onCreated: () => void | Promise<void>
}

function CreateRecordDialog({
  open,
  collection,
  fields,
  onClose,
  onCreated,
}: CreateRecordDialogProps) {
  const client = useBaseClient()
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setValue = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }))

  const submit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await client.createRecord(collection, values)
      setValues({})
      await onCreated()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog modal open={open} onOpenChange={(o: boolean) => { if (!o) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content elevate p="$4" gap="$3" maxW={520} width="90vw">
          <Dialog.Title>Create {collection}</Dialog.Title>
          <YStack gap="$3" maxH="60vh" overflow="scroll">
            {fields.map((f) => (
              <FieldInput
                key={f.id}
                field={f}
                value={values[f.name]}
                onChange={(v) => setValue(f.name, v)}
              />
            ))}
          </YStack>
          {error ? (
            <Text fontSize="$2" color={'$red10' as never}>{error}</Text>
          ) : null}
          <XStack gap="$2" justify="flex-end">
            <Button size="$3" chromeless onPress={onClose} disabled={submitting}>
              <Text fontSize="$2">Cancel</Text>
            </Button>
            <Button size="$3" theme="blue" onPress={() => void submit()} disabled={submitting}>
              <Text fontSize="$2">{submitting ? 'Creating…' : 'Create'}</Text>
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

interface FieldInputProps {
  field: CollectionField
  value: unknown
  onChange: (v: unknown) => void
}

function FieldInput({ field, value, onChange }: FieldInputProps) {
  const label = field.name + (field.required ? ' *' : '')
  switch (field.type) {
    case 'bool':
      return (
        <XStack items="center" gap="$3">
          <Label>{label}</Label>
          <Switch
            size="$2"
            checked={Boolean(value)}
            onCheckedChange={(v: boolean) => onChange(v)}
          >
            <Switch.Thumb />
          </Switch>
        </XStack>
      )
    case 'json':
      return (
        <YStack gap="$1">
          <Label>{label}</Label>
          <TextArea
            size="$3"
            value={typeof value === 'string' ? value : value === undefined ? '' : JSON.stringify(value)}
            onChangeText={(v: string) => {
              try {
                onChange(v === '' ? undefined : JSON.parse(v))
              } catch {
                onChange(v)
              }
            }}
            placeholder='{"key":"value"}'
            rows={4}
          />
        </YStack>
      )
    case 'number':
      return (
        <YStack gap="$1">
          <Label>{label}</Label>
          <Input
            size="$3"
            keyboardType="numeric"
            value={value === undefined || value === null ? '' : String(value)}
            onChangeText={(v: string) => onChange(v === '' ? undefined : Number(v))}
          />
        </YStack>
      )
    case 'email':
      return (
        <YStack gap="$1">
          <Label>{label}</Label>
          <Input
            size="$3"
            value={(value as string) ?? ''}
            onChangeText={onChange}
            placeholder="you@example.com"
            autoCapitalize="none"
          />
        </YStack>
      )
    default:
      return (
        <YStack gap="$1">
          <Label>{label}</Label>
          <Input
            size="$3"
            value={(value as string) ?? ''}
            onChangeText={onChange}
            autoCapitalize="none"
          />
        </YStack>
      )
  }
}
