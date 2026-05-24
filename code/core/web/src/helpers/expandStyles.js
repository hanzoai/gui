"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixStyles = fixStyles;
var constants_1 = require("@hanzogui/constants");
var normalizeShadow_1 = require("./normalizeShadow");
function fixStyles(style) {
    var _a;
    if (process.env.TAMAGUI_TARGET === 'native') {
        if ('elevationAndroid' in style) {
            // @ts-ignore
            style['elevation'] = style.elevationAndroid;
            // @ts-ignore
            delete style.elevationAndroid;
        }
    }
    // TODO deprecate for web-style shadows
    if (style.shadowRadius != null ||
        style.shadowColor ||
        style.shadowOpacity != null ||
        style.shadowOffset) {
        Object.assign(style, (0, normalizeShadow_1.normalizeShadow)(style));
    }
    // could be optimized better
    // ensure border style set by default to solid
    for (var key in borderDefaults) {
        if (key in style) {
            style[_a = borderDefaults[key]] || (style[_a] = 'solid');
        }
    }
}
// native doesn't support specific border edge style
var nativeStyle = constants_1.isWeb ? null : 'borderStyle';
var borderDefaults = {
    borderWidth: 'borderStyle',
    borderBottomWidth: nativeStyle || 'borderBottomStyle',
    borderTopWidth: nativeStyle || 'borderTopStyle',
    borderLeftWidth: nativeStyle || 'borderLeftStyle',
    borderRightWidth: nativeStyle || 'borderRightStyle',
    // TODO: need to add borderBlock and borderInline here, but they are alot and might impact performance
};
