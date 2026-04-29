// Pure logic for EventAttributeTable. Lives in its own file (no JSX,
// no Tamagui imports) so unit tests can exercise the row-derivation
// and the proto-payload decoder without spinning the hanzogui
// provider.
//
// EventAttributeTable.tsx imports from here for the actual rendering;
// the React component layers a Tamagui table + EventLink + PayloadDecoder
// on top of these rows.

import type { HistoryEvent } from '../../lib/types'

export interface AttributeRow {
  label: string
  // null = empty (hidden by default); otherwise the row carries data.
  raw: unknown
  // For EventAttributeTable's renderer: hint how to draw this row.
  kind: 'scalar' | 'badge' | 'payload' | 'link' | 'empty'
  // For 'badge' rows — the short label drawn in the badge.
  badge?: string
}

export interface RowCtx {
  ns: string
  workflowId: string
  runId?: string
}

const EVENT_LINK_FIELDS = new Set([
  'scheduledEventId',
  'startedEventId',
  'initiatedEventId',
  'workflowTaskCompletedEventId',
  'completedEventId',
  'firedEventId',
])

export function buildRows(event: HistoryEvent, _ctx: RowCtx): AttributeRow[] {
  const a = (event.attributes ?? {}) as Record<string, unknown>
  const t = event.eventType

  switch (t) {
    case 'WorkflowExecutionStarted':
      return [
        kv('Workflow type', a.workflowType),
        kv('Task queue', a.taskQueue),
        kv('Input', a.input),
        kv('Header', a.header),
        kv('Workflow run timeout', a.workflowRunTimeout),
        kv('Workflow task timeout', a.workflowTaskTimeout),
        kv('Identity', a.identity),
        kv('Original execution run ID', a.originalExecutionRunId),
        kv('First execution run ID', a.firstExecutionRunId),
        kv('Memo', a.memo),
        kv('Search attributes', a.searchAttributes),
      ]

    case 'WorkflowTaskScheduled':
      return [
        kv('Task queue', a.taskQueue),
        kv('Start to close timeout', a.startToCloseTimeout),
        kv('Attempt', a.attempt),
      ]

    case 'WorkflowTaskStarted':
      return [
        link('Scheduled event', a.scheduledEventId),
        kv('Identity', a.identity),
        kv('Request ID', a.requestId),
      ]

    case 'WorkflowTaskCompleted':
      return [
        link('Scheduled event', a.scheduledEventId),
        link('Started event', a.startedEventId),
        kv('Identity', a.identity),
        kv('Binary checksum', a.binaryChecksum),
      ]

    case 'ActivityTaskScheduled':
      return [
        kv('Activity ID', a.activityId),
        kv('Activity type', a.activityType),
        kv('Task queue', a.taskQueue),
        kv('Input', a.input),
        kv('Schedule to close timeout', a.scheduleToCloseTimeout),
        kv('Schedule to start timeout', a.scheduleToStartTimeout),
        kv('Start to close timeout', a.startToCloseTimeout),
        kv('Heartbeat timeout', a.heartbeatTimeout),
        kv('Retry policy', a.retryPolicy),
        link('Workflow task completed', a.workflowTaskCompletedEventId),
      ]

    case 'ActivityTaskStarted':
      return [
        link('Scheduled event', a.scheduledEventId),
        kv('Identity', a.identity),
        kv('Request ID', a.requestId),
        kv('Attempt', a.attempt),
      ]

    case 'ActivityTaskCompleted':
      return [
        link('Scheduled event', a.scheduledEventId),
        link('Started event', a.startedEventId),
        kv('Identity', a.identity),
        kv('Result', a.result),
      ]

    case 'ActivityTaskFailed':
      return [
        link('Scheduled event', a.scheduledEventId),
        link('Started event', a.startedEventId),
        kv('Identity', a.identity),
        kv('Failure', a.failure),
        kv('Retry state', a.retryState),
      ]

    case 'TimerStarted':
      return [
        kv('Timer ID', a.timerId),
        kv('Start to fire timeout', a.startToFireTimeout),
        link('Workflow task completed', a.workflowTaskCompletedEventId),
      ]

    case 'TimerFired':
      return [kv('Timer ID', a.timerId), link('Started event', a.startedEventId)]

    case 'TimerCanceled':
      return [
        kv('Timer ID', a.timerId),
        link('Started event', a.startedEventId),
        kv('Identity', a.identity),
        link('Workflow task completed', a.workflowTaskCompletedEventId),
      ]

    case 'WorkflowExecutionSignaled':
      return [
        kv('Signal name', a.signalName),
        kv('Input', a.input),
        kv('Identity', a.identity),
        kv('Header', a.header),
      ]

    case 'StartChildWorkflowExecutionInitiated':
      return [
        kv('Namespace', a.namespace),
        kv('Workflow ID', a.workflowId),
        kv('Workflow type', a.workflowType),
        kv('Task queue', a.taskQueue),
        kv('Input', a.input),
        kv('Parent close policy', a.parentClosePolicy),
        kv('Workflow ID reuse policy', a.workflowIdReusePolicy),
        link('Workflow task completed', a.workflowTaskCompletedEventId),
      ]

    case 'ChildWorkflowExecutionStarted':
      return [
        kv('Namespace', a.namespace),
        kv('Workflow execution', a.workflowExecution),
        kv('Workflow type', a.workflowType),
        kv('Header', a.header),
        link('Initiated event', a.initiatedEventId),
      ]

    case 'ChildWorkflowExecutionCompleted':
      return [
        kv('Namespace', a.namespace),
        kv('Workflow execution', a.workflowExecution),
        kv('Workflow type', a.workflowType),
        kv('Result', a.result),
        link('Initiated event', a.initiatedEventId),
        link('Started event', a.startedEventId),
      ]

    case 'MarkerRecorded':
      return [
        kv('Marker name', a.markerName),
        kv('Details', a.details),
        kv('Header', a.header),
        kv('Failure', a.failure),
        link('Workflow task completed', a.workflowTaskCompletedEventId),
      ]

    default:
      return Object.entries(a).map(([k, v]) =>
        EVENT_LINK_FIELDS.has(k) ? link(humanLabel(k), v) : kv(humanLabel(k), v),
      )
  }
}

function kv(label: string, value: unknown): AttributeRow {
  if (value === null || value === undefined || value === '') {
    return { label, raw: value, kind: 'empty' }
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return { label, raw: value, kind: 'scalar' }
  }
  if (typeof value === 'object' && value !== null) {
    const v = value as Record<string, unknown>
    if (typeof v.name === 'string' && Object.keys(v).length <= 2) {
      return { label, raw: value, kind: 'badge', badge: v.name as string }
    }
  }
  return { label, raw: value, kind: 'payload' }
}

function link(label: string, value: unknown): AttributeRow {
  if (value === null || value === undefined || value === '' || value === 0 || value === '0') {
    return { label, raw: value, kind: 'empty' }
  }
  return { label, raw: value, kind: 'link' }
}

export function isEmptyRow(r: AttributeRow): boolean {
  return r.kind === 'empty'
}

function humanLabel(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

// ── proto Payload decoder ─────────────────────────────────────────

export function decodePayload(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    if (value.length === 1) return decodePayload(value[0])
    return JSON.stringify(value.map((v) => tryDecode(v)), null, 2)
  }
  return JSON.stringify(tryDecode(value), null, 2)
}

function tryDecode(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value
  const v = value as Record<string, unknown>
  if (Array.isArray(v.payloads)) {
    return (v.payloads as unknown[]).map((p) => tryDecode(p))
  }
  if ('data' in v && typeof v.data === 'string') {
    const raw = decodeBase64Utf8(v.data)
    try {
      return JSON.parse(raw)
    } catch {
      return raw
    }
  }
  const out: Record<string, unknown> = {}
  for (const [k, vv] of Object.entries(v)) out[k] = tryDecode(vv)
  return out
}

function decodeBase64Utf8(s: string): string {
  try {
    if (typeof atob === 'function') {
      const bin = atob(s)
      const bytes = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
      return new TextDecoder('utf-8').decode(bytes)
    }
  } catch {
    // fallthrough
  }
  return s
}
