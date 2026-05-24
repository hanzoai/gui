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
exports.Biohazard = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.Biohazard = (0, helpers_icon_1.themed)((0, react_1.memo)(function Biohazard(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: "12", cy: "11.9", r: "2", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M6.7 3.4c-.9 2.5 0 5.2 2.2 6.7C6.5 9 3.7 9.6 2 11.6", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m8.9 10.1 1.4.8", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M17.3 3.4c.9 2.5 0 5.2-2.2 6.7 2.4-1.2 5.2-.6 6.9 1.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m15.1 10.1-1.4.8", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M16.7 20.8c-2.6-.4-4.6-2.6-4.7-5.3-.2 2.6-2.1 4.8-4.7 5.2", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M12 13.9v1.6", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M13.5 5.4c-1-.2-2-.2-3 0", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M17 16.4c.7-.7 1.2-1.6 1.5-2.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M5.5 13.9c.3.9.8 1.8 1.5 2.5", stroke: color })] })));
}));
