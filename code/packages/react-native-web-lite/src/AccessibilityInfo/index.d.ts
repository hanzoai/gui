declare function isScreenReaderEnabled(): Promise<unknown>;
declare function isReduceMotionEnabled(): Promise<unknown>;
export declare const AccessibilityInfo: {
    /**
     * Query whether a screen reader is currently enabled.
     *
     * Returns a promise which resolves to a boolean.
     * The result is `true` when a screen reader is enabled and `false` otherwise.
     */
    isScreenReaderEnabled: typeof isScreenReaderEnabled;
    /**
     * Query whether the user prefers reduced motion.
     *
     * Returns a promise which resolves to a boolean.
     * The result is `true` when a screen reader is enabled and `false` otherwise.
     */
    isReduceMotionEnabled: typeof isReduceMotionEnabled;
    /**
     * Deprecated
     */
    fetch: typeof isScreenReaderEnabled;
    /**
     * Add an event handler. Supported events: reduceMotionChanged
     */
    addEventListener: (eventName: string, handler: Function) => any;
    /**
     * Set accessibility focus to a react component.
     */
    setAccessibilityFocus: (reactTag: number) => void;
    /**
     * Post a string to be announced by the screen reader.
     */
    announceForAccessibility: (announcement: string) => void;
    /**
     * Remove an event handler.
     */
    removeEventListener: (eventName: string, handler: Function) => void;
};
export {};
