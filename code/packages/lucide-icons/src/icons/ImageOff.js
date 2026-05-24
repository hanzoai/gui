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
exports.ImageOff = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.ImageOff = (0, helpers_icon_1.themed)((0, react_1.memo)(function ImageOff(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Line, { x1: "2", x2: "22", y1: "2", y2: "22", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M10.41 10.41a2 2 0 1 1-2.83-2.83", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Line, { x1: "13.5", x2: "6", y1: "13.5", y2: "21", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Line, { x1: "18", x2: "21", y1: "12", y2: "15", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M21 15V5a2 2 0 0 0-2-2H9", stroke: color })] })));
}));
