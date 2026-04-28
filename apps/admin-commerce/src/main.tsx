// Entry point. Wires HanzoguiProvider, BrowserRouter, and the route
// tree. PageShell wraps each page for consistent padding.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HanzoguiProvider } from 'hanzogui'
import { PageShell } from '@hanzogui/admin'
import config from '../hanzogui.config'
import App from './App'
import { BillingPage } from './pages/Billing'
import { CollectionsPage } from './pages/Collections'
import { CustomersPage } from './pages/Customers'
import { InventoryPage } from './pages/Inventory'
import { OrdersPage } from './pages/Orders'
import { OverviewPage } from './pages/Overview'
import { ProductsPage } from './pages/Products'
import { SettingsPage } from './pages/Settings'

const root = document.getElementById('root')
if (!root) throw new Error('root element missing')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HanzoguiProvider config={config} defaultTheme="dark">
      <BrowserRouter basename="/_/commerce/ui">
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<PageShell><OverviewPage /></PageShell>} />
            <Route path="products" element={<PageShell><ProductsPage /></PageShell>} />
            <Route path="collections" element={<PageShell><CollectionsPage /></PageShell>} />
            <Route path="orders" element={<PageShell><OrdersPage /></PageShell>} />
            <Route path="customers" element={<PageShell><CustomersPage /></PageShell>} />
            <Route path="inventory" element={<PageShell><InventoryPage /></PageShell>} />
            <Route path="billing" element={<PageShell><BillingPage /></PageShell>} />
            <Route path="settings" element={<PageShell><SettingsPage /></PageShell>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HanzoguiProvider>
  </React.StrictMode>,
)
