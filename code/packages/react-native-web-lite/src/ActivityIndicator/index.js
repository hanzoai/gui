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
exports.ActivityIndicator = void 0;
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
var createSvgCircle = function (style) { return ((0, jsx_runtime_1.jsx)("circle", { cx: "16", cy: "16", fill: "none", r: "14", strokeWidth: "4", style: style })); };
var ActivityIndicator = React.forwardRef(function (props, forwardedRef) {
    var _a = props.animating, animating = _a === void 0 ? true : _a, _b = props.color, color = _b === void 0 ? '#1976D2' : _b, _c = props.hidesWhenStopped, hidesWhenStopped = _c === void 0 ? true : _c, _d = props.size, size = _d === void 0 ? 'small' : _d, style = props.style, other = __rest(props, ["animating", "color", "hidesWhenStopped", "size", "style"]);
    var svg = ((0, jsx_runtime_1.jsxs)("svg", { height: "100%", viewBox: "0 0 32 32", width: "100%", children: [createSvgCircle({
                stroke: color,
                opacity: 0.2,
            }), createSvgCircle({
                stroke: color,
                strokeDasharray: 80,
                strokeDashoffset: 60,
            })] }));
    return ((0, jsx_runtime_1.jsx)(index_1.View, __assign({}, other, { accessibilityRole: "progressbar", accessibilityValueMax: 1, accessibilityValueMin: 0, ref: forwardedRef, style: [styles.container, style], children: (0, jsx_runtime_1.jsx)(index_1.View, { children: svg, style: [
                typeof size === 'number'
                    ? { height: size, width: size }
                    : indicatorSizes[size],
                styles.animation,
                !animating && styles.animationPause,
                !animating && hidesWhenStopped && styles.hidesWhenStopped,
            ] }) })));
});
exports.ActivityIndicator = ActivityIndicator;
ActivityIndicator.displayName = 'ActivityIndicator';
var styles = react_native_web_internals_1.StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    hidesWhenStopped: {
        visibility: 'hidden',
    },
    animation: {
        animationDuration: '0.75s',
        animationKeyframes: [
            {
                '0%': { transform: [{ rotate: '0deg' }] },
                '100%': { transform: [{ rotate: '360deg' }] },
            },
        ],
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
    },
    animationPause: {
        animationPlayState: 'paused',
    },
});
var indicatorSizes = react_native_web_internals_1.StyleSheet.create({
    small: {
        width: 20,
        height: 20,
    },
    large: {
        width: 36,
        height: 36,
    },
});
exports.default = ActivityIndicator;
