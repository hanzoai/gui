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
exports.subtleChildrenThemes = exports.v5SubtlePaletteAdjustments = void 0;
var v5_themes_1 = require("./v5-themes");
exports.v5SubtlePaletteAdjustments = {
    default: {
        light: function (hsl) { return (__assign(__assign({}, hsl), { s: hsl.s * 0.9 })); },
        dark: function (hsl, i) { return (__assign(__assign({}, hsl), { s: hsl.s * (i <= 4 ? 0.7 : 0.9) })); },
    },
    // yellow palette in radix is especially off from the rest
    yellow: {
        light: function (hsl, i) {
            // progressively darken and desaturate toward text colors for better contrast
            // i=1 is lightest bg, i=12 is darkest text
            var t = (i - 1) / 11; // 0 to 1
            // saturation: starts at sStart, ends at sEnd
            var sStart = 0.65;
            var sEnd = 0.4;
            // lightness: starts at lStart, ends at lEnd
            var lStart = 1.08;
            var lEnd = 0.8;
            return __assign(__assign({}, hsl), { s: hsl.s * (sStart + t * (sEnd - sStart)), l: hsl.l * (lStart + t * (lEnd - lStart)) });
        },
        dark: function (hsl, i) { return (__assign(__assign({}, hsl), { s: hsl.s * (i <= 7 ? 0.45 : 0.55), l: hsl.l * (i <= 4 ? 0.8 : 1) })); },
    },
};
exports.subtleChildrenThemes = (0, v5_themes_1.adjustPalettes)(v5_themes_1.defaultChildrenThemes, __assign(__assign({}, exports.v5SubtlePaletteAdjustments), { gray: undefined, neutral: undefined }));
