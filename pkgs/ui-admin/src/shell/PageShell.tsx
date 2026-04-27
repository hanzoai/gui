// Page padding wrapper. Most admin routes wrap their body in this so
// content sits in a 1280-wide centred column with consistent gutters.
// Edge-to-edge pages (e.g. workflows table view with its own header
// band) skip the shell.

import type { ReactNode } from 'react'
import { YStack } from 'hanzogui'

export interface PageShellProps {
  children: ReactNode
  // Override max width — defaults to 1280 to match the rest of the
  // hanzo admin surfaces. Pass `'100%'` to opt out of the centred
  // column.
  maxWidth?: number | '100%'
}

export function PageShell({ children, maxWidth = 1280 }: PageShellProps) {
  return (
    <YStack flex={1} p="$6" gap="$5" maxW={maxWidth} width="100%" self="center">
      {children}
    </YStack>
  )
}
