// Hanzo Base admin — iOS / Android / web shell. Mirrors apps/admin-base
// (Vite SPA) but boots through Expo's native runtime. Screens and
// routes are imported from the shared sibling so we don't fork UI.
//
// The two differences vs the Vite sibling:
//   1. No `import.meta.env`. We read `process.env.EXPO_PUBLIC_*`.
//   2. The IAM server URL defaults to a development LAN address that
//      the device can reach. The user can override with
//      `EXPO_PUBLIC_IAM_SERVER_URL` at build time.

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { HanzoguiProvider } from 'hanzogui'
import BaseAdminApp from '@hanzo/base-ui/App'
import hanzoguiConfig from './gui.config'

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <HanzoguiProvider config={hanzoguiConfig} defaultTheme="light">
      {children}
    </HanzoguiProvider>
  )
}

export function App() {
  return (
    <Provider>
      <NavigationContainer>
        <BaseAdminApp />
      </NavigationContainer>
    </Provider>
  )
}
