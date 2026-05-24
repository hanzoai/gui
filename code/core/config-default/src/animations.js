"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animations = void 0;
var animations_css_1 = require("@hanzogui/animations-css");
var smoothBezier = 'cubic-bezier(0.215, 0.610, 0.355, 1.000)';
exports.animations = (0, animations_css_1.createAnimations)({
    '75ms': 'ease-in 75ms',
    '100ms': 'ease-in 100ms',
    '200ms': 'ease-in 200ms',
    bouncy: 'ease-in 200ms',
    superBouncy: 'ease-in 500ms',
    lazy: 'ease-in 1000ms',
    medium: 'ease-in 300ms',
    slow: 'ease-in 500ms',
    quick: "".concat(smoothBezier, " 400ms"),
    quicker: "".concat(smoothBezier, " 300ms"),
    quickest: "".concat(smoothBezier, " 200ms"),
    tooltip: 'ease-in 400ms',
    select: 'ease-in 150ms',
});
