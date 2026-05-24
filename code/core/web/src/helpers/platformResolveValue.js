"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformResolveValue = platformResolveValue;
var getTokenForKey_1 = require("./getTokenForKey");
var tokenPattern = /(\$[\w.-]+)/g;
/**
 * web: resolves embedded $tokens in compound CSS strings via simple regex replacement.
 */
function platformResolveValue(_key, value, styleProps, styleState) {
    return value.replace(tokenPattern, function (t) {
        var r = (0, getTokenForKey_1.getTokenForKey)('size', t, styleProps, styleState);
        if (r == null) {
            r = (0, getTokenForKey_1.getTokenForKey)('color', t, styleProps, styleState);
        }
        return r != null ? String(r) : t;
    });
}
