// HistoryStrip — horizontal bar chart of workflow events. Each event
// becomes a small colored bar; clicking jumps to that event in the
// History tab. Native engine emits a synthetic timeline today
// (start + signals + terminal), so the strip is short — but the layout
// scales to a real history when the engine ships per-event durability.

import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Text, XStack, YStack } from 'hanzogui'
import { Empty, useFetch } from '@hanzo/admin'

interface HistoryEvent {
  eventId: string
  eventType: string
  eventTime?: string
}

interface HistoryResp {
  events?: HistoryEvent[]
}

// Hex color per event family. Falls through to a neutral muted bar
// for unknown types so unfamiliar events still render without coloring
// them as success or failure.
function colorFor(eventType: string): string {
  const t = eventType.toLowerCase()
  if (t.includes('failed') || t.includes('timedout')) return '#fca5a5'
  if (t.includes('canceled') || t.includes('terminated')) return '#fcd34d'
  if (t.includes('completed')) return '#86efac'
  if (t.includes('started')) return '#7dd3fc'
  if (t.includes('signaled')) return '#c4b5fd'
  if (t.includes('scheduled')) return '#94a3b8'
  return '#7e8794'
}

function shortName(eventType: string): string {
  return eventType
    .replace(/^EVENT_TYPE_/, '')
    .replace(/_/g, ' ')
    .toLowerCase()
}

export function HistoryStrip({
  ns,
  workflowId,
  runId,
}: {
  ns: string
  workflowId: string
  runId: string
}) {
  const [sp] = useSearchParams()
  const qs = sp.toString() ? `?${sp.toString()}` : ''
  const url = `/v1/tasks/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(workflowId)}/history${runId ? `?runId=${encodeURIComponent(runId)}` : ''}`
  const { data, error, isLoading } = useFetch<HistoryResp>(url)

  const events = useMemo(() => data?.events ?? [], [data])

  if (error || isLoading) return null
  if (events.length === 0) {
    return (
      <Empty title="No history events" hint="Events appear as the workflow records start, signals, and terminal transitions." />
    )
  }

  const baseHref = `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(workflowId)}`

  return (
    <YStack gap="$2">
      <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
        EVENT TIMELINE
      </Text>
      <XStack gap={2} items="stretch" height={36} flexWrap="nowrap">
        {events.map((ev) => (
          <Link
            key={ev.eventId}
            to={`${baseHref}/events/${encodeURIComponent(ev.eventId)}${qs}`}
            style={{ textDecoration: 'none', flex: 1, minWidth: 8 }}
            title={`#${ev.eventId} ${shortName(ev.eventType)}${ev.eventTime ? ' · ' + new Date(ev.eventTime).toLocaleString() : ''}`}
          >
            <YStack
              flex={1}
              height={36}
              bg={colorFor(ev.eventType) as never}
              rounded="$1"
              opacity={0.85}
              hoverStyle={{ opacity: 1 }}
            />
          </Link>
        ))}
      </XStack>
      <XStack justify="space-between" gap="$2">
        <Text fontSize="$1" color="$placeholderColor">
          {events.length} event{events.length === 1 ? '' : 's'}
        </Text>
        <Text fontSize="$1" color="$placeholderColor">
          {events[0]?.eventTime ? new Date(events[0].eventTime).toLocaleTimeString() : ''}
          {events[events.length - 1]?.eventTime
            ? ' → ' + new Date(events[events.length - 1].eventTime!).toLocaleTimeString()
            : ''}
        </Text>
      </XStack>
    </YStack>
  )
}
