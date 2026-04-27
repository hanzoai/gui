// WebhookList — port of upstream WebhookListPage.

import { useState, type ReactNode } from 'react'
import { Button, H3, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { DataTable } from '../../primitives/DataTable'
import { Loading, ErrorState } from '../../primitives/Empty'
import { useFetch, apiPost, apiDelete } from '../../data/useFetch'
import { formatTimestamp } from '../../data/format'
import type { IamListResponse, Webhook } from './types'

export interface WebhookListProps {
  organizationName?: string
  onOpenWebhook?: (w: Webhook) => void
  onAdded?: (w: Webhook) => void
}

const PAGE_SIZE = 10

export function WebhookList({ organizationName = '', onOpenWebhook, onAdded }: WebhookListProps) {
  const [page, setPage] = useState(1)
  const [busy, setBusy] = useState(false)
  const params = new URLSearchParams({
    p: String(page),
    pageSize: String(PAGE_SIZE),
    organization: organizationName,
  })
  const url = `/v1/iam/webhooks?${params.toString()}`
  const { data, error, isLoading, mutate } = useFetch<IamListResponse<Webhook>>(url)

  if (isLoading) return <Loading label="Loading webhooks" />
  if (error) return <ErrorState error={error} />

  const rows = data?.data ?? []
  const total = data?.data2 ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const addWebhook = async () => {
    setBusy(true)
    try {
      const fresh: Partial<Webhook> = {
        owner: 'admin',
        organization: organizationName,
        url: 'https://example.com/callback',
        method: 'POST',
        contentType: 'application/json',
        headers: [],
        events: ['signup', 'login', 'logout', 'update-user'],
        isEnabled: true,
      }
      const r = await apiPost<{ status: string; data: Webhook }>('/v1/iam/webhooks', fresh)
      await mutate()
      if (r.data) onAdded?.(r.data)
    } finally {
      setBusy(false)
    }
  }

  const deleteWebhook = async (w: Webhook) => {
    if (!window.confirm(`Delete webhook "${w.name}"?`)) return
    setBusy(true)
    try {
      await apiDelete(`/v1/iam/webhooks/${encodeURIComponent(w.owner)}/${encodeURIComponent(w.name)}`)
      if (rows.length === 1 && page > 1) setPage(page - 1)
      await mutate()
    } finally {
      setBusy(false)
    }
  }

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <H3 size="$5" color="$color">
          Webhooks
        </H3>
        <XStack items="center" gap="$3">
          <Text fontSize="$2" color="$placeholderColor">
            {total} in total
          </Text>
          <Button size="$3" disabled={busy} onPress={addWebhook}>
            <Plus size={14} /> Add
          </Button>
        </XStack>
      </XStack>

      <DataTable<Webhook>
        columns={[
          { key: 'name', label: 'Name', flex: 1.2 },
          { key: 'org', label: 'Organization', flex: 1 },
          { key: 'url', label: 'URL', flex: 1.6 },
          { key: 'method', label: 'Method', flex: 0.6 },
          { key: 'events', label: 'Events', flex: 1.4 },
          { key: 'enabled', label: 'Enabled', flex: 0.5 },
          { key: 'createdTime', label: 'Created', flex: 1 },
          { key: 'actions', label: '', flex: 1 },
        ]}
        rows={rows}
        rowKey={(r) => `${r.owner}/${r.name}`}
        emptyState={{
          title: 'No webhooks',
          hint: 'Add a webhook to receive IAM events on an external endpoint.',
        }}
        renderRow={(w) =>
          [
            <Text key="n" onPress={() => onOpenWebhook?.(w)} cursor="pointer" color="#60a5fa">
              {w.name}
            </Text>,
            <Text key="o" color="$color">
              {w.organization}
            </Text>,
            <Text key="u" color="$color" numberOfLines={1}>
              {w.url}
            </Text>,
            <Text key="m" color="$color">
              {w.method}
            </Text>,
            <Text key="e" color="$color" numberOfLines={1}>
              {w.events.join(', ')}
            </Text>,
            <Text key="en" color={w.isEnabled ? '#4ade80' : '$placeholderColor'}>
              {w.isEnabled ? 'ON' : 'OFF'}
            </Text>,
            <Text key="c" fontSize="$1" color="$placeholderColor">
              {formatTimestamp(w.createdTime)}
            </Text>,
            <XStack key="a" gap="$1.5">
              <Button size="$2" variant="outlined" onPress={() => onOpenWebhook?.(w)}>
                <Pencil size={12} />
              </Button>
              <Button size="$2" variant="outlined" disabled={busy} onPress={() => deleteWebhook(w)}>
                <Trash2 size={12} />
              </Button>
            </XStack>,
          ] as ReactNode[]
        }
      />

      {totalPages > 1 && (
        <XStack justify="flex-end" gap="$2" items="center">
          <Button size="$2" variant="outlined" disabled={page <= 1} onPress={() => setPage(page - 1)}>
            <ChevronLeft size={14} />
          </Button>
          <Text fontSize="$2" color="$placeholderColor">
            {page} / {totalPages}
          </Text>
          <Button
            size="$2"
            variant="outlined"
            disabled={page >= totalPages}
            onPress={() => setPage(page + 1)}
          >
            <ChevronRight size={14} />
          </Button>
        </XStack>
      )}
    </YStack>
  )
}
