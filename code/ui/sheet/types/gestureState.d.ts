/**
 * Re-export gesture state from @hanzogui/native.
 * Sheet uses this for backward compatibility with existing code.
 */
import { type GestureState } from '@hanzogui/native';
export type { GestureState as GestureHandlerState } from '@hanzogui/native';
export declare function isGestureHandlerEnabled(): boolean;
export declare function getGestureHandlerState(): GestureState;
export declare function setGestureHandlerState(updates: Partial<GestureState>): void;
export declare const setGestureState: typeof setGestureHandlerState;
//# sourceMappingURL=gestureState.d.ts.map