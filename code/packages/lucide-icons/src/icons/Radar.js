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
exports.Radar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.Radar = (0, helpers_icon_1.themed)((0, react_1.memo)(function Radar(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M19.07 4.93A10 10 0 0 0 6.99 3.34", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M4 6h.01", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M2.29 9.62A10 10 0 1 0 21.31 8.35", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M16.24 7.76A6 6 0 1 0 8.23 16.67", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M12 18h.01", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M17.99 11.66A6 6 0 0 1 15.77 16.67", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: "12", cy: "12", r: "2", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m13.41 10.59 5.66-5.66", stroke: color })] })));
}));
