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
exports.ImageBackground = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var index_1 = require("../Image/index");
var index_2 = require("../View/index");
var emptyObject = {};
/**
 * Very simple drop-in replacement for <Image> which supports nesting views.
 */
var ImageBackground = (0, react_1.forwardRef)(function (props, forwardedRef) {
    var children = props.children, _a = props.style, style = _a === void 0 ? emptyObject : _a, imageStyle = props.imageStyle, imageRef = props.imageRef, rest = __rest(props, ["children", "style", "imageStyle", "imageRef"]);
    var _b = react_native_web_internals_1.StyleSheet.flatten(style), height = _b.height, width = _b.width;
    return ((0, jsx_runtime_1.jsxs)(index_2.View, { ref: forwardedRef, style: style, children: [(0, jsx_runtime_1.jsx)(index_1.Image, __assign({}, rest, { ref: imageRef, style: [
                    {
                        // Temporary Workaround:
                        // Current (imperfect yet) implementation of <Image> overwrites width and height styles
                        // (which is not quite correct), and these styles conflict with explicitly set styles
                        // of <ImageBackground> and with our internal layout model here.
                        // So, we have to proxy/reapply these styles explicitly for actual <Image> component.
                        // This workaround should be removed after implementing proper support of
                        // intrinsic content size of the <Image>.
                        width: width,
                        height: height,
                        zIndex: -1,
                    },
                    react_native_web_internals_1.StyleSheet.absoluteFill,
                    imageStyle,
                ] })), children] }));
});
exports.ImageBackground = ImageBackground;
ImageBackground.displayName = 'ImageBackground';
exports.default = ImageBackground;
