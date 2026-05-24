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
exports.tokens = exports.themes = exports.defaultSubThemes = exports.defaultComponentThemes = exports.defaultTemplates = exports.defaultPalettes = void 0;
var legacy_1 = require("@hanzogui/colors/legacy");
var theme_builder_1 = require("@hanzogui/theme-builder");
var web_1 = require("@hanzogui/web");
var utils_1 = require("./utils");
var v3_tokens_1 = require("./v3-tokens");
var colorTokens = {
    light: {
        blue: legacy_1.blue,
        gray: legacy_1.gray,
        green: legacy_1.green,
        orange: legacy_1.orange,
        pink: legacy_1.pink,
        purple: legacy_1.purple,
        red: legacy_1.red,
        yellow: legacy_1.yellow,
    },
    dark: {
        blue: legacy_1.blueDark,
        gray: legacy_1.grayDark,
        green: legacy_1.greenDark,
        orange: legacy_1.orangeDark,
        pink: legacy_1.pinkDark,
        purple: legacy_1.purpleDark,
        red: legacy_1.redDark,
        yellow: legacy_1.yellowDark,
    },
};
var lightShadowColor = 'rgba(0,0,0,0.04)';
var lightShadowColorStrong = 'rgba(0,0,0,0.085)';
var darkShadowColor = 'rgba(0,0,0,0.2)';
var darkShadowColorStrong = 'rgba(0,0,0,0.3)';
var darkColors = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, colorTokens.dark.blue), colorTokens.dark.gray), colorTokens.dark.green), colorTokens.dark.orange), colorTokens.dark.pink), colorTokens.dark.purple), colorTokens.dark.red), colorTokens.dark.yellow);
var lightColors = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, colorTokens.light.blue), colorTokens.light.gray), colorTokens.light.green), colorTokens.light.orange), colorTokens.light.pink), colorTokens.light.purple), colorTokens.light.red), colorTokens.light.yellow);
var color = __assign(__assign({ white0: 'rgba(255,255,255,0)', white075: 'rgba(255,255,255,0.75)', white05: 'rgba(255,255,255,0.5)', white025: 'rgba(255,255,255,0.25)', black0: 'rgba(10,10,10,0)', black075: 'rgba(10,10,10,0.75)', black05: 'rgba(10,10,10,0.5)', black025: 'rgba(10,10,10,0.25)', white1: '#fff', white2: '#f8f8f8', white3: 'hsl(0, 0%, 96.3%)', white4: 'hsl(0, 0%, 94.1%)', white5: 'hsl(0, 0%, 92.0%)', white6: 'hsl(0, 0%, 90.0%)', white7: 'hsl(0, 0%, 88.5%)', white8: 'hsl(0, 0%, 81.0%)', white9: 'hsl(0, 0%, 56.1%)', white10: 'hsl(0, 0%, 50.3%)', white11: 'hsl(0, 0%, 42.5%)', white12: 'hsl(0, 0%, 9.0%)', black1: '#050505', black2: '#151515', black3: '#191919', black4: '#232323', black5: '#282828', black6: '#323232', black7: '#424242', black8: '#494949', black9: '#545454', black10: '#626262', black11: '#a5a5a5', black12: '#fff' }, (0, utils_1.postfixObjKeys)(lightColors, 'Light')), (0, utils_1.postfixObjKeys)(darkColors, 'Dark'));
exports.defaultPalettes = (function () {
    var transparent = function (hsl, opacity) {
        if (opacity === void 0) { opacity = 0; }
        return hsl.replace("%)", "%, ".concat(opacity, ")")).replace("hsl(", "hsla(");
    };
    var getColorPalette = function (colors, accentColors) {
        var colorPalette = Object.values(colors);
        // make the transparent color vibrant and towards the middle
        var colorI = colorPalette.length - 4;
        // accents!
        var accentPalette = Object.values(accentColors);
        var accentBackground = accentPalette[0];
        var accentColor = accentPalette[accentPalette.length - 1];
        // add our transparent colors first/last
        // and make sure the last (foreground) color is white/black rather than colorful
        // this is mostly for consistency with the older theme-base
        return __spreadArray(__spreadArray([
            accentBackground,
            transparent(colorPalette[0], 0),
            transparent(colorPalette[0], 0.25),
            transparent(colorPalette[0], 0.5),
            transparent(colorPalette[0], 0.75)
        ], colorPalette, true), [
            transparent(colorPalette[colorI], 0.75),
            transparent(colorPalette[colorI], 0.5),
            transparent(colorPalette[colorI], 0.25),
            transparent(colorPalette[colorI], 0),
            accentColor,
        ], false);
    };
    var brandColor = {
        light: color.blue4Light,
        dark: color.blue4Dark,
    };
    var lightPalette = [
        brandColor.light,
        color.white0,
        color.white025,
        color.white05,
        color.white075,
        color.white1,
        color.white2,
        color.white3,
        color.white4,
        color.white5,
        color.white6,
        color.white7,
        color.white8,
        color.white9,
        color.white10,
        color.white11,
        color.white12,
        color.black075,
        color.black05,
        color.black025,
        color.black0,
        brandColor.dark,
    ];
    var darkPalette = [
        brandColor.dark,
        color.black0,
        color.black025,
        color.black05,
        color.black075,
        color.black1,
        color.black2,
        color.black3,
        color.black4,
        color.black5,
        color.black6,
        color.black7,
        color.black8,
        color.black9,
        color.black10,
        color.black11,
        color.black12,
        color.white075,
        color.white05,
        color.white025,
        color.white0,
        brandColor.light,
    ];
    var lightColorNames = (0, utils_1.objectKeys)(colorTokens.light);
    var lightPalettes = (0, theme_builder_1.objectFromEntries)(lightColorNames.map(function (key, index) {
        return [
            "light_".concat(key),
            getColorPalette(colorTokens.light[key], colorTokens.light[lightColorNames[(index + 1) % lightColorNames.length]]),
        ];
    }));
    var darkColorNames = (0, utils_1.objectKeys)(colorTokens.dark);
    var darkPalettes = (0, theme_builder_1.objectFromEntries)(darkColorNames.map(function (key, index) {
        return [
            "dark_".concat(key),
            getColorPalette(colorTokens.dark[key], colorTokens.dark[darkColorNames[(index + 1) % darkColorNames.length]]),
        ];
    }));
    var colorPalettes = __assign(__assign({}, lightPalettes), darkPalettes);
    return __assign({ light: lightPalette, dark: darkPalette }, colorPalettes);
})();
var getTemplates = function () {
    var getBaseTemplates = function (scheme) {
        var isLight = scheme === 'light';
        // our palettes have 4 things padding each end until you get to bg/color:
        // [accentBg, transparent1, transparent2, transparent3, transparent4, background, ...]
        var bgIndex = 5;
        var lighten = isLight ? -1 : 1;
        var darken = -lighten;
        var borderColor = bgIndex + 3;
        // templates use the palette and specify index
        // negative goes backwards from end so -1 is the last item
        var base = {
            accentBackground: 0,
            accentColor: -0,
            background0: 1,
            background025: 2,
            background05: 3,
            background075: 4,
            color1: bgIndex,
            color2: bgIndex + 1,
            color3: bgIndex + 2,
            color4: bgIndex + 3,
            color5: bgIndex + 4,
            color6: bgIndex + 5,
            color7: bgIndex + 6,
            color8: bgIndex + 7,
            color9: bgIndex + 8,
            color10: bgIndex + 9,
            color11: bgIndex + 10,
            color12: bgIndex + 11,
            color0: -1,
            color025: -2,
            color05: -3,
            color075: -4,
            // the background, color, etc keys here work like generics - they make it so you
            // can publish components for others to use without mandating a specific color scale
            // the @hanzogui/button Button component looks for `$background`, so you set the
            // dark_red_Button theme to have a stronger background than the dark_red theme.
            background: bgIndex,
            backgroundHover: bgIndex + lighten, // always lighten on hover no matter the scheme
            backgroundPress: bgIndex + darken, // always darken on press no matter the theme
            backgroundFocus: bgIndex + darken,
            borderColor: borderColor,
            borderColorHover: borderColor + lighten,
            borderColorPress: borderColor + darken,
            borderColorFocus: borderColor,
            color: -bgIndex,
            colorHover: -bgIndex - 1,
            colorPress: -bgIndex,
            colorFocus: -bgIndex - 1,
            colorTransparent: -1,
            placeholderColor: -bgIndex - 3,
            outlineColor: -2,
        };
        var surface1 = {
            background: base.background + 1,
            backgroundHover: base.backgroundHover + 1,
            backgroundPress: base.backgroundPress + 1,
            backgroundFocus: base.backgroundFocus + 1,
            borderColor: base.borderColor + 1,
            borderColorHover: base.borderColorHover + 1,
            borderColorFocus: base.borderColorFocus + 1,
            borderColorPress: base.borderColorPress + 1,
        };
        var surface2 = {
            background: base.background + 2,
            backgroundHover: base.backgroundHover + 2,
            backgroundPress: base.backgroundPress + 2,
            backgroundFocus: base.backgroundFocus + 2,
            borderColor: base.borderColor + 2,
            borderColorHover: base.borderColorHover + 2,
            borderColorFocus: base.borderColorFocus + 2,
            borderColorPress: base.borderColorPress + 2,
        };
        var surface3 = {
            background: base.background + 3,
            backgroundHover: base.backgroundHover + 3,
            backgroundPress: base.backgroundPress + 3,
            backgroundFocus: base.backgroundFocus + 3,
            borderColor: base.borderColor + 3,
            borderColorHover: base.borderColorHover + 3,
            borderColorFocus: base.borderColorFocus + 3,
            borderColorPress: base.borderColorPress + 3,
        };
        var surfaceActiveBg = {
            background: base.background + 5,
            backgroundHover: base.background + 5,
            backgroundPress: base.backgroundPress + 5,
            backgroundFocus: base.backgroundFocus + 5,
        };
        var surfaceActive = __assign(__assign({}, surfaceActiveBg), { 
            // match border to background when active
            borderColor: surfaceActiveBg.background, borderColorHover: surfaceActiveBg.backgroundHover, borderColorFocus: surfaceActiveBg.backgroundFocus, borderColorPress: surfaceActiveBg.backgroundPress });
        var inverseSurface1 = {
            color: surface1.background,
            colorHover: surface1.backgroundHover,
            colorPress: surface1.backgroundPress,
            colorFocus: surface1.backgroundFocus,
            background: base.color,
            backgroundHover: base.colorHover,
            backgroundPress: base.colorPress,
            backgroundFocus: base.colorFocus,
            borderColor: base.color - 2,
            borderColorHover: base.color - 3,
            borderColorFocus: base.color - 4,
            borderColorPress: base.color - 5,
        };
        var inverseActive = __assign(__assign({}, inverseSurface1), { background: base.color - 2, backgroundHover: base.colorHover - 2, backgroundPress: base.colorPress - 2, backgroundFocus: base.colorFocus - 2, borderColor: base.color - 2 - 2, borderColorHover: base.color - 3 - 2, borderColorFocus: base.color - 4 - 2, borderColorPress: base.color - 5 - 2 });
        var alt1 = {
            color: base.color - 1,
            colorHover: base.colorHover - 1,
            colorPress: base.colorPress - 1,
            colorFocus: base.colorFocus - 1,
        };
        var alt2 = {
            color: base.color - 2,
            colorHover: base.colorHover - 2,
            colorPress: base.colorPress - 2,
            colorFocus: base.colorFocus - 2,
        };
        return {
            base: base,
            alt1: alt1,
            alt2: alt2,
            surface1: surface1,
            surface2: surface2,
            surface3: surface3,
            inverseSurface1: inverseSurface1,
            inverseActive: inverseActive,
            surfaceActive: surfaceActive,
        };
    };
    var lightTemplates = getBaseTemplates('light');
    var darkTemplates = getBaseTemplates('dark');
    var templates = __assign(__assign({}, (0, theme_builder_1.objectFromEntries)((0, utils_1.objectKeys)(lightTemplates).map(function (name) { return ["light_".concat(name), lightTemplates[name]]; }))), (0, theme_builder_1.objectFromEntries)((0, utils_1.objectKeys)(darkTemplates).map(function (name) { return ["dark_".concat(name), darkTemplates[name]]; })));
    return templates;
};
exports.defaultTemplates = getTemplates();
var shadows = {
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
var nonInherited = {
    light: __assign(__assign({}, lightColors), shadows.light),
    dark: __assign(__assign({}, darkColors), shadows.dark),
};
var overlayThemeDefinitions = [
    {
        parent: 'light',
        theme: {
            background: 'rgba(0,0,0,0.5)',
        },
    },
    {
        parent: 'dark',
        theme: {
            background: 'rgba(0,0,0,0.8)',
        },
    },
];
var inverseSurface1 = [
    {
        parent: 'active',
        template: 'inverseActive',
    },
    {
        parent: '',
        template: 'inverseSurface1',
    },
];
var surface1 = [
    {
        parent: 'active',
        template: 'surfaceActive',
    },
    {
        parent: '',
        template: 'surface1',
    },
];
var surface2 = [
    {
        parent: 'active',
        template: 'surfaceActive',
    },
    {
        parent: '',
        template: 'surface2',
    },
];
var surface3 = [
    {
        parent: 'active',
        template: 'surfaceActive',
    },
    {
        parent: '',
        template: 'surface3',
    },
];
/**
 * These are optional themes that serve as defaults for components. They don't
 * change color1 through color12 just "generic" properties like color,
 * background, borderColor.
 *
 * They can be overridden with the theme prop, or left out entirely for
 * "un-themed" components.

 */
exports.defaultComponentThemes = {
    ListItem: {
        template: 'surface1',
    },
    SelectTrigger: surface1,
    Card: surface1,
    Button: surface3,
    Checkbox: surface2,
    Switch: surface2,
    SwitchThumb: inverseSurface1,
    TooltipContent: surface2,
    Progress: {
        template: 'surface1',
    },
    RadioGroupItem: surface2,
    TooltipArrow: {
        template: 'surface1',
    },
    SliderTrackActive: {
        template: 'surface3',
    },
    SliderTrack: {
        template: 'surface1',
    },
    SliderThumb: inverseSurface1,
    Tooltip: inverseSurface1,
    ProgressIndicator: inverseSurface1,
    SheetOverlay: overlayThemeDefinitions,
    DialogOverlay: overlayThemeDefinitions,
    ModalOverlay: overlayThemeDefinitions,
    Input: surface1,
    TextArea: surface1,
};
/**
 * These are useful for states (alt gets more subtle as it goes up) or emphasis
 * (surface gets more contrasted from the background as it goes up)
 */
exports.defaultSubThemes = {
    alt1: {
        template: 'alt1',
    },
    alt2: {
        template: 'alt2',
    },
    active: {
        template: 'surface3',
    },
    surface1: {
        template: 'surface1',
    },
    surface2: {
        template: 'surface2',
    },
    surface3: {
        template: 'surface3',
    },
    surface4: {
        template: 'surfaceActive',
    },
};
// --- themeBuilder ---
var themeBuilder = (0, theme_builder_1.createThemeBuilder)()
    .addPalettes(exports.defaultPalettes)
    .addTemplates(exports.defaultTemplates)
    .addThemes({
    light: {
        template: 'base',
        palette: 'light',
        nonInheritedValues: nonInherited.light,
    },
    dark: {
        template: 'base',
        palette: 'dark',
        nonInheritedValues: nonInherited.dark,
    },
})
    .addChildThemes({
    orange: {
        palette: 'orange',
        template: 'base',
    },
    yellow: {
        palette: 'yellow',
        template: 'base',
    },
    green: {
        palette: 'green',
        template: 'base',
    },
    blue: {
        palette: 'blue',
        template: 'base',
    },
    purple: {
        palette: 'purple',
        template: 'base',
    },
    pink: {
        palette: 'pink',
        template: 'base',
    },
    red: {
        palette: 'red',
        template: 'base',
    },
    gray: {
        palette: 'gray',
        template: 'base',
    },
})
    .addChildThemes(exports.defaultSubThemes)
    .addComponentThemes(exports.defaultComponentThemes, {
    avoidNestingWithin: ['alt1', 'alt2', 'surface1', 'surface2', 'surface3', 'surface4'],
});
// --- themes ---
var themesIn = themeBuilder.build();
exports.themes = themesIn;
// -- tokens ---
exports.tokens = (0, web_1.createTokens)(__assign({ color: color }, v3_tokens_1.tokens));
