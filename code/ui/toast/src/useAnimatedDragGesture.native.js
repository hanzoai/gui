"use strict";
/**
 * Native drag gesture handling for toast swipe-to-dismiss.
 *
 * Uses react-native-gesture-handler (RNGH) when available for proper gesture
 * coordination with ScrollView and navigation. Falls back to PanResponder.
 *
 * Pattern: same as Sheet — RNGH is accessed through @hanzogui/native global
 * registry, never imported directly. The gesture is created in useMemo and
 * returns null when RNGH is not set up.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimatedDragGesture = useAnimatedDragGesture;
var native_1 = require("@hanzogui/native");
var React = require("react");
var react_native_1 = require("react-native");
var VELOCITY_THRESHOLD = 0.11;
var GESTURE_GRANT_THRESHOLD = 10;
function resisted(delta, maxResist) {
    if (maxResist === void 0) { maxResist = 25; }
    if (delta >= 0)
        return delta;
    var pastBoundary = Math.abs(delta);
    var resistedDistance = Math.sqrt(pastBoundary) * 2;
    return -Math.min(resistedDistance, maxResist);
}
var EXIT_DRAG_CAP = 80;
function cappedExit(delta) {
    if (Math.abs(delta) <= EXIT_DRAG_CAP)
        return delta;
    var sign = delta > 0 ? 1 : -1;
    var overshoot = Math.abs(delta) - EXIT_DRAG_CAP;
    return sign * (EXIT_DRAG_CAP + Math.sqrt(overshoot) * 2);
}
function computeOffset(direction, dx, dy) {
    var offsetX = 0;
    var offsetY = 0;
    if (direction === 'right') {
        offsetX = dx > 0 ? cappedExit(dx) : resisted(dx);
    }
    else if (direction === 'left') {
        offsetX = dx < 0 ? cappedExit(dx) : -resisted(-dx);
    }
    else if (direction === 'down') {
        offsetY = dy > 0 ? cappedExit(dy) : resisted(dy);
    }
    else if (direction === 'up') {
        offsetY = dy < 0 ? cappedExit(dy) : -resisted(-dy);
    }
    else if (direction === 'horizontal') {
        offsetX = cappedExit(dx);
    }
    else if (direction === 'vertical') {
        offsetY = cappedExit(dy);
    }
    return { offsetX: offsetX, offsetY: offsetY };
}
function computeExitDirection(direction, dx, dy) {
    if (direction === 'right' && dx > 0)
        return 'right';
    if (direction === 'left' && dx < 0)
        return 'left';
    if (direction === 'horizontal') {
        if (Math.abs(dx) > Math.abs(dy))
            return dx > 0 ? 'right' : 'left';
    }
    if (direction === 'down' && dy > 0)
        return 'down';
    if (direction === 'up' && dy < 0)
        return 'up';
    if (direction === 'vertical') {
        if (Math.abs(dy) > Math.abs(dx))
            return dy > 0 ? 'down' : 'up';
    }
    return null;
}
function shouldGrantGestureMove(dir, dx, dy) {
    var absDx = Math.abs(dx);
    var absDy = Math.abs(dy);
    if ((dir === 'horizontal' || dir === 'left' || dir === 'right') &&
        absDx > GESTURE_GRANT_THRESHOLD &&
        absDx > absDy) {
        return true;
    }
    if ((dir === 'vertical' || dir === 'up' || dir === 'down') &&
        absDy > GESTURE_GRANT_THRESHOLD &&
        absDy > absDx) {
        return true;
    }
    return false;
}
/**
 * Single hook — always calls the same hooks in the same order.
 * Creates RNGH gesture in useMemo (returns null if unavailable).
 * Creates PanResponder in useMemo (returns null if RNGH is used).
 * Consumer checks `gesture` to decide whether to wrap with GestureDetector.
 */
function useAnimatedDragGesture(options) {
    var _a;
    var direction = options.direction, threshold = options.threshold, disabled = options.disabled;
    var _b = React.useState(false), isDragging = _b[0], setIsDragging = _b[1];
    var isHorizontal = direction === 'left' || direction === 'right' || direction === 'horizontal';
    var gestureRef = React.useRef(null);
    // store callbacks in refs for stable closures
    var onDragMoveRef = React.useRef(options.onDragMove);
    var onDragStartRef = React.useRef(options.onDragStart);
    var onDismissRef = React.useRef(options.onDismiss);
    var onCancelRef = React.useRef(options.onCancel);
    onDragMoveRef.current = options.onDragMove;
    onDragStartRef.current = options.onDragStart;
    onDismissRef.current = options.onDismiss;
    onCancelRef.current = options.onCancel;
    // check once — RNGH availability is set at app init and never changes
    var rnghEnabled = (0, native_1.getGestureHandler)().isEnabled;
    // RNGH gesture (null if not available)
    var gesture = React.useMemo(function () {
        if (!rnghEnabled || disabled)
            return null;
        var Gesture = (0, native_1.getGestureHandler)().state.Gesture;
        if (!Gesture)
            return null;
        var pan = Gesture.Pan()
            .withRef(gestureRef)
            .shouldCancelWhenOutside(false)
            .runOnJS(true);
        if (isHorizontal) {
            pan.activeOffsetX([-10, 10]);
            pan.failOffsetY([-20, 20]);
        }
        else {
            pan.activeOffsetY([-10, 10]);
            pan.failOffsetX([-20, 20]);
        }
        pan
            .onStart(function () {
            var _a;
            setIsDragging(true);
            (_a = onDragStartRef.current) === null || _a === void 0 ? void 0 : _a.call(onDragStartRef);
        })
            .onChange(function (event) {
            var _a = computeOffset(direction, event.translationX, event.translationY), offsetX = _a.offsetX, offsetY = _a.offsetY;
            onDragMoveRef.current(offsetX, offsetY);
        })
            .onEnd(function (event) {
            var dx = event.translationX;
            var dy = event.translationY;
            var relevantDelta = isHorizontal ? dx : dy;
            var relevantVelocity = isHorizontal
                ? Math.abs(event.velocityX / 1000)
                : Math.abs(event.velocityY / 1000);
            var passedThreshold = Math.abs(relevantDelta) >= threshold;
            var hasVelocity = relevantVelocity > VELOCITY_THRESHOLD;
            var exitDirection = computeExitDirection(direction, dx, dy);
            var shouldDismiss = exitDirection && (passedThreshold || hasVelocity);
            setIsDragging(false);
            if (shouldDismiss && exitDirection) {
                onDismissRef.current(exitDirection, relevantVelocity);
            }
            else {
                onCancelRef.current();
            }
        })
            .onFinalize(function () {
            setIsDragging(false);
        });
        return pan;
    }, [disabled, direction, threshold, isHorizontal, rnghEnabled]);
    // PanResponder fallback (null if RNGH is used)
    var panResponder = React.useMemo(function () {
        if (rnghEnabled || disabled)
            return null;
        return react_native_1.PanResponder.create({
            onMoveShouldSetPanResponder: function (_e, g) {
                return shouldGrantGestureMove(direction, g.dx, g.dy);
            },
            onMoveShouldSetPanResponderCapture: function (_e, g) {
                return shouldGrantGestureMove(direction, g.dx, g.dy);
            },
            onPanResponderTerminationRequest: function () { return false; },
            onPanResponderGrant: function () {
                var _a;
                setIsDragging(true);
                (_a = onDragStartRef.current) === null || _a === void 0 ? void 0 : _a.call(onDragStartRef);
            },
            onPanResponderMove: function (_e, g) {
                var _a = computeOffset(direction, g.dx, g.dy), offsetX = _a.offsetX, offsetY = _a.offsetY;
                onDragMoveRef.current(offsetX, offsetY);
            },
            onPanResponderRelease: function (_e, g) {
                var dx = g.dx, dy = g.dy, vx = g.vx, vy = g.vy;
                var relevantDelta = isHorizontal ? dx : dy;
                var relevantVelocity = isHorizontal ? Math.abs(vx) : Math.abs(vy);
                var passedThreshold = Math.abs(relevantDelta) >= threshold;
                var hasVelocity = relevantVelocity > VELOCITY_THRESHOLD;
                var exitDirection = computeExitDirection(direction, dx, dy);
                var shouldDismiss = exitDirection && (passedThreshold || hasVelocity);
                setIsDragging(false);
                if (shouldDismiss && exitDirection) {
                    onDismissRef.current(exitDirection, relevantVelocity);
                }
                else {
                    onCancelRef.current();
                }
            },
            onPanResponderTerminate: function () {
                setIsDragging(false);
                onCancelRef.current();
            },
        });
    }, [disabled, direction, threshold, isHorizontal, rnghEnabled]);
    return {
        isDragging: isDragging,
        gestureHandlers: (_a = panResponder === null || panResponder === void 0 ? void 0 : panResponder.panHandlers) !== null && _a !== void 0 ? _a : {},
        gesture: gesture,
    };
}
