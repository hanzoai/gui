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
exports.DnaOff = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.DnaOff = (0, helpers_icon_1.themed)((0, react_1.memo)(function DnaOff(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M15 2c-1.35 1.5-2.092 3-2.5 4.5L14 8", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m17 6-2.891-2.891", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M2 15c3.333-3 6.667-3 10-3", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m2 2 20 20", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m20 9 .891.891", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M22 9c-1.5 1.35-3 2.092-4.5 2.5l-1-1", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M3.109 14.109 4 15", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m6.5 12.5 1 1", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m7 18 2.891 2.891", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M9 22c1.35-1.5 2.092-3 2.5-4.5L10 16", stroke: color })] })));
}));
