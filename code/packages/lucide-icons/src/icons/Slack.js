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
exports.Slack = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.Slack = (0, helpers_icon_1.themed)((0, react_1.memo)(function Slack(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Rect, { width: "3", height: "8", x: "13", y: "2", rx: "1.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Rect, { width: "3", height: "8", x: "8", y: "14", rx: "1.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Rect, { width: "8", height: "3", x: "14", y: "13", rx: "1.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Rect, { width: "8", height: "3", x: "2", y: "8", rx: "1.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5", stroke: color })] })));
}));
