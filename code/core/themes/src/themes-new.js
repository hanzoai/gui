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
exports.themes = void 0;
var theme_builder_1 = require("@hanzogui/theme-builder");
var componentThemeDefinitions_1 = require("./componentThemeDefinitions");
var theme_builder_2 = require("@hanzogui/theme-builder");
var palettes_1 = require("./palettes");
var shadows_1 = require("./shadows");
var templates_1 = require("./templates");
var tokens_1 = require("./tokens");
var colorThemeDefinition = function (colorName) { return [
    {
        parent: 'light',
        palette: colorName,
        template: 'colorLight',
    },
    {
        parent: 'dark',
        palette: colorName,
        template: 'base',
    },
]; };
var themesBuilder = (0, theme_builder_1.createThemeBuilder)()
    .addPalettes(palettes_1.palettes)
    .addTemplates(templates_1.templates)
    .addMasks(theme_builder_2.masks)
    .addThemes({
    light: {
        template: 'base',
        palette: 'light',
        nonInheritedValues: __assign(__assign({}, tokens_1.lightColors), shadows_1.shadows.light),
    },
    dark: {
        template: 'base',
        palette: 'dark',
        nonInheritedValues: __assign(__assign({}, tokens_1.darkColors), shadows_1.shadows.dark),
    },
})
    .addChildThemes({
    orange: colorThemeDefinition('orange'),
    yellow: colorThemeDefinition('yellow'),
    green: colorThemeDefinition('green'),
    blue: colorThemeDefinition('blue'),
    purple: colorThemeDefinition('purple'),
    pink: colorThemeDefinition('pink'),
    red: colorThemeDefinition('red'),
})
    .addChildThemes({
    alt1: __assign({ mask: 'soften' }, templates_1.maskOptions.alt),
    alt2: __assign({ mask: 'soften2' }, templates_1.maskOptions.alt),
    active: {
        mask: 'soften3',
        skip: {
            color: 1,
        },
    },
})
    .addChildThemes(componentThemeDefinitions_1.componentThemeDefinitions, {
// to save bundle size but make alt themes not work on components
// avoidNestingWithin: ['alt1', 'alt2'],
});
exports.themes = themesBuilder.build();
