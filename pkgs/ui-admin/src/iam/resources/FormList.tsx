// Form list — admin-defined form definitions over the four built-in
// list pages (users / applications / providers / organizations).
// Each form picks a type and a column subset. The list page only
// surfaces the row count of `formItems`; the schema lives on Edit.

import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Anchor, Button, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import {
  DataTable,
  type DataTableColumn,
} from '../../primitives/DataTable'
import { apiDelete, apiPost, useFetch } from '../../data/useFetch'
import {
  FormUrls,
  type FormDefinition,
  type ListResponse,
} from './api'
import { type AdminAccount } from './types'

const PAGE_SIZE = 10

const COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'Name', flex: 2 },
  { key: 'displayName', label: 'Display name', flex: 2 },
  { key: 'type', label: 'Type', flex: 1 },
  { key: 'items', label: 'Items', flex: 1 },
  { key: 'op', label: '', flex: 2 },
]

function randomSlug(): string {
  // Lower-case slug, 8 chars, alpha-numeric. Plenty for ad-hoc form
  // names; collisions are not a problem because the backend rejects
  // duplicates and the admin can rename.
  return Math.random().toString(36).slice(2, 10)
}

export interface FormListProps {
  account: AdminAccount
}

export function FormList({ account }: FormListProps) {
  const nav = useNavigate()
  const [page, setPage] = useState(1)

  const url = useMemo(
    () =>
      FormUrls.list({
        owner: account.owner,
        p: page,
        pageSize: PAGE_SIZE,
      }),
    [account.owner, page],
  )
  const { data, error, isLoading, mutate } =
    useFetch<ListResponse<FormDefinition>>(url)

  const total = data?.data2 ?? 0
  const rows = data?.data ?? []
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const onAdd = useCallback(async () => {
    const slug = randomSlug()
    const f: FormDefinition = {
      owner: account.owner,
      name: `form_${slug}`,
      createdTime: new Date().toISOString(),
      displayName: `New Form - ${slug}`,
      type: '',
      formItems: [],
    }
    await apiPost(FormUrls.create(), f)
    nav(`/forms/${f.owner}/${f.name}`)
  }, [account.owner, nav])

  const onDelete = useCallback(
    async (item: FormDefinition) => {
      if (!confirm(`Delete form "${item.name}"?`)) return
      await apiDelete(FormUrls.remove(item.owner, item.name))
      await mutate()
    },
    [mutate],
  )

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <Text fontSize="$6" fontWeight="600" color="$color">
          Forms
        </Text>
        <XStack gap="$2" items="center">
          <Text fontSize="$2" color="$placeholderColor">
            {total} in total
          </Text>
          <Button size="$3" onPress={onAdd} icon={Plus}>
            Add
          </Button>
        </XStack>
      </XStack>

      {error ? (
        <Text fontSize="$2" color="#fca5a5">
          Could not load: {error.message}
        </Text>
      ) : null}

      <DataTable<FormDefinition>
        columns={COLUMNS}
        rows={rows}
        rowKey={(r) => `${r.owner}/${r.name}`}
        emptyState={{
          title: isLoading ? 'Loading...' : 'No forms',
          hint: isLoading ? undefined : 'Add a form to get started.',
        }}
        renderRow={(r) => [
          <Anchor
            href={`/forms/${r.owner}/${r.name}`}
            color="#60a5fa"
            textDecorationLine="none"
          >
            {r.name}
          </Anchor>,
          <Text color="$color">{r.displayName}</Text>,
          <Text color="$color">{r.type || '—'}</Text>,
          <Text color="$placeholderColor">
            {r.formItems?.length ?? 0} items
          </Text>,
          <XStack gap="$2">
            <Button
              size="$2"
              onPress={() => nav(`/forms/${r.owner}/${r.name}`)}
              icon={Pencil}
            >
              Edit
            </Button>
            <Button
              size="$2"
              theme="red"
              onPress={() => onDelete(r)}
              icon={Trash2}
            >
              Delete
            </Button>
          </XStack>,
        ]}
      />

      {totalPages > 1 ? (
        <XStack gap="$2" justify="flex-end" items="center">
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
