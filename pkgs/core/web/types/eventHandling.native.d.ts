/**
 * Native event handling - uses RNGH when available, falls back to responder system
 */
import type { StaticConfig, GuiComponentStateRef } from './types';
export declare function getWebEvents(): {};
export declare function useEvents(events: any, viewProps: any, stateRef: {
    current: GuiComponentStateRef;
}, staticConfig: StaticConfig, isHOC?: boolean, isInsideNativeMenu?: boolean, debugName?: string | null, hasRealPressEvents?: boolean): any;
export declare function wrapWithGestureDetector(content: any, gesture: any, _stateRef: {
    current: GuiComponentStateRef;
}, isHOC?: boolean, isCompositeComponent?: boolean, hasRealPressEvents?: boolean): any;
//# sourceMappingURL=eventHandling.native.d.ts.map