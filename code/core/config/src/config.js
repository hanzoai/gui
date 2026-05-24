"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configWithoutAnimations = void 0;
var shorthands_1 = require("@hanzogui/shorthands");
var themes_1 = require("@hanzogui/themes");
var fonts_1 = require("./fonts");
var media_1 = require("./media");
exports.configWithoutAnimations = {
    themes: themes_1.themes,
    media: media_1.media,
    shorthands: shorthands_1.shorthands,
    tokens: themes_1.tokens,
    fonts: fonts_1.fonts,
    selectionStyles: function (theme) {
        return theme.color5
            ? {
                backgroundColor: theme.color5,
                color: theme.color11,
            }
            : null;
    },
    settings: {
        defaultFont: 'body',
        shouldAddPrefersColorThemes: true,
        mediaQueryDefaultActive: media_1.mediaQueryDefaultActive,
    },
};
