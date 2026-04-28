// Billing — prepaid credit balance for one org plus current-month
// spend. Source of truth is hanzo-commerce; agentd's billing
// service reads it on every execution to enforce the prepaid gate
// (see internal/services/billing).

import { useParams } from 'react-router-dom'
import { EmptyState, ErrorBanner, MetricCard, useFetch } from '@hanzogui/admin'
import type { BillingSummary } from '../lib/api'

function formatCents(cents: number, currency: string): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(cents / 100)
}

export function BillingPage() {
  const { org } = useParams()
  const { data, error, isLoading } = useFetch<BillingSummary>(
    org ? `/v1/agents/orgs/${encodeURIComponent(org)}/billing` : null,
  )

  if (!org) return <EmptyState title="Pick an organization" />
  if (error) return <ErrorBanner error={error} />
  if (isLoading || !data) return null

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <MetricCard label="Balance" value={formatCents(data.balanceCents, data.currency)} />
      <MetricCard label="This month" value={formatCents(data.monthSpendCents, data.currency)} />
      {data.monthBudgetCents !== undefined && (
        <MetricCard label="Budget" value={formatCents(data.monthBudgetCents, data.currency)} />
      )}
    </div>
  )
}
