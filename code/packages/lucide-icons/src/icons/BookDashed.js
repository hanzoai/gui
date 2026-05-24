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
exports.BookDashed = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.BookDashed = (0, helpers_icon_1.themed)((0, react_1.memo)(function BookDashed(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M12 17h1.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M12 22h1.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M12 2h1.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M17.5 22H19a1 1 0 0 0 1-1", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M17.5 2H19a1 1 0 0 1 1 1v1.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M20 14v3h-2.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M20 8.5V10", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M4 10V8.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M4 19.5V14", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M4 4.5A2.5 2.5 0 0 1 6.5 2H8", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M8 22H6.5a1 1 0 0 1 0-5H8", stroke: color })] })));
}));
