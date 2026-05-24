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
exports.Portal = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
require("@hanzogui/polyfill-dev");
var web_1 = require("@hanzogui/web");
var z_index_stack_1 = require("@hanzogui/z-index-stack");
var React = require("react");
var react_dom_1 = require("react-dom");
var helpers_1 = require("./helpers");
exports.Portal = React.memo(function (propsIn) {
    var _a;
    var children = propsIn.children, passThrough = propsIn.passThrough, style = propsIn.style, open = propsIn.open;
    var themeName = (0, web_1.useThemeName)();
    var didHydrate = (0, web_1.useDidFinishSSR)();
    var zIndex = (0, z_index_stack_1.useStackedZIndex)((0, helpers_1.getStackedZIndexProps)(propsIn));
    if (passThrough) {
        return children;
    }
    if (!didHydrate) {
        return null;
    }
    return (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)(web_1.HanzoguiRoot, { theme: themeName, style: __assign({ zIndex: zIndex, position: 'fixed', inset: 0, contain: 'strict', pointerEvents: open ? 'auto' : 'none', 
            // prevent mobile browser from scrolling/moving this fixed element
            touchAction: 'none', display: 'flex' }, style), children: (0, jsx_runtime_1.jsx)(z_index_stack_1.ZIndexHardcodedContext.Provider, { value: zIndex, children: children }) }), (_a = globalThis.document) === null || _a === void 0 ? void 0 : _a.body);
});
