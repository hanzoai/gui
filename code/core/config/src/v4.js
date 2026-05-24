"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.settings = exports.selectionStyles = exports.themes = exports.mediaQueryDefaultActive = exports.media = exports.breakpoints = exports.fonts = exports.createSystemFont = exports.animations = exports.tokens = exports.hanzoguiThemes = exports.createThemes = exports.shorthands = void 0;
var v4_1 = require("@hanzogui/shorthands/v4");
var v4_2 = require("@hanzogui/themes/v4");
var v3_animations_1 = require("./v3-animations");
var v4_fonts_1 = require("./v4-fonts");
var v4_media_1 = require("./v4-media");
var v4_3 = require("@hanzogui/shorthands/v4");
Object.defineProperty(exports, "shorthands", { enumerable: true, get: function () { return v4_3.shorthands; } });
var theme_builder_1 = require("@hanzogui/theme-builder");
Object.defineProperty(exports, "createThemes", { enumerable: true, get: function () { return theme_builder_1.createThemes; } });
var v4_4 = require("@hanzogui/themes/v4");
Object.defineProperty(exports, "hanzoguiThemes", { enumerable: true, get: function () { return v4_4.hanzoguiThemes; } });
Object.defineProperty(exports, "tokens", { enumerable: true, get: function () { return v4_4.tokens; } });
var v4_animations_1 = require("./v4-animations");
Object.defineProperty(exports, "animations", { enumerable: true, get: function () { return v4_animations_1.animations; } });
var v4_fonts_2 = require("./v4-fonts");
Object.defineProperty(exports, "createSystemFont", { enumerable: true, get: function () { return v4_fonts_2.createSystemFont; } });
Object.defineProperty(exports, "fonts", { enumerable: true, get: function () { return v4_fonts_2.fonts; } });
var v4_media_2 = require("./v4-media");
Object.defineProperty(exports, "breakpoints", { enumerable: true, get: function () { return v4_media_2.breakpoints; } });
Object.defineProperty(exports, "media", { enumerable: true, get: function () { return v4_media_2.media; } });
Object.defineProperty(exports, "mediaQueryDefaultActive", { enumerable: true, get: function () { return v4_media_2.mediaQueryDefaultActive; } });
var v4_5 = require("@hanzogui/themes/v4");
Object.defineProperty(exports, "themes", { enumerable: true, get: function () { return v4_5.defaultThemes; } });
// Configuration:
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
    mediaQueryDefaultActive: v4_media_1.mediaQueryDefaultActive,
    defaultFont: 'body',
    fastSchemeChange: true,
    shouldAddPrefersColorThemes: true,
    allowedStyleValues: 'somewhat-strict-web',
    addThemeClassName: 'html',
    onlyAllowShorthands: true,
    styleCompat: 'legacy',
    defaultPosition: 'relative',
};
exports.defaultConfig = {
    animations: v3_animations_1.animations,
    media: v4_media_1.media,
    shorthands: v4_1.shorthands,
    themes: v4_2.defaultThemes,
    tokens: v4_2.tokens,
    fonts: v4_fonts_1.fonts,
    selectionStyles: exports.selectionStyles,
    settings: exports.settings,
};
