// HistoryCompact — one-line-per-event dense view. Designed for long
// histories where the feed becomes unwieldy.

import { Link } from 'react-router-dom'
import { Text, XStack, YStack } from 'hanzogui'
import { Empty, Badge } from '@hanzogui/admin'
import { categorize, classify } from '../../stores/event-aggregation'
import type { HistoryEvent } from '../../lib/types'

const CATEGORY_COLOR: Record<string, string> = {
  workflow: '#7dd3fc',
  activity: '#86efac',
  timer: '#fcd34d',
  signal: '#c4b5fd',
  marker: '#94a3b8',
  'child-workflow': '#a5b4fc',
  nexus: '#f0abfc',
  update: '#fdba74',
  command: '#cbd5e1',
  other: '#7e8794',
}

export interface HistoryCompactProps {
  ns: string
  workflowId: string
  runId: string
  events: HistoryEvent[]
}

export function HistoryCompact({ ns, workflowId, runId, events }: HistoryCompactProps) {
  if (events.length === 0) {
    return <Empty title="No events yet" hint="Events will appear once the workflow runs." />
  }
  const qs = runId ? `?runId=${encodeURIComponent(runId)}` : ''
  const baseHref = `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(workflowId)}`

  return (
    <YStack borderWidth={1} borderColor="$borderColor" rounded="$2" overflow="hidden">
      {events.map((ev, i) => {
        const cat = categorize(ev.eventType)
        const cls = classify(ev.eventType)
        const dot = CATEGORY_COLOR[cat] ?? '#7e8794'
        return (
          <Link
            key={ev.eventId}
            to={`${baseHref}/events/${encodeURIComponent(ev.eventId)}${qs}`}
            style={{ textDecoration: 'none' }}
          >
            <XStack
              px="$3"
              py="$2"
              gap="$3"
              items="center"
              borderBottomWidth={i === events.length - 1 ? 0 : 1}
              borderBottomColor="$borderColor"
              hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
            >
              <Text fontSize={10} color={dot as never}>●</Text>
              <Text
                width={48}
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$1"
                color="$placeholderColor"
              >
                #{ev.eventId}
              </Text>
              <Text fontSize="$2" color="$color" flex={1} numberOfLines={1}>
                {ev.eventType}
              </Text>
              <Badge variant="muted">{cls}</Badge>
              <Text fontSize="$1" color="$placeholderColor" width={180} text="right">
                {ev.eventTime ? new Date(ev.eventTime).toLocaleTimeString() : '—'}
              </Text>
            </XStack>
          </Link>
        )
      })}
    </YStack>
  )
}
