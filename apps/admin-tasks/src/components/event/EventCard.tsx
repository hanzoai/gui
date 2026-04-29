// EventCard — header for the event drill-down: id, type, time, category
// badge, plus Next/Previous navigation that hops by index in the
// chronological history array.

import { useNavigate } from 'react-router-dom'
import { Button, Card, H3, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { Badge, formatTimestamp } from '@hanzogui/admin'
import { EventTypeIcon, categoryColor } from './EventTypeIcon'
import { categorize, classify } from '../../stores/event-aggregation'
import type { HistoryEvent } from '../../lib/types'

export interface EventCardProps {
  event: HistoryEvent
  ns: string
  workflowId: string
  runId?: string
  prev?: HistoryEvent
  next?: HistoryEvent
  children?: React.ReactNode
}

export function EventCard({ event, ns, workflowId, runId, prev, next, children }: EventCardProps) {
  const navigate = useNavigate()
  const cat = categorize(event.eventType)
  const cls = classify(event.eventType)
  const qs = runId ? `?runId=${encodeURIComponent(runId)}` : ''
  const baseHref = `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(workflowId)}/events`

  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$3">
        <XStack items="center" gap="$3" flexWrap="wrap">
          <EventTypeIcon eventType={event.eventType} size={18} />
          <Badge variant="muted">#{event.eventId}</Badge>
          <H3 fontSize="$5" fontWeight="500" color={categoryColor(event.eventType) as never}>
            {event.eventType}
          </H3>
          <Badge variant="muted">{cat}</Badge>
          <Badge variant="muted">{cls}</Badge>
          <YStack flex={1} />
          <Text fontSize="$1" color="$placeholderColor">
            {event.eventTime ? formatTimestamp(new Date(event.eventTime)) : '—'}
          </Text>
        </XStack>

        <XStack gap="$2" items="center">
          <Button
            size="$2"
            chromeless
            borderWidth={1}
            borderColor="$borderColor"
            disabled={!prev}
            onPress={() => prev && navigate(`${baseHref}/${encodeURIComponent(prev.eventId)}${qs}`)}
            aria-label="Previous event"
          >
            <XStack items="center" gap="$1.5">
              <ChevronLeft size={14} color={prev ? '#cbd5e1' : '#52525b'} />
              <Text fontSize="$2" color={prev ? '$color' : '$placeholderColor'}>
                {prev ? `#${prev.eventId} ${prev.eventType}` : 'No previous'}
              </Text>
            </XStack>
          </Button>
          <Button
            size="$2"
            chromeless
            borderWidth={1}
            borderColor="$borderColor"
            disabled={!next}
            onPress={() => next && navigate(`${baseHref}/${encodeURIComponent(next.eventId)}${qs}`)}
            aria-label="Next event"
          >
            <XStack items="center" gap="$1.5">
              <Text fontSize="$2" color={next ? '$color' : '$placeholderColor'}>
                {next ? `#${next.eventId} ${next.eventType}` : 'No next'}
              </Text>
              <ChevronRight size={14} color={next ? '#cbd5e1' : '#52525b'} />
            </XStack>
          </Button>
        </XStack>

        {children}
      </YStack>
    </Card>
  )
}
