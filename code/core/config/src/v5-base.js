"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.settings = exports.selectionStyles = exports.mediaQueryDefaultActive = exports.media = exports.breakpoints = exports.fonts = exports.createSystemFont = exports.tokens = exports.parseHSL = exports.opacify = exports.interpolateColor = exports.hslToString = exports.defaultLightPalette = exports.defaultDarkPalette = exports.defaultChildrenThemes = exports.createV5Theme = exports.adjustPalettes = exports.adjustPalette = exports.createThemes = exports.shorthands = void 0;
var v4_1 = require("@hanzogui/shorthands/v4"); // v4 same as v5
var v5_1 = require("@hanzogui/themes/v5");
var v5_fonts_1 = require("./v5-fonts");
var v5_media_1 = require("./v5-media");
var v4_2 = require("@hanzogui/shorthands/v4");
Object.defineProperty(exports, "shorthands", { enumerable: true, get: function () { return v4_2.shorthands; } });
var theme_builder_1 = require("@hanzogui/theme-builder");
Object.defineProperty(exports, "createThemes", { enumerable: true, get: function () { return theme_builder_1.createThemes; } });
var v5_2 = require("@hanzogui/themes/v5");
Object.defineProperty(exports, "adjustPalette", { enumerable: true, get: function () { return v5_2.adjustPalette; } });
Object.defineProperty(exports, "adjustPalettes", { enumerable: true, get: function () { return v5_2.adjustPalettes; } });
Object.defineProperty(exports, "createV5Theme", { enumerable: true, get: function () { return v5_2.createV5Theme; } });
Object.defineProperty(exports, "defaultChildrenThemes", { enumerable: true, get: function () { return v5_2.defaultChildrenThemes; } });
Object.defineProperty(exports, "defaultDarkPalette", { enumerable: true, get: function () { return v5_2.defaultDarkPalette; } });
Object.defineProperty(exports, "defaultLightPalette", { enumerable: true, get: function () { return v5_2.defaultLightPalette; } });
Object.defineProperty(exports, "hslToString", { enumerable: true, get: function () { return v5_2.hslToString; } });
// helpers
Object.defineProperty(exports, "interpolateColor", { enumerable: true, get: function () { return v5_2.interpolateColor; } });
Object.defineProperty(exports, "opacify", { enumerable: true, get: function () { return v5_2.opacify; } });
Object.defineProperty(exports, "parseHSL", { enumerable: true, get: function () { return v5_2.parseHSL; } });
Object.defineProperty(exports, "tokens", { enumerable: true, get: function () { return v5_2.tokens; } });
var v5_fonts_2 = require("./v5-fonts");
Object.defineProperty(exports, "createSystemFont", { enumerable: true, get: function () { return v5_fonts_2.createSystemFont; } });
Object.defineProperty(exports, "fonts", { enumerable: true, get: function () { return v5_fonts_2.fonts; } });
var v5_media_2 = require("./v5-media");
Object.defineProperty(exports, "breakpoints", { enumerable: true, get: function () { return v5_media_2.breakpoints; } });
Object.defineProperty(exports, "media", { enumerable: true, get: function () { return v5_media_2.media; } });
Object.defineProperty(exports, "mediaQueryDefaultActive", { enumerable: true, get: function () { return v5_media_2.mediaQueryDefaultActive; } });
var selectionStyles = function (theme) {
    return theme.color5
        ? {
            backgroundColor: theme.color5,
            color: theme.color11,
        }
        : null;
};
exports.selectionStyles = selectionStyles;
exports.settings = {
    mediaQueryDefaultActive: v5_media_1.mediaQueryDefaultActive,
    defaultFont: 'body',
    fastSchemeChange: true,
    shouldAddPrefersColorThemes: true,
    allowedStyleValues: 'somewhat-strict-web',
    addThemeClassName: 'html',
    onlyAllowShorthands: true,
    styleCompat: 'react-native',
};
// base config without animations - users must provide their own
exports.defaultConfig = {
    media: v5_media_1.media,
    shorthands: v4_1.shorthands,
    themes: v5_1.themes,
    tokens: v5_1.tokens,
    fonts: v5_fonts_1.fonts,
    selectionStyles: exports.selectionStyles,
    settings: exports.settings,
};
