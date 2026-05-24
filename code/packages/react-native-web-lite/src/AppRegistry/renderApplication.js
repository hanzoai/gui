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
exports.renderApplication = renderApplication;
exports.getApplication = getApplication;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var react_native_web_internals_2 = require("@hanzogui/react-native-web-internals");
var index_1 = require("../render/index");
var AppContainer_1 = require("./AppContainer");
function renderApplication(RootComponent, WrapperComponent, callback, options) {
    if (WrapperComponent === void 0) { WrapperComponent = null; }
    if (callback === void 0) { callback = function () { }; }
    var shouldHydrate = options.hydrate, initialProps = options.initialProps, mode = options.mode, rootTag = options.rootTag;
    var renderFn = shouldHydrate
        ? mode === 'concurrent'
            ? index_1.hydrate
            : index_1.hydrateLegacy
        : mode === 'concurrent'
            ? index_1.render
            : index_1.renderLegacy;
    (0, react_native_web_internals_2.invariant)(rootTag, 'Expect to have a valid rootTag, instead got ', rootTag);
    // @ts-ignore
    return renderFn((0, jsx_runtime_1.jsx)(AppContainer_1.AppContainer, { WrapperComponent: WrapperComponent, ref: callback, rootTag: rootTag, children: (0, jsx_runtime_1.jsx)(RootComponent, __assign({}, initialProps)) }), rootTag);
}
function getApplication(RootComponent, initialProps, WrapperComponent) {
    var element = ((0, jsx_runtime_1.jsx)(AppContainer_1.AppContainer, { WrapperComponent: WrapperComponent, rootTag: {}, children: (0, jsx_runtime_1.jsx)(RootComponent, __assign({}, initialProps)) }));
    // Don't escape CSS text
    var getStyleElement = function (props) {
        var sheet = react_native_web_internals_1.StyleSheet.getSheet();
        return ((0, jsx_runtime_1.jsx)("style", __assign({}, props, { dangerouslySetInnerHTML: { __html: sheet.textContent }, id: sheet.id })));
    };
    return { element: element, getStyleElement: getStyleElement };
}
