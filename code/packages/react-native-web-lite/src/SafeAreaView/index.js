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
exports.SafeAreaView = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
var React = require("react");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var index_1 = require("../View/index");
var cssFunction = (function () {
    if (react_native_web_internals_1.canUseDOM &&
        window.CSS &&
        window.CSS.supports &&
        window.CSS.supports('top: constant(safe-area-inset-top)')) {
        return 'constant';
    }
    return 'env';
})();
var SafeAreaView = React.forwardRef(function (props, ref) {
    var style = props.style, rest = __rest(props, ["style"]);
    return ((0, jsx_runtime_1.jsx)(index_1.View, __assign({}, rest, { ref: ref, style: react_native_web_internals_1.StyleSheet.compose(styles.root, style) })));
});
exports.SafeAreaView = SafeAreaView;
SafeAreaView.displayName = 'SafeAreaView';
var styles = react_native_web_internals_1.StyleSheet.create({
    root: {
        paddingTop: "".concat(cssFunction, "(safe-area-inset-top)"),
        paddingRight: "".concat(cssFunction, "(safe-area-inset-right)"),
        paddingBottom: "".concat(cssFunction, "(safe-area-inset-bottom)"),
        paddingLeft: "".concat(cssFunction, "(safe-area-inset-left)"),
    },
});
exports.default = SafeAreaView;
