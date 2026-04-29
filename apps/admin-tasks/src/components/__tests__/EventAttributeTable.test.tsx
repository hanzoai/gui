import { describe, it, expect } from 'vitest'
import {
  buildRows,
  isEmptyRow,
  decodePayload,
} from '../event/event-attribute-rows'
import { buildHistoryEvent } from '../../test/factories'

// EventAttributeTable.tsx pulls in the hanzogui Tamagui provider chain
// (Text/XStack/Badge), which under jsdom requires the full theme
// extractor (see WorkflowStatusPill.test.tsx for the same trade-off).
// The load-bearing pieces are pure: row derivation per event-type and
// the proto-payload decoder. Both live in event-attribute-rows.ts and
// are exercised here directly.

const ctx = { ns: 'default', workflowId: 'wf-1', runId: 'run-1' }

describe('decodePayload', () => {
  it('decodes a base64-utf8 JSON payload', () => {
    // { "hello": "world" } → utf-8 bytes → base64
    const data = btoa('{"hello":"world"}')
    const decoded = decodePayload({ data })
    expect(decoded).toContain('"hello"')
    expect(decoded).toContain('"world"')
  })

  it('keeps a non-JSON utf-8 payload as a string', () => {
    const data = btoa('plain text')
    expect(decodePayload({ data })).toContain('plain text')
  })

  it('renders scalars and nullish values', () => {
    expect(decodePayload(null)).toBe('—')
    expect(decodePayload(undefined)).toBe('—')
    expect(decodePayload('hello')).toBe('hello')
    expect(decodePayload(42)).toBe('42')
    expect(decodePayload(true)).toBe('true')
  })

  it('unwraps a single-element Payloads list', () => {
    const wrapped = { payloads: [{ data: btoa('"x"') }] }
    expect(decodePayload(wrapped)).toContain('x')
  })
})

describe('EventAttributeTable rows', () => {
  it('renders a key/value row for every attribute on the event (default)', () => {
    const ev = buildHistoryEvent({
      eventType: 'NotARealType',
      attributes: { foo: 'bar', baz: 1, scheduledEventId: 5 },
    })
    const rows = buildRows(ev, ctx)
    const labels = rows.map((r) => r.label)
    expect(labels).toEqual(expect.arrayContaining(['Foo', 'Baz', 'Scheduled Event Id']))
    expect(rows).toHaveLength(3)
  })

  it('uses typed renderers for the 12 canonical event types', () => {
    // Each picks a curated, ordered set of fields. Sanity-check that
    // ActivityTaskScheduled emits Activity ID + activity type + task
    // queue (in that order) regardless of attribute insertion order.
    const ev = buildHistoryEvent({
      eventType: 'ActivityTaskScheduled',
      attributes: {
        taskQueue: { name: 'tq' },
        activityId: 'a-1',
        activityType: { name: 'MyActivity' },
        input: { payloads: [{ data: btoa('"x"') }] },
        workflowTaskCompletedEventId: 4,
      },
    })
    const rows = buildRows(ev, ctx)
    const populated = rows.filter((r) => !isEmptyRow(r))
    const labels = populated.map((r) => r.label)
    expect(labels[0]).toBe('Activity ID')
    expect(labels[1]).toBe('Activity type')
    expect(labels[2]).toBe('Task queue')
    expect(labels).toContain('Workflow task completed')
  })

  it('hides empty / null attributes by default with a "show all" toggle', () => {
    const ev = buildHistoryEvent({
      eventType: 'WorkflowTaskCompleted',
      attributes: {
        scheduledEventId: 1,
        // startedEventId omitted → empty row
        identity: '', // empty string → empty row
        // binaryChecksum undefined → empty row
      },
    })
    const rows = buildRows(ev, ctx)
    const populated = rows.filter((r) => !isEmptyRow(r))
    const hidden = rows.length - populated.length
    expect(rows).toHaveLength(4)
    expect(populated).toHaveLength(1)
    expect(populated[0].label).toBe('Scheduled event')
    expect(hidden).toBe(3)
  })

  it('exposes link-shaped fields with kind=link when set', () => {
    const ev = buildHistoryEvent({
      eventType: 'TimerFired',
      attributes: { timerId: 't-1', startedEventId: 12 },
    })
    const populated = buildRows(ev, ctx).filter((r) => !isEmptyRow(r))
    const startedRow = populated.find((r) => r.label === 'Started event')
    expect(startedRow).toBeDefined()
    expect(startedRow!.kind).toBe('link')
    expect(startedRow!.raw).toBe(12)
  })
})
