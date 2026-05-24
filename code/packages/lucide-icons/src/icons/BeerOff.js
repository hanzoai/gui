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
exports.BeerOff = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.BeerOff = (0, helpers_icon_1.themed)((0, react_1.memo)(function BeerOff(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M13 13v5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M17 11.47V8", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M17 11h1a3 3 0 0 1 2.745 4.211", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m2 2 20 20", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M7.536 7.535C6.766 7.649 6.154 8 5.5 8a2.5 2.5 0 0 1-1.768-4.268", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M8.727 3.204C9.306 2.767 9.885 2 11 2c1.56 0 2 1.5 3 1.5s1.72-.5 2.5-.5a1 1 0 1 1 0 5c-.78 0-1.5-.5-2.5-.5a3.149 3.149 0 0 0-.842.12", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M9 14.6V18", stroke: color })] })));
}));
