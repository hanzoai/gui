// Entry point. Wires HanzoguiProvider, BrowserRouter, and the route
// tree. Workflows renders edge-to-edge; every other page wraps in
// PageShell for consistent padding.
//
// Workflow detail expands to 11 tabs; each is its own deep-linkable
// route under /workflows/:workflowId/<tab> so back/forward + share-URL
// land on the right pane. The :runId variants exist so a paste of
// /workflows/foo/<runId>/history lands on the same view as the no-runId
// canonical URL — the runId is read from useParams when present.

import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HanzoguiProvider } from 'hanzogui'
import { PageShell, Loading } from '@hanzogui/admin'
import config from '../gui.config'
import App from './App'

// Light list/landing pages — eager: keeps initial paint fast and
// avoids a Suspense flash on the most common entry routes.
import { ActivitiesPage } from './pages/Activities'
import { ArchivalPage } from './pages/Archival'
import { BatchesPage } from './pages/Batches'
import { DeploymentsPage } from './pages/Deployments'
import { NamespacesPage } from './pages/Namespaces'
import { NexusPage } from './pages/Nexus'
import { SchedulesPage } from './pages/Schedules'
import { SearchAttributesPage } from './pages/SearchAttributes'
import { SelectNamespacePage } from './pages/SelectNamespace'
import { SupportPage } from './pages/Support'
import { TaskQueuesPage } from './pages/TaskQueues'
import { WorkersPage } from './pages/Workers'
import { WorkflowsPage } from './pages/Workflows'

// Heavy detail / edit / create pages — lazy: each is its own chunk so
// the initial bundle stays small. Named-export components are
// rewrapped to default for React.lazy.
const BatchCreatePage = lazy(() =>
  import('./pages/BatchCreate').then((m) => ({ default: m.BatchCreatePage })),
)
const BatchDetailPage = lazy(() =>
  import('./pages/BatchDetail').then((m) => ({ default: m.BatchDetailPage })),
)
const DeploymentDetailPage = lazy(() =>
  import('./pages/DeploymentDetail').then((m) => ({ default: m.DeploymentDetailPage })),
)
const DeploymentCreatePage = lazy(() =>
  import('./pages/DeploymentCreate').then((m) => ({ default: m.DeploymentCreatePage })),
)
const DeploymentEditPage = lazy(() =>
  import('./pages/DeploymentEdit').then((m) => ({ default: m.DeploymentEditPage })),
)
const DeploymentVersionCreatePage = lazy(() =>
  import('./pages/DeploymentVersionCreate').then((m) => ({
    default: m.DeploymentVersionCreatePage,
  })),
)
const DeploymentVersionEditPage = lazy(() =>
  import('./pages/DeploymentVersionEdit').then((m) => ({
    default: m.DeploymentVersionEditPage,
  })),
)
const EventDetailPage = lazy(() =>
  import('./pages/EventDetail').then((m) => ({ default: m.EventDetailPage })),
)
const NamespaceDetailPage = lazy(() =>
  import('./pages/NamespaceDetail').then((m) => ({ default: m.NamespaceDetailPage })),
)
const NexusCreatePage = lazy(() =>
  import('./pages/NexusCreate').then((m) => ({ default: m.NexusCreatePage })),
)
const NexusDetailPage = lazy(() =>
  import('./pages/NexusDetail').then((m) => ({ default: m.NexusDetailPage })),
)
const ScheduleCreatePage = lazy(() =>
  import('./pages/ScheduleCreate').then((m) => ({ default: m.ScheduleCreatePage })),
)
const ScheduleDetailPage = lazy(() =>
  import('./pages/ScheduleDetail').then((m) => ({ default: m.ScheduleDetailPage })),
)
const ScheduleEditPage = lazy(() =>
  import('./pages/ScheduleEdit').then((m) => ({ default: m.ScheduleEditPage })),
)
const TaskQueueDetailPage = lazy(() =>
  import('./pages/TaskQueueDetail').then((m) => ({ default: m.TaskQueueDetailPage })),
)
const WorkerDetailPage = lazy(() =>
  import('./pages/WorkerDetail').then((m) => ({ default: m.WorkerDetailPage })),
)
const WorkflowDetailPage = lazy(() =>
  import('./pages/WorkflowDetail').then((m) => ({ default: m.WorkflowDetailPage })),
)
const WorkflowHistoryPage = lazy(() =>
  import('./pages/WorkflowHistory').then((m) => ({ default: m.WorkflowHistoryPage })),
)
const ActivityDetailPage = lazy(() =>
  import('./pages/ActivityDetail').then((m) => ({ default: m.ActivityDetailPage })),
)
const ActivityStartPage = lazy(() =>
  import('./pages/ActivityStart').then((m) => ({ default: m.ActivityStartPage })),
)

const Fallback = () => <Loading label="Loading…" />

const root = document.getElementById('root')
if (!root) throw new Error('root element missing')

// Tabs that mount the detail layout — both `/workflowId/<tab>` and
// `/workflowId/<runId>/<tab>` resolve here.
//
// All values must be members of `WorkflowDetailPage`'s `WorkflowTab`
// union. Aliases (queries→query, metadata→user-metadata, stack-trace→
// call-stack) are added below as separate Route entries that point at
// the canonical tab.
const detailTabs = [
  'call-stack',
  'pending-activities',
  'pending-nexus',
  'timeline',
  'workers',
  'query',
  'memo',
  'search-attributes',
  'user-metadata',
  'relationships',
  'nexus-links',
] as const

const tabAliases: Array<{ alias: string; tab: typeof detailTabs[number] }> = [
  { alias: 'queries', tab: 'query' },
  { alias: 'metadata', tab: 'user-metadata' },
  { alias: 'stack-trace', tab: 'call-stack' },
]

// Sub-views of the workflow history page. compact / feed / json are
// rendered by `WorkflowHistoryPage` itself based on the URL segment.
const historyViews = ['compact', 'feed', 'json'] as const

// Activity detail tabs. All values must be members of
// `ActivityDetailPage`'s `ActivityTab` union.
const activityTabs = [
  'summary',
  'history',
  'workers',
  'search-attributes',
  'user-metadata',
] as const

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HanzoguiProvider config={config} defaultTheme="dark">
      <BrowserRouter basename="/_/tasks">
        <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/namespaces" replace />} />

            {/* Top-level shortcuts. */}
            <Route path="select-namespace" element={<PageShell><SelectNamespacePage /></PageShell>} />
            <Route path="archive" element={<PageShell><ArchivalPage /></PageShell>} />
            <Route path="support" element={<PageShell><SupportPage /></PageShell>} />

            {/* Top-level nexus (cross-namespace). */}
            <Route path="nexus" element={<PageShell><NexusPage /></PageShell>} />
            <Route path="nexus/create" element={<PageShell><NexusCreatePage /></PageShell>} />
            <Route path="nexus/:endpointId" element={<PageShell><NexusDetailPage /></PageShell>} />

            {/* Namespace-scoped routes. */}
            <Route path="namespaces" element={<PageShell><NamespacesPage /></PageShell>} />
            <Route path="namespaces/:ns" element={<PageShell><NamespaceDetailPage /></PageShell>} />

            {/* Workflows list + detail (canonical, no runId). */}
            <Route path="namespaces/:ns/workflows" element={<WorkflowsPage />} />
            <Route
              path="namespaces/:ns/workflows/:workflowId"
              element={<PageShell><WorkflowDetailPage tab="summary" /></PageShell>}
            />
            <Route
              path="namespaces/:ns/workflows/:workflowId/history"
              element={<PageShell><WorkflowHistoryPage /></PageShell>}
            />
            {historyViews.map((v) => (
              <Route
                key={`hv-${v}`}
                path={`namespaces/:ns/workflows/:workflowId/history/${v}`}
                element={<PageShell><WorkflowHistoryPage /></PageShell>}
              />
            ))}
            {detailTabs.map((tab) => (
              <Route
                key={tab}
                path={`namespaces/:ns/workflows/:workflowId/${tab}`}
                element={<PageShell><WorkflowDetailPage tab={tab} /></PageShell>}
              />
            ))}
            {tabAliases.map(({ alias, tab }) => (
              <Route
                key={`alias-${alias}`}
                path={`namespaces/:ns/workflows/:workflowId/${alias}`}
                element={<PageShell><WorkflowDetailPage tab={tab} /></PageShell>}
              />
            ))}
            <Route
              path="namespaces/:ns/workflows/:workflowId/events/:eventId"
              element={<PageShell><EventDetailPage /></PageShell>}
            />

            {/* Workflows :runId variants — same components, runId comes
                via useParams. Pages that don't read runId continue to
                work because the param is optional. */}
            <Route
              path="namespaces/:ns/workflows/:workflowId/:runId"
              element={<PageShell><WorkflowDetailPage tab="summary" /></PageShell>}
            />
            <Route
              path="namespaces/:ns/workflows/:workflowId/:runId/history"
              element={<PageShell><WorkflowHistoryPage /></PageShell>}
            />
            {historyViews.map((v) => (
              <Route
                key={`hv-run-${v}`}
                path={`namespaces/:ns/workflows/:workflowId/:runId/history/${v}`}
                element={<PageShell><WorkflowHistoryPage /></PageShell>}
              />
            ))}
            {detailTabs.map((tab) => (
              <Route
                key={`run-${tab}`}
                path={`namespaces/:ns/workflows/:workflowId/:runId/${tab}`}
                element={<PageShell><WorkflowDetailPage tab={tab} /></PageShell>}
              />
            ))}
            {tabAliases.map(({ alias, tab }) => (
              <Route
                key={`run-alias-${alias}`}
                path={`namespaces/:ns/workflows/:workflowId/:runId/${alias}`}
                element={<PageShell><WorkflowDetailPage tab={tab} /></PageShell>}
              />
            ))}
            <Route
              path="namespaces/:ns/workflows/:workflowId/:runId/events/:eventId"
              element={<PageShell><EventDetailPage /></PageShell>}
            />

            {/* Schedules. */}
            <Route path="namespaces/:ns/schedules" element={<PageShell><SchedulesPage /></PageShell>} />
            <Route path="namespaces/:ns/schedules/create" element={<PageShell><ScheduleCreatePage /></PageShell>} />
            <Route
              path="namespaces/:ns/schedules/:scheduleId"
              element={<PageShell><ScheduleDetailPage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/schedules/:scheduleId/edit"
              element={<PageShell><ScheduleEditPage /></PageShell>}
            />

            {/* Batches (the brief calls these batch-operations). */}
            <Route path="namespaces/:ns/batches" element={<PageShell><BatchesPage /></PageShell>} />
            <Route
              path="namespaces/:ns/batches/create"
              element={<PageShell><BatchCreatePage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/batches/:batchId"
              element={<PageShell><BatchDetailPage /></PageShell>}
            />
            <Route path="namespaces/:ns/batch-operations" element={<PageShell><BatchesPage /></PageShell>} />
            <Route
              path="namespaces/:ns/batch-operations/create"
              element={<PageShell><BatchCreatePage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/batch-operations/:batchId"
              element={<PageShell><BatchDetailPage /></PageShell>}
            />

            {/* Archival, scoped per namespace. */}
            <Route path="namespaces/:ns/archival" element={<PageShell><ArchivalPage /></PageShell>} />

            {/* Task queues. */}
            <Route path="namespaces/:ns/task-queues" element={<PageShell><TaskQueuesPage /></PageShell>} />
            <Route
              path="namespaces/:ns/task-queues/:queue"
              element={<PageShell><TaskQueueDetailPage /></PageShell>}
            />

            {/* Deployments. */}
            <Route
              path="namespaces/:ns/deployments"
              element={<PageShell><DeploymentsPage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/deployments/create"
              element={<PageShell><DeploymentCreatePage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/deployments/:name"
              element={<PageShell><DeploymentDetailPage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/deployments/:name/edit"
              element={<PageShell><DeploymentEditPage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/deployments/:name/versions/create"
              element={<PageShell><DeploymentVersionCreatePage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/deployments/:name/versions/:buildId/edit"
              element={<PageShell><DeploymentVersionEditPage /></PageShell>}
            />

            {/* Workers. */}
            <Route path="namespaces/:ns/workers" element={<PageShell><WorkersPage /></PageShell>} />
            <Route
              path="namespaces/:ns/workers/:workerId"
              element={<PageShell><WorkerDetailPage /></PageShell>}
            />

            {/* Activities — list, start, detail with tabs. */}
            <Route
              path="namespaces/:ns/activities"
              element={<PageShell><ActivitiesPage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/activities/start"
              element={<PageShell><ActivityStartPage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/activities/:activityId/:runId"
              element={<PageShell><ActivityDetailPage tab="summary" /></PageShell>}
            />
            {activityTabs.map((tab) => (
              <Route
                key={`act-${tab}`}
                path={`namespaces/:ns/activities/:activityId/:runId/${tab}`}
                element={<PageShell><ActivityDetailPage tab={tab} /></PageShell>}
              />
            ))}

            {/* Search attributes. */}
            <Route
              path="namespaces/:ns/search-attributes"
              element={<PageShell><SearchAttributesPage /></PageShell>}
            />

            {/* Nexus, scoped per namespace. */}
            <Route path="namespaces/:ns/nexus" element={<PageShell><NexusPage /></PageShell>} />
            <Route
              path="namespaces/:ns/nexus/create"
              element={<PageShell><NexusCreatePage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/nexus/:endpointId"
              element={<PageShell><NexusDetailPage /></PageShell>}
            />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
    </HanzoguiProvider>
  </React.StrictMode>,
)
