// Entry point. Wires HanzoguiProvider, BrowserRouter, and the route
// tree. Workflows renders edge-to-edge; every other page wraps in
// PageShell for consistent padding.
//
// Workflow detail expands to 11 tabs; each is its own deep-linkable
// route under /workflows/:workflowId/<tab> so back/forward + share-URL
// land on the right pane.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HanzoguiProvider } from 'hanzogui'
import { PageShell } from '@hanzogui/admin'
import config from '../hanzogui.config'
import App from './App'
import { ActivitiesPage } from './pages/Activities'
import { ArchivalPage } from './pages/Archival'
import { BatchesPage } from './pages/Batches'
import { DeploymentsPage } from './pages/Deployments'
import { EventDetailPage } from './pages/EventDetail'
import { NamespaceDetailPage } from './pages/NamespaceDetail'
import { NamespacesPage } from './pages/Namespaces'
import { NexusPage } from './pages/Nexus'
import { SchedulesPage } from './pages/Schedules'
import { SupportPage } from './pages/Support'
import { TaskQueueDetailPage } from './pages/TaskQueueDetail'
import { TaskQueuesPage } from './pages/TaskQueues'
import { WorkersPage } from './pages/Workers'
import { WorkflowDetailPage } from './pages/WorkflowDetail'
import { WorkflowHistoryPage } from './pages/WorkflowHistory'
import { WorkflowsPage } from './pages/Workflows'

const root = document.getElementById('root')
if (!root) throw new Error('root element missing')

const detailTabs = [
  'call-stack',
  'pending-activities',
  'workers',
  'query',
  'memo',
  'search-attributes',
  'user-metadata',
  'relationships',
  'nexus-links',
] as const

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HanzoguiProvider config={config} defaultTheme="dark">
      <BrowserRouter basename="/_/tasks">
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/namespaces" replace />} />
            <Route path="namespaces" element={<PageShell><NamespacesPage /></PageShell>} />
            <Route path="namespaces/:ns" element={<PageShell><NamespaceDetailPage /></PageShell>} />
            <Route path="namespaces/:ns/workflows" element={<WorkflowsPage />} />
            <Route
              path="namespaces/:ns/workflows/:workflowId"
              element={<PageShell><WorkflowDetailPage tab="summary" /></PageShell>}
            />
            <Route
              path="namespaces/:ns/workflows/:workflowId/history"
              element={<PageShell><WorkflowHistoryPage /></PageShell>}
            />
            {detailTabs.map((tab) => (
              <Route
                key={tab}
                path={`namespaces/:ns/workflows/:workflowId/${tab}`}
                element={<PageShell><WorkflowDetailPage tab={tab} /></PageShell>}
              />
            ))}
            <Route
              path="namespaces/:ns/workflows/:workflowId/events/:eventId"
              element={<PageShell><EventDetailPage /></PageShell>}
            />
            <Route path="namespaces/:ns/schedules" element={<PageShell><SchedulesPage /></PageShell>} />
            <Route path="namespaces/:ns/batches" element={<PageShell><BatchesPage /></PageShell>} />
            <Route
              path="namespaces/:ns/deployments"
              element={<PageShell><DeploymentsPage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/task-queues"
              element={<PageShell><TaskQueuesPage /></PageShell>}
            />
            <Route
              path="namespaces/:ns/task-queues/:queue"
              element={<PageShell><TaskQueueDetailPage /></PageShell>}
            />
            <Route path="namespaces/:ns/workers" element={<PageShell><WorkersPage /></PageShell>} />
            <Route
              path="namespaces/:ns/activities"
              element={<PageShell><ActivitiesPage /></PageShell>}
            />
            <Route path="namespaces/:ns/nexus" element={<PageShell><NexusPage /></PageShell>} />
            <Route path="archive" element={<PageShell><ArchivalPage /></PageShell>} />
            <Route path="support" element={<PageShell><SupportPage /></PageShell>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HanzoguiProvider>
  </React.StrictMode>,
)
