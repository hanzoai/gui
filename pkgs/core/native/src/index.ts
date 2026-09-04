/**
 * @hanzogui/native
 *
 * Native setup modules for Gui. Import these at the top of your app entry point.
 *
 * @example
 * ```tsx
 * // In your app entry (index.js or App.tsx)
 * import '@hanzogui/native/setup-teleport'
 * import '@hanzogui/native/setup-gesture-handler'
 * import '@hanzogui/native/setup-worklets'
 * import '@hanzogui/native/setup-safe-area'
 * import '@hanzogui/native/expo-linear-gradient'
 * import '@hanzogui/native/setup-keyboard-controller'
 *
 * // Then use Gui components normally
 * // Sheet will automatically use native gestures when available
 * // LinearGradient will use expo-linear-gradient when installed
 * ```
 */

// types
export type {
  NativePortalState,
  GestureState,
  WorkletsState,
  SafeAreaState,
  SafeAreaInsets,
  SafeAreaFrame,
  SafeAreaMetrics,
  LinearGradientState,
  ZeegoState,
  BurntState,
  NativePortalProps,
  NativePortalHostProps,
  NativePortalProviderProps,
} from './types.ts'

// portal
export { getPortal } from './portalState.ts'
export type { PortalAccessor } from './portalState.ts'

// gesture handler
export { getGestureHandler } from './gestureState.ts'
export {
  claimExternalPressOwnership as unstable_claimExternalPressOwnership,
  hasExternalPressOwnership as unstable_hasExternalPressOwnership,
  releaseExternalPressOwnership as unstable_releaseExternalPressOwnership,
} from './gestureState.ts'
export type {
  ExternalPressOwnershipToken,
  GestureHandlerAccessor,
  PressGestureConfig,
} from './gestureState.ts'
// NOTE: setupGestureHandler is exported from setup-gesture-handler.ts entry point,
// not here, to avoid bundler pulling in RNGH require during tree-shaking
export type { GestureHandlerConfig } from './setup-gesture-handler.ts'

// worklets
export { getWorklets } from './workletsState.ts'
export type { WorkletsAccessor } from './workletsState.ts'

// safe area
export { getSafeArea } from './safeAreaState.ts'
export type { SafeAreaAccessor } from './safeAreaState.ts'

// linear gradient
export { getLinearGradient } from './linearGradientState.ts'
export type { LinearGradientAccessor } from './linearGradientState.ts'

// keyboard controller state exports (safe - no side effects)
export {
  isKeyboardControllerEnabled,
  getKeyboardControllerState,
  setKeyboardControllerState,
} from './keyboardControllerState.ts'
export type { KeyboardControllerState } from './keyboardControllerState.ts'

// zeego (native menus)
export { getZeego } from './zeegoState.ts'
export type { ZeegoAccessor } from './zeegoState.ts'
export { NativeMenuContext } from './nativeMenuContext.ts'

// burnt (native toasts)
export { getBurnt } from './burntState.ts'
export type { BurntAccessor } from './burntState.ts'

// components
export { NativePortal, NativePortalHost, NativePortalProvider } from './components.tsx'
