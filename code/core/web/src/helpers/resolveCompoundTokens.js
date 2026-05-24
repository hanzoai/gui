"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCompoundTokens = resolveCompoundTokens;
var platformResolveValue_1 = require("./platformResolveValue");
var compoundKeys = {
    boxShadow: true,
    textShadow: true,
    filter: true,
    backgroundImage: true,
    border: true,
    outline: true,
};
/**
 * resolves embedded $tokens in compound CSS string values like
 * boxShadow, textShadow, filter, backgroundImage, border, outline.
 *
 * returns the original value unchanged if no resolution is needed.
 */
function resolveCompoundTokens(key, value, styleProps, styleState) {
    if (!value.includes('$'))
        return value;
    if (!compoundKeys[key])
        return value;
    return (0, platformResolveValue_1.platformResolveValue)(key, value, styleProps, styleState);
}
