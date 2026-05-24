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
exports.maskOptions = exports.templates = void 0;
var palettes_1 = require("./palettes");
var templateColorsSpecific = {
    color1: 1,
    color2: 2,
    color3: 3,
    color4: 4,
    color5: 5,
    color6: 6,
    color7: 7,
    color8: 8,
    color9: 9,
    color10: 10,
    color11: 11,
    color12: 12,
};
// templates use the palette and specify index
// negative goes backwards from end so -1 is the last item
var template = __assign(__assign({}, templateColorsSpecific), { 
    // the background, color, etc keys here work like generics - they make it so you
    // can publish components for others to use without mandating a specific color scale
    // the @hanzogui/button Button component looks for `$background`, so you set the
    // dark_red_Button theme to have a stronger background than the dark_red theme.
    background: 2, backgroundHover: 3, backgroundPress: 4, backgroundFocus: 5, backgroundStrong: 1, backgroundTransparent: 0, color: -1, colorHover: -2, colorPress: -1, colorFocus: -2, colorTransparent: -0, borderColor: 5, borderColorHover: 6, borderColorFocus: 4, borderColorPress: 5, placeholderColor: -4 });
exports.templates = {
    base: template,
    colorLight: __assign(__assign({}, template), { 
        // light color themes are a bit less sensitive
        borderColor: 4, borderColorHover: 5, borderColorFocus: 4, borderColorPress: 4 }),
};
var shadows = {
    shadowColor: 0,
    shadowColorHover: 0,
    shadowColorPress: 0,
    shadowColorFocus: 0,
};
var colors = __assign(__assign({}, shadows), { color: 0, colorHover: 0, colorFocus: 0, colorPress: 0 });
var baseMaskOptions = {
    override: shadows,
    skip: shadows,
    // avoids the transparent ends
    max: palettes_1.palettes.light.length - 2,
    min: 1,
};
var skipShadowsAndSpecificColors = __assign(__assign({}, shadows), templateColorsSpecific);
exports.maskOptions = {
    component: __assign(__assign({}, baseMaskOptions), { override: colors, skip: skipShadowsAndSpecificColors }),
    alt: __assign({}, baseMaskOptions),
    button: __assign(__assign({}, baseMaskOptions), { override: __assign(__assign({}, colors), { borderColor: 'transparent', borderColorHover: 'transparent' }), skip: skipShadowsAndSpecificColors }),
};
