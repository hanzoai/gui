// ManagementPage — the admin chrome wrapper. The upstream
// `~/work/hanzo/iam/web/src/ManagementPage.tsx` is 800+ lines of
// route table + sidebar config + account dropdown + header + theme
// + language switcher.
//
// In `@hanzogui/admin` we already have a richer shell (`AdminApp` +
// `Sidebar` + `TopBar`). So this port is intentionally narrow: it's
// a thin convenience wrapper that wires the admin chrome to the IAM
// account state. It expects the caller to provide its own sidebar
// config and renders nothing if the user isn't authenticated.

import type { ReactNode } from 'react'
import { Paragraph, YStack } from 'hanzogui'
import { AdminApp } from '../../shell/AdminApp'

export interface ManagementPageProps {
  // The signed-in account (or `null` for anonymous, `undefined`
  // while the auth check is in flight).
  account: { name: string; owner: string; isAdmin?: boolean } | null | undefined
  sidebar: ReactNode
  topBar: ReactNode
  children: ReactNode
}

export function ManagementPage({ account, sidebar, topBar, children }: ManagementPageProps) {
  if (account === undefined) {
    return (
      <YStack flex={1} items="center" content="center" p="$6">
        <Paragraph color="$placeholderColor">Loading…</Paragraph>
      </YStack>
    )
  }
  if (account === null) {
    return (
      <YStack flex={1} items="center" content="center" p="$6" gap="$2">
        <Paragraph fontSize="$5">403 Unauthorized</Paragraph>
        <Paragraph color="$placeholderColor">Sign in to access the admin console.</Paragraph>
      </YStack>
    )
  }
  return (
    <AdminApp sidebar={sidebar} topBar={topBar}>
      {children}
    </AdminApp>
  )
}
