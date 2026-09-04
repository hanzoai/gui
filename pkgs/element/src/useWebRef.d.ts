import * as React from 'react';
import type { GuiElement } from './types.ts';
/**
 * Creates a ref for web-only code that properly types to HTMLElement.
 * Useful when you need to access HTMLElement-specific properties (like selectionStart)
 * that aren't available on the cross-platform GuiElement type.
 *
 * @example
 * ```tsx
 * const { ref, composedRef } = useWebRef<HTMLInputElement>(forwardedRef)
 * // ref.current is typed as HTMLInputElement
 * // composedRef is for passing to components
 * ```
 */
export declare function useWebRef<T extends GuiElement | HTMLElement>(forwardedRef?: React.ForwardedRef<any>): {
    ref: React.RefObject<T | null>;
    composedRef: (node: T | null) => void;
};
//# sourceMappingURL=useWebRef.d.ts.map