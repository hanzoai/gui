// Ticket list — support tickets keyed by user. Admins see and act on
// every org's tickets; regular users only see their own. Server-side
// enforcement is the source of truth for visibility — this UI just
// gates the destructive Delete button on isAdmin.

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
import { Badge } from '../../primitives/Badge'
import { apiDelete, apiPost, useFetch } from '../../data/useFetch'
import { formatTimestamp } from '../../data/format'
import {
  TicketUrls,
  type ListResponse,
  type TicketItem,
} from './api'
import {
  isAdminAccount,
  requestOrg,
  type AdminAccount,
  type TicketState,
} from './types'

const PAGE_SIZE = 10

const COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'Name', flex: 1.2 },
  { key: 'createdTime', label: 'Created', flex: 1.5 },
  { key: 'displayName', label: 'Display name', flex: 1.5 },
  { key: 'title', label: 'Title', flex: 2 },
  { key: 'user', label: 'User', flex: 1 },
  { key: 'state', label: 'State', flex: 1 },
  { key: 'op', label: '', flex: 1.5 },
]

function stateVariant(s: TicketState) {
  switch (s) {
    case 'Open':
      return 'info' as const
    case 'In Progress':
      return 'warning' as const
    case 'Resolved':
      return 'success' as const
    case 'Closed':
    default:
      return 'muted' as const
  }
}

function randomSlug(): string {
  return Math.random().toString(36).slice(2, 10)
}

export interface TicketListProps {
  account: AdminAccount
}

export function TicketList({ account }: TicketListProps) {
  const nav = useNavigate()
  const [page, setPage] = useState(1)

  const url = useMemo(
    () =>
      TicketUrls.list({
        owner: requestOrg(account),
        p: page,
        pageSize: PAGE_SIZE,
      }),
    [account, page],
  )

  const { data, error, isLoading, mutate } =
    useFetch<ListResponse<TicketItem>>(url)
  const total = data?.data2 ?? 0
  const rows = data?.data ?? []
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const isUnauthorized =
    data?.status === 'error' &&
    typeof data?.msg === 'string' &&
    data.msg.toLowerCase().includes('login')

  const onAdd = useCallback(async () => {
    const slug = randomSlug()
    const owner = requestOrg(account) || 'admin'
    const now = new Date().toISOString()
    const t: TicketItem = {
      owner,
      name: `ticket_${slug}`,
      createdTime: now,
      updatedTime: now,
      displayName: `New Ticket - ${slug}`,
      user: account.name,
      title: '',
      content: '',
      state: 'Open',
      messages: [],
    }
    await apiPost(TicketUrls.create(), t)
    nav(`/tickets/${t.owner}/${t.name}`)
  }, [account, nav])

  const onDelete = useCallback(
    async (item: TicketItem) => {
      if (!confirm(`Delete ticket "${item.name}"?`)) return
      await apiDelete(TicketUrls.remove(item.owner, item.name))
      await mutate()
    },
    [mutate],
  )

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
          Tickets
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

      <DataTable<TicketItem>
        columns={COLUMNS}
        rows={rows}
        rowKey={(r) => `${r.owner}/${r.name}`}
        emptyState={{
          title: isLoading ? 'Loading...' : 'No tickets',
          hint: isLoading ? undefined : 'Open a ticket to get started.',
        }}
        renderRow={(r) => [
          <Anchor
            href={`/tickets/${r.owner}/${r.name}`}
            color="#60a5fa"
            textDecorationLine="none"
          >
            {r.name}
          </Anchor>,
          <Text fontSize="$1" color="$placeholderColor">
            {formatTimestamp(new Date(r.createdTime))}
          </Text>,
          <Text color="$color">{r.displayName}</Text>,
          <Text color="$color">{r.title}</Text>,
          <Text color="$color">{r.user}</Text>,
          <Badge variant={stateVariant(r.state)}>{r.state}</Badge>,
          <XStack gap="$2">
            <Button
              size="$2"
              icon={Pencil}
              onPress={() => nav(`/tickets/${r.owner}/${r.name}`)}
            >
              Edit
            </Button>
            {isAdminAccount(account) ? (
              <Button
                size="$2"
                theme="red"
                icon={Trash2}
                onPress={() => onDelete(r)}
              >
                Delete
              </Button>
            ) : null}
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
