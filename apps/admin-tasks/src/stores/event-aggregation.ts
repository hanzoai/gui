// Event aggregation. Groups raw history events into UI-friendly
// EventGroups (an Activity Scheduled→Started→Completed sequence is
// one row, not three). Pure functions — input is the events array,
// output is the grouped structure plus a lookup map.
//
// The upstream Temporal Web UI builds these in
// src/lib/models/event-groups/*. We replicate the essential shape:
// initiating event → follow-on events keyed by initiatedEventId / a
// matching id field.

import type {
  EventGroup,
  EventTypeCategory,
  EventClassification,
  HistoryEvent,
  PendingActivity,
  PendingNexusOperation,
} from '../lib/types'

type EventName = string

// Categorise an event by its upstream EventType. The mapping is
// stable enough that "switch" beats a regex.
export function categorize(name: EventName): EventTypeCategory {
  if (name.startsWith('WorkflowExecution') || name.startsWith('WORKFLOW_EXECUTION')) return 'workflow'
  if (name.startsWith('WorkflowTask') || name.startsWith('WORKFLOW_TASK')) return 'workflow'
  if (name.startsWith('ActivityTask') || name.startsWith('ACTIVITY_TASK')) return 'activity'
  if (name.startsWith('Timer') || name.startsWith('TIMER')) return 'timer'
  if (
    name.includes('SignalExternal') ||
    name.includes('SIGNAL_EXTERNAL') ||
    name === 'WorkflowExecutionSignaled'
  )
    return 'signal'
  if (name.startsWith('Marker') || name === 'MARKER_RECORDED') return 'marker'
  if (name.startsWith('ChildWorkflow') || name.startsWith('CHILD_WORKFLOW') || name.startsWith('StartChildWorkflow'))
    return 'child-workflow'
  if (name.startsWith('NexusOperation') || name.startsWith('NEXUS_OPERATION')) return 'nexus'
  if (name.includes('Update') || name.includes('UPDATE')) return 'update'
  if (name.includes('CancelExternal')) return 'command'
  return 'other'
}

// classify returns the lifecycle phase of an event's name. Used for
// timeline coloring + status badges.
export function classify(name: EventName): EventClassification {
  if (name.endsWith('Started') || name.endsWith('STARTED')) return 'Started'
  if (name.endsWith('Scheduled') || name.endsWith('SCHEDULED')) return 'Scheduled'
  if (name.endsWith('Completed') || name.endsWith('COMPLETED')) return 'Completed'
  if (name.endsWith('Failed') || name.endsWith('FAILED')) return 'Failed'
  if (name.endsWith('TimedOut') || name.endsWith('TIMED_OUT')) return 'TimedOut'
  if (name.endsWith('Canceled') || name.endsWith('CANCELED')) return 'Canceled'
  if (name.includes('CancelRequested') || name.includes('CANCEL_REQUESTED')) return 'CancelRequested'
  if (name.endsWith('Signaled') || name.endsWith('SIGNALED')) return 'Signaled'
  if (name.endsWith('Fired') || name.endsWith('FIRED')) return 'Fired'
  if (name.endsWith('Initiated') || name.endsWith('INITIATED')) return 'Initiated'
  if (name === 'MarkerRecorded' || name === 'MARKER_RECORDED') return 'Recorded'
  if (name.endsWith('Terminated') || name.endsWith('TERMINATED')) return 'Terminated'
  if (name.includes('ContinuedAsNew') || name.includes('CONTINUED_AS_NEW')) return 'ContinuedAsNew'
  return 'Pending'
}

// extractInitiatingId — for follow-on events, the attribute carrying
// the initiator's eventId differs by type. This returns whichever
// field is set. Returns undefined for an initiating event itself.
function extractInitiatingId(e: HistoryEvent): string | undefined {
  const a = e.attributes as Record<string, unknown> | undefined
  if (!a) return undefined
  const candidates = [
    'scheduledEventId',
    'startedEventId',
    'initiatedEventId',
    'workflowTaskCompletedEventId',
  ]
  for (const k of candidates) {
    const v = a[k]
    if (typeof v === 'string' && v) return v
    if (typeof v === 'number' && v > 0) return String(v)
  }
  return undefined
}

// groupEvents — primary entry point. Returns:
//   - groups:   EventGroup[] in original order of initiator
//   - flat:     HistoryEvent[] in original order (unchanged)
//   - byId:     map of eventId → HistoryEvent for cross-reference
//   - byGroup:  map of groupId  → EventGroup
export interface AggregatedHistory {
  groups: EventGroup[]
  flat: HistoryEvent[]
  byId: Map<string, HistoryEvent>
  byGroup: Map<string, EventGroup>
}

export function groupEvents(
  events: HistoryEvent[],
  pendingActivities: PendingActivity[] = [],
  pendingNexus: PendingNexusOperation[] = [],
): AggregatedHistory {
  const byId = new Map<string, HistoryEvent>()
  for (const e of events) byId.set(e.eventId, e)

  const byGroup = new Map<string, EventGroup>()
  const groups: EventGroup[] = []

  for (const e of events) {
    const initId = extractInitiatingId(e)
    if (initId && byGroup.has(initId)) {
      const g = byGroup.get(initId)!
      g.events.push(e)
      g.classification = classify(e.eventType)
      if (!g.endTime) g.endTime = e.eventTime
      else g.endTime = e.eventTime ?? g.endTime
      g.timestamp = e.eventTime ?? g.timestamp
      continue
    }
    const g: EventGroup = {
      id: e.eventId,
      name: e.eventType,
      category: categorize(e.eventType),
      classification: classify(e.eventType),
      initialEvent: e,
      events: [e],
      isPending: false,
      startTime: e.eventTime,
      timestamp: e.eventTime,
    }
    groups.push(g)
    byGroup.set(g.id, g)
  }

  // Attach pending activities to their scheduled-event group, if any.
  for (const pa of pendingActivities) {
    // The pending activity carries scheduledEventId in the upstream
    // shape. We accept either the typed field or a loose attribute.
    const looseId =
      (pa as unknown as { scheduledEventId?: string | number }).scheduledEventId ??
      (pa as unknown as { initiatedEventId?: string | number }).initiatedEventId
    if (looseId) {
      const g = byGroup.get(String(looseId))
      if (g) {
        g.pendingActivity = pa
        g.isPending = true
        g.attempt = pa.attempt
      }
    }
  }
  for (const pn of pendingNexus) {
    if (pn.scheduledEventId !== undefined) {
      const g = byGroup.get(String(pn.scheduledEventId))
      if (g) {
        g.pendingNexus = pn
        g.isPending = true
      }
    }
  }

  return { groups, flat: events, byId, byGroup }
}

// bucketByCategory — used by the History compact view to render
// category bands.
export function bucketByCategory(history: AggregatedHistory): Record<EventTypeCategory, EventGroup[]> {
  const out: Record<EventTypeCategory, EventGroup[]> = {
    workflow: [],
    activity: [],
    timer: [],
    signal: [],
    marker: [],
    'child-workflow': [],
    nexus: [],
    update: [],
    command: [],
    other: [],
  }
  for (const g of history.groups) out[g.category].push(g)
  return out
}
