// AdminApp — the chrome wrapper. Renders the sidebar on the left and
// a vertical stack of (top bar + scrolling content) on the right. The
// `<Outlet />` from react-router-dom v7 lives in `children` so each
// app keeps full control over its route tree.
//
// For most apps, the call site looks like this:
//
//   import { AdminApp } from '@hanzo/admin/shell'
//   import { Outlet } from 'react-router-dom'
//
//   function App() {
//     return (
//       <AdminApp sidebar={<Sidebar config={sidebarConfig} />} topBar={<TopBar ... />}>
//         <Outlet />
//       </AdminApp>
//     )
//   }

import type { ReactNode } from 'react'
import { XStack, YStack } from 'hanzogui'

export interface AdminAppProps {
  sidebar: ReactNode
  topBar: ReactNode
  children: ReactNode
}

export function AdminApp({ sidebar, topBar, children }: AdminAppProps) {
  return (
    <XStack height="100vh" bg="$background" items="stretch">
      {sidebar}
      <YStack flex={1} minW={0}>
        {topBar}
        <YStack flex={1} overflow="hidden">
          <YStack flex={1} overflow="scroll">
            {children}
          </YStack>
        </YStack>
      </YStack>
    </XStack>
  )
}
