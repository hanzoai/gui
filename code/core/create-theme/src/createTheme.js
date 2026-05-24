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
exports.createThemeWithPalettes = createThemeWithPalettes;
exports.createTheme = createTheme;
exports.addChildren = addChildren;
var isMinusZero_1 = require("./isMinusZero");
var themeInfo_1 = require("./themeInfo");
var identityCache = new Map();
function createThemeWithPalettes(palettes, defaultPalette, definition, options, name, skipCache) {
    if (skipCache === void 0) { skipCache = false; }
    if (!palettes[defaultPalette]) {
        throw new Error("No palette: ".concat(defaultPalette));
    }
    var newDef = __assign({}, definition);
    for (var key in definition) {
        var val = definition[key];
        if (typeof val === 'string' && val[0] === '$') {
            var _a = val.split('.'), altPaletteName$ = _a[0], altPaletteIndex = _a[1];
            var altPaletteName = altPaletteName$.slice(1);
            var parentName = defaultPalette.split('_')[0];
            var altPalette = palettes[altPaletteName] || palettes["".concat(parentName, "_").concat(altPaletteName)];
            if (altPalette) {
                var next = getValue(altPalette, +altPaletteIndex);
                if (typeof next !== 'undefined') {
                    newDef[key] = next;
                }
            }
        }
    }
    return createTheme(palettes[defaultPalette], newDef, options, name, skipCache);
}
function createTheme(palette, definition, options, name, skipCache) {
    if (skipCache === void 0) { skipCache = false; }
    var cacheKey = skipCache ? '' : JSON.stringify([name, palette, definition, options]);
    if (!skipCache) {
        if (identityCache.has(cacheKey)) {
            return identityCache.get(cacheKey);
        }
    }
    var theme = __assign(__assign({}, Object.fromEntries(Object.entries(definition).map(function (_a) {
        var key = _a[0], offset = _a[1];
        return [key, getValue(palette, offset)];
    }))), options === null || options === void 0 ? void 0 : options.nonInheritedValues);
    (0, themeInfo_1.setThemeInfo)(theme, { palette: palette, definition: definition, options: options, name: name });
    if (cacheKey) {
        identityCache.set(cacheKey, theme);
    }
    return theme;
}
var getValue = function (palette, value) {
    if (!palette) {
        throw new Error("No palette!");
    }
    if (typeof value === 'string') {
        return value;
    }
    var max = palette.length - 1;
    var isPositive = value === 0 ? !(0, isMinusZero_1.isMinusZero)(value) : value >= 0;
    var next = isPositive ? value : max + value;
    var index = Math.min(Math.max(0, next), max);
    return palette[index];
};
function addChildren(themes, getChildren) {
    var out = __assign({}, themes);
    for (var key in themes) {
        var subThemes = getChildren(key, themes[key]);
        for (var sKey in subThemes) {
            out["".concat(key, "_").concat(sKey)] = subThemes[sKey];
        }
    }
    return out;
}
