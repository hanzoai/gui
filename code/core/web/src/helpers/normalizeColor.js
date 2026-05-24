"use strict";
// web: use color-mix for opacity (CSS-native, works with variables and named colors)
// animation drivers that need rgba handle their own conversion
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRgba = exports.normalizeColor = void 0;
var normalize_css_color_1 = require("@hanzogui/normalize-css-color");
var normalizeColor = function (color, opacity) {
    if (!color)
        return;
    if (typeof color !== 'string')
        return color;
    if (color === 'transparent') {
        return 'rgba(0, 0, 0, 0)';
    }
    if (typeof opacity === 'number' && opacity < 1) {
        return "color-mix(in srgb, ".concat(color, " ").concat(Math.round(opacity * 100), "%, transparent)");
    }
    return color;
};
exports.normalizeColor = normalizeColor;
var getRgba = function (color) {
    if (typeof color !== 'string')
        return;
    var colorNum = (0, normalize_css_color_1.normalizeCSSColor)(color);
    if (colorNum != null) {
        return (0, normalize_css_color_1.rgba)(colorNum);
    }
};
exports.getRgba = getRgba;
