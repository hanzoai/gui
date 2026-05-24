export default useRefEffect;
/**
 * Constructs a callback ref that provides similar semantics as `useEffect`. The
 * supplied `effect` callback will be called with non-null component instances.
 * The `effect` callback can also optionally return a cleanup function.
 *
 * When a component is updated or unmounted, the cleanup function is called. The
 * `effect` callback will then be called again, if applicable.
 *
 * When a new `effect` callback is supplied, the previously returned cleanup
 * function will be called before the new `effect` callback is called with the
 * same instance.
 *
 * WARNING: The `effect` callback should be stable (e.g. using `useCallback`).
 */
export function useRefEffect(effect: any): (instance: any) => void;
