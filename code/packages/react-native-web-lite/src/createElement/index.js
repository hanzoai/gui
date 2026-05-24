"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElement = exports.useCreateElement = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var web_1 = require("@hanzogui/web");
var react_1 = require("react");
// SSR safe create element
var useCreateElement = function (component, props, options) {
    var _a = createElementAndStyles(component, props, options), element = _a.element, styles = _a.styles;
    var isHydrated = (0, web_1.useDidFinishSSR)();
    // only for ssr
    var styleTags = (0, react_1.useMemo)(function () {
        return isHydrated || !styles ? null : (0, web_1.getStyleTags)(styles);
    }, [
    // never changes
    ]);
    // after that we insert
    (0, react_1.useInsertionEffect)(function () {
        if (!styles)
            return;
        var styleObj = {};
        for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
            var style = styles_1[_i];
            styleObj[style[0]] = style;
        }
        (0, web_1.insertStyleRules)(styleObj);
    }, [styles]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [element, styleTags] }));
};
exports.useCreateElement = useCreateElement;
var createElement = function (component, props, options) {
    var _a = createElementAndStyles(component, props, options), element = _a.element, styles = _a.styles;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [element, styles ? (0, web_1.getStyleTags)(styles) : null] }));
};
exports.createElement = createElement;
var createElementAndStyles = function (component, props, options) {
    // Use equivalent platform elements where possible.
    var accessibilityComponent;
    if (component && component.constructor === String) {
        accessibilityComponent = react_native_web_internals_1.AccessibilityUtil.propsToAccessibilityComponent(props);
    }
    var Component = accessibilityComponent || component;
    var domProps = (0, react_native_web_internals_1.createDOMProps)(Component, props, options);
    var styles = react_native_web_internals_1.stylesFromProps.get(domProps);
    var element = react_1.default.createElement(Component, domProps);
    // Update locale context if element's writing direction prop changes
    var elementWithLocaleProvider = domProps.dir ? ((0, jsx_runtime_1.jsx)(react_native_web_internals_1.LocaleProvider, { direction: domProps.dir, locale: domProps.lang, children: element })) : (element);
    return {
        element: elementWithLocaleProvider,
        styles: styles,
    };
};
