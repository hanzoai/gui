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
exports.Drama = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.Drama = (0, helpers_icon_1.themed)((0, react_1.memo)(function Drama(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M10 11h.01", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M14 6h.01", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M18 6h.01", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M6.5 13.1h.01", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M17.4 9.9c-.8.8-2 .8-2.8 0", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4", stroke: color })] })));
}));
