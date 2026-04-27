// Display formatting helpers shared across admin pages — timestamps,
// retention TTLs, status badge colour tokens. Stateless. The user's
// tz preference lives in `./tz`; this module reads it via `getTz`.

import { getTz } from './tz'

// formatTimestamp renders a Date in the user's chosen tz mode. UTC
// produces ISO 8601, local produces the upstream
// "26 Apr 2026, 22:33:39.64 GMT-7" shape.
export function formatTimestamp(d: Date): string {
  const tz = getTz()
  if (tz === 'utc') {
    return d.toISOString().replace('T', ' ').slice(0, 23) + ' UTC'
  }
  const day = d.getDate().toString().padStart(2, '0')
  const month = d.toLocaleString('en-US', { month: 'short' })
  const year = d.getFullYear()
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const ms = String(d.getMilliseconds()).padStart(3, '0').slice(0, 2)
  const tzOffset = -d.getTimezoneOffset() / 60
  const tzLabel = `GMT${tzOffset >= 0 ? '+' : ''}${tzOffset}`
  return `${day} ${month} ${year}, ${time}.${ms} ${tzLabel}`
}

// humanTTL — "720h" → "30 days", "604800s" → "7 days", fallthrough
// returns the raw string. Common case for retention TTL fields.
export function humanTTL(raw?: string): string {
  if (!raw) return '—'
  if (raw.endsWith('h')) {
    const h = parseInt(raw, 10)
    if (!Number.isFinite(h)) return raw
    const days = Math.round(h / 24)
    return days >= 1 ? `${days} days` : `${h}h`
  }
  if (raw.endsWith('s')) {
    const s = parseInt(raw, 10)
    if (!Number.isFinite(s)) return raw
    const days = Math.round(s / 86400)
    return days >= 1 ? `${days} days` : `${Math.round(s / 3600)}h`
  }
  return raw
}

export type StatusVariant = 'success' | 'destructive' | 'warning' | 'muted' | 'default' | 'info' | 'accent'

// Badge color tokens. Pure-string CSS so they pass through Hanzo GUI's
// strict ColorTokens generic (cast to never at the call site).
//
// `info` (blue) maps to upstream Running. `accent` (purple) maps to
// upstream ContinuedAsNew + Pending. `warning` (yellow/orange) maps
// to Terminated and TimedOut so that user-initiated stops read
// distinctly from genuine failures (`destructive`, red).
export function badgeColors(variant: StatusVariant): { bg: string; fg: string } {
  switch (variant) {
    case 'success':
      return { bg: 'rgba(34,197,94,0.15)', fg: '#86efac' }
    case 'destructive':
      return { bg: 'rgba(239,68,68,0.15)', fg: '#fca5a5' }
    case 'warning':
      return { bg: 'rgba(234,179,8,0.15)', fg: '#fde68a' }
    case 'info':
      return { bg: 'rgba(59,130,246,0.15)', fg: '#93c5fd' }
    case 'accent':
      return { bg: 'rgba(168,85,247,0.15)', fg: '#d8b4fe' }
    case 'muted':
    case 'default':
    default:
      return { bg: 'rgba(148,163,184,0.15)', fg: '#cbd5e1' }
  }
}

// WorkflowExecutionStatus — the 9 statuses emitted by Temporal-style
// workflow execution APIs. The wire shape is the proto enum string
// `WORKFLOW_EXECUTION_STATUS_*`; we narrow that with `parseWorkflowStatus`
// so downstream switch statements get exhaustivity checking.
export type WorkflowStatus =
  | 'Running'
  | 'Completed'
  | 'Failed'
  | 'Canceled'
  | 'Terminated'
  | 'ContinuedAsNew'
  | 'TimedOut'
  | 'Pending'
  | 'Unspecified'

const WIRE_TO_STATUS: Record<string, WorkflowStatus> = {
  WORKFLOW_EXECUTION_STATUS_RUNNING: 'Running',
  WORKFLOW_EXECUTION_STATUS_COMPLETED: 'Completed',
  WORKFLOW_EXECUTION_STATUS_FAILED: 'Failed',
  WORKFLOW_EXECUTION_STATUS_CANCELED: 'Canceled',
  WORKFLOW_EXECUTION_STATUS_TERMINATED: 'Terminated',
  WORKFLOW_EXECUTION_STATUS_CONTINUED_AS_NEW: 'ContinuedAsNew',
  WORKFLOW_EXECUTION_STATUS_TIMED_OUT: 'TimedOut',
  WORKFLOW_EXECUTION_STATUS_PENDING: 'Pending',
  WORKFLOW_EXECUTION_STATUS_UNSPECIFIED: 'Unspecified',
}

// parseWorkflowStatus normalizes the wire enum string OR the short
// PascalCase form into our canonical `WorkflowStatus`. Unknown
// strings fall back to 'Unspecified' rather than throwing — list
// pages must keep rendering even when the backend invents a status
// the UI hasn't shipped yet.
export function parseWorkflowStatus(s: string): WorkflowStatus {
  if (s in WIRE_TO_STATUS) return WIRE_TO_STATUS[s]
  // Already short form?
  const short = s as WorkflowStatus
  switch (short) {
    case 'Running':
    case 'Completed':
    case 'Failed':
    case 'Canceled':
    case 'Terminated':
    case 'ContinuedAsNew':
    case 'TimedOut':
    case 'Pending':
    case 'Unspecified':
      return short
    default:
      return 'Unspecified'
  }
}

// workflowStatusVariant — colour mapping for all 9 statuses. Mirrors
// upstream temporalio/ui workflow-status.svelte (cva block).
export function workflowStatusVariant(s: WorkflowStatus): StatusVariant {
  switch (s) {
    case 'Running':
      return 'info'
    case 'Completed':
      return 'success'
    case 'Failed':
      return 'destructive'
    case 'Canceled':
      return 'muted'
    case 'Terminated':
    case 'TimedOut':
      return 'warning'
    case 'ContinuedAsNew':
    case 'Pending':
      return 'accent'
    case 'Unspecified':
      return 'muted'
  }
}

// Pretty label for a status — splits CamelCase, e.g. ContinuedAsNew
// → "Continued as New". Dedicated map for the few that don't follow
// camel-split rules.
const STATUS_LABEL: Record<WorkflowStatus, string> = {
  Running: 'Running',
  Completed: 'Completed',
  Failed: 'Failed',
  Canceled: 'Canceled',
  Terminated: 'Terminated',
  ContinuedAsNew: 'Continued as New',
  TimedOut: 'Timed Out',
  Pending: 'Pending',
  Unspecified: 'Unspecified',
}

export function workflowStatusLabel(s: WorkflowStatus): string {
  return STATUS_LABEL[s]
}
