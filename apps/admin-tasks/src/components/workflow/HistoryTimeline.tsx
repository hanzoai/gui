// HistoryTimeline — horizontal Gantt-style bar chart of event groups.
// Each row is one EventGroup; the bar starts at the group's start
// time and extends to its end time (or to "now" while pending).
// Hovering shows duration + classification.

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Text, XStack, YStack } from 'hanzogui'
import { Empty } from '@hanzogui/admin'
import { groupEvents } from '../../stores/event-aggregation'
import { formatDuration } from '../../lib/format'
import type {
  EventGroup,
  EventTypeCategory,
  HistoryEvent,
  PendingActivity,
  PendingNexusOperation,
} from '../../lib/types'

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

export interface HistoryTimelineProps {
  ns: string
  workflowId: string
  runId: string
  events: HistoryEvent[]
  pendingActivities?: PendingActivity[]
  pendingNexus?: PendingNexusOperation[]
}

interface Row {
  group: EventGroup
  startMs: number
  endMs: number
  durationMs: number
}

export function HistoryTimeline({
  ns,
  workflowId,
  runId,
  events,
  pendingActivities,
  pendingNexus,
}: HistoryTimelineProps) {
  const aggregated = useMemo(
    () => groupEvents(events, pendingActivities ?? [], pendingNexus ?? []),
    [events, pendingActivities, pendingNexus],
  )

  const { rows, span } = useMemo(() => {
    const now = Date.now()
    const computed: Row[] = []
    let min = Infinity
    let max = -Infinity
    for (const g of aggregated.groups) {
      const startMs = g.startTime ? new Date(g.startTime).getTime() : NaN
      if (!Number.isFinite(startMs)) continue
      const endMs = g.endTime ? new Date(g.endTime).getTime() : g.isPending ? now : startMs
      computed.push({ group: g, startMs, endMs, durationMs: Math.max(0, endMs - startMs) })
      if (startMs < min) min = startMs
      if (endMs > max) max = endMs
    }
    return { rows: computed, span: { min, max: Math.max(max, min + 1) } }
  }, [aggregated])

  if (rows.length === 0) {
    return <Empty title="No events to plot" hint="Timed events appear here once the workflow records start times." />
  }

  const total = span.max - span.min || 1
  const qs = runId ? `?runId=${encodeURIComponent(runId)}` : ''
  const baseHref = `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(workflowId)}`

  return (
    <YStack gap="$2">
      <XStack justify="space-between">
        <Text fontSize="$1" color="$placeholderColor">
          {new Date(span.min).toLocaleTimeString()}
        </Text>
        <Text fontSize="$1" color="$placeholderColor">
          {formatDuration(total)} span
        </Text>
        <Text fontSize="$1" color="$placeholderColor">
          {new Date(span.max).toLocaleTimeString()}
        </Text>
      </XStack>
      <YStack borderWidth={1} borderColor="$borderColor" rounded="$2" overflow="hidden">
        {rows.map((r, i) => {
          const offsetPct = ((r.startMs - span.min) / total) * 100
          const widthPct = Math.max(0.4, (r.durationMs / total) * 100)
          const color = CATEGORY_COLOR[r.group.category]
          const tooltip = `${r.group.name} · ${r.group.classification} · ${formatDuration(r.durationMs)}`
          return (
            <XStack
              key={r.group.id}
              px="$3"
              py="$2"
              items="center"
              gap="$3"
              borderBottomWidth={i === rows.length - 1 ? 0 : 1}
              borderBottomColor="$borderColor"
              hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
            >
              <Text
                width={48}
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$1"
                color="$placeholderColor"
              >
                #{r.group.id}
              </Text>
              <Link
                to={`${baseHref}/events/${encodeURIComponent(r.group.id)}${qs}`}
                style={{ textDecoration: 'none', minWidth: 220, flex: 0.7 }}
              >
                <Text fontSize="$2" color={'#86efac' as never} numberOfLines={1}>
                  {r.group.name}
                </Text>
              </Link>
              <YStack flex={1} height={20} bg={'rgba(255,255,255,0.04)' as never} rounded="$1" position="relative">
                <YStack
                  position="absolute"
                  l={`${offsetPct}%` as never}
                  width={`${widthPct}%` as never}
                  height={20}
                  bg={color as never}
                  opacity={r.group.isPending ? 0.55 : 0.85}
                  rounded="$1"
                  hoverStyle={{ opacity: 1 }}
                  // title is read by the browser as the hover tooltip
                  // (web-only; harmless on RN platforms).
                  // @ts-expect-error — DOM-only attribute.
                  title={tooltip}
                />
              </YStack>
              <Text fontSize="$1" color="$placeholderColor" width={80} text="right">
                {formatDuration(r.durationMs)}
              </Text>
            </XStack>
          )
        })}
      </YStack>
    </YStack>
  )
}
