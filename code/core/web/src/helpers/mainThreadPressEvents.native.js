"use strict";
/**
 * Fallback press handling when RNGH is not available.
 *
 * Implements the responder-based press detection that usePressability provides,
 * without the deep RN internal import. Supports pressIn/pressOut delays,
 * long press, cancellation, and min press duration.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMainThreadPressEvents = useMainThreadPressEvents;
var react_1 = require("react");
var DEFAULT_LONG_PRESS_DELAY = 500;
var DEFAULT_MIN_PRESS_DURATION = 130;
function useMainThreadPressEvents(events, viewProps, enabled, debugName) {
    var _a, _b, _c, _d;
    if (enabled === void 0) { enabled = true; }
    var ref = (0, react_1.useRef)(null);
    if (!ref.current) {
        ref.current = {
            state: 'idle',
            pressInTimer: null,
            pressOutTimer: null,
            longPressTimer: null,
            activateTime: 0,
        };
    }
    if (!enabled || !events)
        return;
    var delayPressIn = Math.max(0, (_a = events.delayPressIn) !== null && _a !== void 0 ? _a : 0);
    var delayPressOut = Math.max(0, (_b = events.delayPressOut) !== null && _b !== void 0 ? _b : 0);
    var delayLongPress = Math.max(0, (_c = events.delayLongPress) !== null && _c !== void 0 ? _c : DEFAULT_LONG_PRESS_DELAY);
    var minPressDuration = Math.max(0, (_d = events.minPressDuration) !== null && _d !== void 0 ? _d : DEFAULT_MIN_PRESS_DURATION);
    function activate(e) {
        var _a;
        ref.current.state = 'active';
        ref.current.activateTime = Date.now();
        (_a = events.onPressIn) === null || _a === void 0 ? void 0 : _a.call(events, e);
    }
    function deactivate(e) {
        var _a;
        var pressDuration = Date.now() - ref.current.activateTime;
        var remaining = Math.max(minPressDuration - pressDuration, delayPressOut);
        if (remaining > 0) {
            ref.current.pressOutTimer = setTimeout(function () {
                var _a;
                (_a = events.onPressOut) === null || _a === void 0 ? void 0 : _a.call(events, e);
            }, remaining);
        }
        else {
            (_a = events.onPressOut) === null || _a === void 0 ? void 0 : _a.call(events, e);
        }
    }
    function cleanup() {
        if (ref.current.pressInTimer)
            clearTimeout(ref.current.pressInTimer);
        if (ref.current.pressOutTimer)
            clearTimeout(ref.current.pressOutTimer);
        if (ref.current.longPressTimer)
            clearTimeout(ref.current.longPressTimer);
        ref.current.pressInTimer = null;
        ref.current.pressOutTimer = null;
        ref.current.longPressTimer = null;
    }
    viewProps.onStartShouldSetResponder = function () { return !events.disabled; };
    viewProps.onResponderGrant = function (e) {
        cleanup();
        ref.current.state = 'pressing';
        if (delayPressIn > 0) {
            ref.current.pressInTimer = setTimeout(function () { return activate(e); }, delayPressIn);
        }
        else {
            activate(e);
        }
        if (events.onLongPress) {
            ref.current.longPressTimer = setTimeout(function () {
                var _a;
                if (ref.current.state === 'active') {
                    ref.current.state = 'longPressed';
                    (_a = events.onLongPress) === null || _a === void 0 ? void 0 : _a.call(events, e);
                }
            }, delayLongPress + delayPressIn);
        }
    };
    viewProps.onResponderRelease = function (e) {
        var _a;
        var wasLongPressed = ref.current.state === 'longPressed';
        cleanup();
        // if pressIn hasn't fired yet (was in delay), fire it now then immediately deactivate
        if (ref.current.state === 'pressing') {
            activate(e);
        }
        if (!wasLongPressed) {
            (_a = events.onPress) === null || _a === void 0 ? void 0 : _a.call(events, e);
        }
        deactivate(e);
        ref.current.state = 'idle';
    };
    viewProps.onResponderTerminate = function (e) {
        cleanup();
        if (ref.current.state === 'active' || ref.current.state === 'longPressed') {
            deactivate(e);
        }
        ref.current.state = 'idle';
    };
    viewProps.onResponderTerminationRequest = function () {
        return events.cancelable !== false;
    };
    viewProps.onResponderMove = function (e) {
        var _a;
        (_a = events.onPressMove) === null || _a === void 0 ? void 0 : _a.call(events, e);
    };
}
