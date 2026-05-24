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
exports.FolderCog = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.FolderCog = (0, helpers_icon_1.themed)((0, react_1.memo)(function FolderCog(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m14.305 19.53.923-.382", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m15.228 16.852-.923-.383", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m16.852 15.228-.383-.923", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m16.852 20.772-.383.924", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m19.148 15.228.383-.923", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m19.53 21.696-.382-.924", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m20.772 16.852.924-.383", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "m20.772 19.148.924.383", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: "18", cy: "18", r: "3", stroke: color })] })));
}));
