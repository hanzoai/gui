"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shadows = void 0;
var lightShadowColor = 'rgba(0,0,0,0.04)';
var lightShadowColorStrong = 'rgba(0,0,0,0.085)';
var darkShadowColor = 'rgba(0,0,0,0.2)';
var darkShadowColorStrong = 'rgba(0,0,0,0.3)';
exports.shadows = {
    light: {
        shadowColor: lightShadowColorStrong,
        shadowColorHover: lightShadowColorStrong,
        shadowColorPress: lightShadowColor,
        shadowColorFocus: lightShadowColor,
    },
    dark: {
        shadowColor: darkShadowColorStrong,
        shadowColorHover: darkShadowColorStrong,
        shadowColorPress: darkShadowColor,
        shadowColorFocus: darkShadowColor,
    },
};
