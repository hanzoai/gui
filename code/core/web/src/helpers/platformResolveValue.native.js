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
exports.platformResolveValue = platformResolveValue;
var getTokenForKey_1 = require("./getTokenForKey");
var parseNativeStyle_1 = require("./parseNativeStyle");
var tokenPattern = /(\$[\w.-]+)/g;
// keys that need native object parsing (DynamicColorIOS support)
var nativeParseKeys = {
    backgroundImage: true,
    boxShadow: true,
    textShadow: true,
};
function replaceTokens(value, styleProps, styleState) {
    return value.replace(tokenPattern, function (t) {
        var r = (0, getTokenForKey_1.getTokenForKey)('size', t, styleProps, styleState);
        if (r == null) {
            r = (0, getTokenForKey_1.getTokenForKey)('color', t, styleProps, styleState);
        }
        return r != null ? String(r) : t;
    });
}
/**
 * native: resolves embedded $tokens, with DynamicColorIOS placeholder
 * support for boxShadow/textShadow/backgroundImage.
 */
function platformResolveValue(key, value, styleProps, styleState) {
    if (!nativeParseKeys[key]) {
        return replaceTokens(value, styleProps, styleState);
    }
    // for backgroundImage (gradients), force 'web' resolution to avoid DynamicColorIOS
    // gradients don't support dynamic color updates - RN resolves colors once at render time
    // so we need plain values and must let the component re-render on scheme changes
    var effectiveStyleProps = key === 'backgroundImage'
        ? __assign(__assign({}, styleProps), { resolveValues: 'web' }) : styleProps;
    // preserve DynamicColorIOS objects through parsing (for boxShadow/textShadow)
    var tokenMap = new Map();
    var placeholderIdx = 0;
    var withPlaceholders = value.replace(tokenPattern, function (t) {
        var r = (0, getTokenForKey_1.getTokenForKey)('size', t, effectiveStyleProps, styleState);
        if (r == null) {
            r = (0, getTokenForKey_1.getTokenForKey)('color', t, effectiveStyleProps, styleState);
        }
        if (r == null)
            return t;
        if (typeof r !== 'string' && typeof r !== 'number') {
            var placeholder = "__tk".concat(placeholderIdx++, "__");
            tokenMap.set(placeholder, r);
            return placeholder;
        }
        return String(r);
    });
    var parsed = (0, parseNativeStyle_1.parseNativeStyle)(key, withPlaceholders, tokenMap);
    if (parsed)
        return parsed;
    // fallback to plain string resolution
    return replaceTokens(value, styleProps, styleState);
}
