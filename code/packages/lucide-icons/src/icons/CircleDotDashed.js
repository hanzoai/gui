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
exports.CircleDotDashed = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.CircleDotDashed = (0, helpers_icon_1.themed)((0, react_1.memo)(function CircleDotDashed(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M10.1 2.18a9.93 9.93 0 0 1 3.8 0", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M21.82 10.1a9.93 9.93 0 0 1 0 3.8", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M13.9 21.82a9.94 9.94 0 0 1-3.8 0", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M2.18 13.9a9.93 9.93 0 0 1 0-3.8", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: "12", cy: "12", r: "1", stroke: color })] })));
}));
