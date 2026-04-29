// HistoryTree — collapsible tree of EventGroups. Each group is the
// initiating event plus its follow-ons (Activity Scheduled→Started→
// Completed merged into one row). Activities with multiple attempts
// surface a "× N retries" badge; expanding the group shows every
// constituent event in chronological order.
//
// Iconography mirrors event categories so a glance differentiates
// activity vs timer vs child-workflow vs signal vs marker.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Text, XStack, YStack } from 'hanzogui'
import { Activity } from '@hanzogui/lucide-icons-2/icons/Activity'
import { Bell } from '@hanzogui/lucide-icons-2/icons/Bell'
import { Bookmark } from '@hanzogui/lucide-icons-2/icons/Bookmark'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { Clock } from '@hanzogui/lucide-icons-2/icons/Clock'
import { Cog } from '@hanzogui/lucide-icons-2/icons/Cog'
import { GitBranch } from '@hanzogui/lucide-icons-2/icons/GitBranch'
import { Layers } from '@hanzogui/lucide-icons-2/icons/Layers'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import { Send } from '@hanzogui/lucide-icons-2/icons/Send'
import { Badge, Empty, formatTimestamp } from '@hanzogui/admin'
import { groupEvents, type AggregatedHistory } from '../../stores/event-aggregation'
import { formatDuration } from '../../lib/format'
import type {
  EventGroup,
  EventTypeCategory,
  HistoryEvent,
  PendingActivity,
  PendingNexusOperation,
} from '../../lib/types'

const CATEGORY_ICON: Record<EventTypeCategory, typeof Activity> = {
  workflow: Cog,
  activity: Activity,
  timer: Clock,
  signal: Bell,
  marker: Bookmark,
  'child-workflow': GitBranch,
  nexus: Send,
  update: RefreshCw,
  command: Layers,
  other: Layers,
}

const CATEGORY_COLOR: Record<EventTypeCategory, string> = {
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

export interface HistoryTreeProps {
  ns: string
  workflowId: string
  runId: string
  events: HistoryEvent[]
  pendingActivities?: PendingActivity[]
  pendingNexus?: PendingNexusOperation[]
}

export function HistoryTree({
  ns,
  workflowId,
  runId,
  events,
  pendingActivities,
  pendingNexus,
}: HistoryTreeProps) {
  const aggregated = groupEvents(events, pendingActivities ?? [], pendingNexus ?? [])

  if (aggregated.groups.length === 0) {
    return <Empty title="No events yet" hint="Events will appear once the workflow runs." />
  }

  return (
    <YStack gap="$2">
      {aggregated.groups.map((g) => (
        <GroupRow key={g.id} group={g} ns={ns} workflowId={workflowId} runId={runId} />
      ))}
      <FooterCounts aggregated={aggregated} />
    </YStack>
  )
}

function GroupRow({
  group,
  ns,
  workflowId,
  runId,
}: {
  group: EventGroup
  ns: string
  workflowId: string
  runId: string
}) {
  const [open, setOpen] = useState(false)
  const Icon = CATEGORY_ICON[group.category] ?? Layers
  const color = CATEGORY_COLOR[group.category]
  const qs = runId ? `?runId=${encodeURIComponent(runId)}` : ''
  const baseHref = `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(workflowId)}`

  // Retries: count "Started" events under the group beyond the first.
  // Activity retries surface as repeated ActivityTaskStarted events
  // attached to the same scheduledEventId.
  const startedCount = group.events.filter((e) =>
    /Started$|STARTED$/.test(e.eventType),
  ).length
  const retries = Math.max(0, startedCount - 1)
  const duration = group.startTime && group.endTime
    ? new Date(group.endTime).getTime() - new Date(group.startTime).getTime()
    : null

  return (
    <Card bg="$background" borderColor="$borderColor" borderWidth={1} overflow="hidden">
      <XStack
        px="$3"
        py="$2.5"
        items="center"
        gap="$3"
        cursor={'pointer' as never}
        hoverStyle={{ background: 'rgba(255,255,255,0.03)' as never }}
        onPress={() => setOpen((o) => !o)}
      >
        {open ? <ChevronDown size={14} color="#7e8794" /> : <ChevronRight size={14} color="#7e8794" />}
        <Icon size={14} color={color} />
        <Badge variant="muted">#{group.id}</Badge>
        <Link
          to={`${baseHref}/events/${encodeURIComponent(group.id)}${qs}`}
          style={{ textDecoration: 'none' }}
        >
          <Text fontSize="$2" color={'#86efac' as never}>
            {group.name}
          </Text>
        </Link>
        <Badge variant="muted">{group.classification}</Badge>
        {retries > 0 ? (
          <Badge variant="warning">× {retries} retries</Badge>
        ) : null}
        {group.isPending ? <Badge variant="info">pending</Badge> : null}
        <YStack flex={1} />
        {duration !== null ? (
          <Text fontSize="$1" color="$placeholderColor">
            {formatDuration(duration)}
          </Text>
        ) : null}
        <Text fontSize="$1" color="$placeholderColor">
          {group.timestamp ? formatTimestamp(new Date(group.timestamp)) : '—'}
        </Text>
      </XStack>
      {open ? (
        <YStack
          borderTopWidth={1}
          borderTopColor="$borderColor"
          bg={'rgba(255,255,255,0.02)' as never}
          p="$3"
          gap="$2"
        >
          {group.events.map((ev) => (
            <XStack key={ev.eventId} gap="$3" items="center">
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
              <Text fontSize="$1" color="$placeholderColor" width={180} text="right">
                {ev.eventTime ? formatTimestamp(new Date(ev.eventTime)) : '—'}
              </Text>
            </XStack>
          ))}
          {group.events.some((e) => e.attributes && Object.keys(e.attributes).length) ? (
            <Card
              p="$2"
              bg={'rgba(0,0,0,0.25)' as never}
              borderColor="$borderColor"
              borderWidth={1}
              mt="$2"
            >
              <Text
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$1"
                color="$placeholderColor"
              >
                {JSON.stringify(group.initialEvent.attributes ?? {}, null, 2)}
              </Text>
            </Card>
          ) : null}
        </YStack>
      ) : null}
    </Card>
  )
}

function FooterCounts({ aggregated }: { aggregated: AggregatedHistory }) {
  const counts = aggregated.groups.reduce<Record<string, number>>((acc, g) => {
    acc[g.category] = (acc[g.category] ?? 0) + 1
    return acc
  }, {})
  const entries = Object.entries(counts)
  if (entries.length === 0) return null
  return (
    <XStack mt="$2" gap="$2" flexWrap="wrap">
      {entries.map(([cat, n]) => (
        <Badge key={cat} variant="muted">
          {cat}: {n}
        </Badge>
      ))}
      <Badge variant="muted">total events: {aggregated.flat.length}</Badge>
    </XStack>
  )
}
