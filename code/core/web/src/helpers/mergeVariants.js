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
exports.mergeVariants = void 0;
// deep merge variants
// except for functions which override any parents
var mergeVariants = function (parentVariants, ourVariants, level) {
    if (level === void 0) { level = 0; }
    var variants = {};
    for (var key in ourVariants) {
        var parentVariant = parentVariants === null || parentVariants === void 0 ? void 0 : parentVariants[key];
        var ourVariant = ourVariants[key];
        if (!parentVariant || typeof ourVariant === 'function') {
            variants[key] = ourVariant;
        }
        else if (parentVariant && !ourVariant) {
            variants[key] = parentVariant[key];
        }
        else {
            if (level === 0) {
                variants[key] = (0, exports.mergeVariants)(parentVariant, ourVariant, level + 1);
            }
            else {
                variants[key] = __assign(__assign({}, parentVariant), ourVariant);
            }
        }
    }
    return __assign(__assign({}, parentVariants), variants);
};
exports.mergeVariants = mergeVariants;
