// Observability — webhook destinations agentd forwards execution
// events to. Backed by /v1/agents/observability/webhooks (see
// internal/services/observability_forwarder).

import { DataTable, ErrorBanner, useFetch } from '@hanzogui/admin'
import type { ObservabilityWebhook } from '../lib/api'

export function ObservabilityPage() {
  const { data, error, isLoading } = useFetch<{ webhooks: ObservabilityWebhook[] }>(
    '/v1/agents/observability/webhooks',
  )

  if (error) return <ErrorBanner error={error} />
  if (isLoading) return null
  const rows = data?.webhooks ?? []

  return (
    <DataTable
      title="Observability webhooks"
      rows={rows}
      columns={[
        { header: 'URL', render: (w) => w.url },
        { header: 'Active', render: (w) => (w.active ? 'yes' : 'no') },
        { header: 'Last delivery', render: (w) => w.lastDelivery ?? '—' },
      ]}
    />
  )
}
