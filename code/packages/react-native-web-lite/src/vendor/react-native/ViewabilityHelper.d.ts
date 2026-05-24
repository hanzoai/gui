/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
type FrameMetricProps = any;
export type ViewToken = {
    item: any;
    key: string;
    index?: number | null;
    isViewable: boolean;
    section?: any;
};
export type ViewabilityConfigCallbackPair = {
    viewabilityConfig: ViewabilityConfig;
    onViewableItemsChanged: (info: {
        viewableItems: ViewToken[];
        changed: ViewToken[];
    }) => void;
};
export type ViewabilityConfig = {
    /**
     * Minimum amount of time (in milliseconds) that an item must be physically viewable before the
     * viewability callback will be fired. A high number means that scrolling through content without
     * stopping will not mark the content as viewable.
     */
    minimumViewTime?: number;
    /**
     * Percent of viewport that must be covered for a partially occluded item to count as
     * "viewable", 0-100. Fully visible items are always considered viewable. A value of 0 means
     * that a single pixel in the viewport makes the item viewable, and a value of 100 means that
     * an item must be either entirely visible or cover the entire viewport to count as viewable.
     */
    viewAreaCoveragePercentThreshold?: number;
    /**
     * Similar to `viewAreaPercentThreshold`, but considers the percent of the item that is visible,
     * rather than the fraction of the viewable area it covers.
     */
    itemVisiblePercentThreshold?: number;
    /**
     * Nothing is considered viewable until the user scrolls or `recordInteraction` is called after
     * render.
     */
    waitForInteraction?: boolean;
};
/**
 * A Utility class for calculating viewable items based on current metrics like scroll position and
 * layout.
 */
declare class ViewabilityHelper {
    _config: ViewabilityConfig;
    _hasInteracted: boolean;
    _timers: Set<number>;
    _viewableIndices: number[];
    _viewableItems: Map<string, ViewToken>;
    constructor(config?: ViewabilityConfig);
    /**
     * Cleanup, e.g. on unmount. Clears any pending timers.
     */
    dispose(): void;
    /**
     * Determines which items are viewable based on the current metrics and config.
     */
    computeViewableItems(props: FrameMetricProps, scrollOffset: number, viewportHeight: number, getFrameMetrics: (index: number, props: FrameMetricProps) => {
        length: number;
        offset: number;
    } | null, renderRange?: {
        first: number;
        last: number;
    }): number[];
    /**
     * Figures out which items are viewable and how that has changed from before and calls
     * `onViewableItemsChanged` as appropriate.
     */
    onUpdate(props: FrameMetricProps, scrollOffset: number, viewportHeight: number, getFrameMetrics: (index: number, props: FrameMetricProps) => {
        length: number;
        offset: number;
    } | null, createViewToken: (index: number, isViewable: boolean, props: FrameMetricProps) => ViewToken, onViewableItemsChanged: (info: {
        viewableItems: ViewToken[];
        changed: ViewToken[];
    }) => void, renderRange?: {
        first: number;
        last: number;
    }): void;
    resetViewableIndices(): void;
    recordInteraction(): void;
    _onUpdateSync(props: FrameMetricProps, viewableIndicesToCheck: number[], onViewableItemsChanged: (info: {
        changed: ViewToken[];
        viewableItems: ViewToken[];
    }) => void, createViewToken: (index: number, isViewable: boolean, props: FrameMetricProps) => ViewToken): void;
}
export default ViewabilityHelper;
export { ViewabilityHelper };
