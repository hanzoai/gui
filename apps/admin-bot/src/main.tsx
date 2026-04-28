// Entry point for admin-bot. Wires HanzoguiProvider, BrowserRouter,
// and the route tree. Tabs mirror the legacy Lit nav (chat / control:
// overview, channels, instances, sessions, usage, cron / agent: agents,
// skills, nodes / settings: config, debug, logs).
//
// Each page wraps in PageShell for consistent padding.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HanzoguiProvider } from 'hanzogui'
import { PageShell } from '@hanzogui/admin'
import config from '../hanzogui.config'
import App from './App'
import { AgentsPage } from './pages/Agents'
import { ChannelsPage } from './pages/Channels'
import { ChatPage } from './pages/Chat'
import { ConfigPage } from './pages/Config'
import { CronPage } from './pages/Cron'
import { DebugPage } from './pages/Debug'
import { InstancesPage } from './pages/Instances'
import { LogsPage } from './pages/Logs'
import { NodesPage } from './pages/Nodes'
import { OverviewPage } from './pages/Overview'
import { SessionsPage } from './pages/Sessions'
import { SkillsPage } from './pages/Skills'
import { UsagePage } from './pages/Usage'

const root = document.getElementById('root')
if (!root) throw new Error('root element missing')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HanzoguiProvider config={config} defaultTheme="dark">
      <BrowserRouter basename="/_/bot">
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="chat" element={<PageShell><ChatPage /></PageShell>} />
            <Route path="overview" element={<PageShell><OverviewPage /></PageShell>} />
            <Route path="channels" element={<PageShell><ChannelsPage /></PageShell>} />
            <Route path="instances" element={<PageShell><InstancesPage /></PageShell>} />
            <Route path="sessions" element={<PageShell><SessionsPage /></PageShell>} />
            <Route path="usage" element={<PageShell><UsagePage /></PageShell>} />
            <Route path="cron" element={<PageShell><CronPage /></PageShell>} />
            <Route path="agents" element={<PageShell><AgentsPage /></PageShell>} />
            <Route path="skills" element={<PageShell><SkillsPage /></PageShell>} />
            <Route path="nodes" element={<PageShell><NodesPage /></PageShell>} />
            <Route path="config" element={<PageShell><ConfigPage /></PageShell>} />
            <Route path="debug" element={<PageShell><DebugPage /></PageShell>} />
            <Route path="logs" element={<PageShell><LogsPage /></PageShell>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HanzoguiProvider>
  </React.StrictMode>,
)
