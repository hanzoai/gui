export default AnimatedNode;
export class AnimatedNode {
    _listeners: {};
    _platformConfig: any;
    __nativeAnimatedValueListener: any;
    __attach(): void;
    __detach(): void;
    __nativeTag: any;
    __getValue(): void;
    __getAnimatedValue(): void;
    __addChild(child: any): void;
    __removeChild(child: any): void;
    __getChildren(): any[];
    __isNative: any;
    __shouldUpdateListenersForNewNativeTag: any;
    __makeNative(platformConfig: any): void;
    /**
     * Adds an asynchronous listener to the value so you can observe updates from
     * animations.  This is useful because there is no way to
     * synchronously read the value because it might be driven natively.
     *
     * See https://reactnative.dev/docs/animatedvalue#addlistener
     */
    addListener(callback: any): string;
    /**
     * Unregister a listener. The `id` param shall match the identifier
     * previously returned by `addListener()`.
     *
     * See https://reactnative.dev/docs/animatedvalue#removelistener
     */
    removeListener(id: any): void;
    /**
     * Remove all registered listeners.
     *
     * See https://reactnative.dev/docs/animatedvalue#removealllisteners
     */
    removeAllListeners(): void;
    hasListeners(): boolean;
    _startListeningToNativeValueUpdates(): void;
    __onAnimatedValueUpdateReceived(value: any): void;
    __callListeners(value: any): void;
    _stopListeningForNativeValueUpdates(): void;
    __getNativeTag(): any;
    __getNativeConfig(): void;
    toJSON(): void;
    __getPlatformConfig(): any;
    __setPlatformConfig(platformConfig: any): void;
}
