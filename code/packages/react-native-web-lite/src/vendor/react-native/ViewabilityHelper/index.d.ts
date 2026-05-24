export default ViewabilityHelper;
/**
 * A Utility class for calculating viewable items based on current metrics like scroll position and
 * layout.
 *
 * An item is said to be in a "viewable" state when any of the following
 * is true for longer than `minimumViewTime` milliseconds (after an interaction if `waitForInteraction`
 * is true):
 *
 * - Occupying >= `viewAreaCoveragePercentThreshold` of the view area XOR fraction of the item
 *   visible in the view area >= `itemVisiblePercentThreshold`.
 * - Entirely visible on screen
 */
export class ViewabilityHelper {
    constructor(config?: {
        viewAreaCoveragePercentThreshold: number;
    });
    _config: {
        viewAreaCoveragePercentThreshold: number;
    };
    _hasInteracted: boolean;
    _timers: Set<any>;
    _viewableIndices: any[];
    _viewableItems: Map<any, any>;
    /**
     * Cleanup, e.g. on unmount. Clears any pending timers.
     */
    dispose(): void;
    /**
     * Determines which items are viewable based on the current metrics and config.
     */
    computeViewableItems(props: any, scrollOffset: any, viewportHeight: any, getFrameMetrics: any, renderRange: any): any[];
    /**
     * Figures out which items are viewable and how that has changed from before and calls
     * `onViewableItemsChanged` as appropriate.
     */
    onUpdate(props: any, scrollOffset: any, viewportHeight: any, getFrameMetrics: any, createViewToken: any, onViewableItemsChanged: any, renderRange: any): void;
    /**
     * clean-up cached _viewableIndices to evaluate changed items on next update
     */
    resetViewableIndices(): void;
    /**
     * Records that an interaction has happened even if there has been no scroll.
     */
    recordInteraction(): void;
    _onUpdateSync(props: any, viewableIndicesToCheck: any, onViewableItemsChanged: any, createViewToken: any): void;
}
