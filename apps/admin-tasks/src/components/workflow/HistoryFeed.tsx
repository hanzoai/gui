// HistoryFeed — flat chronological list of events. One card per
// event with links to the event detail page.

import { Link } from 'react-router-dom'
import { Card, H4, Text, XStack, YStack } from 'hanzogui'
import { Circle } from '@hanzogui/lucide-icons-2/icons/Circle'
import { Badge, Empty, formatTimestamp } from '@hanzogui/admin'
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

export interface HistoryFeedProps {
  ns: string
  workflowId: string
  runId: string
  events: HistoryEvent[]
}

export function HistoryFeed({ ns, workflowId, runId, events }: HistoryFeedProps) {
  if (events.length === 0) {
    return <Empty title="No events yet" hint="Events will appear once the workflow runs." />
  }
  const qs = runId ? `?runId=${encodeURIComponent(runId)}` : ''
  const baseHref = `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(workflowId)}`

  return (
    <YStack gap="$3" pl="$4" borderLeftWidth={1} borderLeftColor="$borderColor">
      {events.map((ev) => {
        const cat = categorize(ev.eventType)
        const cls = classify(ev.eventType)
        const dot = CATEGORY_COLOR[cat] ?? '#7e8794'
        return (
          <YStack key={ev.eventId} position="relative">
            <YStack
              position="absolute"
              l={-29}
              t={14}
              width={12}
              height={12}
              rounded={9999}
              bg="$background"
              items="center"
              justify="center"
            >
              <Circle size={10} color={dot} fill={dot} />
            </YStack>
            <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
              <YStack gap="$2">
                <XStack items="center" justify="space-between" gap="$3">
                  <XStack items="center" gap="$2" flexWrap="wrap">
                    <Badge variant="muted">#{ev.eventId}</Badge>
                    <Link
                      to={`${baseHref}/events/${encodeURIComponent(ev.eventId)}${qs}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <H4 fontSize="$3" fontWeight="500" color={'#86efac' as never}>
                        {ev.eventType}
                      </H4>
                    </Link>
                    <Badge variant="muted">{cat}</Badge>
                    <Badge variant="muted">{cls}</Badge>
                  </XStack>
                  <Text fontSize="$1" color="$placeholderColor">
                    {ev.eventTime ? formatTimestamp(new Date(ev.eventTime)) : '—'}
                  </Text>
                </XStack>
                {ev.attributes && Object.keys(ev.attributes).length > 0 ? (
                  <YStack
                    bg={'rgba(255,255,255,0.02)' as never}
                    p="$2"
                    rounded="$2"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <Text
                      fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                      fontSize="$1"
                      color="$placeholderColor"
                    >
                      {JSON.stringify(ev.attributes, null, 2)}
                    </Text>
                  </YStack>
                ) : null}
              </YStack>
            </Card>
          </YStack>
        )
      })}
    </YStack>
  )
}
