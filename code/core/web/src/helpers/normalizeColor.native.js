"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRgba = exports.normalizeColor = exports.rgba = void 0;
var normalize_css_color_1 = require("@hanzogui/normalize-css-color");
var normalize_css_color_2 = require("@hanzogui/normalize-css-color");
Object.defineProperty(exports, "rgba", { enumerable: true, get: function () { return normalize_css_color_2.rgba; } });
var normalizeColor = function (color, opacity) {
    var _a;
    if (!color)
        return;
    // handle dynamic color objects (from $theme-dark/$theme-light)
    if (typeof color !== 'string')
        return color;
    if (color[0] === '$')
        return color;
    var rgbaVal = (0, exports.getRgba)(color);
    if (rgbaVal) {
        var colors = "".concat(rgbaVal.r, ",").concat(rgbaVal.g, ",").concat(rgbaVal.b);
        return opacity === 1
            ? "rgb(".concat(colors, ")")
            : "rgba(".concat(colors, ",").concat((_a = opacity !== null && opacity !== void 0 ? opacity : rgbaVal.a) !== null && _a !== void 0 ? _a : 1, ")");
    }
    return color;
};
exports.normalizeColor = normalizeColor;
var getRgba = function (color) {
    // handle dynamic color objects (from $theme-dark/$theme-light)
    if (typeof color !== 'string')
        return;
    var colorNum = (0, normalize_css_color_1.normalizeCSSColor)(color);
    if (colorNum != null) {
        return (0, normalize_css_color_1.rgba)(colorNum);
    }
};
exports.getRgba = getRgba;
