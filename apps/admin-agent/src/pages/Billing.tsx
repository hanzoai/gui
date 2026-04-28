// Billing — prepaid credit balance for one org plus current-month
// spend. Source of truth is hanzo-commerce; agentd's billing
// service reads it on every execution to enforce the prepaid gate
// (see internal/services/billing).

import { useParams } from 'react-router-dom'
import { XStack } from 'hanzogui'
import {
  Empty,
  ErrorState,
  SummaryCard,
  useFetch,
} from '@hanzogui/admin'
import type { BillingSummary } from '../lib/api'

function formatCents(cents: number, currency: string): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(cents / 100)
}

export function BillingPage() {
  const { org } = useParams()
  const { data, error, isLoading } = useFetch<BillingSummary>(
    org ? `/v1/agents/orgs/${encodeURIComponent(org)}/billing` : null,
  )

  if (!org) return <Empty title="Pick an organization" />
  if (error) return <ErrorState error={error} />
  if (isLoading || !data) return null

  return (
    <XStack gap="$4" flexWrap="wrap">
      <SummaryCard label="Balance" value={formatCents(data.balanceCents, data.currency)} />
      <SummaryCard label="This month" value={formatCents(data.monthSpendCents, data.currency)} />
      {data.monthBudgetCents !== undefined && (
        <SummaryCard label="Budget" value={formatCents(data.monthBudgetCents, data.currency)} />
      )}
    </XStack>
  )
}
