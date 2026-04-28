// Entry point. Wires HanzoguiProvider, BrowserRouter, and the route
// tree. Login is unguarded; everything else routes through App's
// AdminApp shell with an auth gate.
//
// Data fetching is via @hanzogui/admin's useFetch (no React Query) —
// same as admin-tasks. Mutations call lib/api.ts directly and call
// `mutate()` on the affected useFetch hook to revalidate.

import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import { HanzoguiProvider } from 'hanzogui'
import { PageShell } from '@hanzogui/admin'
import config from '../hanzogui.config'
import App from './App'
import { useAuth } from './hooks/useAuth'
import { Collections } from './pages/Collections'
import { Login } from './pages/Login'
import { Logs } from './pages/Logs'
import { Records } from './pages/Records'
import { Settings } from './pages/Settings'
import { SettingsRateLimits } from './pages/SettingsRateLimits'
import { SettingsSmtp } from './pages/SettingsSmtp'
import { SettingsTokens } from './pages/SettingsTokens'

function AuthGate() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

function CollectionRecords() {
  const { id } = useParams<{ id: string }>()
  if (!id) return null
  return <Records id={id} />
}

const root = document.getElementById('root')
if (!root) throw new Error('root element missing')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HanzoguiProvider config={config} defaultTheme="dark">
      <BrowserRouter basename="/_">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AuthGate />}>
            <Route element={<App />}>
              <Route path="/" element={<Navigate to="/collections" replace />} />
              <Route path="/collections" element={<PageShell><Collections /></PageShell>} />
              <Route
                path="/collections/:id/records"
                element={<CollectionRecords />}
              />
              <Route path="/logs" element={<PageShell><Logs /></PageShell>} />
              <Route path="/settings" element={<PageShell><Settings /></PageShell>}>
                <Route index element={<Navigate to="/settings/smtp" replace />} />
                <Route path="smtp" element={<SettingsSmtp />} />
                <Route path="rate-limits" element={<SettingsRateLimits />} />
                <Route path="tokens" element={<SettingsTokens />} />
              </Route>
              <Route path="*" element={<Navigate to="/collections" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </HanzoguiProvider>
  </React.StrictMode>,
)
