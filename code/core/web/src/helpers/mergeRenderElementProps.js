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
exports.mergeRenderElementProps = mergeRenderElementProps;
var mergeSlotStyleProps_1 = require("./mergeSlotStyleProps");
/**
 * Merges props from a render element with viewProps from Hanzogui.
 * viewProps takes precedence, elementProps provides fallbacks.
 * Style/className are merged, refs and event handlers are composed.
 */
function mergeRenderElementProps(elementProps, viewProps, children) {
    // elementProps as base, viewProps as overlay (viewProps wins)
    var merged = (0, mergeSlotStyleProps_1.mergeSlotStyleProps)(__assign({}, elementProps), viewProps);
    merged.children = children;
    return merged;
}
