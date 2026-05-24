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
exports.Sandwich = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.Sandwich = (0, helpers_icon_1.themed)((0, react_1.memo)(function Sandwich(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Rect, { width: "20", height: "4", x: "2", y: "11", rx: "1", stroke: color })] })));
}));
