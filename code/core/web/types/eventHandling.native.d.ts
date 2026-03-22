/**
 * Native event handling - uses RNGH when available, falls back to usePressability
 */
import type { StaticConfig, GuiComponentStateRef } from './types';
export declare function getWebEvents(): {};
export declare function useEvents(events: any, viewProps: any, stateRef: {
    current: GuiComponentStateRef;
}, staticConfig: StaticConfig, isHOC?: boolean, isInsideNativeMenu?: boolean): any;
export declare function wrapWithGestureDetector(content: any, gesture: any, stateRef: {
    current: GuiComponentStateRef;
}, isHOC?: boolean): any;
//# sourceMappingURL=eventHandling.native.d.ts.map