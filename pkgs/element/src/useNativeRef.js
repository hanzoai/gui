import { useComposedRefs } from '@hanzogui/compose-refs';
import * as React from 'react';
/**
 * Creates a ref for native-only code that properly types to View.
 * Returns both ref and composedRef for component usage.
 *
 * @example
 * ```tsx
 * const { ref, composedRef } = useNativeRef(forwardedRef)
 * // ref.current is typed as View
 * ```
 */
export function useNativeRef(forwardedRef) {
    const ref = React.useRef(null);
    const composedRef = useComposedRefs(ref, forwardedRef);
    return { ref, composedRef };
}
/**
 * Creates a ref for native TextInput components.
 * Returns both ref and composedRef for component usage.
 *
 * @example
 * ```tsx
 * const { ref, composedRef } = useNativeInputRef(forwardedRef)
 * // ref.current is typed as TextInput
 * ```
 */
export function useNativeInputRef(forwardedRef) {
    const ref = React.useRef(null);
    const composedRef = useComposedRefs(ref, forwardedRef);
    return { ref, composedRef };
}
//# sourceMappingURL=useNativeRef.js.map