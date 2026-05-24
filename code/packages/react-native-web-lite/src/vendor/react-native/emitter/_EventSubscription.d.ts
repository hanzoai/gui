export default _EventSubscription;
/**
 * EventSubscription represents a subscription to a particular event. It can
 * remove its own subscription.
 */
export class _EventSubscription {
    /**
     * @param {EventSubscriptionVendor} subscriber the subscriber that controls
     *   this subscription.
     */
    constructor(subscriber: EventSubscriptionVendor);
    subscriber: EventSubscriptionVendor;
    /**
     * Removes this subscription from the subscriber that controls it.
     */
    remove(): void;
}
