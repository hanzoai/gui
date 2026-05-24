"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizableStack = void 0;
var core_1 = require("@hanzogui/core");
var get_button_sized_1 = require("@hanzogui/get-button-sized");
var ThemeableStack_1 = require("./ThemeableStack");
var variants_1 = require("./variants");
exports.SizableStack = (0, core_1.styled)(ThemeableStack_1.ThemeableStack, {
    name: 'SizableStack',
    variants: {
        unstyled: {
            true: {
                elevate: false,
                bordered: false,
            },
        },
        circular: variants_1.circular,
        elevate: variants_1.elevate,
        bordered: {
            true: variants_1.bordered,
        },
        size: {
            '...size': function (val, extras) {
                return (0, get_button_sized_1.getButtonSized)(val, extras);
            },
        },
    },
});
