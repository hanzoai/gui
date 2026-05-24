"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizableText = exports.getFontSized = void 0;
var constants_1 = require("@hanzogui/constants");
var web_1 = require("@hanzogui/web");
var getFontSized = function (sizeTokenIn, _a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    if (sizeTokenIn === void 0) { sizeTokenIn = '$true'; }
    var font = _a.font, fontFamily = _a.fontFamily, props = _a.props;
    if (!font) {
        return {
            fontSize: sizeTokenIn,
        };
    }
    var sizeToken = sizeTokenIn === '$true' ? getDefaultSizeToken(font) : sizeTokenIn;
    var style = {};
    // size related, treat them as overrides
    var fontSize = font.size[sizeToken];
    var lineHeight = (_b = font.lineHeight) === null || _b === void 0 ? void 0 : _b[sizeToken];
    var fontWeight = (_c = font.weight) === null || _c === void 0 ? void 0 : _c[sizeToken];
    var letterSpacing = (_d = font.letterSpacing) === null || _d === void 0 ? void 0 : _d[sizeToken];
    var textTransform = (_e = font.transform) === null || _e === void 0 ? void 0 : _e[sizeToken];
    var fontStyle = (_f = props.fontStyle) !== null && _f !== void 0 ? _f : (_g = font.style) === null || _g === void 0 ? void 0 : _g[sizeToken];
    var color = (_h = props.color) !== null && _h !== void 0 ? _h : (_j = font.color) === null || _j === void 0 ? void 0 : _j[sizeToken];
    if (fontStyle)
        style.fontStyle = fontStyle;
    if (textTransform)
        style.textTransform = textTransform;
    if (fontFamily)
        style.fontFamily = fontFamily;
    if (fontWeight)
        style.fontWeight = fontWeight;
    if (letterSpacing)
        style.letterSpacing = letterSpacing;
    if (fontSize)
        style.fontSize = fontSize;
    if (lineHeight)
        style.lineHeight = lineHeight;
    if (color)
        style.color = color;
    if (process.env.NODE_ENV === 'development') {
        if (props['debug'] && props['debug'] === 'verbose') {
            console.groupCollapsed('  🔹 getFontSized', sizeTokenIn, sizeToken);
            if (constants_1.isClient) {
                console.info({ style: style, props: props, font: font });
            }
            console.groupEnd();
        }
    }
    return style;
};
exports.getFontSized = getFontSized;
exports.SizableText = (0, web_1.styled)(web_1.Text, {
    name: 'SizableText',
    fontFamily: '$body',
    variants: {
        size: {
            '...fontSize': exports.getFontSized,
        },
    },
    defaultVariants: {
        size: '$true',
    },
});
var cache = new WeakMap();
function getDefaultSizeToken(font) {
    if (typeof font === 'object' && cache.has(font)) {
        return cache.get(font);
    }
    // use either font.size if it has true set, or fallback to tokens.size mapping to the same
    var tokens = (0, web_1.getTokens)();
    var sizeTokens = '$true' in font.size ? font.size : tokens === null || tokens === void 0 ? void 0 : tokens.size;
    if (!sizeTokens) {
        return Object.keys(font.size)[3];
    }
    var sizeDefault = sizeTokens['$true'];
    var sizeDefaultSpecific = sizeDefault
        ? Object.keys(sizeTokens).find(function (x) { return x !== '$true' && sizeTokens[x]['val'] === sizeDefault['val']; })
        : null;
    if (!sizeDefault || !sizeDefaultSpecific) {
        if (process.env.NODE_ENV === 'development') {
            console.warn("No default size is set in your tokens for the \"true\" key, fonts will be inconsistent.\n\n      Fix this by having consistent tokens across fonts and sizes and setting a true key for your size tokens, or\n      set true keys for all your font tokens: \"size\", \"lineHeight\", \"fontStyle\", etc.");
        }
        return Object.keys(font.size)[3];
    }
    cache.set(font, sizeDefaultSpecific);
    return sizeDefaultSpecific;
}
