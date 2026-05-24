"use strict";
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
exports.PALETTE_BACKGROUND_OFFSET = void 0;
exports.getThemeSuitePalettes = getThemeSuitePalettes;
var color2k_1 = require("color2k");
/**
 * palette generally is:
 *
 * [constrastBackground, accent, backgroundTransparent, ...background, ...foreground, foregroundTransparent, accentForeground]
 */
var paletteSize = 12;
// how many things come before the actual bg color (transparencies etc)
// 👋 SYNC WITH hanzogui.dev/features/studio/constants
exports.PALETTE_BACKGROUND_OFFSET = 6;
var generateColorPalette = function (_a) {
    var _b, _c;
    var buildPalette = _a.palette, scheme = _a.scheme;
    if (!buildPalette) {
        return [];
    }
    var anchors = buildPalette.anchors;
    var palette = [];
    var add = function (h, s, l, a) {
        palette.push((0, color2k_1.hsla)(h, s, l, a !== null && a !== void 0 ? a : 1));
    };
    var numAnchors = Object.keys(anchors).length;
    for (var _i = 0, _d = anchors.entries(); _i < _d.length; _i++) {
        var _e = _d[_i], anchorIndex = _e[0], anchor = _e[1];
        var _f = [
            anchor.hue[scheme],
            anchor.sat[scheme],
            anchor.lum[scheme],
            (_c = (_b = anchor.alpha) === null || _b === void 0 ? void 0 : _b[scheme]) !== null && _c !== void 0 ? _c : 1,
        ], h = _f[0], s = _f[1], l = _f[2], a = _f[3];
        if (anchorIndex !== 0) {
            var lastAnchor = anchors[anchorIndex - 1];
            var steps = anchor.index - lastAnchor.index;
            var lastHue = lastAnchor.hue[scheme];
            var lastSat = lastAnchor.sat[scheme];
            var lastLum = lastAnchor.lum[scheme];
            var stepHue = (lastHue - h) / steps;
            var stepSat = (lastSat - s) / steps;
            var stepLum = (lastLum - l) / steps;
            // backfill:
            for (var step = lastAnchor.index + 1; step < anchor.index; step++) {
                var str = anchor.index - step;
                add(h + stepHue * str, s + stepSat * str, l + stepLum * str);
            }
        }
        add(h, s, l, a);
        var isLastAnchor = anchorIndex === numAnchors - 1;
        if (isLastAnchor && palette.length < paletteSize) {
            // forwardfill:
            for (var step = anchor.index + 1; step < paletteSize; step++) {
                add(h, s, l);
            }
        }
    }
    // add transparent values
    var background = palette[0];
    var foreground = palette[palette.length - 1];
    var transparentValues = [background, foreground].map(function (color) {
        var _a = (0, color2k_1.parseToHsla)(color), h = _a[0], s = _a[1], l = _a[2];
        // fully transparent to partially
        return [
            (0, color2k_1.hsla)(h, s, l, 0),
            (0, color2k_1.hsla)(h, s, l, 0.2),
            (0, color2k_1.hsla)(h, s, l, 0.4),
            (0, color2k_1.hsla)(h, s, l, 0.6),
            (0, color2k_1.hsla)(h, s, l, 0.8),
        ];
    });
    var reverseForeground = __spreadArray([], transparentValues[1], true).reverse();
    palette = __spreadArray(__spreadArray(__spreadArray([], transparentValues[0], true), palette, true), reverseForeground, true);
    return palette;
};
function getThemeSuitePalettes(palette) {
    return {
        light: generateColorPalette({ palette: palette, scheme: 'light' }),
        dark: generateColorPalette({ palette: palette, scheme: 'dark' }),
    };
}
