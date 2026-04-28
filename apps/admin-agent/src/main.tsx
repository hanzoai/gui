// Entry point. Wires HanzoguiProvider, BrowserRouter, and the route
// tree for the Hanzo Agents admin SPA.
//
// Operator chrome — orgs, API keys, billing, observability. Lives
// alongside the existing 79k LOC product UI which keeps mounting at
// '/' inside agentd; this admin chrome mounts at '/_/agents/'.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HanzoguiProvider } from 'hanzogui'
import { PageShell } from '@hanzogui/admin'
import config from '../hanzogui.config'
import App from './App'
import { ApiKeysPage } from './pages/ApiKeys'
import { BillingPage } from './pages/Billing'
import { MembersPage } from './pages/Members'
import { ObservabilityPage } from './pages/Observability'
import { OrgsPage } from './pages/Orgs'

const root = document.getElementById('root')
if (!root) throw new Error('root element missing')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HanzoguiProvider config={config} defaultTheme="dark">
      <BrowserRouter basename="/_/agents">
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/orgs" replace />} />
            <Route path="orgs" element={<PageShell><OrgsPage /></PageShell>} />
            <Route path="orgs/:org/members" element={<PageShell><MembersPage /></PageShell>} />
            <Route path="orgs/:org/api-keys" element={<PageShell><ApiKeysPage /></PageShell>} />
            <Route path="orgs/:org/billing" element={<PageShell><BillingPage /></PageShell>} />
            <Route path="observability" element={<PageShell><ObservabilityPage /></PageShell>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HanzoguiProvider>
  </React.StrictMode>,
)
