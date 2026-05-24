"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOutlineShorthand = parseOutlineShorthand;
// outline style keywords
var outlineStyles = new Set([
    'solid',
    'dashed',
    'dotted',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset',
    'none',
    'hidden',
]);
// parses CSS outline shorthand: "<width> <style> <color>"
// components can appear in any order, all are optional
// on native, expands directly to individual outline properties
function parseOutlineShorthand(value) {
    if (value === 'none' || value === '0') {
        return [
            ['outlineWidth', 0],
            ['outlineStyle', 'none'],
        ];
    }
    var parts = value.trim().split(/\s+/);
    var outlineWidth;
    var outlineStyle;
    var outlineColor;
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        // check if it's an outline style keyword
        if (outlineStyles.has(part)) {
            outlineStyle = part;
        }
        // check if it's a length (number or ends with px/em/rem/etc)
        else if (/^[\d.]+(?:px|em|rem|%|pt|vw|vh)?$/.test(part)) {
            var num = parseFloat(part);
            outlineWidth = part.endsWith('px') || !part.match(/[a-z%]/i) ? num : part;
        }
        // otherwise assume it's a color
        else {
            outlineColor = part;
        }
    }
    var result = [];
    if (outlineWidth !== undefined) {
        result.push(['outlineWidth', outlineWidth]);
    }
    if (outlineStyle !== undefined) {
        result.push(['outlineStyle', outlineStyle]);
    }
    if (outlineColor !== undefined) {
        result.push(['outlineColor', outlineColor]);
    }
    return result.length > 0 ? result : undefined;
}
