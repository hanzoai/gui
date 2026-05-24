"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.selectionStyles = exports.mediaQueryDefaultActive = exports.media = exports.fonts = exports.themes = exports.tokens = exports.animations = exports.shorthands = void 0;
var v3_themes_1 = require("@hanzogui/themes/v3-themes");
var v3_animations_1 = require("./v3-animations");
var fonts_1 = require("./fonts");
var media_1 = require("./media");
// fix vite - react native uses global which it doesn't provide
globalThis['global'] || (globalThis['global'] = globalThis);
// v3 shorthands (inlined from deprecated @hanzogui/shorthands/v2)
exports.shorthands = {
    ussel: 'userSelect',
    cur: 'cursor',
    pe: 'pointerEvents',
    col: 'color',
    ff: 'fontFamily',
    fos: 'fontSize',
    fost: 'fontStyle',
    fow: 'fontWeight',
    ls: 'letterSpacing',
    lh: 'lineHeight',
    ta: 'textAlign',
    tt: 'textTransform',
    ww: 'wordWrap',
    ac: 'alignContent',
    ai: 'alignItems',
    als: 'alignSelf',
    b: 'bottom',
    bg: 'backgroundColor',
    bbc: 'borderBottomColor',
    bblr: 'borderBottomLeftRadius',
    bbrr: 'borderBottomRightRadius',
    bbw: 'borderBottomWidth',
    blc: 'borderLeftColor',
    blw: 'borderLeftWidth',
    bc: 'borderColor',
    br: 'borderRadius',
    bs: 'borderStyle',
    brw: 'borderRightWidth',
    brc: 'borderRightColor',
    btc: 'borderTopColor',
    btlr: 'borderTopLeftRadius',
    btrr: 'borderTopRightRadius',
    btw: 'borderTopWidth',
    bw: 'borderWidth',
    dsp: 'display',
    f: 'flex',
    fb: 'flexBasis',
    fd: 'flexDirection',
    fg: 'flexGrow',
    fs: 'flexShrink',
    fw: 'flexWrap',
    h: 'height',
    jc: 'justifyContent',
    l: 'left',
    m: 'margin',
    mah: 'maxHeight',
    maw: 'maxWidth',
    mb: 'marginBottom',
    mih: 'minHeight',
    miw: 'minWidth',
    ml: 'marginLeft',
    mr: 'marginRight',
    mt: 'marginTop',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    o: 'opacity',
    ov: 'overflow',
    p: 'padding',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pos: 'position',
    pr: 'paddingRight',
    pt: 'paddingTop',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    r: 'right',
    shac: 'shadowColor',
    shar: 'shadowRadius',
    shof: 'shadowOffset',
    shop: 'shadowOpacity',
    t: 'top',
    w: 'width',
    zi: 'zIndex',
};
var v3_animations_2 = require("./v3-animations");
Object.defineProperty(exports, "animations", { enumerable: true, get: function () { return v3_animations_2.animations; } });
var v3_themes_2 = require("@hanzogui/themes/v3-themes");
Object.defineProperty(exports, "tokens", { enumerable: true, get: function () { return v3_themes_2.tokens; } });
Object.defineProperty(exports, "themes", { enumerable: true, get: function () { return v3_themes_2.themes; } });
var fonts_2 = require("./fonts");
Object.defineProperty(exports, "fonts", { enumerable: true, get: function () { return fonts_2.fonts; } });
var media_2 = require("./media");
Object.defineProperty(exports, "media", { enumerable: true, get: function () { return media_2.media; } });
Object.defineProperty(exports, "mediaQueryDefaultActive", { enumerable: true, get: function () { return media_2.mediaQueryDefaultActive; } });
var selectionStyles = function (theme) {
    return theme.color5
        ? {
            backgroundColor: theme.color5,
            color: theme.color11,
        }
        : null;
};
exports.selectionStyles = selectionStyles;
// tree shake away themes in production
var themes = process.env.TAMAGUI_OPTIMIZE_THEMES === 'true' ? {} : v3_themes_1.themes;
exports.config = {
    animations: v3_animations_1.animations,
    themes: themes,
    media: media_1.media,
    shorthands: exports.shorthands,
    tokens: v3_themes_1.tokens,
    fonts: fonts_1.fonts,
    selectionStyles: exports.selectionStyles,
    settings: {
        mediaQueryDefaultActive: media_1.mediaQueryDefaultActive,
        defaultFont: 'body',
        fastSchemeChange: true,
        shouldAddPrefersColorThemes: true,
    },
};
