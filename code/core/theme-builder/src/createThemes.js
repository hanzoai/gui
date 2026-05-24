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
exports.getComponentThemes = exports.getLastBuilder = void 0;
exports.createThemes = createThemes;
exports.createV4Themes = createV4Themes;
exports.createSimpleThemeBuilder = createSimpleThemeBuilder;
exports.createPalettes = createPalettes;
exports.createV4ThemeBuilder = createV4ThemeBuilder;
var color2k_1 = require("color2k");
var defaultComponentThemes_1 = require("./defaultComponentThemes");
var defaultTemplates_1 = require("./defaultTemplates");
var getThemeSuitePalettes_1 = require("./getThemeSuitePalettes");
var ThemeBuilder_1 = require("./ThemeBuilder");
// Implementation
function createThemes(props) {
    var accent = props.accent, childrenThemes = props.childrenThemes, grandChildrenThemes = props.grandChildrenThemes, _a = props.templates, templates = _a === void 0 ? defaultTemplates_1.defaultTemplates : _a, componentThemes = props.componentThemes, getTheme = props.getTheme;
    var builder = createSimpleThemeBuilder({
        extra: props.base.extra,
        accentExtra: accent === null || accent === void 0 ? void 0 : accent.extra,
        componentThemes: componentThemes,
        palettes: createPalettes(getThemesPalettes(props)),
        templates: templates,
        accentTheme: !!accent,
        childrenThemes: normalizeSubThemes(childrenThemes),
        grandChildrenThemes: (grandChildrenThemes
            ? normalizeSubThemes(grandChildrenThemes)
            : undefined),
        getTheme: getTheme,
    });
    lastBuilder = builder.themeBuilder;
    return builder.themes;
}
var lastBuilder = null;
var getLastBuilder = function () { return lastBuilder; };
exports.getLastBuilder = getLastBuilder;
/**
 * V4 version of createThemes - uses v4 theme ordering for backwards compatibility.
 * Use this for v4 themes (like v4-hanzogui.ts).
 */
function createV4Themes(props) {
    var accent = props.accent, childrenThemes = props.childrenThemes, grandChildrenThemes = props.grandChildrenThemes, _a = props.templates, templates = _a === void 0 ? defaultTemplates_1.defaultTemplates : _a, componentThemes = props.componentThemes, getTheme = props.getTheme;
    var builder = createV4ThemeBuilder({
        extra: props.base.extra,
        accentExtra: accent === null || accent === void 0 ? void 0 : accent.extra,
        componentThemes: componentThemes,
        palettes: createPalettes(getThemesPalettes(props)),
        templates: templates,
        accentTheme: !!accent,
        childrenThemes: normalizeSubThemes(childrenThemes),
        grandChildrenThemes: (grandChildrenThemes
            ? normalizeSubThemes(grandChildrenThemes)
            : undefined),
        getTheme: getTheme,
    });
    lastBuilder = builder.themeBuilder;
    return builder.themes;
}
function normalizeSubThemes(defs) {
    return Object.fromEntries(Object.entries(defs || {}).map(function (_a) {
        var name = _a[0], value = _a[1];
        var hasPalette = value.palette !== undefined;
        return [
            name,
            __assign(__assign({}, (hasPalette ? { palette: name } : {})), { template: value.template || 'base' }),
        ];
    }));
}
var defaultPalettes = createPalettes(getThemesPalettes({
    base: {
        palette: ['#fff', '#000'],
    },
    accent: {
        palette: ['#ff0000', '#ff9999'],
    },
}));
// a simpler API surface
function createSimpleThemeBuilder(props) {
    var getTheme = props.getTheme, extra = props.extra, accentExtra = props.accentExtra, _a = props.childrenThemes, childrenThemes = _a === void 0 ? null : _a, _b = props.grandChildrenThemes, grandChildrenThemes = _b === void 0 ? null : _b, _c = props.templates, templates = _c === void 0 ? defaultTemplates_1.defaultTemplates : _c, _d = props.palettes, palettes = _d === void 0 ? defaultPalettes : _d, accentTheme = props.accentTheme, _e = props.componentThemes, componentThemes = _e === void 0 ? templates === defaultTemplates_1.defaultTemplates
        ? defaultComponentThemes_1.defaultComponentThemes
        : undefined : _e;
    // start theme-builder
    var themeBuilder = (0, ThemeBuilder_1.createThemeBuilder)()
        .addPalettes(palettes)
        .addTemplates(templates)
        .addThemes({
        light: {
            template: 'base',
            palette: 'light',
            nonInheritedValues: __assign(__assign({}, extra === null || extra === void 0 ? void 0 : extra.light), (accentTheme &&
                palettes.light_accent && {
                accent1: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 0],
                accent2: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 1],
                accent3: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 2],
                accent4: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 3],
                accent5: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 4],
                accent6: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 5],
                accent7: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 6],
                accent8: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 7],
                accent9: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 8],
                accent10: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 9],
                accent11: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 10],
                accent12: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 11],
            })),
        },
        dark: {
            template: 'base',
            palette: 'dark',
            nonInheritedValues: __assign(__assign({}, extra === null || extra === void 0 ? void 0 : extra.dark), (accentTheme &&
                palettes.dark_accent && {
                accent1: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 0],
                accent2: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 1],
                accent3: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 2],
                accent4: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 3],
                accent5: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 4],
                accent6: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 5],
                accent7: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 6],
                accent8: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 7],
                accent9: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 8],
                accent10: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 9],
                accent11: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 10],
                accent12: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 11],
            })),
        },
    });
    // v5 behavior: add accent FIRST, without avoidNestingWithin
    if (palettes.light_accent) {
        themeBuilder = themeBuilder.addChildThemes({
            accent: [
                {
                    parent: 'light',
                    template: 'base',
                    palette: 'light_accent',
                    nonInheritedValues: accentExtra === null || accentExtra === void 0 ? void 0 : accentExtra.light,
                },
                {
                    parent: 'dark',
                    template: 'base',
                    palette: 'dark_accent',
                    nonInheritedValues: accentExtra === null || accentExtra === void 0 ? void 0 : accentExtra.dark,
                },
            ],
        });
    }
    // then add children and grandChildren
    if (childrenThemes) {
        themeBuilder = themeBuilder.addChildThemes(childrenThemes, {
            avoidNestingWithin: ['accent'],
        });
    }
    if (grandChildrenThemes) {
        themeBuilder = themeBuilder.addChildThemes(grandChildrenThemes, {
            avoidNestingWithin: ['accent'],
        });
    }
    if (componentThemes) {
        themeBuilder = themeBuilder.addComponentThemes((0, exports.getComponentThemes)(componentThemes), {
            avoidNestingWithin: Object.keys(grandChildrenThemes || {}),
        });
    }
    if (getTheme) {
        themeBuilder = themeBuilder.getTheme(getTheme);
    }
    return {
        themeBuilder: themeBuilder,
        themes: themeBuilder.build(),
    };
}
function getSchemePalette(colors) {
    return {
        light: colors,
        dark: __spreadArray([], colors, true).reverse(),
    };
}
function getAnchors(palette) {
    var maxIndex = 11;
    var numItems = palette.light.length;
    var anchors = palette.light.map(function (lcolor, index) {
        var dcolor = palette.dark[index];
        var _a = (0, color2k_1.parseToHsla)(lcolor), lhue = _a[0], lsat = _a[1], llum = _a[2], lalpha = _a[3];
        var _b = (0, color2k_1.parseToHsla)(dcolor), dhue = _b[0], dsat = _b[1], dlum = _b[2], dalpha = _b[3];
        return {
            index: spreadIndex(maxIndex, numItems, index),
            hue: { light: lhue, dark: dhue },
            sat: { light: lsat, dark: dsat },
            lum: { light: llum, dark: dlum },
            alpha: { light: lalpha, dark: dalpha },
        };
    });
    return anchors;
}
function spreadIndex(maxIndex, numItems, index) {
    return Math.round((index / (numItems - 1)) * maxIndex);
}
function coerceSimplePaletteToSchemePalette(def) {
    return Array.isArray(def) ? getSchemePalette(def) : def;
}
function getThemesPalettes(props) {
    var base = coerceSimplePaletteToSchemePalette(props.base.palette);
    var accent = props.accent
        ? coerceSimplePaletteToSchemePalette(props.accent.palette)
        : null;
    var baseAnchors = getAnchors(base);
    function getSubThemesPalettes(defs, isGrandChildren) {
        if (isGrandChildren === void 0) { isGrandChildren = false; }
        return Object.fromEntries(Object.entries(defs)
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            // For grandChildren accent without custom palette: skip it entirely
            // It will inherit from parent in the theme builder
            if (isGrandChildren && key === 'accent' && !value.palette) {
                return null;
            }
            return [
                key,
                {
                    name: key,
                    anchors: value.palette
                        ? getAnchors(coerceSimplePaletteToSchemePalette(value.palette))
                        : baseAnchors,
                },
            ];
        })
            .filter(Boolean));
    }
    return __assign(__assign(__assign({ base: {
            name: 'base',
            anchors: baseAnchors,
        } }, (accent && {
        accent: {
            name: 'accent',
            anchors: getAnchors(accent),
        },
    })), (props.childrenThemes && getSubThemesPalettes(props.childrenThemes, false))), (props.grandChildrenThemes &&
        getSubThemesPalettes(props.grandChildrenThemes, true)));
}
var getComponentThemes = function (components) {
    return Object.fromEntries(Object.entries(components).map(function (_a) {
        var componentName = _a[0], template = _a[1].template;
        return [
            componentName,
            {
                parent: '',
                template: template || 'base',
            },
        ];
    }));
};
exports.getComponentThemes = getComponentThemes;
function createPalettes(palettes) {
    var accentPalettes = palettes.accent ? (0, getThemeSuitePalettes_1.getThemeSuitePalettes)(palettes.accent) : null;
    var basePalettes = (0, getThemeSuitePalettes_1.getThemeSuitePalettes)(palettes.base);
    var next = Object.fromEntries(Object.entries(palettes).flatMap(function (_a) {
        var name = _a[0], palette = _a[1];
        var palettes = (0, getThemeSuitePalettes_1.getThemeSuitePalettes)(palette);
        var isAccent = name.startsWith('accent');
        var oppositePalettes = isAccent ? basePalettes : accentPalettes || basePalettes;
        if (!oppositePalettes) {
            return [];
        }
        var oppositeLight = oppositePalettes.light;
        var oppositeDark = oppositePalettes.dark;
        var bgOffset = 7;
        var out = [
            [
                name === 'base' ? 'light' : "light_".concat(name),
                __spreadArray(__spreadArray([
                    oppositeLight[bgOffset]
                ], palettes.light, true), [
                    oppositeLight[oppositeLight.length - bgOffset - 1],
                ], false),
            ],
            [
                name === 'base' ? 'dark' : "dark_".concat(name),
                __spreadArray(__spreadArray([
                    oppositeDark[oppositeDark.length - bgOffset - 1]
                ], palettes.dark, true), [
                    oppositeDark[bgOffset],
                ], false),
            ],
        ];
        return out;
    }));
    return next;
}
/**
 * V4 theme builder - preserves v4 ordering for backwards compatibility:
 * - Children and grandChildren themes are added FIRST
 * - Accent theme is added LAST with avoidNestingWithin for children themes
 *
 * Use this for v4 themes (like v4-hanzogui.ts). The default createSimpleThemeBuilder
 * now uses v5 ordering.
 */
function createV4ThemeBuilder(props) {
    var getTheme = props.getTheme, extra = props.extra, accentExtra = props.accentExtra, _a = props.childrenThemes, childrenThemes = _a === void 0 ? null : _a, _b = props.grandChildrenThemes, grandChildrenThemes = _b === void 0 ? null : _b, _c = props.templates, templates = _c === void 0 ? defaultTemplates_1.defaultTemplates : _c, _d = props.palettes, palettes = _d === void 0 ? defaultPalettes : _d, accentTheme = props.accentTheme, _e = props.componentThemes, componentThemes = _e === void 0 ? templates === defaultTemplates_1.defaultTemplates
        ? defaultComponentThemes_1.defaultComponentThemes
        : undefined : _e;
    // start theme-builder
    var themeBuilder = (0, ThemeBuilder_1.createThemeBuilder)()
        .addPalettes(palettes)
        .addTemplates(templates)
        .addThemes({
        light: {
            template: 'base',
            palette: 'light',
            nonInheritedValues: __assign(__assign({}, extra === null || extra === void 0 ? void 0 : extra.light), (accentTheme &&
                palettes.light_accent && {
                accent1: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 0],
                accent2: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 1],
                accent3: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 2],
                accent4: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 3],
                accent5: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 4],
                accent6: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 5],
                accent7: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 6],
                accent8: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 7],
                accent9: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 8],
                accent10: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 9],
                accent11: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 10],
                accent12: palettes.light_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 11],
            })),
        },
        dark: {
            template: 'base',
            palette: 'dark',
            nonInheritedValues: __assign(__assign({}, extra === null || extra === void 0 ? void 0 : extra.dark), (accentTheme &&
                palettes.dark_accent && {
                accent1: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 0],
                accent2: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 1],
                accent3: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 2],
                accent4: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 3],
                accent5: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 4],
                accent6: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 5],
                accent7: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 6],
                accent8: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 7],
                accent9: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 8],
                accent10: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 9],
                accent11: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 10],
                accent12: palettes.dark_accent[getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET + 11],
            })),
        },
    });
    // v4 behavior: add children and grandChildren FIRST
    if (childrenThemes) {
        themeBuilder = themeBuilder.addChildThemes(childrenThemes, {
            avoidNestingWithin: ['accent'],
        });
    }
    if (grandChildrenThemes) {
        themeBuilder = themeBuilder.addChildThemes(grandChildrenThemes, {
            avoidNestingWithin: ['accent'],
        });
    }
    // then add accent LAST with avoidNestingWithin
    if (palettes.light_accent) {
        themeBuilder = themeBuilder.addChildThemes({
            accent: [
                {
                    parent: 'light',
                    template: 'base',
                    palette: 'light_accent',
                    nonInheritedValues: accentExtra === null || accentExtra === void 0 ? void 0 : accentExtra.light,
                },
                {
                    parent: 'dark',
                    template: 'base',
                    palette: 'dark_accent',
                    nonInheritedValues: accentExtra === null || accentExtra === void 0 ? void 0 : accentExtra.dark,
                },
            ],
        }, {
            avoidNestingWithin: Object.keys(childrenThemes || {}),
        });
    }
    if (componentThemes) {
        themeBuilder = themeBuilder.addComponentThemes((0, exports.getComponentThemes)(componentThemes), {
            avoidNestingWithin: Object.keys(grandChildrenThemes || {}),
        });
    }
    if (getTheme) {
        themeBuilder = themeBuilder.getTheme(getTheme);
    }
    return {
        themeBuilder: themeBuilder,
        themes: themeBuilder.build(),
    };
}
