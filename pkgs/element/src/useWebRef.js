import { useComposedRefs } from '@hanzogui/compose-refs';
import * as React from 'react';
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
export function useWebRef(forwardedRef) {
    const ref = React.useRef(null);
    const composedRef = useComposedRefs(ref, forwardedRef);
    return { ref, composedRef };
}
//# sourceMappingURL=useWebRef.js.map