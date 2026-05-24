/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */
/**
 * Used to find the indices of the frames that overlap the given offsets. Useful for finding the
 * items that bound different windows of content, such as the visible area or the buffered overscan
 * area.
 */
export function elementsThatOverlapOffsets(offsets: any, props: any, getFrameMetrics: any, zoomScale?: number): number[];
/**
 * Computes the number of elements in the `next` range that are new compared to the `prev` range.
 * Handy for calculating how many new items will be rendered when the render window changes so we
 * can restrict the number of new items render at once so that content can appear on the screen
 * faster.
 */
export function newRangeCount(prev: any, next: any): number;
/**
 * Custom logic for determining which items should be rendered given the current frame and scroll
 * metrics, as well as the previous render state. The algorithm may evolve over time, but generally
 * prioritizes the visible area first, then expands that with overscan regions ahead and behind,
 * biased in the direction of scroll.
 */
export function computeWindowedRenderLimits(props: any, maxToRenderPerBatch: any, windowSize: any, prev: any, getFrameMetricsApprox: any, scrollMetrics: any): {
    first: number;
    last: number;
};
export function keyExtractor(item: any, index: any): any;
