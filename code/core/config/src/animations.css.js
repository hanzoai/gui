"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animations = void 0;
var animations_css_1 = require("@hanzogui/animations-css");
exports.animations = (0, animations_css_1.createAnimations)({
    '100ms': 'ease-in 100ms',
    bouncy: 'ease-in 200ms',
    lazy: 'ease-in 600ms',
    slow: 'ease-in 500ms',
    medium: 'ease-in 300ms',
    quick: 'ease-in 100ms',
    tooltip: 'ease-in 400ms',
});
