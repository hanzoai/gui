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
exports.createSilkscreenFont = void 0;
var core_1 = require("@hanzogui/core");
var createSilkscreenFont = function (font) {
    if (font === void 0) { font = {}; }
    return (0, core_1.createFont)(__assign({ family: core_1.isWeb
            ? 'Silkscreen, Fira Code, Monaco, Consolas, Ubuntu Mono, monospace'
            : 'Silkscreen', size: size, lineHeight: Object.fromEntries(Object.entries(font.size || size).map(function (_a) {
            var k = _a[0], v = _a[1];
            return [
                k,
                typeof v === 'number' ? Math.round(v * 1.2 + 6) : v,
            ];
        })), weight: {
            4: '300',
        }, letterSpacing: {
            4: 1,
            5: 3,
            6: 3,
            9: -2,
            10: -3,
            12: -4,
        } }, font));
};
exports.createSilkscreenFont = createSilkscreenFont;
var size = {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 15,
    6: 16,
    7: 18,
    8: 21,
    9: 28,
    10: 42,
    11: 52,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 124,
};
