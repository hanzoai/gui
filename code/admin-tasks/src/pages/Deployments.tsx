// Deployments — worker version series. Upstream renders a table with
// Deployment Name / Build ID / Deployed At / Actions; we mirror it.

import { useParams } from 'react-router-dom'
import { H2, Text, XStack, YStack } from 'hanzogui'
import {
  Badge,
  DataTable,
  ErrorState,
  LoadingState,
  formatTimestamp,
  useFetch,
} from '@hanzo/admin'
import type { Deployment } from '../lib/api'

const COLUMNS = [
  { key: 'series', label: 'Deployment Name', flex: 2 },
  { key: 'buildId', label: 'Build ID', flex: 2 },
  { key: 'state', label: 'State', flex: 1 },
  { key: 'createdAt', label: 'Deployed At', flex: 2 },
]

interface FlatRow {
  key: string
  seriesName: string
  buildId: string
  state: string
  createTime: string
  isDefault: boolean
}

export function DeploymentsPage() {
  const { ns } = useParams()
  const namespace = ns!
  const url = `/v1/tasks/namespaces/${encodeURIComponent(namespace)}/deployments`
  const { data, error, isLoading } = useFetch<{ deployments: Deployment[] }>(url)

  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const deployments = data?.deployments ?? []
  const rows: FlatRow[] = deployments.flatMap((d) =>
    d.buildIds.map((b) => ({
      key: `${d.seriesName}::${b.buildId}`,
      seriesName: d.seriesName,
      buildId: b.buildId,
      state: b.state,
      createTime: b.createTime,
      isDefault: b.buildId === d.defaultBuildId,
    })),
  )

  return (
    <YStack gap="$4">
      <XStack items="baseline" justify="space-between">
        <H2 size="$7" color="$color">
          Deployments{' '}
          <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
            ({deployments.length})
          </Text>
        </H2>
      </XStack>

      <DataTable
        columns={COLUMNS}
        rows={rows}
        rowKey={(r) => r.key}
        renderRow={(r) => [
          <XStack key="name" gap="$2" items="center">
            <Text fontSize="$2" fontWeight="500" color="$color">
              {r.seriesName}
            </Text>
            {r.isDefault ? <Badge variant="success">default</Badge> : null}
          </XStack>,
          <Text
            key="build"
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$2"
            color="$color"
            numberOfLines={1}
          >
            {r.buildId}
          </Text>,
          <Badge
            key="state"
            variant={r.state === 'DEPLOYMENT_STATE_CURRENT' ? 'success' : 'muted'}
          >
            {r.state.replace('DEPLOYMENT_STATE_', '').toLowerCase()}
          </Badge>,
          <Text key="created" fontSize="$2" color="$placeholderColor">
            {r.createTime ? formatTimestamp(new Date(r.createTime)) : '—'}
          </Text>,
        ]}
        emptyState={{
          title: `No worker deployments in ${namespace}`,
          hint: 'Workers register a series + buildId on connect. Routing rules promote a default and ramp new versions.',
        }}
      />
    </YStack>
  )
}
