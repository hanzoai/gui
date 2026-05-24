"use strict";
/**
 * Web implementation of drag gesture handling with animation driver integration.
 * Uses pointer events for smooth drag tracking, animation driver for transforms.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimatedDragGesture = useAnimatedDragGesture;
var React = require("react");
var VELOCITY_THRESHOLD = 0.11;
/**
 * Apply resistance when dragging past a boundary.
 * Uses a square root curve for natural-feeling resistance (same as Sheet).
 */
function resisted(delta, maxResist) {
    if (maxResist === void 0) { maxResist = 25; }
    if (delta >= 0)
        return delta;
    var pastBoundary = Math.abs(delta);
    var resistedDistance = Math.sqrt(pastBoundary) * 2;
    return -Math.min(resistedDistance, maxResist);
}
/**
 * Cap the exit-direction drag distance so the toast doesn't fly across the screen.
 * Allows free movement up to the limit, then applies gentle resistance beyond it.
 */
var EXIT_DRAG_CAP = 80;
function cappedExit(delta) {
    if (Math.abs(delta) <= EXIT_DRAG_CAP)
        return delta;
    var sign = delta > 0 ? 1 : -1;
    var overshoot = Math.abs(delta) - EXIT_DRAG_CAP;
    return sign * (EXIT_DRAG_CAP + Math.sqrt(overshoot) * 2);
}
function useAnimatedDragGesture(options) {
    var direction = options.direction, threshold = options.threshold, disabled = options.disabled, expanded = options.expanded, onDragMove = options.onDragMove, onDragStart = options.onDragStart, onDismiss = options.onDismiss, onCancel = options.onCancel;
    var _a = React.useState(false), isDragging = _a[0], setIsDragging = _a[1];
    var dragStartRef = React.useRef(null);
    var lockedDirectionRef = React.useRef(null);
    // Stable ref for pointer capture - avoids issues with event.target changing
    var captureElementRef = React.useRef(null);
    var isHorizontal = direction === 'left' || direction === 'right' || direction === 'horizontal';
    var isVertical = direction === 'up' || direction === 'down' || direction === 'vertical';
    // block native text selection during drag — works in Safari where
    // userSelect style alone doesn't prevent fast-swipe selection
    var preventSelectRef = React.useRef(null);
    function startPreventingSelection() {
        var _a;
        if (typeof document === 'undefined')
            return;
        // clear any selection that already started
        (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
        // block future selection attempts at the event level
        var handler = function (e) { return e.preventDefault(); };
        preventSelectRef.current = handler;
        document.addEventListener('selectstart', handler, true);
    }
    function stopPreventingSelection() {
        if (preventSelectRef.current) {
            document.removeEventListener('selectstart', preventSelectRef.current, true);
            preventSelectRef.current = null;
        }
    }
    // Cleanup function to reset all drag state
    var cleanup = React.useCallback(function () {
        dragStartRef.current = null;
        lockedDirectionRef.current = null;
        setIsDragging(false);
        stopPreventingSelection();
    }, []);
    // Defensive cleanup on unmount - if toast unmounts while dragging
    React.useEffect(function () {
        return function () {
            if (dragStartRef.current) {
                // Release pointer capture if we have it
                if (captureElementRef.current && dragStartRef.current.pointerId) {
                    try {
                        captureElementRef.current.releasePointerCapture(dragStartRef.current.pointerId);
                    }
                    catch (_a) {
                        // ignore
                    }
                }
                cleanup();
                // Note: can't call onCancel here as component is unmounting
            }
        };
    }, [cleanup]);
    var handlePointerDown = React.useCallback(function (event) {
        var _a, _b;
        if (disabled)
            return;
        if (event.button !== 0)
            return;
        // don't start drag if clicking on interactive elements (buttons, links, inputs)
        var target = event.target;
        if (target.closest('button, a, input, textarea, select, [role="button"]')) {
            return;
        }
        // don't start drag if user has text selected (let them copy it)
        var hasSelection = ((_b = (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString().length) !== null && _b !== void 0 ? _b : 0) > 0;
        if (hasSelection)
            return;
        // Use currentTarget (the element with the handler) for stable capture
        var captureElement = event.currentTarget;
        captureElementRef.current = captureElement;
        captureElement.setPointerCapture(event.pointerId);
        dragStartRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            startTime: Date.now(),
            pointerId: event.pointerId,
        };
        // prevent text selection on the page during drag
        startPreventingSelection();
        setIsDragging(true);
        onDragStart === null || onDragStart === void 0 ? void 0 : onDragStart();
    }, [disabled, onDragStart]);
    var handlePointerMove = React.useCallback(function (event) {
        if (!dragStartRef.current || disabled)
            return;
        var deltaX = event.clientX - dragStartRef.current.startX;
        var deltaY = event.clientY - dragStartRef.current.startY;
        // detect direction lock on first significant movement
        if (!lockedDirectionRef.current && (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1)) {
            lockedDirectionRef.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
        }
        var offsetX = 0;
        var offsetY = 0;
        // only allow movement along the exit axis with capped distance
        // cross-axis is locked to zero for clean swipes
        if (direction === 'right') {
            offsetX = deltaX > 0 ? cappedExit(deltaX) : resisted(deltaX);
        }
        else if (direction === 'left') {
            offsetX = deltaX < 0 ? cappedExit(deltaX) : -resisted(-deltaX);
        }
        else if (direction === 'down') {
            offsetY = deltaY > 0 ? cappedExit(deltaY) : resisted(deltaY);
        }
        else if (direction === 'up') {
            offsetY = deltaY < 0 ? cappedExit(deltaY) : -resisted(-deltaY);
        }
        else if (direction === 'horizontal') {
            offsetX = cappedExit(deltaX);
        }
        else if (direction === 'vertical') {
            offsetY = cappedExit(deltaY);
        }
        // directly update animated values (no React state update during drag)
        onDragMove(offsetX, offsetY);
    }, [disabled, direction, expanded, isHorizontal, isVertical, onDragMove]);
    var handlePointerUp = React.useCallback(function (event) {
        if (!dragStartRef.current || disabled)
            return;
        var deltaX = event.clientX - dragStartRef.current.startX;
        var deltaY = event.clientY - dragStartRef.current.startY;
        var timeTaken = Date.now() - dragStartRef.current.startTime;
        var velocityX = Math.abs(deltaX) / timeTaken;
        var velocityY = Math.abs(deltaY) / timeTaken;
        var lockedDirection = lockedDirectionRef.current;
        // if locked to wrong axis for the swipe direction, don't dismiss
        // e.g., if drag started vertical but swipe direction is horizontal
        var isLockedToWrongAxis = (lockedDirection === 'y' && isHorizontal) ||
            (lockedDirection === 'x' && isVertical);
        var relevantDelta = isHorizontal ? deltaX : deltaY;
        var relevantVelocity = isHorizontal ? velocityX : velocityY;
        var passedThreshold = Math.abs(relevantDelta) >= threshold;
        var hasVelocity = relevantVelocity > VELOCITY_THRESHOLD;
        // determine exit direction based on actual drag direction
        var exitDirection = null;
        // only set exit direction if not locked to wrong axis
        if (!isLockedToWrongAxis) {
            if (direction === 'right' && deltaX > 0)
                exitDirection = 'right';
            else if (direction === 'left' && deltaX < 0)
                exitDirection = 'left';
            else if (direction === 'horizontal') {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    exitDirection = deltaX > 0 ? 'right' : 'left';
                }
            }
            else if (direction === 'down' && deltaY > 0)
                exitDirection = 'down';
            else if (direction === 'up' && deltaY < 0)
                exitDirection = 'up';
            else if (direction === 'vertical') {
                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    exitDirection = deltaY > 0 ? 'down' : 'up';
                }
            }
        }
        var shouldDismiss = exitDirection && (passedThreshold || hasVelocity);
        // release pointer capture using stable ref
        if (captureElementRef.current) {
            try {
                captureElementRef.current.releasePointerCapture(event.pointerId);
            }
            catch (_a) {
                // ignore if already released
            }
        }
        // reset state
        cleanup();
        if (shouldDismiss && exitDirection) {
            onDismiss(exitDirection, relevantVelocity);
        }
        else {
            onCancel();
        }
    }, [
        disabled,
        direction,
        threshold,
        isHorizontal,
        isVertical,
        onDismiss,
        onCancel,
        cleanup,
    ]);
    var handlePointerCancel = React.useCallback(function (event) {
        // release pointer capture using stable ref
        if (captureElementRef.current) {
            try {
                captureElementRef.current.releasePointerCapture(event.pointerId);
            }
            catch (_a) {
                // ignore if already released
            }
        }
        cleanup();
        onCancel();
    }, [onCancel, cleanup]);
    // Handle lost pointer capture - treat like cancel
    var handleLostPointerCapture = React.useCallback(function () {
        if (dragStartRef.current) {
            cleanup();
            onCancel();
        }
    }, [onCancel, cleanup]);
    var gestureHandlers = {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerCancel,
        onLostPointerCapture: handleLostPointerCapture,
    };
    return {
        isDragging: isDragging,
        gestureHandlers: gestureHandlers,
        gesture: null,
    };
}
