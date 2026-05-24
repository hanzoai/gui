"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchQuery = matchQuery;
exports.parseQuery = parseQuery;
// -----------------------------------------------------------------------------
var RE_MEDIA_QUERY = /(?:(only|not)?\s*([^\s()]+)(?:\s*and)?\s*)?(.+)?/i;
var RE_MQ_EXPRESSION = /\(\s*([^\s:)]+)\s*(?::\s*([^\s)]+))?\s*\)/;
var RE_MQ_FEATURE = /^(?:(min|max)-)?(.+)/;
var RE_LENGTH_UNIT = /(em|rem|px|cm|mm|in|pt|pc)?$/;
var RE_RESOLUTION_UNIT = /(dpi|dpcm|dppx)?$/;
function matchQuery(mediaQuery, values) {
    return parseQuery(mediaQuery).some(function (query) {
        if (!query)
            return;
        var inverse = query.inverse;
        // Either the parsed or specified `type` is "all", or the types must be
        // equal for a match.
        var typeMatch = query.type === 'all' || values.type === query.type;
        // Quit early when `type` doesn't match, but take "not" into account.
        if ((typeMatch && inverse) || !(typeMatch || inverse)) {
            return false;
        }
        var expressionsMatch = query.expressions.every(function (expression) {
            var feature = expression.feature;
            var modifier = expression.modifier;
            var expValue = expression.value;
            var value = values[feature];
            // Missing or falsy values don't match.
            if (!value) {
                return false;
            }
            switch (feature) {
                case 'orientation':
                case 'scan':
                    return value.toLowerCase() === expValue.toLowerCase();
                case 'width':
                case 'height':
                case 'device-width':
                case 'device-height':
                    expValue = toPx(expValue);
                    value = toPx(value);
                    break;
                case 'resolution':
                    expValue = toDpi(expValue);
                    value = toDpi(value);
                    break;
                case 'aspect-ratio':
                case 'device-aspect-ratio':
                case /* Deprecated */ 'device-pixel-ratio':
                    expValue = toDecimal(expValue);
                    value = toDecimal(value);
                    break;
                case 'grid':
                case 'color':
                case 'color-index':
                case 'monochrome':
                    expValue = Number.parseInt(expValue, 10) || 1;
                    value = Number.parseInt(value, 10) || 0;
                    break;
            }
            switch (modifier) {
                case 'min':
                    return value >= expValue;
                case 'max':
                    return value <= expValue;
                default:
                    return value === expValue;
            }
        });
        return (expressionsMatch && !inverse) || (!expressionsMatch && inverse);
    });
}
function parseQuery(mediaQuery) {
    return mediaQuery.split(',').map(function (query) {
        query = query.trim();
        var captures = query.match(RE_MEDIA_QUERY);
        if (!captures)
            return null;
        var modifier = captures[1];
        var type = captures[2];
        var expressionsCapture = captures[3] || '';
        // Split expressions into a list.
        var expressions = expressionsCapture.match(/\([^)]+\)/g) || [];
        return {
            inverse: !!modifier && modifier.toLowerCase() === 'not',
            type: type ? type.toLowerCase() : 'all',
            expressions: expressions.map(function (expression) {
                var captures = expression.match(RE_MQ_EXPRESSION);
                var feature = captures[1].toLowerCase().match(RE_MQ_FEATURE);
                return {
                    modifier: feature[1],
                    feature: feature[2],
                    value: captures[2],
                };
            }),
        };
    });
}
// -- Utilities ----------------------------------------------------------------
function toDecimal(ratio) {
    var decimal = Number(ratio);
    var numbers;
    if (!decimal) {
        numbers = ratio.match(/^(\d+)\s*\/\s*(\d+)$/);
        decimal = numbers[1] / numbers[2];
    }
    return decimal;
}
function toDpi(resolution) {
    var _a;
    var value = Number.parseFloat(resolution);
    var units = (_a = String(resolution).match(RE_RESOLUTION_UNIT)) === null || _a === void 0 ? void 0 : _a[1];
    switch (units) {
        case 'dpcm':
            return value / 2.54;
        case 'dppx':
            return value * 96;
        default:
            return value;
    }
}
function toPx(length) {
    var _a;
    var value = Number.parseFloat(length);
    var units = (_a = String(length).match(RE_LENGTH_UNIT)) === null || _a === void 0 ? void 0 : _a[1];
    switch (units) {
        case 'em':
            return value * 16;
        case 'rem':
            return value * 16;
        case 'cm':
            return (value * 96) / 2.54;
        case 'mm':
            return (value * 96) / 2.54 / 10;
        case 'in':
            return value * 96;
        case 'pt':
            return value * 72;
        case 'pc':
            return (value * 72) / 12;
        default:
            return value;
    }
}
