"use strict";
// weird stuff
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPropsToFontFamily = setPropsToFontFamily;
exports.getFontFamilyNameFromProps = getFontFamilyNameFromProps;
exports.forwardFontFamilyName = forwardFontFamilyName;
var cache = new WeakMap();
function setPropsToFontFamily(props, ff) {
    cache.set(props, ff.replace('$', '').trim());
}
function getFontFamilyNameFromProps(props) {
    return cache.get(props);
}
function forwardFontFamilyName(prev, next, fallback) {
    var ff = getFontFamilyNameFromProps(prev) || fallback;
    if (ff) {
        setPropsToFontFamily(next, ff);
    }
}
