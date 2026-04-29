import { describe, it, expect } from 'vitest'
import { categorize, classify, groupEvents, bucketByCategory } from '../event-aggregation'
import { buildHistoryEvent, buildPendingActivity } from '../../test/factories'

describe('categorize', () => {
  it('returns workflow for Workflow* events (PascalCase + SCREAMING_SNAKE)', () => {
    expect(categorize('WorkflowExecutionStarted')).toBe('workflow')
    expect(categorize('WORKFLOW_TASK_COMPLETED')).toBe('workflow')
  })
  it('returns activity / timer / signal / nexus / child-workflow', () => {
    expect(categorize('ActivityTaskScheduled')).toBe('activity')
    expect(categorize('TimerStarted')).toBe('timer')
    expect(categorize('SignalExternalWorkflowExecutionInitiated')).toBe('signal')
    expect(categorize('NexusOperationScheduled')).toBe('nexus')
    expect(categorize('ChildWorkflowExecutionStarted')).toBe('child-workflow')
    // WorkflowExecutionSignaled is categorised as 'workflow' because
    // the WorkflowExecution* family check runs first; the signal-
    // specific bucket exists for SignalExternal* events. Both behaviours
    // are intentional and the UI key off classify() for the badge.
    expect(categorize('WorkflowExecutionSignaled')).toBe('workflow')
  })
  it('falls back to other for unknown shapes', () => {
    expect(categorize('SomethingElse')).toBe('other')
  })
})

describe('classify', () => {
  it('returns the lifecycle phase from the event name suffix', () => {
    expect(classify('ActivityTaskStarted')).toBe('Started')
    expect(classify('ActivityTaskCompleted')).toBe('Completed')
    expect(classify('ActivityTaskFailed')).toBe('Failed')
    expect(classify('TimerFired')).toBe('Fired')
    expect(classify('MarkerRecorded')).toBe('Recorded')
    expect(classify('WorkflowExecutionContinuedAsNew')).toBe('ContinuedAsNew')
  })
  it('returns Pending for unrecognised', () => {
    expect(classify('Hmm')).toBe('Pending')
  })
})

describe('groupEvents', () => {
  it('groups Activity Scheduled→Started→Completed under one EventGroup', () => {
    const events = [
      buildHistoryEvent({ eventId: '1', eventType: 'WorkflowExecutionStarted' }),
      buildHistoryEvent({ eventId: '5', eventType: 'ActivityTaskScheduled' }),
      buildHistoryEvent({ eventId: '6', eventType: 'ActivityTaskStarted', attributes: { scheduledEventId: '5' } }),
      buildHistoryEvent({ eventId: '7', eventType: 'ActivityTaskCompleted', attributes: { scheduledEventId: '5' } }),
    ]
    const agg = groupEvents(events)
    expect(agg.groups.length).toBe(2)
    const activityGroup = agg.groups.find((g) => g.id === '5')!
    expect(activityGroup.events.length).toBe(3)
    expect(activityGroup.classification).toBe('Completed')
  })

  it('attaches a pending activity to its scheduled-event group', () => {
    const events = [
      buildHistoryEvent({ eventId: '5', eventType: 'ActivityTaskScheduled' }),
    ]
    const pa = buildPendingActivity({ activityId: 'a', attempt: 2 })
    ;(pa as unknown as Record<string, unknown>).scheduledEventId = '5'
    const agg = groupEvents(events, [pa])
    const g = agg.byGroup.get('5')!
    expect(g.isPending).toBe(true)
    expect(g.pendingActivity).toBeDefined()
    expect(g.attempt).toBe(2)
  })

  it('keeps flat list and byId lookup intact', () => {
    const events = [
      buildHistoryEvent({ eventId: '1', eventType: 'WorkflowExecutionStarted' }),
      buildHistoryEvent({ eventId: '2', eventType: 'WorkflowTaskScheduled' }),
    ]
    const agg = groupEvents(events)
    expect(agg.flat).toHaveLength(2)
    expect(agg.byId.get('1')?.eventType).toBe('WorkflowExecutionStarted')
  })

  it('bucketByCategory sorts groups into category bands', () => {
    const events = [
      buildHistoryEvent({ eventId: '1', eventType: 'WorkflowExecutionStarted' }),
      buildHistoryEvent({ eventId: '2', eventType: 'TimerStarted' }),
      buildHistoryEvent({ eventId: '3', eventType: 'ActivityTaskScheduled' }),
    ]
    const buckets = bucketByCategory(groupEvents(events))
    expect(buckets.workflow.length).toBe(1)
    expect(buckets.timer.length).toBe(1)
    expect(buckets.activity.length).toBe(1)
    expect(buckets.signal.length).toBe(0)
  })
})
