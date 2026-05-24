"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCSSColor = void 0;
exports.rgba = rgba;
var normalizeColor = require("@react-native/normalize-color");
// vite/webpack compat
var norm = normalizeColor.default || normalizeColor;
exports.normalizeCSSColor = norm;
function rgba(colorInt) {
    var r = Math.round((colorInt & 0xff000000) >>> 24);
    var g = Math.round((colorInt & 0x00ff0000) >>> 16);
    var b = Math.round((colorInt & 0x0000ff00) >>> 8);
    var a = ((colorInt & 0x000000ff) >>> 0) / 255;
    return {
        r: r,
        g: g,
        b: b,
        a: a,
    };
}
exports.default = exports.normalizeCSSColor;
