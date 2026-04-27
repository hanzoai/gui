// Server list — registered MCP servers. Each server is owned by an
// org, bound to one IAM application, and exposes its tool list at
// `/api/server/<owner>/<name>`.

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
import { formatTimestamp } from '../../data/format'
import {
  ServerUrls,
  type ListResponse,
  type ServerItem,
} from './api'
import { type AdminAccount, requestOrg } from './types'

const PAGE_SIZE = 10

const COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'Name', flex: 1.2 },
  { key: 'owner', label: 'Org', flex: 1 },
  { key: 'createdTime', label: 'Created', flex: 1.5 },
  { key: 'displayName', label: 'Display name', flex: 1.5 },
  { key: 'url', label: 'URL', flex: 1.5 },
  { key: 'application', label: 'App', flex: 1 },
  { key: 'op', label: '', flex: 1.5 },
]

function randomSlug(): string {
  return Math.random().toString(36).slice(2, 10)
}

// Truncate long URLs for the list cell so a 500-char gateway URL
// doesn't blow out the row layout. The full URL is in the title attr.
function shortText(s: string, len: number): string {
  if (!s) return ''
  return s.length <= len ? s : `${s.slice(0, len - 1)}…`
}

export interface ServerListProps {
  account: AdminAccount
}

export function ServerList({ account }: ServerListProps) {
  const nav = useNavigate()
  const [page, setPage] = useState(1)

  const url = useMemo(
    () =>
      ServerUrls.list({
        owner: requestOrg(account),
        p: page,
        pageSize: PAGE_SIZE,
      }),
    [account, page],
  )
  const { data, error, isLoading, mutate } =
    useFetch<ListResponse<ServerItem>>(url)
  const total = data?.data2 ?? 0
  const rows = data?.data ?? []
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const onAdd = useCallback(async () => {
    const slug = randomSlug()
    const owner = requestOrg(account) || 'admin'
    const s: ServerItem = {
      owner,
      name: `server_${slug}`,
      createdTime: new Date().toISOString(),
      displayName: `New Server - ${slug}`,
      url: '',
      application: '',
    }
    await apiPost(ServerUrls.create(), s)
    nav(`/servers/${s.owner}/${s.name}`)
  }, [account, nav])

  const onDelete = useCallback(
    async (item: ServerItem) => {
      if (!confirm(`Delete server "${item.name}"?`)) return
      await apiDelete(ServerUrls.remove(item.owner, item.name))
      await mutate()
    },
    [mutate],
  )

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <Text fontSize="$6" fontWeight="600" color="$color">
          MCP Servers
        </Text>
        <Button size="$3" onPress={onAdd} icon={Plus}>
          Add
        </Button>
      </XStack>

      {error ? (
        <Text fontSize="$2" color="#fca5a5">
          Could not load: {error.message}
        </Text>
      ) : null}

      <DataTable<ServerItem>
        columns={COLUMNS}
        rows={rows}
        rowKey={(r) => `${r.owner}/${r.name}`}
        emptyState={{
          title: isLoading ? 'Loading...' : 'No MCP servers',
          hint: isLoading ? undefined : 'Register a server to get started.',
        }}
        renderRow={(r) => [
          <Anchor
            href={`/servers/${r.owner}/${r.name}`}
            color="#60a5fa"
            textDecorationLine="none"
          >
            {r.name}
          </Anchor>,
          <Text color="$color">{r.owner}</Text>,
          <Text fontSize="$1" color="$placeholderColor">
            {formatTimestamp(new Date(r.createdTime))}
          </Text>,
          <Text color="$color">{r.displayName}</Text>,
          r.url ? (
            <Anchor
              href={r.url}
              target="_blank"
              rel="noreferrer"
              color="#60a5fa"
              textDecorationLine="none"
            >
              {shortText(r.url, 40)}
            </Anchor>
          ) : (
            <Text color="$placeholderColor">—</Text>
          ),
          <Text color="$color">{r.application || '—'}</Text>,
          <XStack gap="$2">
            <Button
              size="$2"
              onPress={() => nav(`/servers/${r.owner}/${r.name}`)}
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
