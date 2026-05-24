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
exports.createInterFont = void 0;
var core_1 = require("@hanzogui/core");
var createInterFont = function (font, _a) {
    if (font === void 0) { font = {}; }
    var _b = _a === void 0 ? {} : _a, _c = _b.sizeLineHeight, sizeLineHeight = _c === void 0 ? function (size) { return size + 10; } : _c, _d = _b.sizeSize, sizeSize = _d === void 0 ? function (size) { return size * 1; } : _d;
    // merge to allow individual overrides
    var size = Object.fromEntries(Object.entries(__assign(__assign({}, defaultSizes), font.size)).map(function (_a) {
        var k = _a[0], v = _a[1];
        return [k, sizeSize(+v)];
    }));
    return (0, core_1.createFont)(__assign(__assign({ family: core_1.isWeb
            ? 'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            : 'Inter', lineHeight: Object.fromEntries(Object.entries(size).map(function (_a) {
            var k = _a[0], v = _a[1];
            return [k, sizeLineHeight((0, core_1.getVariableValue)(v))];
        })), weight: {
            4: '300',
        }, letterSpacing: {
            4: 0,
        } }, font), { size: size }));
};
exports.createInterFont = createInterFont;
var defaultSizes = {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    true: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 23,
    9: 30,
    10: 46,
    11: 55,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 134,
};
