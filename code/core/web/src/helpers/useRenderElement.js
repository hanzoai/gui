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
exports.evaluateRenderProp = evaluateRenderProp;
var react_1 = require("react");
var compose_refs_1 = require("@hanzogui/compose-refs");
var mergeSlotStyleProps_1 = require("./mergeSlotStyleProps");
/**
 * Evaluates a render prop and returns the element to render.
 *
 * @param render - The render prop (tag string, JSX element, or function)
 * @param props - Props to pass to the rendered element (including ref)
 * @param state - Component state for render functions
 * @param defaultElement - Fallback element if render prop is not provided
 */
function evaluateRenderProp(render, props, state, defaultElement) {
    var _a;
    if (!render) {
        return defaultElement;
    }
    var defaultChildren = defaultElement.props.children;
    // String tag - swap element type, reuse props from defaultElement
    if (typeof render === 'string') {
        // on native, ignore lowercase tags (html/jsx elements like "div", "span")
        if (process.env.TAMAGUI_TARGET === 'native' &&
            render[0] === render[0].toLowerCase()) {
            return defaultElement;
        }
        return (0, react_1.createElement)(render, props, defaultChildren);
    }
    // Render function - call with props and state
    if (typeof render === 'function') {
        return render(props, state);
    }
    // JSX element - clone with merged props
    if ((0, react_1.isValidElement)(render)) {
        var renderProps = render.props;
        var renderRef = renderProps === null || renderProps === void 0 ? void 0 : renderProps.ref;
        // Fast path: no props to merge
        if (!renderProps || Object.keys(renderProps).length === 0) {
            if (renderRef) {
                return (0, react_1.cloneElement)(render, __assign(__assign({}, props), { ref: (0, compose_refs_1.composeRefs)(props.ref, renderRef) }), defaultChildren);
            }
            return (0, react_1.cloneElement)(render, props, defaultChildren);
        }
        // Merge props (component props as base, render props as overlay)
        var merged = (0, mergeSlotStyleProps_1.mergeSlotStyleProps)(__assign({}, props), renderProps);
        var children = (_a = renderProps.children) !== null && _a !== void 0 ? _a : defaultChildren;
        return (0, react_1.cloneElement)(render, merged, children);
    }
    return defaultElement;
}
