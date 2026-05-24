/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
type PressEvent = any;
export type GestureState = {
    stateID: number;
    x: number;
    y: number;
    initialX: number;
    initialY: number;
    deltaX: number;
    deltaY: number;
    velocityX: number;
    velocityY: number;
    numberActiveTouches: number;
    _accountsForMovesUpTo: number;
};
type ActiveCallback = (event: PressEvent, gestureState: GestureState) => boolean;
type PassiveCallback = (event: PressEvent, gestureState: GestureState) => void;
type PanResponderConfig = {
    readonly onMoveShouldSetResponder?: ActiveCallback | null;
    readonly onMoveShouldSetResponderCapture?: ActiveCallback | null;
    readonly onStartShouldSetResponder?: ActiveCallback | null;
    readonly onStartShouldSetResponderCapture?: ActiveCallback | null;
    readonly onPanTerminationRequest?: ActiveCallback | null;
    readonly onPanGrant?: PassiveCallback | null;
    readonly onPanReject?: PassiveCallback | null;
    readonly onPanStart?: PassiveCallback | null;
    readonly onPanMove?: PassiveCallback | null;
    readonly onPanEnd?: PassiveCallback | null;
    readonly onPanRelease?: PassiveCallback | null;
    readonly onPanTerminate?: PassiveCallback | null;
};
declare const PanResponder: {
    _initializeGestureState(gestureState: GestureState): void;
    /**
     * Take all recently moved touches, calculate how the centroid has changed just for those
     * recently moved touches, and append that change to an accumulator. This is
     * to (at least) handle the case where the user is moving three fingers, and
     * then one of the fingers stops but the other two continue.
     *
     * This is very different than taking all of the recently moved touches and
     * storing their centroid as `dx/dy`. For correctness, we must *accumulate
     * changes* in the centroid of recently moved touches.
     *
     * There is also some nuance with how we handle multiple moved touches in a
     * single event. Multiple touches generate two 'move' events, each of
     * them triggering `onResponderMove`. But with the way `PanResponder` works,
     * all of the gesture inference is performed on the first dispatch, since it
     * looks at all of the touches. Therefore, `PanResponder` does not call
     * `onResponderMove` passed the first dispatch. This diverges from the
     * typical responder callback pattern (without using `PanResponder`), but
     * avoids more dispatches than necessary.
     *
     * When moving two touches in opposite directions, the cumulative
     * distance is zero in each dimension. When two touches move in parallel five
     * pixels in the same direction, the cumulative distance is five, not ten. If
     * two touches start, one moves five in a direction, then stops and the other
     * touch moves fives in the same direction, the cumulative distance is ten.
     *
     * This logic requires a kind of processing of time "clusters" of touch events
     * so that two touch moves that essentially occur in parallel but move every
     * other frame respectively, are considered part of the same movement.
     *
     * x/y: If a move event has been observed, `(x, y)` is the centroid of the most
     * recently moved "cluster" of active touches.
     * deltaX/deltaY: Cumulative touch distance. Accounts for touch moves that are
     * clustered together in time, moving the same direction. Only valid when
     * currently responder (otherwise, it only represents the drag distance below
     * the threshold).
     */
    _updateGestureStateOnMove(gestureState: GestureState, touchHistory: PressEvent["touchHistory"]): void;
    /**
     * Enhanced versions of all of the responder callbacks that provide not only
     * the `ResponderEvent`, but also the `PanResponder` gesture state.
     *
     * In general, for events that have capture equivalents, we update the
     * gestureState once in the capture phase and can use it in the bubble phase
     * as well.
     */
    create(config: PanResponderConfig): {
        getInteractionHandle: () => number | null;
        panHandlers: {
            onMoveShouldSetResponder: (event: PressEvent) => boolean;
            onMoveShouldSetResponderCapture: (event: PressEvent) => boolean;
            onResponderEnd: (event: PressEvent) => void;
            onResponderGrant: (event: PressEvent) => void;
            onResponderMove: (event: PressEvent) => void;
            onResponderReject: (event: PressEvent) => void;
            onResponderRelease: (event: PressEvent) => void;
            onResponderStart: (event: PressEvent) => void;
            onResponderTerminate: (event: PressEvent) => void;
            onResponderTerminationRequest: (event: PressEvent) => boolean;
            onStartShouldSetResponder: (event: PressEvent) => boolean;
            onStartShouldSetResponderCapture: (event: PressEvent) => boolean;
        };
    };
};
export { PanResponder };
