import type { ReactNode } from 'react'
import { getPortal } from './portalState.ts'
import type {
  NativePortalProps,
  NativePortalHostProps,
  NativePortalProviderProps,
} from './types.ts'

export type { NativePortalProps, NativePortalHostProps, NativePortalProviderProps }

/**
 * Renders children into a teleport Portal when available.
 * Returns null when teleport is not set up (allows fallback handling by caller).
 */
export function NativePortal({
  hostName = 'root',
  children,
}: NativePortalProps): ReactNode {
  const state = getPortal().state
  if (state.type !== 'teleport') return null

  const teleport = (globalThis as any).__hanzogui_teleport
  if (!teleport?.Portal) return null
  const { Portal } = teleport
  return <Portal hostName={hostName}>{children}</Portal>
}

/**
 * Renders a teleport PortalHost when available.
 * Returns null when teleport is not set up.
 */
export function NativePortalHost({ name }: NativePortalHostProps): ReactNode {
  const state = getPortal().state
  if (state.type !== 'teleport') return null

  const teleport = (globalThis as any).__hanzogui_teleport
  if (!teleport?.PortalHost) return null
  const { PortalHost } = teleport
  return <PortalHost name={name} />
}

/**
 * Wraps children with teleport PortalProvider when available.
 * Returns children as-is when teleport is not set up.
 */
export function NativePortalProvider({ children }: NativePortalProviderProps): ReactNode {
  const state = getPortal().state
  if (state.type !== 'teleport') return <>{children}</>

  const teleport = (globalThis as any).__hanzogui_teleport
  if (!teleport?.PortalProvider) return <>{children}</>
  const { PortalProvider } = teleport
  return <PortalProvider>{children}</PortalProvider>
}
