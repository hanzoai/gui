// RecentRunsTable — last N triggered actions for a schedule. Each
// row links to the started workflow's detail page when a workflowId
// is present on the action.

import { Link } from 'react-router-dom'
import { Text, XStack, YStack } from 'hanzogui'
import { formatTimestamp } from '../../lib/format'

export interface RecentRunRow {
  scheduleTime: string
  actualTime?: string
  workflowId?: string
  runId?: string
  status?: string
}

export interface RecentRunsTableProps {
  namespace: string
  rows: RecentRunRow[]
  limit?: number
}

export function RecentRunsTable({ namespace, rows, limit = 20 }: RecentRunsTableProps) {
  const slice = rows.slice(0, limit)
  if (slice.length === 0) {
    return (
      <Text fontSize="$2" color="$placeholderColor">
        No recent runs.
      </Text>
    )
  }
  return (
    <YStack gap="$1">
      <XStack gap="$3" py="$1" borderBottomWidth={1} borderBottomColor="$borderColor">
        <HeaderCell flex={2}>Scheduled</HeaderCell>
        <HeaderCell flex={2}>Actual</HeaderCell>
        <HeaderCell flex={3}>Workflow</HeaderCell>
        <HeaderCell flex={1}>Status</HeaderCell>
      </XStack>
      {slice.map((r, i) => {
        const wfHref = r.workflowId
          ? `/namespaces/${encodeURIComponent(namespace)}/workflows/${encodeURIComponent(r.workflowId)}${
              r.runId ? `/${encodeURIComponent(r.runId)}` : ''
            }`
          : null
        return (
          <XStack
            key={`${r.scheduleTime}-${i}`}
            gap="$3"
            py="$1.5"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
          >
            <Cell flex={2}>{formatTimestamp(new Date(r.scheduleTime))}</Cell>
            <Cell flex={2}>{r.actualTime ? formatTimestamp(new Date(r.actualTime)) : '—'}</Cell>
            <YStack flex={3} justify="center">
              {wfHref ? (
                <Link to={wfHref} style={{ textDecoration: 'none' }}>
                  <Text
                    fontSize="$1"
                    color="$color"
                    fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                    numberOfLines={1}
                    hoverStyle={{ color: '#f2f2f2' as never }}
                  >
                    {r.workflowId}
                  </Text>
                </Link>
              ) : (
                <Text fontSize="$1" color="$placeholderColor">
                  —
                </Text>
              )}
            </YStack>
            <Cell flex={1}>{r.status ?? '—'}</Cell>
          </XStack>
        )
      })}
    </YStack>
  )
}

function HeaderCell({ children, flex }: { children: React.ReactNode; flex: number }) {
  return (
    <YStack flex={flex} justify="center">
      <Text fontSize="$1" color="$placeholderColor" fontWeight="500">
        {children}
      </Text>
    </YStack>
  )
}

function Cell({ children, flex }: { children: React.ReactNode; flex: number }) {
  return (
    <YStack flex={flex} justify="center">
      <Text fontSize="$1" color="$color" numberOfLines={1}>
        {children}
      </Text>
    </YStack>
  )
}
