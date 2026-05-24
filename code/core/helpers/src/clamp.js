"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = clamp;
function clamp(value, _a) {
    var min = _a[0], max = _a[1];
    return Math.min(max, Math.max(min, value));
}
