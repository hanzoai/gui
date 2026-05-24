"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpolateColor = interpolateColor;
exports.opacify = opacify;
/**
 * Interpolate between two colors
 * @param color1 - First color (hex or hsl)
 * @param color2 - Second color (hex or hsl)
 * @param amount - 0 = color1, 1 = color2, 0.5 = middle
 */
function interpolateColor(color1, color2, amount) {
    var rgb1 = parseToRgb(color1);
    var rgb2 = parseToRgb(color2);
    if (!rgb1 || !rgb2)
        return color1;
    var r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * amount);
    var g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * amount);
    var b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * amount);
    return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
}
function parseToRgb(color) {
    if (typeof color !== 'string')
        return null;
    // Handle hex
    if (color.startsWith('#')) {
        var hex = color.slice(1);
        if (hex.length === 3) {
            hex = hex
                .split('')
                .map(function (c) { return c + c; })
                .join('');
        }
        if (hex.length >= 6) {
            return {
                r: Number.parseInt(hex.slice(0, 2), 16),
                g: Number.parseInt(hex.slice(2, 4), 16),
                b: Number.parseInt(hex.slice(4, 6), 16),
            };
        }
    }
    // Handle rgb/rgba
    if (color.startsWith('rgb')) {
        var match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return {
                r: Number.parseInt(match[1], 10),
                g: Number.parseInt(match[2], 10),
                b: Number.parseInt(match[3], 10),
            };
        }
    }
    // Handle hsl/hsla
    if (color.startsWith('hsl')) {
        var match = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);
        if (match) {
            var h = Number.parseInt(match[1], 10);
            var s = Number.parseInt(match[2], 10) / 100;
            var l = Number.parseInt(match[3], 10) / 100;
            return hslToRgb(h, s, l);
        }
    }
    return null;
}
function hslToRgb(h, s, l) {
    var r;
    var g;
    var b;
    if (s === 0) {
        r = g = b = l;
    }
    else {
        var hue2rgb = function (p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h / 360 + 1 / 3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
function opacify(color, opacity) {
    if (opacity === void 0) { opacity = 0.1; }
    // Handle dynamic color objects (from $theme-dark/$theme-light)
    if (typeof color !== 'string')
        return color;
    // handle hsl/hsla
    if (color.startsWith('hsl')) {
        var match = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
        if (match) {
            var h = match[1], s = match[2], l = match[3];
            return "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(opacity, ")");
        }
    }
    // handle hex
    if (color.startsWith('#')) {
        var hex = color.slice(1);
        // expand shorthand hex
        if (hex.length === 3) {
            hex = hex
                .split('')
                .map(function (c) { return c + c; })
                .join('');
        }
        // set alpha channel to specified opacity
        if (hex.length === 6 || hex.length === 8) {
            var alphaHex = Math.round(opacity * 255)
                .toString(16)
                .padStart(2, '0');
            return "#".concat(hex.slice(0, 6)).concat(alphaHex);
        }
    }
    return color;
}
