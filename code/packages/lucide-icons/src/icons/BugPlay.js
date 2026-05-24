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
exports.BugPlay = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.BugPlay = (0, helpers_icon_1.themed)((0, react_1.memo)(function BugPlay(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M12.765 21.522a.5.5 0 0 1-.765-.424v-8.196a.5.5 0 0 1 .765-.424l5.878 3.674a1 1 0 0 1 0 1.696z", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M14.12 3.88 16 2", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M18 11a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v3a6.1 6.1 0 0 0 2 4.5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M3 21c0-2.1 1.7-3.9 3.8-4", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M6 13H2", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M6.53 9C4.6 8.8 3 7.1 3 5", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m8 2 1.88 1.88", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1", stroke: color })] })));
}));
