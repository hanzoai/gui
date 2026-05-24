/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */
export class EventSubscription {
    remove(): void;
}
export class IEventEmitter {
    addListener(eventType: any, listener: any, context: any): EventSubscription;
    emit(eventType: any, ...args: any[]): void;
    removeAllListeners(eventType: any): void;
    listenerCount(eventType: any): number;
}
export default EventEmitter;
/**
 * EventEmitter manages listeners and publishes events to them.
 *
 * EventEmitter accepts a single type parameter that defines the valid events
 * and associated listener argument(s).
 *
 * @example
 *
 *   const emitter = new EventEmitter<{
 *     success: [number, string],
 *     error: [Error],
 *   }>();
 *
 *   emitter.on('success', (statusCode, responseText) => {...});
 *   emitter.emit('success', 200, '...');
 *
 *   emitter.on('error', error => {...});
 *   emitter.emit('error', new Error('Resource not found'));
 *
 */
export class EventEmitter {
    _registry: {};
    /**
     * Registers a listener that is called when the supplied event is emitted.
     * Returns a subscription that has a `remove` method to undo registration.
     */
    addListener(eventType: any, listener: any, context: any): {
        context: any;
        listener: any;
        remove(): void;
    };
    /**
     * Emits the supplied event. Additional arguments supplied to `emit` will be
     * passed through to each of the registered listeners.
     *
     * If a listener modifies the listeners registered for the same event, those
     * changes will not be reflected in the current invocation of `emit`.
     */
    emit(eventType: any, ...args: any[]): void;
    /**
     * Removes all registered listeners.
     */
    removeAllListeners(eventType: any): void;
    /**
     * Returns the number of registered listeners for the supplied event.
     */
    listenerCount(eventType: any): any;
}
