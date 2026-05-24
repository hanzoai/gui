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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.themes = void 0;
var create_theme_1 = require("@hanzogui/create-theme");
var tokens_1 = require("./tokens");
var lightTransparent = 'rgba(255,255,255,0)';
var darkTransparent = 'rgba(10,10,10,0)';
// background => foreground
var palettes = {
    dark: [
        darkTransparent,
        '#050505',
        '#151515',
        '#191919',
        '#232323',
        '#282828',
        '#323232',
        '#424242',
        '#494949',
        '#545454',
        '#626262',
        '#a5a5a5',
        '#fff',
        lightTransparent,
    ],
    light: [
        lightTransparent,
        '#fff',
        '#f9f9f9',
        'hsl(0, 0%, 97.3%)',
        'hsl(0, 0%, 95.1%)',
        'hsl(0, 0%, 94.0%)',
        'hsl(0, 0%, 92.0%)',
        'hsl(0, 0%, 89.5%)',
        'hsl(0, 0%, 81.0%)',
        'hsl(0, 0%, 56.1%)',
        'hsl(0, 0%, 50.3%)',
        'hsl(0, 0%, 42.5%)',
        'hsl(0, 0%, 9.0%)',
        darkTransparent,
    ],
};
var templateColors = {
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
var templateShadows = {
    shadowColor: 1,
    shadowColorHover: 1,
    shadowColorPress: 2,
    shadowColorFocus: 2,
};
// we can use subset of our template as a "override" so it doesn't get adjusted with masks
// we want to skip over templateColor + templateShadows
var toSkip = __assign({}, templateShadows);
var override = Object.fromEntries(Object.entries(toSkip).map(function (_a) {
    var k = _a[0];
    return [k, 0];
}));
var overrideShadows = Object.fromEntries(Object.entries(templateShadows).map(function (_a) {
    var k = _a[0];
    return [k, 0];
}));
var overrideWithColors = __assign(__assign({}, override), { color: 0, colorHover: 0, colorFocus: 0, colorPress: 0 });
// templates use the palette and specify index
// negative goes backwards from end so -1 is the last item
var template = __assign(__assign(__assign({}, templateColors), toSkip), { 
    // the background, color, etc keys here work like generics - they make it so you
    // can publish components for others to use without mandating a specific color scale
    // the @hanzogui/button Button component looks for `$background`, so you set the
    // dark_red_Button theme to have a stronger background than the dark_red theme.
    background: 2, backgroundHover: 3, backgroundPress: 4, backgroundFocus: 5, backgroundStrong: 1, backgroundTransparent: 0, color: -1, colorHover: -2, colorPress: -1, colorFocus: -2, colorTransparent: -0, borderColor: 4, borderColorHover: 5, borderColorPress: 3, borderColorFocus: 4, placeholderColor: -4 });
var lightShadowColor = 'rgba(0,0,0,0.02)';
var lightShadowColorStrong = 'rgba(0,0,0,0.066)';
var darkShadowColor = 'rgba(0,0,0,0.2)';
var darkShadowColorStrong = 'rgba(0,0,0,0.3)';
var lightShadows = {
    shadowColor: lightShadowColorStrong,
    shadowColorHover: lightShadowColorStrong,
    shadowColorPress: lightShadowColor,
    shadowColorFocus: lightShadowColor,
};
var darkShadows = {
    shadowColor: darkShadowColorStrong,
    shadowColorHover: darkShadowColorStrong,
    shadowColorPress: darkShadowColor,
    shadowColorFocus: darkShadowColor,
};
var lightTemplate = __assign(__assign(__assign({}, template), { background: 2, backgroundHover: 3, backgroundPress: 4, 
    // our light color palette is... a bit unique
    borderColor: 6, borderColorHover: 7, borderColorFocus: 5, borderColorPress: 6 }), lightShadows);
var darkTemplate = __assign(__assign({}, template), darkShadows);
var light = (0, create_theme_1.createTheme)(palettes.light, lightTemplate);
var dark = (0, create_theme_1.createTheme)(palettes.dark, darkTemplate);
var baseThemes = {
    light: light,
    dark: dark,
};
var masks = {
    skip: create_theme_1.skipMask,
    weaker: (0, create_theme_1.createWeakenMask)(),
    stronger: (0, create_theme_1.createStrengthenMask)(),
};
// default mask options for most uses
var maskOptions = {
    override: override,
    skip: toSkip,
    // avoids the transparent ends
    max: palettes.light.length - 2,
    min: 1,
};
var transparent = function (hsl, opacity) {
    if (opacity === void 0) { opacity = 0; }
    return hsl.replace("%)", "%, ".concat(opacity, ")")).replace("hsl(", "hsla(");
};
// setup colorThemes and their inverses
var _a = [tokens_1.colorTokens.light, tokens_1.colorTokens.dark].map(function (colorSet, i) {
    var isLight = i === 0;
    var theme = baseThemes[isLight ? 'light' : 'dark'];
    return Object.fromEntries(Object.keys(colorSet).map(function (color) {
        var colorPalette = Object.values(colorSet[color]);
        // were re-ordering these
        var _a = [
            colorPalette.slice(0, 6),
            colorPalette.slice(colorPalette.length - 5),
        ], head = _a[0], tail = _a[1];
        // add our transparent colors first/last
        // and make sure the last (foreground) color is white/black rather than colorful
        // this is mostly for consistency with the older theme-base
        var palette = __spreadArray(__spreadArray(__spreadArray([
            transparent(colorPalette[0])
        ], head, true), tail, true), [
            theme.color,
            transparent(colorPalette[colorPalette.length - 1]),
        ], false);
        var colorTheme = (0, create_theme_1.createTheme)(palette, isLight
            ? __assign(__assign({}, lightTemplate), { 
                // light color themes are a bit less sensitive
                borderColor: 4, borderColorHover: 5, borderColorFocus: 4, borderColorPress: 4 }) : darkTemplate);
        return [color, colorTheme];
    }));
}), lightColorThemes = _a[0], darkColorThemes = _a[1];
var allThemes = (0, create_theme_1.addChildren)(baseThemes, function (name, theme) {
    var isLight = name === 'light';
    var inverseName = isLight ? 'dark' : 'light';
    var inverseTheme = baseThemes[inverseName];
    var colorThemes = isLight ? lightColorThemes : darkColorThemes;
    var inverseColorThemes = isLight ? darkColorThemes : lightColorThemes;
    var allColorThemes = (0, create_theme_1.addChildren)(colorThemes, function (colorName, colorTheme) {
        var inverse = inverseColorThemes[colorName];
        return __assign(__assign({}, getAltThemes({
            theme: colorTheme,
            inverse: inverse,
            isLight: isLight,
        })), getComponentThemes(colorTheme, inverse, isLight));
    });
    var baseSubThemes = __assign(__assign({}, getAltThemes({ theme: theme, inverse: inverseTheme, isLight: isLight })), getComponentThemes(theme, inverseTheme, isLight));
    return __assign(__assign({}, baseSubThemes), allColorThemes);
});
function getAltThemes(_a) {
    var theme = _a.theme, inverse = _a.inverse, isLight = _a.isLight, activeTheme = _a.activeTheme;
    var maskOptionsAlt = __assign(__assign({}, maskOptions), { override: overrideShadows });
    var alt1 = (0, create_theme_1.applyMask)(theme, masks.weaker, maskOptionsAlt);
    var alt2 = (0, create_theme_1.applyMask)(alt1, masks.weaker, maskOptionsAlt);
    var active = activeTheme !== null && activeTheme !== void 0 ? activeTheme : (process.env.ACTIVE_THEME_INVERSE
        ? inverse
        : (function () {
            return (0, create_theme_1.applyMask)(theme, masks.weaker, __assign(__assign({}, maskOptions), { strength: 3, skip: __assign(__assign({}, maskOptions.skip), { color: 1 }) }));
        })());
    return (0, create_theme_1.addChildren)({ alt1: alt1, alt2: alt2, active: active }, function (_, subTheme) {
        return getComponentThemes(subTheme, subTheme === inverse ? theme : inverse, isLight);
    });
}
function getComponentThemes(theme, inverse, isLight) {
    var componentMaskOptions = __assign(__assign({}, maskOptions), { override: overrideWithColors, skip: __assign(__assign({}, maskOptions.skip), templateColors) });
    var weaker1 = (0, create_theme_1.applyMask)(theme, masks.weaker, componentMaskOptions);
    var base = (0, create_theme_1.applyMask)(weaker1, masks.stronger, componentMaskOptions);
    var weaker2 = (0, create_theme_1.applyMask)(weaker1, masks.weaker, componentMaskOptions);
    var stronger1 = (0, create_theme_1.applyMask)(theme, masks.stronger, componentMaskOptions);
    var inverse1 = (0, create_theme_1.applyMask)(inverse, masks.weaker, componentMaskOptions);
    var inverse2 = (0, create_theme_1.applyMask)(inverse1, masks.weaker, componentMaskOptions);
    var strongerBorderLighterBackground = isLight
        ? __assign(__assign({}, stronger1), { borderColor: weaker1.borderColor, borderColorHover: weaker1.borderColorHover, borderColorPress: weaker1.borderColorPress, borderColorFocus: weaker1.borderColorFocus }) : __assign(__assign({}, (0, create_theme_1.applyMask)(theme, masks.skip, componentMaskOptions)), { borderColor: weaker1.borderColor, borderColorHover: weaker1.borderColorHover, borderColorPress: weaker1.borderColorPress, borderColorFocus: weaker1.borderColorFocus });
    var overlayTheme = {
        background: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.9)',
    };
    var weaker2WithoutBorder = __assign(__assign({}, weaker2), { borderColor: 'transparent', borderColorHover: 'transparent' });
    return {
        ListItem: isLight ? stronger1 : base,
        Card: weaker1,
        Button: weaker2WithoutBorder,
        Checkbox: weaker2,
        DrawerFrame: weaker1,
        SliderTrack: stronger1,
        SliderTrackActive: weaker2,
        SliderThumb: inverse1,
        Progress: weaker1,
        ProgressIndicator: inverse,
        Switch: weaker2,
        SwitchThumb: inverse2,
        TooltipArrow: weaker1,
        TooltipContent: weaker2,
        Input: strongerBorderLighterBackground,
        TextArea: strongerBorderLighterBackground,
        Tooltip: inverse1,
        // make overlays always dark
        SheetOverlay: overlayTheme,
        DialogOverlay: overlayTheme,
        ModalOverlay: overlayTheme,
    };
}
exports.themes = __assign(__assign({}, allThemes), { 
    // bring back the full type, the rest use a subset to avoid clogging up ts,
    // hanzogui will be smart and use the top level themes as the type for useTheme() etc
    light: (0, create_theme_1.createTheme)(palettes.light, lightTemplate, { nonInheritedValues: tokens_1.lightColors }), dark: (0, create_theme_1.createTheme)(palettes.dark, darkTemplate, { nonInheritedValues: tokens_1.darkColors }) });
// if (process.env.NODE_ENV === 'development') {
//   console.log(JSON.stringify(themes).length)
// }
