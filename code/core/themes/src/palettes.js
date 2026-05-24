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
exports.palettes = void 0;
var helpers_1 = require("./helpers");
var tokens_1 = require("./tokens");
exports.palettes = (function () {
    var lightTransparent = 'rgba(255,255,255,0)';
    var darkTransparent = 'rgba(10,10,10,0)';
    var transparent = function (hsl, opacity) {
        if (opacity === void 0) { opacity = 0; }
        return hsl.replace("%)", "%, ".concat(opacity, ")")).replace("hsl(", "hsla(");
    };
    var getColorPalette = function (colors, color) {
        if (color === void 0) { color = colors[0]; }
        var colorPalette = Object.values(colors);
        // were re-ordering these
        var _a = [
            colorPalette.slice(0, 6),
            colorPalette.slice(colorPalette.length - 5),
        ], head = _a[0], tail = _a[1];
        // add our transparent colors first/last
        // and make sure the last (foreground) color is white/black rather than colorful
        // this is mostly for consistency with the older theme-base
        return __spreadArray(__spreadArray(__spreadArray([
            transparent(colorPalette[0])
        ], head, true), tail, true), [
            color,
            transparent(colorPalette[colorPalette.length - 1]),
        ], false);
    };
    var lightColor = 'hsl(0, 0%, 9.0%)';
    var lightPalette = [
        lightTransparent,
        '#fff',
        '#f8f8f8',
        'hsl(0, 0%, 96.3%)',
        'hsl(0, 0%, 94.1%)',
        'hsl(0, 0%, 92.0%)',
        'hsl(0, 0%, 90.0%)',
        'hsl(0, 0%, 88.5%)',
        'hsl(0, 0%, 81.0%)',
        'hsl(0, 0%, 56.1%)',
        'hsl(0, 0%, 50.3%)',
        'hsl(0, 0%, 42.5%)',
        lightColor,
        darkTransparent,
    ];
    var darkColor = '#fff';
    var darkPalette = [
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
        darkColor,
        lightTransparent,
    ];
    var lightPalettes = (0, helpers_1.objectFromEntries)((0, helpers_1.objectKeys)(tokens_1.colorTokens.light).map(function (key) {
        return ["light_".concat(key), getColorPalette(tokens_1.colorTokens.light[key], lightColor)];
    }));
    var darkPalettes = (0, helpers_1.objectFromEntries)((0, helpers_1.objectKeys)(tokens_1.colorTokens.dark).map(function (key) { return ["dark_".concat(key), getColorPalette(tokens_1.colorTokens.dark[key], darkColor)]; }));
    var colorPalettes = __assign(__assign({}, lightPalettes), darkPalettes);
    return __assign({ light: lightPalette, dark: darkPalette }, colorPalettes);
})();
