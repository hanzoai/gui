"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupPropParts = getGroupPropParts;
var mediaState_1 = require("./mediaState");
var pseudoDescriptors_1 = require("./pseudoDescriptors");
// convert kebab-case to camelCase (e.g. "focus-visible" -> "focusVisible")
function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
}
// validate that a string is a known pseudo selector
function isValidPseudo(str) {
    if (!str)
        return false;
    // pseudoPriorities uses camelCase keys, but parsed candidates may be kebab-case
    return kebabToCamel(str) in pseudoDescriptors_1.pseudoPriorities;
}
function getGroupPropParts(groupProp) {
    var m = (0, mediaState_1.getMedia)();
    var _a = groupProp.split('-'), _ = _a[0], name = _a[1], a = _a[2], b = _a[3], c = _a[4];
    // check 2-part media key first (e.g. "max-md"), then 1-part
    var m2 = a && b ? "".concat(a, "-").concat(b) : '';
    var media = (m2 && m2 in m && m2) || (a && a in m && a) || undefined;
    var pseudoCandidate = media
        ? media === m2
            ? c
            : b
                ? "".concat(b).concat(c ? "-".concat(c) : '')
                : undefined
        : a
            ? "".concat(a).concat(b ? "-".concat(b) : '').concat(c ? "-".concat(c) : '')
            : undefined;
    // only treat as pseudo if it's a known pseudo selector
    // otherwise it might be an unrecognized media query
    if (pseudoCandidate && !isValidPseudo(pseudoCandidate)) {
        if (process.env.NODE_ENV === 'development') {
            console.warn("Unknown group prop part \"".concat(pseudoCandidate, "\" in \"").concat(groupProp, "\". If this is a media query, ensure it's defined in your hanzogui config."));
        }
        pseudoCandidate = undefined;
    }
    return { name: name, pseudo: pseudoCandidate, media: media };
}
