"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeStyle = normalizeStyle;
var expandStyle_1 = require("./expandStyle");
var expandStyles_1 = require("./expandStyles");
var isObj_1 = require("./isObj");
var normalizeValueWithProperty_1 = require("./normalizeValueWithProperty");
var pseudoDescriptors_1 = require("./pseudoDescriptors");
/**
 * This is what you want to run before Object.assign() a style onto another.
 * It does the following:
 *   1. Shorthands into longhands, px = paddingHorizontal
 *   2. Expands flex, borderColor and other properties that can expand into sub-parts
 *   3. Normalizes all sub pseudo-media-etc styles
 */
function normalizeStyle(style, disableNormalize) {
    if (disableNormalize === void 0) { disableNormalize = false; }
    var res = {};
    for (var key in style) {
        var prop = style[key];
        if (prop == null)
            continue;
        if (key in pseudoDescriptors_1.pseudoDescriptors ||
            // this should capture all parent-based styles like media, group, etc
            (key[0] === '$' && (0, isObj_1.isObj)(prop))) {
            res[key] = normalizeStyle(prop, disableNormalize);
            continue;
        }
        var value = disableNormalize ? prop : (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(prop, key);
        // expand react-native shorthands
        var out = (0, expandStyle_1.expandStyle)(key, value);
        if (out) {
            Object.assign(res, Object.fromEntries(out));
        }
        else {
            res[key] = value;
        }
    }
    (0, expandStyles_1.fixStyles)(res);
    return res;
}
