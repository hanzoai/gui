// Observability — webhook destinations agentd forwards execution
// events to. Backed by /v1/agents/observability/webhooks (see
// internal/services/observability_forwarder).

import type { ReactNode } from 'react'
import { Text } from 'hanzogui'
import {
  DataTable,
  ErrorState,
  useFetch,
  type DataTableColumn,
} from '@hanzogui/admin'
import type { ObservabilityWebhook } from '../lib/api'

const COLUMNS: DataTableColumn[] = [
  { key: 'url', label: 'URL', flex: 2 },
  { key: 'active', label: 'Active', flex: 0.6 },
  { key: 'last', label: 'Last delivery', flex: 1 },
]

export function ObservabilityPage() {
  const { data, error, isLoading } = useFetch<{ webhooks: ObservabilityWebhook[] }>(
    '/v1/agents/observability/webhooks',
  )

  if (error) return <ErrorState error={error} />
  if (isLoading) return null
  const rows = data?.webhooks ?? []

  const renderRow = (w: ObservabilityWebhook): ReactNode[] => [
    <Text key="url">{w.url}</Text>,
    <Text key="active">{w.active ? 'yes' : 'no'}</Text>,
    <Text key="last">{w.lastDelivery ?? '—'}</Text>,
  ]

  return (
    <DataTable
      columns={COLUMNS}
      rows={rows}
      renderRow={renderRow}
      rowKey={(w) => w.url}
    emptyState={{ title: 'No webhooks', hint: 'Add a webhook to forward execution events.' }}
    />
  )
}
