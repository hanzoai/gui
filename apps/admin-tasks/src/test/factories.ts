// Test data factories. Each factory returns a minimally-complete
// instance with sensible defaults; callers override fields by passing
// a partial. Keep factories pure — no randomness, deterministic IDs
// only. Tests that need a unique id pass it in.

import type {
  BatchOperation,
  HistoryEvent,
  Namespace,
  NexusEndpoint,
  PendingActivity,
  Schedule,
  WorkflowExecution,
} from '../lib/types'

type Override<T> = Partial<T> & Record<string, unknown>

function merge<T extends object>(base: T, over?: Override<T>): T {
  if (!over) return base
  const out: Record<string, unknown> = { ...(base as unknown as Record<string, unknown>) }
  for (const [k, v] of Object.entries(over)) {
    const cur = (base as unknown as Record<string, unknown>)[k]
    if (
      v && typeof v === 'object' && !Array.isArray(v) &&
      cur && typeof cur === 'object' && !Array.isArray(cur)
    ) {
      out[k] = merge(cur as object, v as Override<object>)
    } else {
      out[k] = v
    }
  }
  return out as T
}

export function buildNamespace(over?: Override<Namespace>): Namespace {
  return merge<Namespace>(
    {
      namespaceInfo: {
        name: 'default',
        state: 'Registered',
        description: '',
        ownerEmail: 'ops@example.com',
        createTime: '2026-01-01T00:00:00Z',
      },
      config: {
        workflowExecutionRetentionTtl: '604800s',
        apsLimit: 0,
      },
      isActive: true,
      failoverVersion: '0',
    },
    over,
  )
}

export function buildWorkflow(over?: Override<WorkflowExecution>): WorkflowExecution {
  return merge<WorkflowExecution>(
    {
      execution: { workflowId: 'wf-1', runId: 'run-1' },
      type: { name: 'TestWorkflow' },
      status: 'WORKFLOW_EXECUTION_STATUS_RUNNING',
      startTime: '2026-04-01T00:00:00Z',
      taskQueue: 'default',
      historyLength: 5,
    },
    over,
  )
}

export function buildHistoryEvent(over?: Override<HistoryEvent>): HistoryEvent {
  return merge<HistoryEvent>(
    {
      eventId: '1',
      eventTime: '2026-04-01T00:00:00Z',
      eventType: 'WorkflowExecutionStarted',
      attributes: {},
    },
    over,
  )
}

export function buildPendingActivity(over?: Override<PendingActivity>): PendingActivity {
  return merge<PendingActivity>(
    {
      activityId: 'a-1',
      activityType: 'TestActivity',
      state: 'Started',
      attempt: 1,
      maximumAttempts: 3,
    },
    over,
  )
}

export function buildSchedule(over?: Override<Schedule>): Schedule {
  return merge<Schedule>(
    {
      scheduleId: 'sch-1',
      namespace: 'default',
      spec: { cronString: ['0 9 * * 1-5'] },
      action: { workflowType: { name: 'TestWorkflow' }, taskQueue: 'default' },
      state: { paused: false },
      info: { createTime: '2026-04-01T00:00:00Z' },
    },
    over,
  )
}

export function buildBatch(over?: Override<BatchOperation>): BatchOperation {
  return merge<BatchOperation>(
    {
      batchId: 'b-1',
      namespace: 'default',
      operation: 'Cancel',
      reason: 'manual',
      query: '',
      state: 'Running',
      startTime: '2026-04-01T00:00:00Z',
      totalOperationCount: 0,
      completeOperationCount: 0,
    },
    over,
  )
}

export function buildNexusEndpoint(over?: Override<NexusEndpoint>): NexusEndpoint {
  return merge<NexusEndpoint>(
    {
      name: 'echo',
      target: 'tasksrv://default/echo',
      namespace: 'default',
      createTime: '2026-04-01T00:00:00Z',
    },
    over,
  )
}
