// Tasks API client. One way in/out: every backend call is a typed
// function in this file. No /api/ prefix; everything is /v1/tasks/*.
// Routes match `pkg/tasks/embed.go` exactly. Where the backend
// currently 501s (queries, archival, deployments setCurrent, schedule
// trigger/update, search, workers detail) the call is shaped now and
// will start succeeding when the engine handler lands.
//
// Conventions:
//   - Reads use `useFetch<T>(url)` directly so SWR-style revalidation
//     works at the page level. This module exports the URL builders
//     and the imperative wrappers.
//   - Writes (POST/PUT/DELETE) go through `request<T>()` which adds
//     CSRF + JSON headers via apiPost/apiDelete from @hanzogui/admin.
//   - Cursor pagination uses { data, nextPageToken } via Cursor<T>.
//   - All response envelopes come back as typed objects, never `any`.

import { apiPost, apiDelete, ApiError } from '@hanzogui/admin'
import type {
  Activity,
  BatchOperation,
  Cursor,
  Deployment,
  Identity,
  ListActivitiesResponse,
  ListWorkflowExecutionsResponse,
  Namespace,
  NexusEndpoint,
  NexusEndpointSpec,
  Schedule,
  SearchAttributesSchema,
  StartActivityRequest,
  WorkflowExecution,
} from './types'

export { ApiError, apiPost, apiDelete }

// Re-export wire types so pages can `import type { Namespace } from '../lib/api'`
// without reaching into types.ts.
export type {
  Namespace,
  WorkflowExecution,
  Schedule,
  BatchOperation,
  Deployment,
  NexusEndpoint,
  NexusEndpointSpec,
  Identity,
  Worker,
  PendingActivity,
  PendingNexusOperation,
  ExecutionRef,
  ListWorkflowExecutionsResponse,
  Activity,
  ActivityWireStatus,
  ActivityStatus,
  ActivityRetryPolicy,
  ActivityAttempt,
  ListActivitiesResponse,
  DescribeActivityResponse,
  StartActivityRequest,
} from './types'

// ── URL helpers ────────────────────────────────────────────────────

const ROOT = '/v1/tasks'

const enc = encodeURIComponent

function qs(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  if (entries.length === 0) return ''
  const sp = new URLSearchParams()
  for (const [k, v] of entries) sp.set(k, String(v))
  return `?${sp.toString()}`
}

// Generic transport — used by all writes. Reads stay on useFetch<T>.
async function request<T>(method: 'POST' | 'DELETE' | 'PUT', path: string, body?: unknown): Promise<T> {
  if (method === 'POST' || method === 'PUT') return apiPost<T>(path, body)
  if (method === 'DELETE') return apiDelete<T>(path)
  throw new Error(`unsupported method ${method}`)
}

// statusVariant + shortStatus retained for callers that import from
// '../lib/api' (existing pages). Forward to admin's parseWorkflowStatus
// + workflowStatusVariant where shape allows; keep wire-string variants
// here for back-compat with the tasks server's current envelope.

export type StatusVariant = 'success' | 'destructive' | 'warning' | 'muted' | 'default' | 'info' | 'accent'

export function statusVariant(s: string): StatusVariant {
  switch (s) {
    case 'WORKFLOW_EXECUTION_STATUS_RUNNING':
    case 'Running':
      return 'info'
    case 'WORKFLOW_EXECUTION_STATUS_COMPLETED':
    case 'Completed':
      return 'success'
    case 'WORKFLOW_EXECUTION_STATUS_FAILED':
    case 'Failed':
      return 'destructive'
    case 'WORKFLOW_EXECUTION_STATUS_TIMED_OUT':
    case 'WORKFLOW_EXECUTION_STATUS_TERMINATED':
    case 'TimedOut':
    case 'Terminated':
      return 'warning'
    case 'WORKFLOW_EXECUTION_STATUS_CANCELED':
    case 'Canceled':
      return 'muted'
    case 'WORKFLOW_EXECUTION_STATUS_CONTINUED_AS_NEW':
    case 'ContinuedAsNew':
      return 'accent'
    default:
      return 'muted'
  }
}

export function shortStatus(s: string): string {
  return s.replace(/^WORKFLOW_EXECUTION_STATUS_/, '').toLowerCase()
}

// ── Namespaces ─────────────────────────────────────────────────────

export const namespaceUrls = {
  list: (pageSize = 200) => `${ROOT}/namespaces${qs({ pageSize })}`,
  describe: (ns: string) => `${ROOT}/namespaces/${enc(ns)}`,
}

export const Namespaces = {
  listUrl: namespaceUrls.list,
  describeUrl: namespaceUrls.describe,
  register: (n: Partial<Namespace>) => request<Namespace>('POST', `${ROOT}/namespaces`, n),
  update: (ns: string, patch: Partial<Namespace>) =>
    request<Namespace>('POST', `${ROOT}/namespaces/${enc(ns)}`, patch),
  // Stub: backend does not yet expose namespace metadata mutation.
  // Returns 501 today; route shape ready.
  updateMetadata: (ns: string, summary: string, details?: string) =>
    request<{ status: string }>('POST', `${ROOT}/namespaces/${enc(ns)}/metadata`, { summary, details }),
  getMetadata: (ns: string) => `${ROOT}/namespaces/${enc(ns)}/metadata`,
}

// ── Workflows ──────────────────────────────────────────────────────

export const workflowUrls = {
  list: (ns: string, opts: { query?: string; pageSize?: number; nextPageToken?: string } = {}) =>
    `${ROOT}/namespaces/${enc(ns)}/workflows${qs(opts)}`,
  describe: (ns: string, workflowId: string, runId?: string) =>
    `${ROOT}/namespaces/${enc(ns)}/workflows/${enc(workflowId)}${qs({ 'execution.runId': runId })}`,
  history: (ns: string, workflowId: string, runId?: string, nextPageToken?: string) =>
    `${ROOT}/namespaces/${enc(ns)}/workflows/${enc(workflowId)}/history${qs({ runId, nextPageToken })}`,
}

export const Workflows = {
  listUrl: workflowUrls.list,
  describeUrl: workflowUrls.describe,
  historyUrl: workflowUrls.history,

  list: async (
    ns: string,
    opts: { query?: string; pageSize?: number; nextPageToken?: string } = {},
    fetcher: (url: string) => Promise<unknown> = (u) => fetch(u, { credentials: 'same-origin' }).then((r) => r.json()),
  ): Promise<Cursor<ListWorkflowExecutionsResponse>> => {
    const body = (await fetcher(workflowUrls.list(ns, opts))) as ListWorkflowExecutionsResponse
    return { data: body, nextPageToken: body.nextPageToken ?? null }
  },

  start: (
    ns: string,
    req: {
      workflowId: string
      runId?: string
      workflowType: { name: string }
      taskQueue: { name: string }
      input?: unknown
      memo?: Record<string, unknown>
      searchAttributes?: SearchAttributesSchema
    },
  ) => request<WorkflowExecution>('POST', `${ROOT}/namespaces/${enc(ns)}/workflows`, req),

  signal: (ns: string, workflowId: string, runId: string | undefined, name: string, payload?: unknown) =>
    request<{ status: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/workflows/${enc(workflowId)}/signal${qs({ runId })}`,
      { name, payload },
    ),

  cancel: (ns: string, workflowId: string, runId?: string) =>
    request<WorkflowExecution>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/workflows/${enc(workflowId)}/cancel${qs({ runId })}`,
    ),

  terminate: (ns: string, workflowId: string, runId?: string, reason?: string) =>
    request<WorkflowExecution>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/workflows/${enc(workflowId)}/terminate${qs({ runId })}`,
      { reason },
    ),

  // Stub: engine-level reset has not landed; backend returns 501.
  reset: (
    ns: string,
    workflowId: string,
    runId: string | undefined,
    body: { eventId: number; reason: string; resetReapplyType?: string },
  ) =>
    request<{ runId: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/workflows/${enc(workflowId)}/reset${qs({ runId })}`,
      body,
    ),

  // Stub: the worker SDK runtime owns query routing; backend returns 501.
  query: (
    ns: string,
    workflowId: string,
    runId: string | undefined,
    queryType: string,
    args?: unknown,
  ) =>
    request<{ result?: unknown; rejected?: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/workflows/${enc(workflowId)}/query${qs({ runId })}`,
      { queryType, args },
    ),

  // Listing alternate executions of the same workflowId (open + closed
  // history). Today the backend only returns the active record; this
  // call is shaped for when the visibility store ships.
  listExecutionsUrl: (ns: string, workflowId: string) =>
    `${ROOT}/namespaces/${enc(ns)}/workflows/${enc(workflowId)}/executions`,
}

// ── Schedules ──────────────────────────────────────────────────────

export const scheduleUrls = {
  list: (ns: string, opts: { pageSize?: number; nextPageToken?: string } = {}) =>
    `${ROOT}/namespaces/${enc(ns)}/schedules${qs(opts)}`,
  describe: (ns: string, scheduleId: string) =>
    `${ROOT}/namespaces/${enc(ns)}/schedules/${enc(scheduleId)}`,
  matchingTimes: (ns: string, scheduleId: string, start: string, end: string) =>
    `${ROOT}/namespaces/${enc(ns)}/schedules/${enc(scheduleId)}/matching-times${qs({ start, end })}`,
}

export const Schedules = {
  listUrl: scheduleUrls.list,
  describeUrl: scheduleUrls.describe,
  matchingTimesUrl: scheduleUrls.matchingTimes,

  create: (ns: string, schedule: Schedule) =>
    request<Schedule>('POST', `${ROOT}/namespaces/${enc(ns)}/schedules`, schedule),

  // Stub: backend has create + describe + delete + pause/unpause; full
  // update lands when the schedule engine is wired.
  update: (ns: string, scheduleId: string, schedule: Partial<Schedule>) =>
    request<Schedule>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/schedules/${enc(scheduleId)}`,
      schedule,
    ),

  delete: (ns: string, scheduleId: string) =>
    request<{ status: string }>('DELETE', `${ROOT}/namespaces/${enc(ns)}/schedules/${enc(scheduleId)}`),

  pause: (ns: string, scheduleId: string, note?: string) =>
    request<{ status: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/schedules/${enc(scheduleId)}/pause`,
      { note },
    ),

  unpause: (ns: string, scheduleId: string) =>
    request<{ status: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/schedules/${enc(scheduleId)}/unpause`,
    ),

  // Stub: trigger-now fires a one-off action of the schedule's workflow
  // immediately. Backend returns 501 today.
  trigger: (ns: string, scheduleId: string, overlapPolicy?: string) =>
    request<{ status: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/schedules/${enc(scheduleId)}/trigger`,
      { overlapPolicy },
    ),
}

// ── Batch operations ───────────────────────────────────────────────

export const batchUrls = {
  list: (ns: string, opts: { pageSize?: number; nextPageToken?: string } = {}) =>
    `${ROOT}/namespaces/${enc(ns)}/batches${qs(opts)}`,
  describe: (ns: string, batchId: string) => `${ROOT}/namespaces/${enc(ns)}/batches/${enc(batchId)}`,
}

export const Batches = {
  listUrl: batchUrls.list,
  describeUrl: batchUrls.describe,
  create: (ns: string, batch: Partial<BatchOperation>) =>
    request<BatchOperation>('POST', `${ROOT}/namespaces/${enc(ns)}/batches`, batch),
  // Stub: terminate-batch RPC not yet wired in the native engine.
  terminate: (ns: string, batchId: string, reason?: string) =>
    request<{ status: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/batches/${enc(batchId)}/terminate`,
      { reason },
    ),
}

// ── Deployments ────────────────────────────────────────────────────

export const deploymentUrls = {
  list: (ns: string) => `${ROOT}/namespaces/${enc(ns)}/deployments`,
  describe: (ns: string, name: string) => `${ROOT}/namespaces/${enc(ns)}/deployments/${enc(name)}`,
  versionDescribe: (ns: string, name: string, buildId: string) =>
    `${ROOT}/namespaces/${enc(ns)}/deployments/${enc(name)}/versions/${enc(buildId)}`,
  versionValidate: (ns: string, name: string, buildId: string) =>
    `${ROOT}/namespaces/${enc(ns)}/deployments/${enc(name)}/versions/${enc(buildId)}/validate`,
}

export interface DeploymentCreateInput {
  name: string
  description?: string
  ownerEmail?: string
  defaultCompute?: Record<string, unknown>
}

export interface DeploymentUpdateInput {
  description?: string
  ownerEmail?: string
  defaultCompute?: Record<string, unknown>
}

export interface VersionCreateInput {
  buildId: string
  description?: string
  image?: string
  region?: string
  compute?: Record<string, unknown>
  env?: Record<string, string>
}

export interface VersionUpdateInput {
  description?: string
  image?: string
  region?: string
  compute?: Record<string, unknown>
  env?: Record<string, string>
}

export interface ValidateConnectionResult {
  valid: boolean
  message?: string
  network?: boolean
  workerRegistered?: boolean
  heartbeatReceived?: boolean
  latencyMs?: number
}

export const Deployments = {
  listUrl: deploymentUrls.list,
  describeUrl: deploymentUrls.describe,
  versionDescribeUrl: deploymentUrls.versionDescribe,
  versionValidateUrl: deploymentUrls.versionValidate,

  create: (ns: string, deployment: DeploymentCreateInput | Partial<Deployment>) =>
    request<Deployment>('POST', `${ROOT}/namespaces/${enc(ns)}/deployments`, deployment),

  // Full update of deployment metadata. Engine route shape ready; backend
  // returns 501 until the mutation handler lands.
  update: (ns: string, deploymentName: string, patch: DeploymentUpdateInput) =>
    request<Deployment>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/deployments/${enc(deploymentName)}`,
      patch,
    ),

  // Delete a deployment series. Backend refuses with 409 if any versions
  // are still attached unless force=true cascades the delete.
  deleteDeployment: (ns: string, deploymentName: string, force = false) =>
    request<{ status: string }>(
      'DELETE',
      `${ROOT}/namespaces/${enc(ns)}/deployments/${enc(deploymentName)}${qs({ force: force ? 'true' : undefined })}`,
    ),

  // Stub: setCurrent flips the active build; backend returns 501.
  setCurrent: (ns: string, deploymentName: string, buildId: string) =>
    request<Deployment>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/deployments/${enc(deploymentName)}/set-current`,
      { buildId },
    ),
  // Inverse of setCurrent — clears the active build so no version is
  // routed to. Backend treats `buildId: ""` as the unset sentinel.
  unsetCurrent: (ns: string, deploymentName: string) =>
    request<Deployment>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/deployments/${enc(deploymentName)}/set-current`,
      { buildId: '' },
    ),

  // Register a new version (build id) under a deployment series.
  createVersion: (ns: string, deploymentName: string, version: VersionCreateInput) =>
    request<{ buildId: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/deployments/${enc(deploymentName)}/versions`,
      version,
    ),

  // Patch a version's metadata (image, env, compute). Build id itself is
  // immutable; routing identity is the build id, not metadata.
  updateVersion: (
    ns: string,
    deploymentName: string,
    buildId: string,
    patch: VersionUpdateInput,
  ) =>
    request<{ buildId: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/deployments/${enc(deploymentName)}/versions/${enc(buildId)}`,
      patch,
    ),

  // Delete a single version. Backend refuses if buildId === defaultBuildId
  // (set another current first).
  deleteVersion: (ns: string, deploymentName: string, buildId: string) =>
    request<{ status: string }>(
      'DELETE',
      `${ROOT}/namespaces/${enc(ns)}/deployments/${enc(deploymentName)}/versions/${enc(buildId)}`,
    ),

  // Smoke-test connectivity for a version: probes registration, heartbeat,
  // and round-trip latency. Returns a typed result envelope.
  validateVersion: (ns: string, deploymentName: string, buildId: string) =>
    request<ValidateConnectionResult>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/deployments/${enc(deploymentName)}/versions/${enc(buildId)}/validate`,
    ),
}

// ── Workers / Task Queues ──────────────────────────────────────────

export const taskQueueUrls = {
  list: (ns: string) => `${ROOT}/namespaces/${enc(ns)}/task-queues`,
  describe: (ns: string, name: string) => `${ROOT}/namespaces/${enc(ns)}/task-queues/${enc(name)}`,
  workers: (ns: string, name: string) => `${ROOT}/namespaces/${enc(ns)}/task-queues/${enc(name)}/workers`,
  // Stub: per-partition listing; backend returns 501.
  partitions: (ns: string, name: string) =>
    `${ROOT}/namespaces/${enc(ns)}/task-queues/${enc(name)}/partitions`,
}

export const TaskQueues = {
  listUrl: taskQueueUrls.list,
  describeUrl: taskQueueUrls.describe,
  workersUrl: taskQueueUrls.workers,
  partitionsUrl: taskQueueUrls.partitions,
}

export const workerUrls = {
  list: (ns: string) => `${ROOT}/namespaces/${enc(ns)}/workers`,
  describe: (ns: string, identity: string) =>
    `${ROOT}/namespaces/${enc(ns)}/workers/${enc(identity)}`,
}

export const Workers = {
  listUrl: workerUrls.list,
  describeUrl: workerUrls.describe,
  // Graceful disconnect — engine clears the poller record so no new
  // tasks are dispatched. Gated by settings.workerStopSupported.
  stop: (ns: string, identity: string) =>
    request<{ status: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/workers/${enc(identity)}/stop`,
    ),
}

// ── Search attributes / Search ────────────────────────────────────

export const searchUrls = {
  attributes: (ns: string) => `${ROOT}/namespaces/${enc(ns)}/search-attributes`,
  workflows: (ns: string, query: string, pageSize = 100, nextPageToken?: string) =>
    `${ROOT}/namespaces/${enc(ns)}/workflows${qs({ query, pageSize, nextPageToken })}`,
}

export const Search = {
  attributesUrl: searchUrls.attributes,
  workflowsUrl: searchUrls.workflows,
  // Stub: add-search-attribute requires an admin handler that does
  // not yet exist; route shape ready.
  addAttribute: (ns: string, name: string, type: string) =>
    request<{ status: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/search-attributes`,
      { name, type },
    ),
  // Inverse of addAttribute — removes a custom attribute. System
  // attributes cannot be deleted; the UI gates that path.
  deleteAttribute: (ns: string, name: string) =>
    request<{ status: string }>(
      'DELETE',
      `${ROOT}/namespaces/${enc(ns)}/search-attributes/${enc(name)}`,
    ),
}

// ── Nexus ──────────────────────────────────────────────────────────

export const nexusUrls = {
  list: (ns?: string) =>
    ns ? `${ROOT}/namespaces/${enc(ns)}/nexus` : `${ROOT}/nexus`,
  describe: (ns: string, endpointId: string) =>
    `${ROOT}/namespaces/${enc(ns)}/nexus/${enc(endpointId)}`,
}

export const Nexus = {
  listUrl: nexusUrls.list,
  describeUrl: nexusUrls.describe,
  create: (ns: string, spec: NexusEndpointSpec) =>
    request<NexusEndpoint>('POST', `${ROOT}/namespaces/${enc(ns)}/nexus`, spec),
  update: (ns: string, endpointId: string, spec: Partial<NexusEndpointSpec>) =>
    request<NexusEndpoint>('POST', `${ROOT}/namespaces/${enc(ns)}/nexus/${enc(endpointId)}`, spec),
  delete: (ns: string, endpointId: string) =>
    request<{ status: string }>('DELETE', `${ROOT}/namespaces/${enc(ns)}/nexus/${enc(endpointId)}`),
}

// ── Archival ───────────────────────────────────────────────────────

export const archivalUrls = {
  // Archived workflows live under the same /workflows endpoint with
  // ?archived=true. When the persistence layer ships, this becomes a
  // distinct visibility query.
  query: (
    ns: string,
    opts: { query?: string; pageSize?: number; nextPageToken?: string } = {},
  ) => `${ROOT}/namespaces/${enc(ns)}/archival${qs(opts)}`,
}

export const Archival = {
  queryUrl: archivalUrls.query,
}

// ── Identities ─────────────────────────────────────────────────────

export const identityUrls = {
  list: (ns: string) => `${ROOT}/namespaces/${enc(ns)}/identities`,
}

export const Identities = {
  listUrl: identityUrls.list,
  grant: (ns: string, identity: Partial<Identity>) =>
    request<Identity>('POST', `${ROOT}/namespaces/${enc(ns)}/identities`, identity),
  // Inverse of grant — removes an identity's access to a namespace.
  // Identity is keyed by email per the IAM mapping.
  revoke: (ns: string, email: string) =>
    request<{ status: string }>(
      'DELETE',
      `${ROOT}/namespaces/${enc(ns)}/identities/${enc(email)}`,
    ),
}

// ── User Metadata ──────────────────────────────────────────────────

export const userMetadataUrls = {
  forNamespace: (ns: string) => Namespaces.getMetadata(ns),
  forWorkflow: (ns: string, workflowId: string, runId?: string) =>
    `${ROOT}/namespaces/${enc(ns)}/workflows/${enc(workflowId)}/metadata${qs({ runId })}`,
}

export const UserMetadata = {
  getNamespaceUrl: userMetadataUrls.forNamespace,
  getWorkflowUrl: userMetadataUrls.forWorkflow,
  updateNamespace: Namespaces.updateMetadata,
  // Stub: per-workflow metadata mutation requires the metadata
  // command in the worker SDK; route ready.
  updateWorkflow: (ns: string, workflowId: string, runId: string | undefined, summary: string, details?: string) =>
    request<{ status: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/workflows/${enc(workflowId)}/metadata${qs({ runId })}`,
      { summary, details },
    ),
}

// ── Activities (standalone) ───────────────────────────────────────
//
// Standalone activities live on the same /v1/tasks tree. The id+run
// pair scopes mutations the same way workflows do. History uses the
// shared `events` envelope so the workflow history adapter renders
// the response shape unchanged.

export const activityUrls = {
  list: (ns: string, opts: { query?: string; pageSize?: number; nextPageToken?: string } = {}) =>
    `${ROOT}/namespaces/${enc(ns)}/activities${qs(opts)}`,
  describe: (ns: string, activityId: string, runId: string) =>
    `${ROOT}/namespaces/${enc(ns)}/activities/${enc(activityId)}/${enc(runId)}`,
  history: (ns: string, activityId: string, runId: string, nextPageToken?: string) =>
    `${ROOT}/namespaces/${enc(ns)}/activities/${enc(activityId)}/${enc(runId)}/history${qs({ nextPageToken })}`,
}

export const Activities = {
  listUrl: activityUrls.list,
  describeUrl: activityUrls.describe,
  historyUrl: activityUrls.history,

  list: async (
    ns: string,
    opts: { query?: string; pageSize?: number; nextPageToken?: string } = {},
    fetcher: (url: string) => Promise<unknown> = (u) => fetch(u, { credentials: 'same-origin' }).then((r) => r.json()),
  ): Promise<Cursor<ListActivitiesResponse>> => {
    const body = (await fetcher(activityUrls.list(ns, opts))) as ListActivitiesResponse
    return { data: body, nextPageToken: body.nextPageToken ?? null }
  },

  start: (ns: string, req: StartActivityRequest) =>
    request<Activity>('POST', `${ROOT}/namespaces/${enc(ns)}/activities`, req),

  cancel: (ns: string, activityId: string, runId: string, reason?: string) =>
    request<{ status: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/activities/${enc(activityId)}/${enc(runId)}/cancel`,
      { reason },
    ),

  // Operator-side completion. The worker SDK is the natural producer of
  // success — this surface exists for stuck-activity recovery (drained
  // worker, lost host).
  complete: (ns: string, activityId: string, runId: string, result?: unknown) =>
    request<{ status: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/activities/${enc(activityId)}/${enc(runId)}/complete`,
      { result },
    ),

  fail: (ns: string, activityId: string, runId: string, message: string, stackTrace?: string) =>
    request<{ status: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/activities/${enc(activityId)}/${enc(runId)}/fail`,
      { failure: { message, stackTrace } },
    ),

  // Heartbeat-reset bumps the activity's last-heartbeat timestamp from
  // the operator side. Used to keep an activity alive past
  // heartbeatTimeout while the worker recovers.
  heartbeat: (ns: string, activityId: string, runId: string, details?: unknown) =>
    request<{ status: string }>(
      'POST',
      `${ROOT}/namespaces/${enc(ns)}/activities/${enc(activityId)}/${enc(runId)}/heartbeat`,
      { details },
    ),
}

// ── Settings (UI bootstrap) ───────────────────────────────────────

export const settingsUrls = {
  get: () => `${ROOT}/settings`,
  health: () => `${ROOT}/health`,
}

export const SettingsApi = {
  getUrl: settingsUrls.get,
  healthUrl: settingsUrls.health,
}

// ── Cluster (distributed engine, optional) ────────────────────────
//
// `GET /v1/tasks/cluster` returns 200 with the topology when the
// engine runs in replicated mode, 404 on single-node deployments.
// `GET /v1/tasks/cluster/health` returns 200 in-quorum, 503 otherwise.
// The UI calls statusUrl through useFetch and treats a 404 as
// "single-node — hide the cluster surface".

export const clusterUrls = {
  status: () => `${ROOT}/cluster`,
  health: () => `${ROOT}/cluster/health`,
}

export const Cluster = {
  statusUrl: clusterUrls.status,
  healthUrl: clusterUrls.health,
  getStatus: () =>
    fetch(clusterUrls.status(), { credentials: 'same-origin', headers: { Accept: 'application/json' } }).then(
      async (r) => {
        if (!r.ok) throw new ApiError(r.status, await r.json().catch(() => null), `cluster → ${r.status}`)
        return r.json() as Promise<import('./types').ClusterStatus>
      },
    ),
  getHealth: () =>
    fetch(clusterUrls.health(), { credentials: 'same-origin' }).then((r) => ({ ok: r.ok, status: r.status })),
}

// ── Namespace migration ──────────────────────────────────────────
//
// `POST /v1/tasks/namespaces/{ns}/migrate` body `{toNode}` returns
// `{jobId,state}`; subsequent `GET ...?jobId=...` polls the same job.

export const migrationUrls = {
  start: (ns: string) => `${ROOT}/namespaces/${enc(ns)}/migrate`,
  status: (ns: string, jobId: string) =>
    `${ROOT}/namespaces/${enc(ns)}/migrate${qs({ jobId })}`,
}

export const Migration = {
  startUrl: migrationUrls.start,
  statusUrl: migrationUrls.status,
  start: (ns: string, toNode: string) =>
    request<import('./types').MigrationJob>('POST', migrationUrls.start(ns), { toNode }),
  status: (ns: string, jobId: string) =>
    fetch(migrationUrls.status(ns, jobId), { credentials: 'same-origin', headers: { Accept: 'application/json' } }).then(
      async (r) => {
        if (!r.ok) throw new ApiError(r.status, await r.json().catch(() => null), `migrate → ${r.status}`)
        return r.json() as Promise<import('./types').MigrationJob>
      },
    ),
}

export type {
  ClusterStatus,
  Validator,
  ValidatorHealth,
  ValidatorRole,
  ReplicatorKind,
  ShardInfo,
  MigrationJob,
  MigrationPhase,
} from './types'

// ── Aggregate response types — re-exported for convenience ────────

export type {
  Cursor,
  NextPageToken,
  ListNamespacesResponse,
  ListSchedulesResponse,
  ListBatchOperationsResponse,
  ListDeploymentsResponse,
  ListNexusEndpointsResponse,
  GetWorkflowExecutionHistoryResponse,
  WorkflowExecutionAPIResponse,
  DescribeTaskQueueResponse,
  TaskQueueSummary,
  TaskQueuePartition,
  SearchAttributesResponse,
  SearchAttributesSchema,
  Settings,
  HistoryEvent,
  EventGroup,
  EventTypeCategory,
  EventClassification,
  EventType,
  WorkflowStatus,
  ScheduleStatus,
  BatchOperationType,
  BatchOperationState,
  PendingActivityState,
  DeploymentStatus,
  ScheduleSpec,
  IntervalSpec,
  CalendarSpec,
  StructuredCalendarSpec,
} from './types'
