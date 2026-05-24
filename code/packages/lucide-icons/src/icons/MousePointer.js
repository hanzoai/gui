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
exports.MousePointer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var helpers_icon_1 = require("@hanzogui/helpers-icon");
exports.MousePointer = (0, helpers_icon_1.themed)((0, react_1.memo)(function MousePointer(props) {
    var _a = props.color, color = _a === void 0 ? 'black' : _a, _b = props.size, size = _b === void 0 ? 24 : _b, otherProps = __rest(props, ["color", "size"]);
    return ((0, jsx_runtime_1.jsxs)(react_native_svg_1.Svg, __assign({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, otherProps, { children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M12.586 12.586 19 19", stroke: color }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z", stroke: color })] })));
}));
