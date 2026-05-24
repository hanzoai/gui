"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animations = exports.animationsCSS = void 0;
var animations_css_1 = require("@hanzogui/animations-css");
var easeOut = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
var bouncy = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
exports.animationsCSS = (0, animations_css_1.createAnimations)({
    '0ms': '0ms linear',
    '50ms': '50ms linear',
    '75ms': '75ms linear',
    '100ms': '100ms ease-out',
    '200ms': '200ms ease-out',
    '250ms': '250ms ease-out',
    '300ms': '300ms ease-out',
    '400ms': '400ms ease-out',
    '500ms': '500ms ease-out',
    superBouncy: "300ms cubic-bezier(0.175, 0.885, 0.32, 1.5)",
    bouncy: "350ms ".concat(bouncy),
    superLazy: "600ms ".concat(easeOut),
    lazy: "500ms ".concat(easeOut),
    medium: "300ms ".concat(easeOut),
    slowest: "800ms ".concat(easeOut),
    slow: "450ms ".concat(easeOut),
    quick: "150ms ".concat(easeOut),
    quickLessBouncy: "180ms ".concat(easeOut),
    quicker: "120ms ".concat(easeOut),
    quickerLessBouncy: "100ms ".concat(easeOut),
    quickest: "80ms ".concat(easeOut),
    quickestLessBouncy: "60ms ".concat(easeOut),
});
exports.animations = exports.animationsCSS;
