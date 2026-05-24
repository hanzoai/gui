"use strict";
/**
 * Hook to detect reduced motion preference.
 * Returns true if user prefers reduced motion (via system settings or forced).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReducedMotion = useReducedMotion;
var constants_1 = require("@hanzogui/constants");
var React = require("react");
var cachedResult = null;
function getReducedMotion() {
    var _a, _b, _c;
    if (cachedResult !== null)
        return cachedResult;
    if (!constants_1.isWeb) {
        // on native, we could use AccessibilityInfo.isReduceMotionEnabled()
        // but that requires async, so default to false
        cachedResult = false;
        return false;
    }
    if (typeof window === 'undefined') {
        return false;
    }
    cachedResult = (_c = (_b = (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, '(prefers-reduced-motion: reduce)')) === null || _b === void 0 ? void 0 : _b.matches) !== null && _c !== void 0 ? _c : false;
    return cachedResult;
}
function useReducedMotion(forceReducedMotion) {
    var _a = React.useState(function () { return forceReducedMotion !== null && forceReducedMotion !== void 0 ? forceReducedMotion : getReducedMotion(); }), reducedMotion = _a[0], setReducedMotion = _a[1];
    React.useEffect(function () {
        var _a, _b;
        // if forced, use that value
        if (forceReducedMotion !== undefined) {
            setReducedMotion(forceReducedMotion);
            return;
        }
        // listen for changes to system preference
        if (!constants_1.isWeb || typeof window === 'undefined')
            return;
        var mediaQuery = (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, '(prefers-reduced-motion: reduce)');
        if (!mediaQuery)
            return;
        var handleChange = function (e) {
            cachedResult = e.matches;
            setReducedMotion(e.matches);
        };
        (_b = mediaQuery.addEventListener) === null || _b === void 0 ? void 0 : _b.call(mediaQuery, 'change', handleChange);
        return function () {
            var _a;
            (_a = mediaQuery.removeEventListener) === null || _a === void 0 ? void 0 : _a.call(mediaQuery, 'change', handleChange);
        };
    }, [forceReducedMotion]);
    return reducedMotion;
}
