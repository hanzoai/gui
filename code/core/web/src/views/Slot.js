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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slottable = exports.Slot = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// via radix
var compose_refs_1 = require("@hanzogui/compose-refs");
var constants_1 = require("@hanzogui/constants");
var react_1 = require("react");
var mergeSlotStyleProps_1 = require("../helpers/mergeSlotStyleProps");
exports.Slot = (0, react_1.memo)((0, react_1.forwardRef)(function Slot(props, forwardedRef) {
    var children = props.children, slotProps = __rest(props, ["children"]);
    if ((0, react_1.isValidElement)(children)) {
        var mergedProps = mergeSlotProps(children, slotProps);
        return (0, react_1.cloneElement)(children, children.type['avoidForwardRef']
            ? mergedProps
            : __assign(__assign({}, mergedProps), { ref: (0, compose_refs_1.composeRefs)(forwardedRef, children.props.ref) }));
    }
    return react_1.Children.count(children) > 1 ? react_1.Children.only(null) : null;
}));
/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/
var Slottable = function (_a) {
    var children = _a.children;
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
};
exports.Slottable = Slottable;
exports.Slottable['displayName'] = 'Slottable';
/* ---------------------------------------------------------------------------------------------- */
var pressMap = constants_1.isWeb
    ? {
        onPress: 'onClick',
        onPressOut: 'onMouseUp',
        onPressIn: 'onMouseDown',
    }
    : {};
function mergeSlotProps(child, slotProps) {
    var childProps = child.props;
    var isHTMLChild = typeof child.type === 'string';
    // convert RN press events to web events for HTML children
    if (isHTMLChild) {
        for (var key in pressMap) {
            if (key in slotProps) {
                slotProps[pressMap[key]] = slotProps[key];
                delete slotProps[key];
            }
        }
    }
    // merge slot props with child props (child wins via overlay)
    var merged = (0, mergeSlotStyleProps_1.mergeSlotStyleProps)(slotProps, childProps);
    // convert child's RN press events to web events after merge
    if (isHTMLChild) {
        for (var key in pressMap) {
            if (key in merged) {
                merged[pressMap[key]] = merged[key];
                delete merged[key];
            }
        }
    }
    return merged;
}
