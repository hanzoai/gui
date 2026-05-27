// Entry point. Wires GuiProvider, BrowserRouter, and the route
// tree. PageShell wraps each page for consistent padding.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuiProvider } from 'hanzogui'
import { PageShell } from '@hanzogui/admin'
import config from '../gui.config'
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
    <GuiProvider config={config} defaultTheme="dark">
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
    </GuiProvider>
  </React.StrictMode>,
)
