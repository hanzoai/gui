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
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapChildrenInText = wrapChildrenInText;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
function wrapChildrenInText(TextComponent, propsIn, extraProps) {
    var children = propsIn.children, textProps = propsIn.textProps, size = propsIn.size, noTextWrap = propsIn.noTextWrap, color = propsIn.color, fontFamily = propsIn.fontFamily, fontSize = propsIn.fontSize, fontWeight = propsIn.fontWeight, letterSpacing = propsIn.letterSpacing, textAlign = propsIn.textAlign, fontStyle = propsIn.fontStyle, maxFontSizeMultiplier = propsIn.maxFontSizeMultiplier;
    if (noTextWrap || !children) {
        return [children];
    }
    var props = __assign({}, extraProps);
    // to avoid setting undefined
    if (color)
        props.color = color;
    if (fontFamily)
        props.fontFamily = fontFamily;
    if (fontSize)
        props.fontSize = fontSize;
    if (fontWeight)
        props.fontWeight = fontWeight;
    if (letterSpacing)
        props.letterSpacing = letterSpacing;
    if (textAlign)
        props.textAlign = textAlign;
    if (size)
        props.size = size;
    if (fontStyle)
        props.fontStyle = fontStyle;
    if (maxFontSizeMultiplier)
        props.maxFontSizeMultiplier = maxFontSizeMultiplier;
    return react_1.default.Children.toArray(children).map(function (child, index) {
        return typeof child === 'string' ? (
        // so "data-disable-theme" is a hack to fix themeInverse, don't ask me why
        (0, jsx_runtime_1.jsx)(TextComponent, __assign({}, props, textProps, { children: child }), index)) : (child);
    });
}
