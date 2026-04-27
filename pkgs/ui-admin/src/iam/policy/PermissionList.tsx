// PermissionList — port of upstream PermissionListPage.
//
// Permissions are the user-facing rule rows: WHO can do WHAT on
// WHICH resources, with what effect. Casdoor's upstream had import/
// export of XLSX templates plus a "submitter / approver" workflow
// for non-admin users — we keep both concepts but drop the XLSX
// path (use the Casbin policy CSV import on Adapters for bulk
// loading; a single .xlsx surface area is unnecessary noise).

import { useMemo, useState } from 'react'
import { Button, H3, Input, Spinner, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { DataTable } from '../../primitives/DataTable'
import { ErrorState } from '../../primitives/Empty'
import { Badge } from '../../primitives/Badge'
import { useFetch, apiDelete } from '../../data/useFetch'
import type {
  IamListResponse,
  Permission,
  PermissionEffect,
  PermissionState,
} from './types'

export interface PermissionListProps {
  // The owner (organization) to filter by. Empty string queries
  // across all orgs (admin only). Match upstream Setting.getRequestOrganization.
  owner: string
  // Edit/Add navigation. Receives owner + name; callers route.
  onEdit: (owner: string, name: string) => void
  onAdd: () => void
  // Optional fetcher seam for tests.
  fetcher?: (url: string) => Promise<unknown>
}

const PAGE_SIZE = 10

export function PermissionList({ owner, onEdit, onAdd, fetcher }: PermissionListProps) {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const url = useMemo(() => {
    const params = new URLSearchParams({
      owner,
      p: String(page),
      pageSize: String(PAGE_SIZE),
    })
    if (query.trim().length > 0) params.set('field', 'name'), params.set('value', query.trim())
    return `/v1/iam/permissions?${params.toString()}`
  }, [owner, page, query])

  const { data, error, isLoading, mutate } = useFetch<IamListResponse<Permission>>(url, {
    fetcher,
  })

  const rows = data?.data ?? []
  const total = data?.data2 ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  async function handleDelete(p: Permission) {
    if (!window.confirm(`Delete permission "${p.name}"?`)) return
    try {
      await apiDelete(`/v1/iam/permissions/${encodeURIComponent(p.owner)}/${encodeURIComponent(p.name)}`)
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
          Permissions
        </H3>
        <XStack gap="$2" items="center">
          <Text fontSize="$2" color="$placeholderColor">
            {total} in total
          </Text>
          <Input
            placeholder="Filter by name"
            value={query}
            onChangeText={(v: string) => {
              setQuery(v)
              setPage(1)
            }}
            width={220}
            size="$3"
          />
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
        <DataTable<Permission>
          columns={[
            { key: 'name', label: 'Name', flex: 1.2 },
            { key: 'owner', label: 'Organization', flex: 1 },
            { key: 'displayName', label: 'Display name', flex: 1.2 },
            { key: 'resourceType', label: 'Type', flex: 0.8 },
            { key: 'resources', label: 'Resources', flex: 1.4 },
            { key: 'actions', label: 'Actions', flex: 1 },
            { key: 'effect', label: 'Effect', flex: 0.7 },
            { key: 'enabled', label: 'On', flex: 0.5 },
            { key: 'state', label: 'State', flex: 0.8 },
            { key: 'rowActions', label: '', flex: 1 },
          ]}
          rows={rows}
          rowKey={(r) => `${r.owner}/${r.name}`}
          emptyState={{ title: 'No permissions', hint: 'Click Add to create one.' }}
          renderRow={(p) => [
            <Text key="name" fontSize="$2" color="$color">
              {p.name}
            </Text>,
            <Text key="owner" fontSize="$2" color="$placeholderColor">
              {p.owner}
            </Text>,
            <Text key="display" fontSize="$2" color="$color">
              {p.displayName}
            </Text>,
            <Text key="rt" fontSize="$2" color="$color">
              {p.resourceType}
            </Text>,
            <ChipList key="rsrc" items={p.resources} />,
            <ChipList key="act" items={p.actions} />,
            <Badge variant={effectVariant(p.effect)}>{p.effect}</Badge>,
            <Badge variant={p.isEnabled ? 'success' : 'muted'}>
              {p.isEnabled ? 'ON' : 'OFF'}
            </Badge>,
            <Badge variant={stateVariant(p.state)}>{p.state}</Badge>,
            <XStack key="row-actions" gap="$2">
              <Button
                size="$2"
                onPress={() => onEdit(p.owner, p.name)}
                icon={Pencil}
              >
                Edit
              </Button>
              <Button
                size="$2"
                theme={'red' as never}
                onPress={() => handleDelete(p)}
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

function effectVariant(e: PermissionEffect) {
  return e === 'Allow' ? ('success' as const) : ('destructive' as const)
}

function stateVariant(s: PermissionState) {
  return s === 'Approved' ? ('success' as const) : ('warning' as const)
}

function ChipList({ items }: { items: string[] }) {
  if (!items || items.length === 0)
    return (
      <Text fontSize="$2" color="$placeholderColor">
        —
      </Text>
    )
  return (
    <XStack gap="$1" flexWrap={'wrap' as never}>
      {items.slice(0, 3).map((it) => (
        <Badge key={it} variant="muted">
          {it}
        </Badge>
      ))}
      {items.length > 3 ? (
        <Text fontSize="$1" color="$placeholderColor">
          +{items.length - 3}
        </Text>
      ) : null}
    </XStack>
  )
}
