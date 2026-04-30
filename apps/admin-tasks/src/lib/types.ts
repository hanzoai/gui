// Canonical domain types for the Hanzo Tasks SPA. Mirrors the upstream
// Temporal Web UI types tree (src/lib/types/{workflows,events,schedule,
// batch,nexus,namespace,worker,deployment,task-queue,global}.ts) but
// strips the proto-derived bits we don't carry on the wire. Source of
// truth for every feature agent — extend here, not inside a page.
//
// JSON shape matches /v1/tasks/* responses produced by
// pkg/tasks/embed.go. Ints come back as strings (proto convention), so
// numeric counters are typed as `string` where the backend emits them
// that way. UI helpers should `Number(x)` at the call site.

// ── primitives ─────────────────────────────────────────────────────

export type Optional<T, K extends keyof T = keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>
export type Replace<T, U extends Record<string, unknown>> = Omit<T, keyof U> & U

export type NextPageToken = string | null
export interface Cursor<T> {
  data: T
  nextPageToken?: NextPageToken
}

export interface Payload {
  metadata?: Record<string, string>
  data?: string
}
export type Payloads = { payloads?: Payload[] }
export type Memo = { fields?: Record<string, Payload> }

// Duration on the wire is the proto-style "Ns" / "12.34s" string.
export type Duration = string
export type Timestamp = string

// ── status enums (typed string unions, exhaustivity-safe) ──────────

export type WorkflowStatus =
  | 'Running'
  | 'Completed'
  | 'Failed'
  | 'Canceled'
  | 'Terminated'
  | 'ContinuedAsNew'
  | 'TimedOut'
  | 'Paused'
  | 'Pending'
  | 'Unspecified'

export const WORKFLOW_STATUSES: WorkflowStatus[] = [
  'Running',
  'Completed',
  'Failed',
  'Canceled',
  'Terminated',
  'ContinuedAsNew',
  'TimedOut',
  'Paused',
  'Pending',
  'Unspecified',
]

export type WorkflowWireStatus =
  | 'WORKFLOW_EXECUTION_STATUS_UNSPECIFIED'
  | 'WORKFLOW_EXECUTION_STATUS_RUNNING'
  | 'WORKFLOW_EXECUTION_STATUS_COMPLETED'
  | 'WORKFLOW_EXECUTION_STATUS_FAILED'
  | 'WORKFLOW_EXECUTION_STATUS_CANCELED'
  | 'WORKFLOW_EXECUTION_STATUS_TERMINATED'
  | 'WORKFLOW_EXECUTION_STATUS_CONTINUED_AS_NEW'
  | 'WORKFLOW_EXECUTION_STATUS_TIMED_OUT'
  | 'WORKFLOW_EXECUTION_STATUS_PENDING'

export type ScheduleStatus = 'Running' | 'Paused'

export type BatchOperationType =
  | 'Cancel'
  | 'Terminate'
  | 'Reset'
  | 'Signal'
  | 'Delete'
  | 'Unspecified'

export type BatchOperationState =
  | 'Running'
  | 'Completed'
  | 'Failed'
  | 'Unspecified'

export type PendingActivityState =
  | 'Unspecified'
  | 'Scheduled'
  | 'Started'
  | 'CancelRequested'
  | 'Paused'

export type DeploymentStatus =
  | 'Ramping'
  | 'Current'
  | 'Latest'
  | 'Draining'
  | 'Drained'
  | 'Inactive'
  | 'Created'

export type EventView = 'compact' | 'feed' | 'json'
export type TaskQueueView = 'workers' | 'versioning'

// EventType is the union of all upstream WorkflowExecution history
// event names. Kept loose (string + tagged variants) so a forward-
// compat backend release that emits new types still renders.
export type EventType =
  | 'WorkflowExecutionStarted'
  | 'WorkflowExecutionCompleted'
  | 'WorkflowExecutionFailed'
  | 'WorkflowExecutionTimedOut'
  | 'WorkflowExecutionTerminated'
  | 'WorkflowExecutionCanceled'
  | 'WorkflowExecutionContinuedAsNew'
  | 'WorkflowExecutionSignaled'
  | 'WorkflowExecutionCancelRequested'
  | 'WorkflowTaskScheduled'
  | 'WorkflowTaskStarted'
  | 'WorkflowTaskCompleted'
  | 'WorkflowTaskFailed'
  | 'WorkflowTaskTimedOut'
  | 'ActivityTaskScheduled'
  | 'ActivityTaskStarted'
  | 'ActivityTaskCompleted'
  | 'ActivityTaskFailed'
  | 'ActivityTaskTimedOut'
  | 'ActivityTaskCancelRequested'
  | 'ActivityTaskCanceled'
  | 'TimerStarted'
  | 'TimerFired'
  | 'TimerCanceled'
  | 'MarkerRecorded'
  | 'StartChildWorkflowExecutionInitiated'
  | 'StartChildWorkflowExecutionFailed'
  | 'ChildWorkflowExecutionStarted'
  | 'ChildWorkflowExecutionCompleted'
  | 'ChildWorkflowExecutionFailed'
  | 'ChildWorkflowExecutionCanceled'
  | 'ChildWorkflowExecutionTimedOut'
  | 'ChildWorkflowExecutionTerminated'
  | 'SignalExternalWorkflowExecutionInitiated'
  | 'SignalExternalWorkflowExecutionFailed'
  | 'ExternalWorkflowExecutionSignaled'
  | 'RequestCancelExternalWorkflowExecutionInitiated'
  | 'RequestCancelExternalWorkflowExecutionFailed'
  | 'ExternalWorkflowExecutionCancelRequested'
  | 'UpsertWorkflowSearchAttributes'
  | 'WorkflowExecutionUpdateAdmitted'
  | 'WorkflowExecutionUpdateAccepted'
  | 'WorkflowExecutionUpdateRejected'
  | 'WorkflowExecutionUpdateCompleted'
  | 'WorkflowExecutionOptionsUpdated'
  | 'WorkflowPropertiesModified'
  | 'NexusOperationScheduled'
  | 'NexusOperationStarted'
  | 'NexusOperationCompleted'
  | 'NexusOperationFailed'
  | 'NexusOperationCanceled'
  | 'NexusOperationTimedOut'
  | 'NexusOperationCancelRequested'
  | 'NexusOperationCancelRequestCompleted'
  | 'NexusOperationCancelRequestFailed'
  // Forward-compat: backends may emit a SCREAMING_SNAKE wire form like
  // WORKFLOW_EXECUTION_STARTED in the synth path. We accept both.
  | (string & { readonly __brand?: 'EventTypeUnknown' })

export type EventTypeCategory =
  | 'workflow'
  | 'activity'
  | 'timer'
  | 'signal'
  | 'marker'
  | 'child-workflow'
  | 'nexus'
  | 'update'
  | 'command'
  | 'other'

export type EventClassification =
  | 'Pending'
  | 'Scheduled'
  | 'Started'
  | 'Completed'
  | 'Failed'
  | 'TimedOut'
  | 'Canceled'
  | 'CancelRequested'
  | 'Signaled'
  | 'Fired'
  | 'Initiated'
  | 'Recorded'
  | 'Terminated'
  | 'ContinuedAsNew'

// ── workflows ──────────────────────────────────────────────────────

export interface ExecutionRef {
  workflowId: string
  runId: string
}

export interface WorkflowType {
  name: string
}

export interface TaskQueueRef {
  name: string
  kind?: 'Normal' | 'Sticky' | 'Unspecified'
}

export interface PendingActivity {
  activityId: string
  id?: string
  activityType?: WorkflowType | string
  state?: PendingActivityState
  attempt?: number
  maximumAttempts?: number
  scheduledTime?: Timestamp
  lastStartedTime?: Timestamp
  scheduleToCloseTimeout?: Duration
  lastFailure?: { message?: string; stackTrace?: string } | null
  heartbeatDetails?: Payloads
  pauseInfo?: { manual?: { reason?: string; identity?: string }; pauseTime?: Timestamp }
}

export interface PendingNexusOperation {
  endpoint: string
  service: string
  operation: string
  state?: string
  scheduledEventId?: number
  scheduleToStartTimeout?: Duration | null
  startToCloseTimeout?: Duration | null
}

export interface PendingChildren {
  workflowId: string
  runId?: string
  workflowTypeName?: string
  initiatedId?: string
  parentClosePolicy?: string
}

export interface PendingWorkflowTaskInfo {
  state?: string
  scheduledTime?: Timestamp
  originalScheduledTime?: Timestamp
  startedTime?: Timestamp
  attempt?: number
}

export interface SearchAttributesMap {
  indexedFields?: Record<string, Payload>
}

export interface DecodedSearchAttributes {
  indexedFields?: Record<string, string>
}

// WorkflowExecution — wire shape from `GET /v1/tasks/namespaces/{ns}/workflows`
// (item) and `GET /v1/tasks/namespaces/{ns}/workflows/{id}` (workflowExecutionInfo).
export interface WorkflowExecution {
  execution: ExecutionRef
  type: WorkflowType
  startTime?: Timestamp
  closeTime?: Timestamp
  executionTime?: Timestamp
  status: WorkflowWireStatus | WorkflowStatus | string
  taskQueue?: string
  // Backend currently emits this as a JSON number; upstream proto
  // shape is a string. UI code reads it as `wf.historyLength ?? 0`.
  historyLength?: number
  historySizeBytes?: string | number
  stateTransitionCount?: string | number
  input?: unknown
  result?: unknown
  memo?: Memo | Record<string, unknown> | null
  searchAttributes?: SearchAttributesMap | null
  searchAttrs?: Record<string, unknown> | null
  pendingActivities?: PendingActivity[] | null
  pendingNexusOperations?: PendingNexusOperation[] | null
  pendingChildren?: PendingChildren[] | null
  parentExecution?: ExecutionRef | null
  rootExecution?: ExecutionRef | null
  userMetadata?: { summary?: string; details?: string } | null
  assignedBuildId?: string
  versioningInfo?: VersioningInfo
  callbacks?: Callback[]
}

export interface WorkflowExecutionAPIResponse {
  workflowExecutionInfo: WorkflowExecution
  pendingActivities?: PendingActivity[]
  pendingChildren?: PendingChildren[]
  pendingNexusOperations?: PendingNexusOperation[]
  executionConfig?: WorkflowExecutionConfig
  callbacks?: Callback[]
  pendingWorkflowTask?: PendingWorkflowTaskInfo
}

export interface WorkflowExecutionConfig {
  taskQueue?: TaskQueueRef
  defaultWorkflowTaskTimeout?: Duration
  workflowExecutionTimeout?: Duration
  workflowRunTimeout?: Duration
}

export interface ListWorkflowExecutionsResponse {
  executions?: WorkflowExecution[]
  nextPageToken?: NextPageToken
}

// ── history events ─────────────────────────────────────────────────

export interface HistoryEventBase {
  eventId: string
  eventTime?: Timestamp
  eventType: EventType
  taskId?: string
  version?: string
  workerMayIgnore?: boolean
  attributes?: Record<string, unknown>
  links?: EventLink[]
  principal?: Principal
}

export interface Principal {
  type?: string
  name?: string
}

export interface EventLink {
  workflowEvent?: {
    namespace: string
    workflowId: string
    runId: string
    eventRef?: { eventId?: string; eventType?: EventType }
  }
}

export type HistoryEvent = HistoryEventBase

export interface EventHistory {
  events: HistoryEvent[]
}

export interface GetWorkflowExecutionHistoryResponse {
  history?: EventHistory
  // Hanzo Tasks engine returns events flat at the top level.
  events?: HistoryEvent[]
  nextCursor?: number
  rawHistory?: unknown
  archived?: boolean
  nextPageToken?: NextPageToken
}

// EventGroup is the UI-side aggregation: a workflow event plus all its
// follow-on events (Activity Scheduled→Started→Completed) merged into
// one row. Built by stores/event-aggregation.
export interface EventGroup {
  id: string
  name: string
  category: EventTypeCategory
  classification: EventClassification
  initialEvent: HistoryEvent
  events: HistoryEvent[]
  pendingActivity?: PendingActivity
  pendingNexus?: PendingNexusOperation
  attempt?: number
  isPending: boolean
  startTime?: Timestamp
  endTime?: Timestamp
  timestamp?: Timestamp
}

export type IterableEvent = HistoryEvent | EventGroup

// ── schedules ──────────────────────────────────────────────────────

export interface CalendarSpec {
  second?: string
  minute?: string
  hour?: string
  dayOfMonth?: string
  month?: string
  year?: string
  dayOfWeek?: string
  comment?: string
}

export interface RangeSpec {
  start: number
  end: number
  step?: number
}

export interface StructuredCalendarSpec {
  second?: RangeSpec[]
  minute?: RangeSpec[]
  hour?: RangeSpec[]
  dayOfMonth?: RangeSpec[]
  month?: RangeSpec[]
  year?: RangeSpec[]
  dayOfWeek?: RangeSpec[]
  comment?: string
}

export interface IntervalSpec {
  interval: Duration
  phase?: Duration
}

export interface ScheduleSpec {
  cronString?: string[]
  calendar?: CalendarSpec[]
  structuredCalendar?: StructuredCalendarSpec[]
  interval?: IntervalSpec[]
  excludeCalendar?: CalendarSpec[]
  excludeStructuredCalendar?: StructuredCalendarSpec[]
  startTime?: Timestamp
  endTime?: Timestamp
  jitter?: Duration
  timezoneName?: string
}

export type OverlapPolicy =
  | 'Unspecified'
  | 'Skip'
  | 'BufferOne'
  | 'BufferAll'
  | 'CancelOther'
  | 'TerminateOther'
  | 'AllowAll'

export interface ScheduleAction {
  workflowType: WorkflowType
  taskQueue: string | TaskQueueRef
  workflowId?: string
  input?: unknown
  searchAttributes?: SearchAttributesMap
  memo?: Memo
}

export interface ScheduleState {
  paused: boolean
  notes?: string
  note?: string
  limitedActions?: boolean
  remainingActions?: number
}

export interface ScheduleInfo {
  createTime: Timestamp
  updateTime?: Timestamp
  actionCount?: number
  missedCatchupWindow?: number
  overlapSkipped?: number
  bufferDropped?: number
  bufferSize?: number
  recentActions?: Array<{ scheduleTime: Timestamp; actualTime?: Timestamp }>
  futureActionTimes?: Timestamp[]
}

export interface Schedule {
  scheduleId: string
  namespace: string
  spec: ScheduleSpec
  action: ScheduleAction
  state: ScheduleState
  info: ScheduleInfo
  policies?: {
    overlapPolicy?: OverlapPolicy
    catchupWindow?: Duration
    pauseOnFailure?: boolean
  }
  searchAttributes?: SearchAttributesMap
  memo?: Memo
}

export interface ListSchedulesResponse {
  schedules?: Schedule[]
  nextPageToken?: NextPageToken
}

// ── batch operations ───────────────────────────────────────────────

export interface BatchOperation {
  batchId: string
  jobId?: string
  namespace: string
  operationType?: BatchOperationType
  // `operation` is the wire-shape field name from the legacy API and
  // the current tasks server JSON. Treated as required so existing
  // pages can `b.operation.toLowerCase()` without nullable plumbing.
  operation: string
  reason: string
  query: string
  state: BatchOperationState | string
  startTime: Timestamp
  closeTime?: Timestamp
  totalOperationCount: number
  completeOperationCount: number
  failureOperationCount?: number
  identity?: string
}

export interface ListBatchOperationsResponse {
  batches?: BatchOperation[]
  operationInfo?: BatchOperation[]
  nextPageToken?: NextPageToken
}

// ── nexus ──────────────────────────────────────────────────────────

export interface NexusEndpointSpec {
  name: string
  description?: string
  descriptionString?: string
  target: string
  allowedCallerNamespaces?: string[]
}

export interface NexusEndpoint extends NexusEndpointSpec {
  namespace: string
  createTime: Timestamp
  updateTime?: Timestamp
  state?: string
  asyncOperationId?: string
}

export interface ListNexusEndpointsResponse {
  endpoints?: NexusEndpoint[]
  nextPageToken?: NextPageToken
}

export interface Callback {
  state?: string
  registrationTime?: Timestamp
  blockedReason?: string
  callback?: {
    nexus?: { url: string; header?: Record<string, string> }
    links?: EventLink[]
  }
}

// ── namespaces ─────────────────────────────────────────────────────

export interface NamespaceInfo {
  name: string
  state: 'Registered' | 'Deprecated' | 'Deleted' | 'Unspecified' | string
  description?: string
  ownerEmail?: string
  region?: string
  createTime?: Timestamp
}

export interface NamespaceConfig {
  workflowExecutionRetentionTtl: Duration
  // APS = actions-per-second cap. Backend always emits this; required
  // so namespace detail can render the value without nullable plumbing.
  apsLimit: number
  historyArchivalState?: string
  historyArchivalUri?: string
  visibilityArchivalState?: string
  visibilityArchivalUri?: string
}

export interface Namespace {
  namespaceInfo: NamespaceInfo
  config: NamespaceConfig
  isActive: boolean
  failoverVersion?: string
}

export interface ListNamespacesResponse {
  namespaces?: Namespace[]
  nextPageToken?: NextPageToken
}

// ── workers / task-queues ─────────────────────────────────────────

export interface Worker {
  identity: string
  taskQueue?: string
  lastAccessTime?: Timestamp
  buildId?: string
  ratePerSecond?: number
  pollerKind?: 'Workflow' | 'Activity' | 'Nexus'
}

export interface TaskQueueSummary {
  name: string
  workflows?: number
  running?: number
  latestStart?: Timestamp
}

export interface TaskQueuePartition {
  taskQueueName: string
  partitionId: number
  ownerHostId?: string
  forwarded?: boolean
}

export interface DescribeTaskQueueResponse {
  pollers?: Worker[]
  taskQueueStatus?: {
    backlogCountHint?: string
    readLevel?: string
    ackLevel?: string
    ratePerSecond?: number
  }
  versioningInfo?: VersioningInfo
}

// ── deployments ────────────────────────────────────────────────────

export interface VersioningInfo {
  behavior?: string
  version?: string
  deploymentVersion?: WorkerDeploymentVersion
}

export interface WorkerDeploymentVersion {
  buildId: string
  deploymentName: string
}

export interface BuildIdEntry {
  buildId: string
  state: DeploymentStatus | string
  createTime: Timestamp
}

export interface Deployment {
  seriesName: string
  namespace: string
  buildIds: BuildIdEntry[]
  defaultBuildId: string
  createTime: Timestamp
}

export interface ListDeploymentsResponse {
  deployments?: Deployment[]
  nextPageToken?: NextPageToken
}

// ── search attributes ──────────────────────────────────────────────

export const SEARCH_ATTRIBUTE_TYPE = {
  BOOL: 'Bool',
  DATETIME: 'Datetime',
  DOUBLE: 'Double',
  INT: 'Int',
  KEYWORD: 'Keyword',
  TEXT: 'Text',
  KEYWORDLIST: 'KeywordList',
  UNSPECIFIED: 'Unspecified',
} as const

export type SearchAttributeType =
  (typeof SEARCH_ATTRIBUTE_TYPE)[keyof typeof SEARCH_ATTRIBUTE_TYPE]

export type SearchAttributesSchema = Record<string, SearchAttributeType>

export interface SearchAttributesResponse {
  customAttributes?: SearchAttributesSchema
  systemAttributes?: SearchAttributesSchema
  storageSchema?: Record<string, string>
}

// ── identities ─────────────────────────────────────────────────────

export interface Identity {
  email: string
  namespace: string
  role: 'admin' | 'write' | 'read' | string
  grantTime: Timestamp
}

// ── settings (UI-only mirror of upstream src/lib/types/global.Settings) ─

export interface Settings {
  auth: { enabled: boolean; options: string[] }
  baseUrl: string
  codec: {
    endpoint?: string
    passAccessToken?: boolean
    includeCredentials?: boolean
  }
  defaultNamespace: string
  disableWriteActions: boolean
  workflowTerminateDisabled: boolean
  workflowCancelDisabled: boolean
  workflowSignalDisabled: boolean
  workflowResetDisabled: boolean
  workflowPauseDisabled: boolean
  batchActionsDisabled: boolean
  showTemporalSystemNamespace: boolean
  feedbackURL: string
  runtimeEnvironment: { isCloud: boolean; isLocal: boolean; envOverride: boolean }
  version: string
  // Capability flags surfaced by /v1/tasks/settings. All optional —
  // server backfills as the engine wires each subsystem. Treat absence
  // as "feature available" so legacy responses do not over-disable.
  namespaceWriteDisabled?: boolean
  advancedVisibilityEnabled?: boolean
  workerHeartbeatsEnabled?: boolean
  archivalEnabled?: boolean
  workerStopSupported?: boolean
}

// ── standalone activities ─────────────────────────────────────────
//
// Standalone activities are first-class entities that workers can start
// directly (i.e. without a workflow parent). The wire shape mirrors
// upstream Temporal's ActivityExecutionInfo. Status uses the
// ACTIVITY_EXECUTION_STATUS_* enum on the wire; the UI prefers the
// PascalCase short form via parseActivityStatus.

export type ActivityWireStatus =
  | 'ACTIVITY_EXECUTION_STATUS_UNSPECIFIED'
  | 'ACTIVITY_EXECUTION_STATUS_SCHEDULED'
  | 'ACTIVITY_EXECUTION_STATUS_RUNNING'
  | 'ACTIVITY_EXECUTION_STATUS_COMPLETED'
  | 'ACTIVITY_EXECUTION_STATUS_FAILED'
  | 'ACTIVITY_EXECUTION_STATUS_CANCELED'
  | 'ACTIVITY_EXECUTION_STATUS_TERMINATED'
  | 'ACTIVITY_EXECUTION_STATUS_TIMED_OUT'

export type ActivityStatus =
  | 'Scheduled'
  | 'Running'
  | 'Started'
  | 'Completed'
  | 'Failed'
  | 'Canceled'
  | 'Terminated'
  | 'TimedOut'
  | 'Unspecified'

export const ACTIVITY_STATUSES: ActivityStatus[] = [
  'Scheduled',
  'Running',
  'Started',
  'Completed',
  'Failed',
  'Canceled',
  'Terminated',
  'TimedOut',
  'Unspecified',
]

export interface ActivityRetryPolicy {
  initialInterval?: Duration
  backoffCoefficient?: number
  maximumInterval?: Duration
  maximumAttempts?: number
  nonRetryableErrorTypes?: string[]
}

export interface ActivityAttempt {
  attempt: number
  startTime?: Timestamp
  endTime?: Timestamp
  failure?: { message?: string; stackTrace?: string } | null
  workerIdentity?: string
}

export interface Activity {
  activityId: string
  runId: string
  namespace: string
  activityType: WorkflowType | string
  taskQueue: TaskQueueRef | string
  status: ActivityWireStatus | ActivityStatus | string
  attempt?: number
  maximumAttempts?: number
  scheduledTime?: Timestamp
  startedTime?: Timestamp
  closeTime?: Timestamp
  scheduleToCloseTimeout?: Duration
  scheduleToStartTimeout?: Duration
  startToCloseTimeout?: Duration
  heartbeatTimeout?: Duration
  lastHeartbeatTime?: Timestamp
  heartbeatDetails?: Payloads
  input?: unknown
  result?: unknown
  lastFailure?: { message?: string; stackTrace?: string } | null
  retryPolicy?: ActivityRetryPolicy
  searchAttributes?: SearchAttributesMap | null
  searchAttrs?: Record<string, unknown> | null
  memo?: Memo | Record<string, unknown> | null
  userMetadata?: { summary?: string; details?: string } | null
  workerIdentity?: string
  attempts?: ActivityAttempt[]
}

export interface ListActivitiesResponse {
  activities?: Activity[]
  nextPageToken?: NextPageToken
}

export interface DescribeActivityResponse {
  activityInfo: Activity
}

// Wire request shapes for start / mutate. Mirrors the workflow start
// request — workers attach via task queue + type name, the rest is
// optional configuration.
export interface StartActivityRequest {
  activityId?: string
  activityType: { name: string }
  taskQueue: { name: string }
  input?: unknown
  retryPolicy?: ActivityRetryPolicy
  scheduleToCloseTimeout?: Duration
  scheduleToStartTimeout?: Duration
  startToCloseTimeout?: Duration
  heartbeatTimeout?: Duration
  searchAttributes?: SearchAttributesSchema
  memo?: Record<string, unknown>
}

// ── filter / query parameters ─────────────────────────────────────

export interface FilterParameters {
  workflowId?: string
  workflowType?: string
  executionStatus?: WorkflowStatus
  timeRange?: Duration | string
  query?: string
}

export type ArchiveFilterParameters = Omit<FilterParameters, 'timeRange'> & {
  closeTime?: Duration | string
}

// ── ui-only: configurable table columns ───────────────────────────
//
// Generic descriptor shared by the configurable table headers drawer.
// Every table that opts in passes its own `Column[]` and a stable
// localStorage `key`. Visibility is persisted under
// `tasks.columns.${key}` so the user's choice survives reloads.
export interface TableColumn {
  key: string
  label: string
  default: boolean
}

// ── ui-only: retry policy form input ──────────────────────────────
//
// Mirror of the Temporal RetryPolicy proto, kept in the same wire
// shape so the form can post it to /v1/tasks/* endpoints without an
// adapter. `maximumAttempts: 0` means unlimited (proto convention).
export interface RetryPolicy {
  initialInterval: Duration
  backoffCoefficient: number
  maximumInterval: Duration
  maximumAttempts: number
  nonRetryableErrorTypes: string[]
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  initialInterval: '1s',
  backoffCoefficient: 2.0,
  maximumInterval: '60s',
  maximumAttempts: 0,
  nonRetryableErrorTypes: [],
}

// ── ui-only: payload encoding ─────────────────────────────────────
//
// Encoding tags accepted by PayloadInputWithEncoding. `json/plain`
// is the default (utf-8 JSON → base64). `json/protobuf` and `binary`
// are passthrough — the textarea contents are encoded as raw utf-8
// bytes; the worker SDK is expected to parse. `none` emits no
// payload (the form returns null).
export type PayloadEncoding = 'json/plain' | 'json/protobuf' | 'binary' | 'none'

export const PAYLOAD_ENCODINGS: PayloadEncoding[] = [
  'json/plain',
  'json/protobuf',
  'binary',
  'none',
]
