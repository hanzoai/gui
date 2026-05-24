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
exports.themes = exports.defaultChildrenThemes = exports.defaultLightPalette = exports.defaultDarkPalette = exports.v5GrandchildrenThemes = exports.v5ComponentThemesWithInverses = exports.v5ComponentThemes = exports.opacify = exports.interpolateColor = exports.V5_BG_OFFSET = void 0;
exports.parseHSL = parseHSL;
exports.parseHex = parseHex;
exports.parseColor = parseColor;
exports.hslToString = hslToString;
exports.adjustPalette = adjustPalette;
exports.adjustPalettes = adjustPalettes;
exports.createV5Theme = createV5Theme;
var colors_1 = require("@hanzogui/colors");
var theme_builder_1 = require("@hanzogui/theme-builder");
var opacify_1 = require("./opacify");
var v5_templates_1 = require("./v5-templates");
// base theme uses elevated background (like old surface1)
// this offset aligns getTheme's palette index with that elevation
exports.V5_BG_OFFSET = 6 + 1;
// re-export color utilities for users
var opacify_2 = require("./opacify");
Object.defineProperty(exports, "interpolateColor", { enumerable: true, get: function () { return opacify_2.interpolateColor; } });
Object.defineProperty(exports, "opacify", { enumerable: true, get: function () { return opacify_2.opacify; } });
exports.v5ComponentThemes = {
    Button: { template: 'surface2' },
    Input: { template: 'surface1' },
    Progress: { template: 'surface1' },
    ProgressIndicator: { template: 'surface3' },
    Slider: { template: 'surface1' },
    SliderActive: { template: 'surface3' },
    SliderThumb: { template: 'surface2' },
    Switch: { template: 'surface2' },
    TextArea: { template: 'surface1' },
    Tooltip: { template: 'accent' },
    SwitchThumb: { template: 'accent' },
};
// inverses are confusing af
exports.v5ComponentThemesWithInverses = __assign(__assign({}, exports.v5ComponentThemes), { ProgressIndicator: { template: 'accent' }, SliderThumb: { template: 'accent' }, Tooltip: { template: 'accent' } });
/** Default grandchildren themes available in v5 */
exports.v5GrandchildrenThemes = {
    accent: { template: 'accent' },
    surface1: { template: 'surface1' },
    surface2: { template: 'surface2' },
};
/** parse hsl string to HSL object */
function parseHSL(str) {
    var m = str.match(/hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/);
    return m ? { h: +m[1], s: +m[2], l: +m[3] } : null;
}
/** parse hex color to HSL object */
function parseHex(str) {
    if (!str.startsWith('#'))
        return null;
    var hex = str.slice(1);
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map(function (c) { return c + c; })
            .join('');
    }
    if (hex.length !== 6)
        return null;
    var r = Number.parseInt(hex.slice(0, 2), 16) / 255;
    var g = Number.parseInt(hex.slice(2, 4), 16) / 255;
    var b = Number.parseInt(hex.slice(4, 6), 16) / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var l = (max + min) / 2;
    if (max === min) {
        return { h: 0, s: 0, l: l * 100 };
    }
    var d = max - min;
    var s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    var h = 0;
    if (max === r)
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g)
        h = ((b - r) / d + 2) / 6;
    else
        h = ((r - g) / d + 4) / 6;
    return { h: Math.round(h * 360), s: s * 100, l: l * 100 };
}
/** parse any color format to HSL */
function parseColor(str) {
    var _a;
    return (_a = parseHSL(str)) !== null && _a !== void 0 ? _a : parseHex(str);
}
function hslToString(hsl) {
    return "hsl(".concat(hsl.h, ", ").concat(Math.round(Math.min(100, Math.max(0, hsl.s))), "%, ").concat(Math.round(Math.min(100, Math.max(0, hsl.l))), "%)");
}
/** adjust a palette of colors (hsl or hex) using a callback */
function adjustPalette(palette, fn) {
    var out = {};
    var keys = Object.keys(palette);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var parsed = parseColor(palette[key]);
        if (!parsed) {
            out[key] = palette[key];
            continue;
        }
        out[key] = hslToString(fn(parsed, i + 1));
    }
    return out;
}
var identity = function (hsl) { return hsl; };
/**
 * Adjust color palettes using callback functions.
 *
 * @example
 * const adjusted = adjustPalettes(defaultChildrenThemes, {
 *   default: {
 *     light: (hsl, i) => ({ ...hsl, s: hsl.s * 0.8 }),
 *     dark: (hsl, i) => ({ ...hsl, s: hsl.s * 0.5, l: hsl.l * 0.9 }),
 *   },
 *   yellow: {
 *     light: (hsl, i) => ({ ...hsl, s: hsl.s * 0.5 }),
 *   },
 * })
 */
function adjustPalettes(themes, adjustments) {
    var _a, _b, _c;
    var result = {};
    for (var _i = 0, _d = Object.entries(themes); _i < _d.length; _i++) {
        var _e = _d[_i], name_1 = _e[0], theme = _e[1];
        var adj = (_a = adjustments[name_1]) !== null && _a !== void 0 ? _a : adjustments.default;
        if (!adj) {
            ;
            result[name_1] = theme;
            continue;
        }
        ;
        result[name_1] = {
            light: adjustPalette(theme.light, (_b = adj.light) !== null && _b !== void 0 ? _b : identity),
            dark: adjustPalette(theme.dark, (_c = adj.dark) !== null && _c !== void 0 ? _c : identity),
        };
    }
    return result;
}
// component themes removed in v5 - use defaultProps in your config instead
// see: https://hanzogui.dev/docs/core/config-v5#migrating-from-component-themes
/** Generate named colors from a palette: ['#fff', ...] -> { name1: '#fff', name2: ... } */
function paletteToNamedColors(name, palette) {
    return Object.fromEntries(palette.map(function (color, i) { return ["".concat(name).concat(i + 1), color]; }));
}
// Base palettes
var darkPalette = [
    '#090909',
    '#151515',
    '#191919',
    '#232323',
    '#333',
    '#444',
    '#666',
    '#777',
    '#858585',
    '#aaa',
    '#ccc',
    '#ffffff',
];
exports.defaultDarkPalette = darkPalette;
var lightPalette = [
    '#fff',
    '#f8f8f8',
    'hsl(0, 0%, 93%)',
    'hsl(0, 0%, 85%)',
    'hsl(0, 0%, 80%)',
    'hsl(0, 0%, 70%)',
    'hsl(0, 0%, 59%)',
    'hsl(0, 0%, 45%)',
    'hsl(0, 0%, 30%)',
    'hsl(0, 0%, 20%)',
    'hsl(0, 0%, 14%)',
    'hsl(0, 0%, 2%)',
];
exports.defaultLightPalette = lightPalette;
/** Neutral grey - sufficient contrast on both white and black backgrounds */
var neutralPalette = [
    'hsl(0, 0%, 68%)',
    'hsl(0, 0%, 65%)',
    'hsl(0, 0%, 62%)',
    'hsl(0, 0%, 59%)',
    'hsl(0, 0%, 56%)',
    'hsl(0, 0%, 53%)',
    'hsl(0, 0%, 50%)',
    'hsl(0, 0%, 47%)',
    'hsl(0, 0%, 44%)',
    'hsl(0, 0%, 41%)',
    'hsl(0, 0%, 38%)',
    'hsl(0, 0%, 32%)',
];
// Generate neutral colors from palette (used in defaultChildrenThemes)
var neutral = paletteToNamedColors('neutral', neutralPalette);
// Constants for forcing white/black with opacity variants
var whiteBlack = {
    white: 'rgba(255,255,255,1)',
    white0: 'rgba(255,255,255,0)',
    white02: 'rgba(255,255,255,0.2)',
    white04: 'rgba(255,255,255,0.4)',
    white06: 'rgba(255,255,255,0.6)',
    white08: 'rgba(255,255,255,0.8)',
    black: 'rgba(0,0,0,1)',
    black0: 'rgba(0,0,0,0)',
    black02: 'rgba(0,0,0,0.2)',
    black04: 'rgba(0,0,0,0.4)',
    black06: 'rgba(0,0,0,0.6)',
    black08: 'rgba(0,0,0,0.8)',
};
var darkShadows = {
    shadow1: 'rgba(0,0,0,0.15)',
    shadow2: 'rgba(0,0,0,0.23)',
    shadow3: 'rgba(0,0,0,0.33)',
    shadow4: 'rgba(0,0,0,0.45)',
    shadow5: 'rgba(0,0,0,0.65)',
    shadow6: 'rgba(0,0,0,0.8)',
    shadow7: 'rgba(0,0,0,0.9)',
    shadow8: 'rgba(0,0,0,1)',
};
var lightShadows = {
    shadow1: 'rgba(0,0,0,0.04)',
    shadow2: 'rgba(0,0,0,0.08)',
    shadow3: 'rgba(0,0,0,0.12)',
    shadow4: 'rgba(0,0,0,0.22)',
    shadow5: 'rgba(0,0,0,0.33)',
    shadow6: 'rgba(0,0,0,0.44)',
    shadow7: 'rgba(0,0,0,0.6)',
    shadow8: 'rgba(0,0,0,0.75)',
};
var darkHighlights = {
    highlight1: 'rgba(255,255,255,0.1)',
    highlight2: 'rgba(255,255,255,0.2)',
    highlight3: 'rgba(255,255,255,0.3)',
    highlight4: 'rgba(255,255,255,0.45)',
    highlight5: 'rgba(255,255,255,0.65)',
    highlight6: 'rgba(255,255,255,0.85)',
    highlight7: 'rgba(255,255,255,0.95)',
    highlight8: 'rgba(255,255,255,1)',
};
var lightHighlights = {
    highlight1: 'rgba(255,255,255,0.05)',
    highlight2: 'rgba(255,255,255,0.1)',
    highlight3: 'rgba(255,255,255,0.15)',
    highlight4: 'rgba(255,255,255,0.3)',
    highlight5: 'rgba(255,255,255,0.4)',
    highlight6: 'rgba(255,255,255,0.55)',
    highlight7: 'rgba(255,255,255,0.7)',
    highlight8: 'rgba(255,255,255,0.85)',
};
/** Default children themes - accepts radix colors directly */
exports.defaultChildrenThemes = {
    gray: { light: colors_1.gray, dark: colors_1.grayDark },
    blue: { light: colors_1.blue, dark: colors_1.blueDark },
    red: { light: colors_1.red, dark: colors_1.redDark },
    yellow: { light: colors_1.yellow, dark: colors_1.yellowDark },
    green: { light: colors_1.green, dark: colors_1.greenDark },
    orange: { light: colors_1.orange, dark: colors_1.orangeDark },
    pink: { light: colors_1.pink, dark: colors_1.pinkDark },
    purple: { light: colors_1.purple, dark: colors_1.purpleDark },
    teal: { light: colors_1.teal, dark: colors_1.tealDark },
    neutral: { light: neutral, dark: neutral },
};
function getDefaultV5ThemeValues(_a) {
    var palette = _a.palette;
    if (!palette || palette.length < 3) {
        throw new Error("invalid palette: ".concat(JSON.stringify(palette)));
    }
    var bgColor = palette[exports.V5_BG_OFFSET];
    var fgColor = palette[palette.length - 2];
    return {
        color01: (0, opacify_1.opacify)(fgColor, 0.1),
        color0075: (0, opacify_1.opacify)(fgColor, 0.075),
        color005: (0, opacify_1.opacify)(fgColor, 0.05),
        color0025: (0, opacify_1.opacify)(fgColor, 0.025),
        color002: (0, opacify_1.opacify)(fgColor, 0.02),
        color001: (0, opacify_1.opacify)(fgColor, 0.01),
        background01: (0, opacify_1.opacify)(bgColor, 0.1),
        background0075: (0, opacify_1.opacify)(bgColor, 0.075),
        background005: (0, opacify_1.opacify)(bgColor, 0.05),
        background0025: (0, opacify_1.opacify)(bgColor, 0.025),
        background002: (0, opacify_1.opacify)(bgColor, 0.02),
        background001: (0, opacify_1.opacify)(bgColor, 0.01),
        background02: (0, opacify_1.opacify)(bgColor, 0.2),
        background04: (0, opacify_1.opacify)(bgColor, 0.4),
        background06: (0, opacify_1.opacify)(bgColor, 0.6),
        background08: (0, opacify_1.opacify)(bgColor, 0.8),
        outlineColor: (0, opacify_1.opacify)(palette[exports.V5_BG_OFFSET + 4], 0.6),
    };
}
/**
 * Creates v5 themes with optional customizations.
 *
 * @example
 * Use default themes
 * const themes = createV5Theme()
 *
 * @example
 * Custom children themes with brand color (accepts radix colors directly)
 * const themes = createV5Theme({
 *   childrenThemes: {
 *     ...defaultChildrenThemes,
 *     brand: { light: brandLight, dark: brandDark },
 *   },
 * })
 *
 * @example
 * Minimal - no color themes
 * const themes = createV5Theme({
 *   childrenThemes: {},
 * })
 */
function createV5Theme(options) {
    if (options === void 0) { options = {}; }
    var _a = options.darkPalette, customDarkPalette = _a === void 0 ? darkPalette : _a, _b = options.lightPalette, customLightPalette = _b === void 0 ? lightPalette : _b, customAccent = options.accent, _c = options.childrenThemes, childrenThemes = _c === void 0 ? exports.defaultChildrenThemes : _c, _d = options.grandChildrenThemes, grandChildrenThemes = _d === void 0 ? exports.v5GrandchildrenThemes : _d, _e = options.componentThemes, customComponentThemes = _e === void 0 ? exports.v5ComponentThemes : _e, userGetTheme = options.getTheme;
    // Generate black/white named colors from palettes
    var blackColors = paletteToNamedColors('black', customDarkPalette);
    var whiteColors = paletteToNamedColors('white', customLightPalette);
    // Build extra colors - spread children color objects directly (types flow naturally)
    // Note: opacity/interpolation colors (color01, background01, etc.) are computed by getTheme
    var extraBase = __assign(__assign(__assign({}, blackColors), whiteColors), whiteBlack);
    var lightExtraBase = __assign(__assign(__assign(__assign({}, extraBase), lightShadows), lightHighlights), { shadowColor: lightShadows.shadow3 });
    var darkExtraBase = __assign(__assign(__assign(__assign({}, extraBase), darkShadows), darkHighlights), { shadowColor: darkShadows.shadow3 });
    var lightExtra = __assign({}, lightExtraBase);
    var darkExtra = __assign({}, darkExtraBase);
    for (var _i = 0, _f = Object.values(childrenThemes); _i < _f.length; _i++) {
        var theme = _f[_i];
        if (theme.light)
            Object.assign(lightExtra, theme.light);
        if (theme.dark)
            Object.assign(darkExtra, theme.dark);
    }
    // Convert children to palette format for createThemes, adding black/white internally
    var childrenWithPalettes = __assign({ 
        // Always include black/white for theme generation
        black: {
            palette: { dark: Object.values(blackColors), light: Object.values(blackColors) },
        }, white: {
            palette: { dark: Object.values(whiteColors), light: Object.values(whiteColors) },
        } }, Object.fromEntries(Object.entries(childrenThemes).map(function (_a) {
        var name = _a[0], theme = _a[1];
        return [
            name,
            {
                palette: {
                    light: Object.values(theme.light),
                    dark: Object.values(theme.dark),
                },
            },
        ];
    })));
    return (0, theme_builder_1.createThemes)({
        // componentThemes: false disables them, undefined/truthy values enable them
        componentThemes: customComponentThemes,
        templates: v5_templates_1.v5Templates,
        base: {
            palette: {
                dark: customDarkPalette,
                light: customLightPalette,
            },
            extra: {
                light: lightExtra,
                dark: darkExtra,
            },
        },
        accent: {
            palette: customAccent
                ? {
                    light: Object.values(customAccent.light),
                    dark: Object.values(customAccent.dark),
                }
                : {
                    dark: customLightPalette,
                    light: customDarkPalette,
                },
        },
        childrenThemes: childrenWithPalettes,
        grandChildrenThemes: grandChildrenThemes,
        getTheme: function (props) {
            var builtInTheme = getDefaultV5ThemeValues(props);
            var customTheme = userGetTheme === null || userGetTheme === void 0 ? void 0 : userGetTheme(props);
            return (customTheme ? __assign(__assign({}, builtInTheme), customTheme) : builtInTheme);
        },
    });
}
// Default themes using the createV5Theme function
exports.themes = createV5Theme();
// don't remove this - type sanity checks - these should not cause type errors:
exports.themes.dark.background0075;
exports.themes.dark_yellow.background0075;
exports.themes.dark.background;
exports.themes.dark.accent1;
// @ts-expect-error
exports.themes.dark.nonValid;
