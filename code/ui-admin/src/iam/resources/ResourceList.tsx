// Resource list — uploaded files attached to the active org/user.
// Upstream is `ResourceListPage.tsx` (Ant Design react table). The
// admin can upload from the toolbar, copy the public URL, or delete
// the row. There is no edit page: resources are immutable once
// uploaded; only the metadata they carry around is.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Anchor, Button, Text, XStack, YStack } from 'hanzogui'
import { Upload } from '@hanzogui/lucide-icons-2/icons/Upload'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { Copy } from '@hanzogui/lucide-icons-2/icons/Copy'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import {
  DataTable,
  type DataTableColumn,
} from '../../primitives/DataTable'
import { apiDelete, useFetch } from '../../data/useFetch'
import { formatTimestamp } from '../../data/format'
import { ResourceUrls, type ListResponse, type ResourceItem } from './api'
import {
  isAdminAccount,
  requestOrg,
  type AdminAccount,
} from './types'

const PAGE_SIZE = 10

const COLUMNS: DataTableColumn[] = [
  { key: 'provider', label: 'Provider', flex: 1 },
  { key: 'org', label: 'Organization', flex: 1 },
  { key: 'user', label: 'User', flex: 1 },
  { key: 'name', label: 'Name', flex: 2 },
  { key: 'createdTime', label: 'Created', flex: 2 },
  { key: 'fileType', label: 'Type', flex: 1 },
  { key: 'fileSize', label: 'Size', flex: 1 },
  { key: 'url', label: 'URL', flex: 1 },
  { key: 'op', label: '', flex: 1 },
]

// Friendly file size — human-readable suffix at the boundary, never
// fewer than one decimal so "0.9 KB" stays distinguishable from "0 KB".
function friendlySize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export interface ResourceListProps {
  account: AdminAccount
}

export function ResourceList({ account }: ResourceListProps) {
  const [page, setPage] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const url = useMemo(
    () =>
      ResourceUrls.list({
        owner: requestOrg(account),
        p: page,
        pageSize: PAGE_SIZE,
      }),
    [account, page],
  )

  const { data, error, isLoading, mutate } =
    useFetch<ListResponse<ResourceItem>>(url)

  const total = data?.data2 ?? 0
  const rows = data?.data ?? []
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const isUnauthorized =
    data?.status === 'error' &&
    typeof data?.msg === 'string' &&
    data.msg.toLowerCase().includes('login')

  const onUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)
      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch(
          ResourceUrls.upload(account.owner, account.name),
          { method: 'POST', body: fd },
        )
        if (!res.ok) throw new Error(`upload failed: ${res.status}`)
        await mutate()
      } finally {
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    },
    [account, mutate],
  )

  const onDelete = useCallback(
    async (item: ResourceItem) => {
      if (
        !confirm(`Delete resource "${item.name}"? This cannot be undone.`)
      )
        return
      await apiDelete(ResourceUrls.remove(item))
      await mutate()
    },
    [mutate],
  )

  const onCopy = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopyError(null)
    } catch (e) {
      setCopyError(e instanceof Error ? e.message : 'copy failed')
    }
  }, [])

  // Force a refetch when the page changes — useFetch already does this
  // because the URL is keyed by page, but the empty-state text needs a
  // first render before data arrives.
  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  if (isUnauthorized) {
    return (
      <YStack p="$8" items="center" gap="$3">
        <Text fontSize="$7" fontWeight="600" color="$color">
          403 Unauthorized
        </Text>
        <Anchor href="/" textDecorationLine="none">
          <Button>Back home</Button>
        </Anchor>
      </YStack>
    )
  }

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <Text fontSize="$6" fontWeight="600" color="$color">
          Resources
        </Text>
        <XStack gap="$2" items="center">
          <Text fontSize="$2" color="$placeholderColor">
            {total} in total
          </Text>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={onUpload}
          />
          <Button
            size="$3"
            disabled={uploading}
            onPress={() => fileInputRef.current?.click()}
            icon={Upload}
          >
            {uploading ? 'Uploading...' : 'Upload a file...'}
          </Button>
        </XStack>
      </XStack>

      {error ? (
        <YStack p="$4" bg="$background" borderColor="#7f1d1d" borderWidth={1}>
          <Text color="#fca5a5">Could not load: {error.message}</Text>
        </YStack>
      ) : null}

      {copyError ? (
        <Text fontSize="$1" color="#fca5a5">
          Copy failed: {copyError}
        </Text>
      ) : null}

      <DataTable<ResourceItem>
        columns={COLUMNS}
        rows={rows}
        rowKey={(r) => `${r.owner}/${r.name}`}
        emptyState={{
          title: isLoading ? 'Loading...' : 'No resources',
          hint: isLoading ? undefined : 'Upload a file to get started.',
        }}
        renderRow={(r) => [
          <Text color="$color">{r.provider}</Text>,
          <Text color="$color">{r.owner}</Text>,
          <Text color="$color">{r.user}</Text>,
          <Text color="$color">{r.name}</Text>,
          <Text fontSize="$1" color="$placeholderColor">
            {formatTimestamp(new Date(r.createdTime))}
          </Text>,
          <Text color="$color">{r.fileType}</Text>,
          <Text color="$color">{friendlySize(r.fileSize)}</Text>,
          <Button size="$2" onPress={() => onCopy(r.url)} icon={Copy}>
            Copy
          </Button>,
          <Button
            size="$2"
            theme="red"
            onPress={() => onDelete(r)}
            icon={Trash2}
            disabled={!isAdminAccount(account)}
          >
            Delete
          </Button>,
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
