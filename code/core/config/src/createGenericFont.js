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
exports.createGenericFont = createGenericFont;
var web_1 = require("@hanzogui/web");
var genericFontSizes = {
    1: 10,
    2: 11,
    3: 12,
    4: 14,
    5: 15,
    6: 16,
    7: 20,
    8: 22,
    9: 30,
    10: 42,
    11: 52,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 124,
};
function createGenericFont(family, font, _a) {
    if (font === void 0) { font = {}; }
    var _b = _a === void 0 ? {} : _a, _c = _b.sizeLineHeight, sizeLineHeight = _c === void 0 ? function (val) { return val * 1.35; } : _c;
    var size = font.size || genericFontSizes;
    return (0, web_1.createFont)(__assign({ family: family, size: size, lineHeight: Object.fromEntries(Object.entries(size).map(function (_a) {
            var k = _a[0], v = _a[1];
            return [k, sizeLineHeight(+v)];
        })), weight: { 0: '300' }, letterSpacing: { 4: 0 } }, font));
}
