import { describe, it, expect, beforeEach } from 'vitest'
import {
  Workflows,
  Schedules,
  Batches,
  Nexus,
  Namespaces,
  namespaceUrls,
  workflowUrls,
  scheduleUrls,
  batchUrls,
  nexusUrls,
  searchUrls,
  statusVariant,
  shortStatus,
} from '../api'
import { server } from '../../test/msw'

beforeEach(() => server.resetHandlers())

describe('URL builders', () => {
  it('namespaces.list defaults pageSize=200', () => {
    expect(namespaceUrls.list()).toBe('/v1/tasks/namespaces?pageSize=200')
  })
  it('encodes namespace path segments', () => {
    expect(namespaceUrls.describe('with space')).toBe('/v1/tasks/namespaces/with%20space')
  })
  it('workflowUrls.list builds query string from opts', () => {
    expect(workflowUrls.list('default', { query: 'WorkflowType="Foo"', pageSize: 50 })).toBe(
      '/v1/tasks/namespaces/default/workflows?query=WorkflowType%3D%22Foo%22&pageSize=50',
    )
  })
  it('workflowUrls.describe attaches execution.runId when given', () => {
    const url = workflowUrls.describe('default', 'wf-1', 'run-1')
    expect(url).toContain('/v1/tasks/namespaces/default/workflows/wf-1')
    expect(url).toContain('execution.runId=run-1')
  })
  it('workflowUrls.history builds nextPageToken', () => {
    const url = workflowUrls.history('default', 'wf-1', undefined, 'tok')
    expect(url).toContain('nextPageToken=tok')
  })
  it('scheduleUrls + batchUrls + nexusUrls use the /v1/tasks prefix', () => {
    expect(scheduleUrls.list('default')).toMatch(/^\/v1\/tasks\/namespaces\/default\/schedules/)
    expect(batchUrls.list('default')).toMatch(/^\/v1\/tasks\/namespaces\/default\/batches/)
    expect(nexusUrls.list()).toBe('/v1/tasks/nexus')
    expect(nexusUrls.list('default')).toBe('/v1/tasks/namespaces/default/nexus')
  })
  it('searchUrls.workflows includes query + pageSize', () => {
    const url = searchUrls.workflows('default', 'WorkflowType="X"')
    expect(url).toContain('query=WorkflowType')
    expect(url).toContain('pageSize=100')
  })
})

describe('imperative endpoints route to /v1/tasks/* via fetch', () => {
  it('Workflows.start POSTs to /workflows', async () => {
    await Workflows.start('default', {
      workflowId: 'wf-x',
      workflowType: { name: 'T' },
      taskQueue: { name: 'q' },
    })
    const last = server.requests.at(-1)!
    expect(last.method).toBe('POST')
    expect(last.url).toBe('/v1/tasks/namespaces/default/workflows')
    expect((last.body as { workflowId?: string })?.workflowId).toBe('wf-x')
  })

  it('Workflows.signal POSTs to /signal', async () => {
    await Workflows.signal('default', 'wf-1', 'run-1', 'go', { x: 1 })
    const last = server.requests.at(-1)!
    expect(last.method).toBe('POST')
    expect(last.url).toContain('/v1/tasks/namespaces/default/workflows/wf-1/signal')
    expect(last.url).toContain('runId=run-1')
  })

  it('Workflows.cancel POSTs to /cancel', async () => {
    await Workflows.cancel('default', 'wf-1')
    const last = server.requests.at(-1)!
    expect(last.method).toBe('POST')
    expect(last.url).toContain('/cancel')
  })

  it('Workflows.terminate POSTs to /terminate with reason', async () => {
    await Workflows.terminate('default', 'wf-1', undefined, 'oops')
    const last = server.requests.at(-1)!
    expect(last.method).toBe('POST')
    expect(last.url).toContain('/terminate')
    expect((last.body as { reason?: string })?.reason).toBe('oops')
  })

  it('Workflows.query POSTs to /query', async () => {
    await Workflows.query('default', 'wf-1', undefined, 'currentStatus')
    const last = server.requests.at(-1)!
    expect(last.method).toBe('POST')
    expect(last.url).toContain('/query')
    expect((last.body as { queryType?: string })?.queryType).toBe('currentStatus')
  })

  it('Schedules.create POSTs to /schedules', async () => {
    await Schedules.create('default', {
      scheduleId: 's-1',
      namespace: 'default',
      spec: { cronString: ['0 0 * * *'] },
      action: { workflowType: { name: 'T' }, taskQueue: 'q' },
      state: { paused: false },
      info: { createTime: '2026-04-29T00:00:00Z' },
    })
    const last = server.requests.at(-1)!
    expect(last.method).toBe('POST')
    expect(last.url).toBe('/v1/tasks/namespaces/default/schedules')
  })

  it('Schedules.delete DELETEs the schedule', async () => {
    await Schedules.delete('default', 's-1')
    const last = server.requests.at(-1)!
    expect(last.method).toBe('DELETE')
    expect(last.url).toBe('/v1/tasks/namespaces/default/schedules/s-1')
  })

  it('Batches.create POSTs to /batches', async () => {
    await Batches.create('default', { operation: 'Cancel', reason: 'cleanup' })
    const last = server.requests.at(-1)!
    expect(last.method).toBe('POST')
    expect(last.url).toBe('/v1/tasks/namespaces/default/batches')
  })

  it('Nexus.create POSTs to /namespaces/:ns/nexus', async () => {
    await Nexus.create('default', { name: 'echo', target: 'tasksrv://default/echo' })
    const last = server.requests.at(-1)!
    expect(last.method).toBe('POST')
    expect(last.url).toBe('/v1/tasks/namespaces/default/nexus')
  })

  it('Namespaces.register POSTs to /namespaces', async () => {
    // No default handler registered; install a one-off so request resolves.
    const { http, HttpResponse } = await import('../../test/msw')
    server.use(http.post('/v1/tasks/namespaces', () => HttpResponse.json({})))
    await Namespaces.register({ namespaceInfo: { name: 'staging', state: 'Registered' } })
    const last = server.requests.at(-1)!
    expect(last.method).toBe('POST')
    expect(last.url).toBe('/v1/tasks/namespaces')
  })
})

describe('status helpers', () => {
  it('statusVariant maps wire enum + short forms', () => {
    expect(statusVariant('WORKFLOW_EXECUTION_STATUS_RUNNING')).toBe('info')
    expect(statusVariant('Completed')).toBe('success')
    expect(statusVariant('Failed')).toBe('destructive')
    expect(statusVariant('Canceled')).toBe('muted')
    expect(statusVariant('TimedOut')).toBe('warning')
    expect(statusVariant('ContinuedAsNew')).toBe('accent')
    expect(statusVariant('Unknown')).toBe('muted')
  })
  it('shortStatus strips the WORKFLOW_EXECUTION_STATUS_ prefix and lowercases', () => {
    expect(shortStatus('WORKFLOW_EXECUTION_STATUS_RUNNING')).toBe('running')
    expect(shortStatus('Completed')).toBe('completed')
  })
})
