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
exports.ThemeableStack = exports.themeableVariants = void 0;
var core_1 = require("@hanzogui/core");
var Stacks_1 = require("./Stacks");
var variants_1 = require("./variants");
var chromelessStyle = {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    shadowColor: 'transparent',
    hoverStyle: {
        borderColor: 'transparent',
    },
};
exports.themeableVariants = {
    circular: variants_1.circular,
    elevate: variants_1.elevate,
    bordered: {
        true: variants_1.bordered,
    },
    transparent: {
        true: {
            backgroundColor: 'transparent',
        },
    },
    chromeless: {
        true: chromelessStyle,
        all: __assign(__assign({}, chromelessStyle), { hoverStyle: chromelessStyle, pressStyle: chromelessStyle, focusStyle: chromelessStyle }),
    },
};
exports.ThemeableStack = (0, core_1.styled)(Stacks_1.YStack, {
    variants: exports.themeableVariants,
});
