"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMinusZero = isMinusZero;
function isMinusZero(value) {
    return 1 / value === Number.NEGATIVE_INFINITY;
}
