import { describe, expect, it } from 'vitest'
import { buildRows } from '../TimelinePane'
import type { EventGroup } from '../../../lib/types'

function group(
  id: string,
  category: EventGroup['category'],
  startTime: string,
  endTime?: string,
  isPending = false,
): EventGroup {
  return {
    id,
    name: `${category}-${id}`,
    category,
    classification: endTime ? 'Completed' : 'Started',
    initialEvent: { eventId: id, eventType: 'ActivityTaskScheduled' as never },
    events: [],
    isPending,
    startTime,
    endTime,
    timestamp: startTime,
  }
}

describe('TimelinePane.buildRows', () => {
  it('keeps activity / timer / child-workflow / nexus groups', () => {
    const groups: EventGroup[] = [
      group('1', 'workflow', '2024-01-01T00:00:00Z'),
      group('2', 'activity', '2024-01-01T00:00:01Z', '2024-01-01T00:00:05Z'),
      group('3', 'timer', '2024-01-01T00:00:02Z', '2024-01-01T00:00:04Z'),
      group('4', 'marker', '2024-01-01T00:00:03Z'),
      group('5', 'child-workflow', '2024-01-01T00:00:06Z'),
      group('6', 'nexus', '2024-01-01T00:00:07Z'),
    ]
    const { rows } = buildRows(groups)
    expect(rows.map((r) => r.group.id)).toEqual(['2', '3', '5', '6'])
  })

  it('orders rows by start time, then by event id', () => {
    const groups: EventGroup[] = [
      group('5', 'activity', '2024-01-01T00:00:02Z', '2024-01-01T00:00:03Z'),
      group('3', 'activity', '2024-01-01T00:00:01Z', '2024-01-01T00:00:02Z'),
      group('4', 'activity', '2024-01-01T00:00:01Z', '2024-01-01T00:00:02Z'),
    ]
    const { rows } = buildRows(groups)
    expect(rows.map((r) => r.group.id)).toEqual(['3', '4', '5'])
  })

  it('extends pending bars to "now" so they render with a positive width', () => {
    const groups: EventGroup[] = [
      group('1', 'activity', new Date(Date.now() - 5000).toISOString(), undefined, true),
    ]
    const { rows } = buildRows(groups)
    expect(rows).toHaveLength(1)
    expect(rows[0].pending).toBe(true)
    expect(rows[0].durationMs).toBeGreaterThan(0)
  })

  it('indents child-workflow rows beneath parent rows', () => {
    const groups: EventGroup[] = [
      group('1', 'activity', '2024-01-01T00:00:01Z', '2024-01-01T00:00:02Z'),
      group('2', 'child-workflow', '2024-01-01T00:00:03Z'),
    ]
    const { rows } = buildRows(groups)
    expect(rows.find((r) => r.group.id === '1')?.indent).toBe(0)
    expect(rows.find((r) => r.group.id === '2')?.indent).toBe(1)
  })

  it('returns a sane span when no rows have start times', () => {
    const { rows, spanStartMs, spanEndMs } = buildRows([])
    expect(rows).toEqual([])
    expect(spanEndMs).toBeGreaterThan(spanStartMs)
  })
})
