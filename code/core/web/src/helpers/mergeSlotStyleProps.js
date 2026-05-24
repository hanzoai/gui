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
exports.mergeSlotStyleProps = mergeSlotStyleProps;
var compose_refs_1 = require("@hanzogui/compose-refs");
var helpers_1 = require("@hanzogui/helpers");
var isEventHandler = /^on[A-Z]/;
/**
 * Merges props with special handling for style, className, ref, and event handlers.
 * Used by Slot and render prop implementations.
 *
 * @param base - Base props (typically from parent/slot)
 * @param overlay - Props to merge on top (typically from child/element)
 * @returns Merged props object (mutates and returns base for perf)
 */
function mergeSlotStyleProps(base, overlay) {
    for (var key in overlay) {
        var baseVal = base[key];
        var overlayVal = overlay[key];
        if (overlayVal === undefined)
            continue;
        if (key === 'style') {
            base.style =
                baseVal && overlayVal ? __assign(__assign({}, baseVal), overlayVal) : overlayVal || baseVal;
        }
        else if (key === 'className') {
            base.className =
                baseVal && overlayVal ? "".concat(baseVal, " ").concat(overlayVal) : overlayVal || baseVal;
        }
        else if (key === 'ref') {
            base.ref =
                baseVal && overlayVal ? (0, compose_refs_1.composeRefs)(baseVal, overlayVal) : overlayVal || baseVal;
        }
        else if (isEventHandler.test(key) &&
            typeof baseVal === 'function' &&
            typeof overlayVal === 'function') {
            base[key] = (0, helpers_1.composeEventHandlers)(baseVal, overlayVal);
        }
        else {
            // overlay wins for regular props
            base[key] = overlayVal;
        }
    }
    return base;
}
