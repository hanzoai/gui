export default NativeEventEmitter;
/**
 * `NativeEventEmitter` is intended for use by Native Modules to emit events to
 * JavaScript listeners. If a `NativeModule` is supplied to the constructor, it
 * will be notified (via `addListener` and `removeListeners`) when the listener
 * count changes to manage "native memory".
 *
 * Currently, all native events are fired via a global `RCTDeviceEventEmitter`.
 * This means event names must be globally unique, and it means that call sites
 * can theoretically listen to `RCTDeviceEventEmitter` (although discouraged).
 */
export class NativeEventEmitter {
    constructor(nativeModule: any);
    _nativeModule: any;
    addListener(eventType: any, listener: any, context: any): {
        remove: () => void;
    };
    /**
     * @deprecated Use `remove` on the EventSubscription from `addListener`.
     */
    removeListener(eventType: any, listener: any): void;
    emit(eventType: any, ...args: any[]): void;
    removeAllListeners(eventType: any): void;
    listenerCount(eventType: any): number;
}
