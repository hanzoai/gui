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
* // Then use GUI components normally
* // Sheet will automatically use native gestures when available
* // LinearGradient will use expo-linear-gradient when installed
* ```
*/
export type { NativePortalState, GestureState, WorkletsState, SafeAreaState, SafeAreaInsets, SafeAreaFrame, SafeAreaMetrics, LinearGradientState, ZeegoState, BurntState, NativePortalProps, NativePortalHostProps, NativePortalProviderProps } from "./types";
export { getPortal } from "./portalState";
export type { PortalAccessor } from "./portalState";
export { getGestureHandler } from "./gestureState";
export type { GestureHandlerAccessor, PressGestureConfig } from "./gestureState";
export { getWorklets } from "./workletsState";
export type { WorkletsAccessor } from "./workletsState";
export { getSafeArea } from "./safeAreaState";
export type { SafeAreaAccessor } from "./safeAreaState";
export { getLinearGradient } from "./linearGradientState";
export type { LinearGradientAccessor } from "./linearGradientState";
export { isKeyboardControllerEnabled, getKeyboardControllerState, setKeyboardControllerState } from "./keyboardControllerState";
export type { KeyboardControllerState } from "./keyboardControllerState";
export { getZeego } from "./zeegoState";
export type { ZeegoAccessor } from "./zeegoState";
export { NativeMenuContext } from "./nativeMenuContext";
export { getBurnt } from "./burntState";
export type { BurntAccessor } from "./burntState";
export { NativePortal, NativePortalHost, NativePortalProvider } from "./components";

//# sourceMappingURL=index.d.ts.map