"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeShadow = normalizeShadow;
var defaultOffset_1 = require("./defaultOffset");
var normalizeColor_1 = require("./normalizeColor");
function normalizeShadow(_a) {
    var _b;
    var shadowColor = _a.shadowColor, shadowOffset = _a.shadowOffset, shadowOpacity = _a.shadowOpacity, shadowRadius = _a.shadowRadius;
    var _c = shadowOffset || defaultOffset_1.defaultOffset, height = _c.height, width = _c.width;
    return {
        shadowOffset: {
            width: width || 0,
            height: height || 0,
        },
        shadowRadius: shadowRadius || 0,
        shadowColor: (0, normalizeColor_1.normalizeColor)(shadowColor, 1),
        shadowOpacity: shadowOpacity !== null && shadowOpacity !== void 0 ? shadowOpacity : (shadowColor ? (_b = (0, normalizeColor_1.getRgba)(shadowColor)) === null || _b === void 0 ? void 0 : _b.a : 1),
    };
}
