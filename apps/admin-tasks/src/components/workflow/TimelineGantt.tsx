// TimelineGantt — pure rendering primitive for the workflow Timeline
// tab. Distinct from HistoryTimeline (which is the lightweight strip
// rendered on top of the workflow detail page). This one is the full
// Gantt: a fixed-height SVG with one row per activity / timer / child
// workflow, time on the x-axis, hover tooltips, and click-through to
// the underlying event detail.
//
// Keeping it props-only — the data fetch + grouping happens in the
// pane component — so this file is trivially testable and reusable
// for activity-detail's per-attempt timeline if/when that lands.

import { Fragment, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Text, XStack, YStack } from 'hanzogui'
import { Empty } from '@hanzogui/admin'
import { formatDuration } from '../../lib/format'
import type { EventGroup, EventTypeCategory } from '../../lib/types'

const ROW_HEIGHT = 22
const ROW_GAP = 4
const TOP_PAD = 24
const BOTTOM_PAD = 12
const LEFT_LABEL_PX = 220
const RIGHT_PAD_PX = 24
const SVG_VIEW_W = 1200

const STATUS_COLOR: Record<string, string> = {
  Completed: '#86efac',
  Failed: '#fca5a5',
  TimedOut: '#fdba74',
  Canceled: '#94a3b8',
  Terminated: '#fca5a5',
  Started: '#7dd3fc',
  Scheduled: '#cbd5e1',
  Signaled: '#c4b5fd',
  Fired: '#fcd34d',
  Initiated: '#a5b4fc',
  Recorded: '#94a3b8',
  Pending: '#7e8794',
  CancelRequested: '#fdba74',
  ContinuedAsNew: '#86efac',
}

const CATEGORY_FALLBACK: Record<EventTypeCategory, string> = {
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

export interface TimelineGanttRow {
  group: EventGroup
  startMs: number
  endMs: number
  durationMs: number
  // Bar appears semi-transparent for in-flight bars so the user can
  // tell at a glance which work is still running.
  pending: boolean
  // Indent level — child workflows are nested under their parent.
  indent: number
}

export interface TimelineGanttProps {
  rows: TimelineGanttRow[]
  // Time-axis bounds. The pane computes these so all bars share the
  // same scale even when rows are filtered.
  spanStartMs: number
  spanEndMs: number
  // Where each row's "Open event detail" link points.
  hrefForRow: (row: TimelineGanttRow) => string
  // Empty-state copy. Optional; sensible default.
  emptyTitle?: string
  emptyHint?: string
}

export function TimelineGantt({
  rows,
  spanStartMs,
  spanEndMs,
  hrefForRow,
  emptyTitle = 'No timed events',
  emptyHint = 'Activities, timers, and child workflows show up here once they record start times.',
}: TimelineGanttProps) {
  const [hover, setHover] = useState<string | null>(null)

  const total = Math.max(1, spanEndMs - spanStartMs)
  const innerWidth = SVG_VIEW_W - LEFT_LABEL_PX - RIGHT_PAD_PX
  const height = TOP_PAD + BOTTOM_PAD + rows.length * (ROW_HEIGHT + ROW_GAP)

  const ticks = useMemo(() => buildTicks(spanStartMs, spanEndMs), [spanStartMs, spanEndMs])

  if (rows.length === 0) {
    return <Empty title={emptyTitle} hint={emptyHint} />
  }

  return (
    <YStack gap="$2">
      <XStack justify="space-between">
        <Text fontSize="$1" color="$placeholderColor">
          {new Date(spanStartMs).toLocaleString()}
        </Text>
        <Text fontSize="$1" color="$placeholderColor">
          {formatDuration(total)} span
        </Text>
        <Text fontSize="$1" color="$placeholderColor">
          {new Date(spanEndMs).toLocaleString()}
        </Text>
      </XStack>
      <YStack
        borderWidth={1}
        borderColor="$borderColor"
        rounded="$2"
        overflow="hidden"
        bg="$background"
      >
        <svg
          viewBox={`0 0 ${SVG_VIEW_W} ${height}`}
          preserveAspectRatio="xMinYMin meet"
          style={{ width: '100%', height: 'auto', display: 'block' }}
          role="img"
          aria-label="Workflow timeline"
        >
          {/* Time-axis grid + tick labels. */}
          {ticks.map((t) => {
            const x = LEFT_LABEL_PX + ((t.ms - spanStartMs) / total) * innerWidth
            return (
              <Fragment key={`tick-${t.ms}`}>
                <line
                  x1={x}
                  x2={x}
                  y1={TOP_PAD - 4}
                  y2={height - BOTTOM_PAD}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={TOP_PAD - 8}
                  fontSize={9}
                  fill="#7e8794"
                  textAnchor="middle"
                >
                  {t.label}
                </text>
              </Fragment>
            )
          })}

          {/* Bars + labels. */}
          {rows.map((row, i) => {
            const y = TOP_PAD + i * (ROW_HEIGHT + ROW_GAP)
            const x =
              LEFT_LABEL_PX + ((row.startMs - spanStartMs) / total) * innerWidth
            const w = Math.max(2, (row.durationMs / total) * innerWidth)
            const color = colorFor(row)
            const isHover = hover === row.group.id
            return (
              <g key={row.group.id}>
                {/* Row label (left gutter). */}
                <foreignObject
                  x={6 + row.indent * 12}
                  y={y - 1}
                  width={LEFT_LABEL_PX - 8 - row.indent * 12}
                  height={ROW_HEIGHT + 2}
                >
                  <Link
                    to={hrefForRow(row)}
                    style={{
                      textDecoration: 'none',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#cbd5e1',
                      fontSize: 11,
                      lineHeight: `${ROW_HEIGHT}px`,
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, monospace',
                    }}
                    title={row.group.name}
                  >
                    {row.group.name}
                  </Link>
                </foreignObject>

                {/* Track background. */}
                <rect
                  x={LEFT_LABEL_PX}
                  y={y}
                  width={innerWidth}
                  height={ROW_HEIGHT}
                  fill="rgba(255,255,255,0.02)"
                />

                {/* The bar. */}
                <Link to={hrefForRow(row)} style={{ textDecoration: 'none' }}>
                  <rect
                    x={x}
                    y={y + 2}
                    width={w}
                    height={ROW_HEIGHT - 4}
                    rx={3}
                    ry={3}
                    fill={color}
                    fillOpacity={row.pending ? 0.55 : isHover ? 1 : 0.85}
                    onMouseEnter={() => setHover(row.group.id)}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <title>{tooltipFor(row)}</title>
                  </rect>
                </Link>
              </g>
            )
          })}
        </svg>
      </YStack>
    </YStack>
  )
}

function colorFor(row: TimelineGanttRow): string {
  const c = STATUS_COLOR[row.group.classification]
  if (c) return c
  return CATEGORY_FALLBACK[row.group.category] ?? '#7e8794'
}

function tooltipFor(row: TimelineGanttRow): string {
  const parts = [
    row.group.name,
    row.group.classification,
    formatDuration(row.durationMs),
  ]
  if (row.group.attempt && row.group.attempt > 1) {
    parts.push(`attempt ${row.group.attempt}`)
  }
  if (row.pending) parts.push('in flight')
  return parts.join(' · ')
}

// buildTicks — returns up to ~6 evenly-spaced tick marks for the
// rendered span. Labels adapt to the scale: ms / s / m / h.
export function buildTicks(
  startMs: number,
  endMs: number,
  count = 6,
): Array<{ ms: number; label: string }> {
  const total = endMs - startMs
  if (!Number.isFinite(total) || total <= 0) return []
  const step = total / count
  const out: Array<{ ms: number; label: string }> = []
  for (let i = 0; i <= count; i++) {
    const ms = startMs + i * step
    out.push({ ms, label: tickLabel(ms - startMs) })
  }
  return out
}

function tickLabel(deltaMs: number): string {
  if (deltaMs < 1000) return `${Math.round(deltaMs)}ms`
  const s = deltaMs / 1000
  if (s < 60) return `${s.toFixed(s < 10 ? 1 : 0)}s`
  const m = s / 60
  if (m < 60) return `${m.toFixed(m < 10 ? 1 : 0)}m`
  const h = m / 60
  return `${h.toFixed(h < 10 ? 1 : 0)}h`
}
