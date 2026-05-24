"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeShadow = normalizeShadow;
var defaultOffset_1 = require("./defaultOffset");
function normalizeShadow(_a) {
    var shadowColor = _a.shadowColor, shadowOffset = _a.shadowOffset, shadowOpacity = _a.shadowOpacity, shadowRadius = _a.shadowRadius;
    var _b = shadowOffset || defaultOffset_1.defaultOffset, height = _b.height, width = _b.width;
    return {
        shadowOffset: {
            width: width || 0,
            height: height || 0,
        },
        shadowRadius: shadowRadius || 0,
        // pass color through as-is, opacity applied via color-mix in getCSSStylesAtomic
        shadowColor: shadowColor,
        // default to 1 if not specified (color-mix will handle the opacity)
        shadowOpacity: shadowOpacity !== null && shadowOpacity !== void 0 ? shadowOpacity : 1,
    };
}
