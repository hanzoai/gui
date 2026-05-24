export default EventEmitter;
/**
 * @class EventEmitter
 * @description
 * An EventEmitter is responsible for managing a set of listeners and publishing
 * events to them when it is told that such events happened. In addition to the
 * data for the given event it also sends a event control object which allows
 * the listeners/handlers to prevent the default behavior of the given event.
 *
 * The emitter is designed to be generic enough to support all the different
 * contexts in which one might want to emit events. It is a simple multicast
 * mechanism on top of which extra functionality can be composed. For example, a
 * more advanced emitter may use an EventHolder and EventFactory.
 */
export class EventEmitter {
    /**
     * @constructor
     *
     * @param {EventSubscriptionVendor} subscriber - Optional subscriber instance
     *   to use. If omitted, a new subscriber will be created for the emitter.
     */
    constructor(subscriber?: EventSubscriptionVendor);
    _subscriber: EventSubscriptionVendor;
    /**
     * Adds a listener to be invoked when events of the specified type are
     * emitted. An optional calling context may be provided. The data arguments
     * emitted will be passed to the listener function.
     *
     * TODO: Annotate the listener arg's type. This is tricky because listeners
     *       can be invoked with varargs.
     *
     * @param {string} eventType - Name of the event to listen to
     * @param {function} listener - Function to invoke when the specified event is
     *   emitted
     * @param {*} context - Optional context object to use when invoking the
     *   listener
     */
    addListener(eventType: string, listener: Function, context: any): EventSubscription;
    /**
     * Removes all of the registered listeners, including those registered as
     * listener maps.
     *
     * @param {?string} eventType - Optional name of the event whose registered
     *   listeners to remove
     */
    removeAllListeners(eventType: string | null): void;
    /**
     * @deprecated Use `remove` on the EventSubscription from `addListener`.
     */
    removeSubscription(subscription: any): void;
    /**
     * Returns the number of listeners that are currently registered for the given
     * event.
     *
     * @param {string} eventType - Name of the event to query
     * @returns {number}
     */
    listenerCount(eventType: string): number;
    /**
     * Emits an event of the given type with the given data. All handlers of that
     * particular type will be notified.
     *
     * @param {string} eventType - Name of the event to emit
     * @param {...*} Arbitrary arguments to be passed to each registered listener
     *
     * @example
     *   emitter.addListener('someEvent', function(message) {
     *     console.log(message);
     *   });
     *
     *   emitter.emit('someEvent', 'abc'); // logs 'abc'
     */
    emit(eventType: string, ...args: any[]): void;
    /**
     * @deprecated Use `remove` on the EventSubscription from `addListener`.
     */
    removeListener(eventType: any, listener: any): void;
}
import { EventSubscriptionVendor } from './_EventSubscriptionVendor';
