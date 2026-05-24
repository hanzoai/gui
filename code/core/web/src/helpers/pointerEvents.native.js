"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePointerEvents = usePointerEvents;
/**
 * Native pointer events - maps pointer events to touch/responder events
 *
 * Implements setPointerCapture/releasePointerCapture on the event target
 * to match web API for drag scenarios.
 */
var react_1 = require("react");
var helpers_1 = require("@hanzogui/helpers");
function usePointerEvents(props, viewProps) {
    var onPointerDown = props.onPointerDown, onPointerUp = props.onPointerUp, onPointerMove = props.onPointerMove, onPointerCancel = props.onPointerCancel, onPointerEnter = props.onPointerEnter, onPointerLeave = props.onPointerLeave;
    var hasPointerEvents = onPointerDown ||
        onPointerUp ||
        onPointerMove ||
        onPointerCancel ||
        onPointerEnter ||
        onPointerLeave;
    // track if pointer is currently inside bounds (for enter/leave)
    var isInsideRef = (0, react_1.useRef)(false);
    var layoutRef = (0, react_1.useRef)({ width: 0, height: 0 });
    // track if pointer is captured (for move events outside bounds)
    var isCapturedRef = (0, react_1.useRef)(false);
    if (!hasPointerEvents)
        return;
    // create normalized event with setPointerCapture support
    var createNormalizedEvent = function (e) {
        var _a;
        var touch = e.nativeEvent;
        var normalized = __assign(__assign({}, e), { clientX: touch.pageX, clientY: touch.pageY, pageX: touch.pageX, pageY: touch.pageY, offsetX: touch.locationX, offsetY: touch.locationY, pointerType: 'touch', pointerId: (_a = touch.identifier) !== null && _a !== void 0 ? _a : 0, nativeEvent: touch, target: {
                setPointerCapture: function (_pointerId) {
                    isCapturedRef.current = true;
                },
                releasePointerCapture: function (_pointerId) {
                    isCapturedRef.current = false;
                },
            } });
        return normalized;
    };
    // pointer down
    if (onPointerDown) {
        viewProps.onTouchStart = (0, helpers_1.composeEventHandlers)(viewProps.onTouchStart, function (e) {
            onPointerDown(createNormalizedEvent(e));
        });
    }
    // pointer up
    if (onPointerUp) {
        viewProps.onTouchEnd = (0, helpers_1.composeEventHandlers)(viewProps.onTouchEnd, function (e) {
            isCapturedRef.current = false; // auto-release on up
            onPointerUp(createNormalizedEvent(e));
        });
    }
    // pointer move - fires for all moves when captured, otherwise only in bounds
    if (onPointerMove) {
        viewProps.onTouchMove = (0, helpers_1.composeEventHandlers)(viewProps.onTouchMove, function (e) {
            var _a = e.nativeEvent, locationX = _a.locationX, locationY = _a.locationY;
            var _b = layoutRef.current, width = _b.width, height = _b.height;
            var isInBounds = locationX >= 0 && locationX <= width && locationY >= 0 && locationY <= height;
            // fire if captured OR in bounds (matches web behavior)
            if (isCapturedRef.current || isInBounds) {
                onPointerMove(createNormalizedEvent(e));
            }
        });
    }
    // pointer cancel
    if (onPointerCancel) {
        viewProps.onTouchCancel = (0, helpers_1.composeEventHandlers)(viewProps.onTouchCancel, function (e) {
            isCapturedRef.current = false;
            onPointerCancel(createNormalizedEvent(e));
        });
    }
    // enter/leave and layout tracking
    if (onPointerEnter || onPointerLeave || onPointerMove) {
        // track layout for bounds checking
        viewProps.onLayout = (0, helpers_1.composeEventHandlers)(viewProps.onLayout, function (e) {
            layoutRef.current = {
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
            };
        });
    }
    // enter on touch start if in bounds
    if (onPointerEnter) {
        viewProps.onTouchStart = (0, helpers_1.composeEventHandlers)(viewProps.onTouchStart, function (e) {
            var _a = e.nativeEvent, locationX = _a.locationX, locationY = _a.locationY;
            var _b = layoutRef.current, width = _b.width, height = _b.height;
            if (locationX >= 0 && locationX <= width && locationY >= 0 && locationY <= height) {
                isInsideRef.current = true;
                onPointerEnter(createNormalizedEvent(e));
            }
        });
    }
    // leave when touch moves outside or ends
    if (onPointerLeave) {
        viewProps.onTouchMove = (0, helpers_1.composeEventHandlers)(viewProps.onTouchMove, function (e) {
            var _a = e.nativeEvent, locationX = _a.locationX, locationY = _a.locationY;
            var _b = layoutRef.current, width = _b.width, height = _b.height;
            var isInside = locationX >= 0 && locationX <= width && locationY >= 0 && locationY <= height;
            if (isInsideRef.current && !isInside) {
                isInsideRef.current = false;
                onPointerLeave(createNormalizedEvent(e));
            }
        });
        viewProps.onTouchEnd = (0, helpers_1.composeEventHandlers)(viewProps.onTouchEnd, function (e) {
            if (isInsideRef.current) {
                isInsideRef.current = false;
                onPointerLeave(createNormalizedEvent(e));
            }
        });
    }
}
