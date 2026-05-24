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
exports.fonts = exports.createSystemFont = void 0;
var core_1 = require("@hanzogui/core");
var isWeb = process.env.TAMAGUI_TARGET === 'web';
var isNative = process.env.TAMAGUI_TARGET === 'native';
// web sizes
var webSizes = {
    1: 12,
    2: 13,
    3: 14,
    4: 15,
    true: 15,
    5: 16,
    6: 18,
    7: 22,
    8: 26,
    9: 30,
    10: 40,
    11: 46,
    12: 52,
    13: 60,
    14: 70,
    15: 85,
    16: 100,
};
// native sizes aligned with iOS HIG (SF Pro)
// 4/true = body (17pt), 3 = subheadline (15pt), 2 = caption (12pt)
var nativeSizes = {
    1: 11,
    2: 12,
    3: 15,
    4: 17,
    true: 17,
    5: 20,
    6: 22,
    7: 24,
    8: 28,
    9: 32,
    10: 40,
    11: 46,
    12: 52,
    13: 60,
    14: 70,
    15: 85,
    16: 100,
};
var defaultSizes = isNative ? nativeSizes : webSizes;
// line height: native per iOS HIG (size + 5), web 150% tapering to ~142% for large sizes
var defaultLineHeight = function (size) {
    if (isNative)
        return Math.round(size + 5);
    // taper from 1.5 at small sizes to ~1.42 at 40px
    var ratio = 1.5 - Math.max(0, (size - 20) * 0.004);
    return Math.round(size * ratio);
};
var createSystemFont = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.font, font = _c === void 0 ? {} : _c, _d = _b.sizeLineHeight, sizeLineHeight = _d === void 0 ? defaultLineHeight : _d, _e = _b.sizeSize, sizeSize = _e === void 0 ? function (size) { return Math.round(size); } : _e;
    // merge to allow individual overrides
    var size = Object.fromEntries(Object.entries(__assign(__assign({}, defaultSizes), font.size)).map(function (_a) {
        var k = _a[0], v = _a[1];
        return [k, sizeSize(+v)];
    }));
    return (0, core_1.createFont)(__assign(__assign({ family: isWeb
            ? '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            : 'System', lineHeight: Object.fromEntries(Object.entries(size).map(function (_a) {
            var k = _a[0], v = _a[1];
            return [k, sizeLineHeight((0, core_1.getVariableValue)(v))];
        })), weight: {
            1: '400',
        }, letterSpacing: {
            4: 0,
        } }, font), { size: size }));
};
exports.createSystemFont = createSystemFont;
// heading line height: native ~120%, web original
var headingLineHeight = function (size) {
    return Math.round(isNative ? size * 1.2 : size * 1.12 + 5);
};
exports.fonts = {
    body: (0, exports.createSystemFont)(),
    heading: (0, exports.createSystemFont)({
        font: {
            weight: {
                0: '600',
                6: '700',
                9: '800',
            },
        },
        sizeLineHeight: headingLineHeight,
    }),
};
