// Bot status overview — health snapshot + activity counters.

import { Card, H2, Paragraph, XStack, YStack } from 'hanzogui'
import { Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import type { HealthSnapshot, StatusSummary } from '../lib/api'

interface OverviewData {
  health: HealthSnapshot
  summary: StatusSummary
}

export function OverviewPage() {
  const { data, error, isLoading } = useFetch<OverviewData>('/v1/bot/overview')
  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  if (!data) return <Empty title="No status" hint="The bot gateway hasn't reported yet." />

  return (
    <YStack gap="$4">
      <H2 size="$7" color="$color">Overview</H2>
      <XStack gap="$3" flexWrap="wrap">
        <StatCard label="Status" value={data.health.status} />
        <StatCard label="Uptime" value={formatUptime(data.health.uptimeMs)} />
        <StatCard label="Channels" value={data.summary.channelsActive} />
        <StatCard label="Agents" value={data.summary.agentsActive} />
        <StatCard label="Sessions" value={data.summary.sessionsOpen} />
      </XStack>
    </YStack>
  )
}

function StatCard({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <Card minWidth={180} p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <Paragraph fontSize="$2" color="$placeholderColor">{label}</Paragraph>
      <Paragraph fontSize="$8" fontWeight="700" color="$color">
        {value ?? '—'}
      </Paragraph>
    </Card>
  )
}

function formatUptime(ms: number | undefined): string {
  if (!ms) return '—'
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ${m % 60}m`
  const d = Math.floor(h / 24)
  return `${d}d ${h % 24}h`
}
