"use strict";
/**
 * parses CSS string values into RN object format on native,
 * preserving DynamicColorIOS objects from the token map.
 *
 * supports: backgroundImage (linear-gradient), boxShadow, textShadow
 * filter has no RN object equivalent, returns undefined (falls back to string)
 *
 * only called inside process.env.TAMAGUI_TARGET === 'native' checks,
 * so this code is dead-code-eliminated on web builds.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNativeStyle = parseNativeStyle;
function parseNativeStyle(key, cssString, tokenMap) {
    switch (key) {
        case 'backgroundImage':
            return parseBackgroundImage(cssString, tokenMap);
        case 'boxShadow':
            return parseBoxShadow(cssString, tokenMap);
        case 'textShadow':
            return parseTextShadow(cssString, tokenMap);
        default:
            return undefined;
    }
}
function resolveColor(raw, tokenMap) {
    if (tokenMap && tokenMap.has(raw)) {
        return tokenMap.get(raw);
    }
    return raw;
}
// parse "linear-gradient(direction, color1 pos1, color2 pos2, ...)"
function parseBackgroundImage(css, tokenMap) {
    var match = css.match(/^linear-gradient\((.+)\)$/s);
    if (!match)
        return undefined;
    var inner = match[1];
    // split on commas that are not inside parentheses
    var parts = splitOutsideParens(inner);
    if (parts.length < 2)
        return undefined;
    var direction;
    var startIdx = 0;
    var firstPart = parts[0].trim();
    // check if first part is a direction (starts with "to " or ends with "deg/rad/turn/grad")
    if (firstPart.startsWith('to ') || /^\d+(\.\d+)?(deg|rad|turn|grad)$/.test(firstPart)) {
        direction = firstPart;
        startIdx = 1;
    }
    var colorStops = [];
    for (var i = startIdx; i < parts.length; i++) {
        var stopParts = parts[i].trim().match(/\S+\([^)]*\)|\S+/g);
        if (!stopParts)
            continue;
        var colorRaw = stopParts[0];
        var color = resolveColor(colorRaw, tokenMap);
        var positions = stopParts.slice(1);
        var stop_1 = { color: color };
        if (positions.length > 0) {
            stop_1.positions = positions;
        }
        colorStops.push(stop_1);
    }
    var gradient = {
        type: 'linear-gradient',
        colorStops: colorStops,
    };
    if (direction) {
        gradient.direction = direction;
    }
    return [gradient];
}
// parse "offsetX offsetY [blur [spread]] [color]" (comma-separated for multiple)
function parseBoxShadow(css, tokenMap) {
    // split on commas for multiple shadows
    var shadowStrings = splitOutsideParens(css);
    var shadows = [];
    for (var _i = 0, shadowStrings_1 = shadowStrings; _i < shadowStrings_1.length; _i++) {
        var raw = shadowStrings_1[_i];
        var s = raw.trim();
        if (!s)
            continue;
        var tokens = s.split(/\s+/);
        if (tokens.length < 2)
            return undefined;
        var startIdx = 0;
        var inset = false;
        if (tokens[0] === 'inset') {
            inset = true;
            startIdx = 1;
        }
        // find where the color starts - numbers/dimensions come first
        var numericParts = [];
        var colorParts = [];
        for (var i = startIdx; i < tokens.length; i++) {
            var n = parseDimension(tokens[i]);
            if (n !== undefined) {
                numericParts.push(n);
            }
            else {
                // rest is color (could be "rgba(..." which was split, so rejoin)
                colorParts = tokens.slice(i);
                break;
            }
        }
        if (numericParts.length < 2)
            return undefined;
        var shadow = {
            offsetX: numericParts[0],
            offsetY: numericParts[1],
        };
        if (inset) {
            shadow.inset = true;
        }
        if (numericParts.length >= 3) {
            shadow.blurRadius = numericParts[2];
        }
        if (numericParts.length >= 4) {
            shadow.spreadDistance = numericParts[3];
        }
        if (colorParts.length > 0) {
            var colorStr = colorParts.join(' ');
            shadow.color = resolveColor(colorStr, tokenMap);
        }
        shadows.push(shadow);
    }
    return shadows.length > 0 ? shadows : undefined;
}
// parse "offsetX offsetY blur color"
function parseTextShadow(css, tokenMap) {
    var tokens = css.trim().split(/\s+/);
    if (tokens.length < 3)
        return undefined;
    var offsetX = parseDimension(tokens[0]);
    var offsetY = parseDimension(tokens[1]);
    var blur = parseDimension(tokens[2]);
    if (offsetX === undefined || offsetY === undefined || blur === undefined) {
        return undefined;
    }
    var result = [
        ['textShadowOffset', { width: offsetX, height: offsetY }],
        ['textShadowRadius', blur],
    ];
    if (tokens.length >= 4) {
        var colorStr = tokens.slice(3).join(' ');
        result.push(['textShadowColor', resolveColor(colorStr, tokenMap)]);
    }
    return result;
}
function parseDimension(s) {
    // strip px/dp suffix
    var cleaned = s.replace(/px$|dp$/, '');
    var n = Number(cleaned);
    return Number.isFinite(n) ? n : undefined;
}
// split a string on commas that are not inside parentheses
function splitOutsideParens(s) {
    var parts = [];
    var depth = 0;
    var start = 0;
    for (var i = 0; i < s.length; i++) {
        var ch = s.charCodeAt(i);
        if (ch === 40 /* ( */)
            depth++;
        else if (ch === 41 /* ) */)
            depth--;
        else if (ch === 44 /* , */ && depth === 0) {
            parts.push(s.slice(start, i));
            start = i + 1;
        }
    }
    parts.push(s.slice(start));
    return parts;
}
