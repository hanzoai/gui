/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
/**
 * PAN RESPONDER
 *
 * `PanResponder` uses the Responder System to reconcile several touches into
 * a single gesture. It makes single-touch gestures resilient to extra touches,
 * and can be used to recognize simple multi-touch gestures. For each handler,
 * it provides a `gestureState` object alongside the ResponderEvent object.
 *
 * By default, `PanResponder` holds an `InteractionManager` handle to block
 * long-running JS events from interrupting active gestures.
 *
 * A graphical explanation of the touch data flow:
 *
 * +----------------------------+             +--------------------------------+
 * | ResponderTouchHistoryStore |             |TouchHistoryMath                |
 * +----------------------------+             +----------+---------------------+
 * |Global store of touchHistory|             |Allocation-less math util       |
 * |including activeness, start |             |on touch history (centroids     |
 * |position, prev/cur position.|             |and multitouch movement etc)    |
 * |                            |             |                                |
 * +----^-----------------------+             +----^---------------------------+
 *      |                                          |
 *      | (records relevant history                |
 *      |  of touches relevant for                 |
 *      |  implementing higher level               |
 *      |  gestures)                               |
 *      |                                          |
 * +----+-----------------------+             +----|---------------------------+
 * | ResponderEventPlugin       |             |    |   Your App/Component      |
 * +----------------------------+             +----|---------------------------+
 * |Negotiates which view gets  | Low level   |    |             High level    |
 * |onResponderMove events.     | events w/   |  +-+-------+     events w/     |
 * |Also records history into   | touchHistory|  |   Pan   |     multitouch +  |
 * |ResponderTouchHistoryStore. +---------------->Responder+-----> accumulative|
 * +----------------------------+ attached to |  |         |     distance and  |
 *                                 each event |  +---------+     velocity.     |
 *                                            |                                |
 *                                            |                                |
 *                                            +--------------------------------+
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanResponder = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var index_1 = require("../vendor/react-native/TouchHistoryMath/index");
var currentCentroidX = index_1.default.currentCentroidX, currentCentroidY = index_1.default.currentCentroidY, currentCentroidXOfTouchesChangedAfter = index_1.default.currentCentroidXOfTouchesChangedAfter, currentCentroidYOfTouchesChangedAfter = index_1.default.currentCentroidYOfTouchesChangedAfter, previousCentroidXOfTouchesChangedAfter = index_1.default.previousCentroidXOfTouchesChangedAfter, previousCentroidYOfTouchesChangedAfter = index_1.default.previousCentroidYOfTouchesChangedAfter;
var PanResponder = {
    _initializeGestureState: function (gestureState) {
        gestureState.x = 0;
        gestureState.y = 0;
        gestureState.initialX = 0;
        gestureState.initialY = 0;
        gestureState.deltaX = 0;
        gestureState.deltaY = 0;
        gestureState.velocityX = 0;
        gestureState.velocityY = 0;
        gestureState.numberActiveTouches = 0;
        // All `gestureState` accounts for timeStamps up until:
        gestureState._accountsForMovesUpTo = 0;
    },
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
    _updateGestureStateOnMove: function (gestureState, touchHistory) {
        var movedAfter = gestureState._accountsForMovesUpTo;
        var prevX = previousCentroidXOfTouchesChangedAfter(touchHistory, movedAfter);
        var prevY = previousCentroidYOfTouchesChangedAfter(touchHistory, movedAfter);
        var prevDeltaX = gestureState.deltaX;
        var prevDeltaY = gestureState.deltaY;
        var x = currentCentroidXOfTouchesChangedAfter(touchHistory, movedAfter);
        var y = currentCentroidYOfTouchesChangedAfter(touchHistory, movedAfter);
        var deltaX = prevDeltaX + (x - prevX);
        var deltaY = prevDeltaY + (y - prevY);
        // TODO: This must be filtered intelligently.
        var dt = touchHistory.mostRecentTimeStamp - gestureState._accountsForMovesUpTo;
        gestureState.deltaX = deltaX;
        gestureState.deltaY = deltaY;
        gestureState.numberActiveTouches = touchHistory.numberActiveTouches;
        gestureState.velocityX = (deltaX - prevDeltaX) / dt;
        gestureState.velocityY = (deltaY - prevDeltaY) / dt;
        gestureState.x = x;
        gestureState.y = y;
        gestureState._accountsForMovesUpTo = touchHistory.mostRecentTimeStamp;
    },
    /**
     * Enhanced versions of all of the responder callbacks that provide not only
     * the `ResponderEvent`, but also the `PanResponder` gesture state.
     *
     * In general, for events that have capture equivalents, we update the
     * gestureState once in the capture phase and can use it in the bubble phase
     * as well.
     */
    create: function (config) {
        var interactionState = {
            handle: null,
        };
        var gestureState = {
            // Useful for debugging
            stateID: Math.random(),
            x: 0,
            y: 0,
            initialX: 0,
            initialY: 0,
            deltaX: 0,
            deltaY: 0,
            velocityX: 0,
            velocityY: 0,
            numberActiveTouches: 0,
            _accountsForMovesUpTo: 0,
        };
        var onStartShouldSetResponder = config.onStartShouldSetResponder, onStartShouldSetResponderCapture = config.onStartShouldSetResponderCapture, onMoveShouldSetResponder = config.onMoveShouldSetResponder, onMoveShouldSetResponderCapture = config.onMoveShouldSetResponderCapture, onPanGrant = config.onPanGrant, onPanStart = config.onPanStart, onPanMove = config.onPanMove, onPanEnd = config.onPanEnd, onPanRelease = config.onPanRelease, onPanReject = config.onPanReject, onPanTerminate = config.onPanTerminate, onPanTerminationRequest = config.onPanTerminationRequest;
        var panHandlers = {
            onStartShouldSetResponder: function (event) {
                return onStartShouldSetResponder != null
                    ? onStartShouldSetResponder(event, gestureState)
                    : false;
            },
            onMoveShouldSetResponder: function (event) {
                return onMoveShouldSetResponder != null
                    ? onMoveShouldSetResponder(event, gestureState)
                    : false;
            },
            onStartShouldSetResponderCapture: function (event) {
                // TODO: Actually, we should reinitialize the state any time
                // touches.length increases from 0 active to > 0 active.
                if (event.nativeEvent.touches.length === 1) {
                    PanResponder._initializeGestureState(gestureState);
                }
                gestureState.numberActiveTouches = event.touchHistory.numberActiveTouches;
                return onStartShouldSetResponderCapture != null
                    ? onStartShouldSetResponderCapture(event, gestureState)
                    : false;
            },
            onMoveShouldSetResponderCapture: function (event) {
                var touchHistory = event.touchHistory;
                // Responder system incorrectly dispatches should* to current responder
                // Filter out any touch moves past the first one - we would have
                // already processed multi-touch geometry during the first event.
                // NOTE: commented out because new responder system should get it right.
                //if (gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp) {
                //  return false;
                //}
                PanResponder._updateGestureStateOnMove(gestureState, touchHistory);
                return onMoveShouldSetResponderCapture != null
                    ? onMoveShouldSetResponderCapture(event, gestureState)
                    : false;
            },
            onResponderGrant: function (event) {
                if (!interactionState.handle) {
                    interactionState.handle = react_native_web_internals_1.InteractionManager.createInteractionHandle();
                }
                gestureState.initialX = currentCentroidX(event.touchHistory);
                gestureState.initialY = currentCentroidY(event.touchHistory);
                gestureState.deltaX = 0;
                gestureState.deltaY = 0;
                if (onPanGrant != null) {
                    onPanGrant(event, gestureState);
                }
            },
            onResponderReject: function (event) {
                // @ts-ignore
                clearInteractionHandle(interactionState, onPanReject, event, gestureState);
            },
            onResponderStart: function (event) {
                var numberActiveTouches = event.touchHistory.numberActiveTouches;
                gestureState.numberActiveTouches = numberActiveTouches;
                if (onPanStart != null) {
                    onPanStart(event, gestureState);
                }
            },
            onResponderMove: function (event) {
                var touchHistory = event.touchHistory;
                // Guard against the dispatch of two touch moves when there are two
                // simultaneously changed touches.
                if (gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp) {
                    return;
                }
                // Filter out any touch moves past the first one - we would have
                // already processed multi-touch geometry during the first event.
                PanResponder._updateGestureStateOnMove(gestureState, touchHistory);
                if (onPanMove != null) {
                    onPanMove(event, gestureState);
                }
            },
            onResponderEnd: function (event) {
                var numberActiveTouches = event.touchHistory.numberActiveTouches;
                gestureState.numberActiveTouches = numberActiveTouches;
                // @ts-ignore
                clearInteractionHandle(interactionState, onPanEnd, event, gestureState);
            },
            onResponderRelease: function (event) {
                // @ts-ignore
                clearInteractionHandle(interactionState, onPanRelease, event, gestureState);
                PanResponder._initializeGestureState(gestureState);
            },
            onResponderTerminate: function (event) {
                // @ts-ignore
                clearInteractionHandle(interactionState, onPanTerminate, event, gestureState);
                PanResponder._initializeGestureState(gestureState);
            },
            onResponderTerminationRequest: function (event) {
                return onPanTerminationRequest != null
                    ? onPanTerminationRequest(event, gestureState)
                    : true;
            },
        };
        return {
            panHandlers: panHandlers,
            getInteractionHandle: function () {
                return interactionState.handle;
            },
        };
    },
};
exports.PanResponder = PanResponder;
function clearInteractionHandle(interactionState, callback, event, gestureState) {
    if (interactionState.handle) {
        react_native_web_internals_1.InteractionManager.clearInteractionHandle(interactionState.handle);
        interactionState.handle = null;
    }
    if (callback) {
        callback(event, gestureState);
    }
}
