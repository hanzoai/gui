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
exports.Cog = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.Cog = (0, helpers_icon_1.themed)((0, react_1.memo)(function Cog(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M12 2v2", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M12 22v-2", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m17 20.66-1-1.73", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M11 10.27 7 3.34", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m20.66 17-1.73-1", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m3.34 7 1.73 1", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M14 12h8", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M2 12h2", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m20.66 7-1.73 1", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m3.34 17 1.73-1", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m17 3.34-1 1.73", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m11 13.73-4 6.93", stroke: color })] })));
}));
