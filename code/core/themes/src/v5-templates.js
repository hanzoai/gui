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
exports.v5Templates = void 0;
var theme_builder_1 = require("@hanzogui/theme-builder");
var objectFromEntries = function (entries) {
    return Object.fromEntries(entries);
};
var objectKeys = function (obj) {
    return Object.keys(obj);
};
var getTemplates = function () {
    var lightTemplates = getBaseTemplates('light');
    var darkTemplates = getBaseTemplates('dark');
    var templates = __assign(__assign({}, objectFromEntries(objectKeys(lightTemplates).map(function (name) { return ["light_".concat(name), lightTemplates[name]]; }))), objectFromEntries(objectKeys(darkTemplates).map(function (name) { return ["dark_".concat(name), darkTemplates[name]]; })));
    return templates;
};
var getBaseTemplates = function (scheme) {
    var isLight = scheme === 'light';
    // our palettes have PALETTE_BACKGROUND_OFFSET things padding each end until you get to bg/color:
    // [accentBg, transparent1, transparent2, transparent3, transparent4, background, ...]
    var lighten = isLight ? -1 : 1;
    var darken = -lighten;
    // base
    var background = theme_builder_1.PALETTE_BACKGROUND_OFFSET;
    var borderColor = background + 2;
    var color = -background;
    // helper for surface themes - they need their own hover/press/focus calculations
    // because those need to be relative to their elevated background, not base
    var makeSurface = function (offset, colorOffset) {
        if (colorOffset === void 0) { colorOffset = 0; }
        var clr = color - colorOffset;
        var bg = background + offset;
        var brdr = borderColor + offset;
        return {
            color: clr,
            colorHover: clr + (isLight ? 0 : lighten),
            colorPress: clr,
            colorFocus: clr + darken,
            background: bg,
            // hover lightens always
            backgroundHover: bg + lighten,
            // press darkens always
            backgroundPress: bg + darken,
            // focus: lightens in dark mode, darkens in light
            backgroundFocus: bg + offset,
            backgroundActive: bg,
            borderColor: brdr,
            borderColorHover: brdr + lighten,
            borderColorFocus: brdr,
            borderColorPress: brdr + darken,
        };
    };
    // templates use the palette and specify index
    // negative goes backwards from end so -1 is the last item
    var base = __assign(__assign({ accentBackground: 0, accentColor: -0, background0: 1, background02: 2, background04: 3, background06: 4, background08: 5, color1: background, color2: background + 1, color3: background + 2, color4: background + 3, color5: background + 4, color6: background + 5, color7: background + 6, color8: background + 7, color9: background + 8, color10: background + 9, color11: background + 10, color12: background + 11, color0: -1, color02: -2, color04: -3, color06: -4, color08: -5 }, makeSurface(1)), { placeholderColor: color - 3, colorTransparent: -1 });
    var surface1 = makeSurface(2, 1);
    var surface2 = makeSurface(3, 1);
    var surface3 = makeSurface(5, 1);
    var accent = Object.fromEntries(Object.entries(base).map(function (_a) {
        var key = _a[0], index = _a[1];
        return [key, -index];
    }));
    return {
        base: base,
        surface1: surface1,
        surface2: surface2,
        surface3: surface3,
        accent: accent,
    };
};
exports.v5Templates = getTemplates();
