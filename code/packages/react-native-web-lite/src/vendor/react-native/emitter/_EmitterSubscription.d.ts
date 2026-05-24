export default EmitterSubscription;
/**
 * EmitterSubscription represents a subscription with listener and context data.
 */
export class EmitterSubscription extends _EventSubscription {
    /**
     * @param {EventEmitter} emitter - The event emitter that registered this
     *   subscription
     * @param {EventSubscriptionVendor} subscriber - The subscriber that controls
     *   this subscription
     * @param {function} listener - Function to invoke when the specified event is
     *   emitted
     * @param {*} context - Optional context object to use when invoking the
     *   listener
     */
    constructor(emitter: EventEmitter, subscriber: EventSubscriptionVendor, listener: Function, context: any);
    emitter: EventEmitter;
    listener: Function;
    context: any;
}
import { _EventSubscription } from './_EventSubscription';
