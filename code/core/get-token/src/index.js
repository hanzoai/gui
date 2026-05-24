"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenRelative = exports.stepTokenUpOrDown = exports.getRadius = exports.getSpace = exports.getSize = void 0;
var web_1 = require("@hanzogui/web");
var defaultOptions = {
    shift: 0,
    bounds: [0],
};
var getSize = function (size, options) {
    return (0, exports.getTokenRelative)('size', size, options);
};
exports.getSize = getSize;
var getSpace = function (space, options) {
    return (0, exports.getTokenRelative)('space', space, options);
};
exports.getSpace = getSpace;
var getRadius = function (radius, options) {
    return (0, exports.getTokenRelative)('radius', radius, options);
};
exports.getRadius = getRadius;
var cacheVariables = {};
var cacheWholeVariables = {};
var cacheKeys = {};
var cacheWholeKeys = {};
/** @deprecated use getSize, getSpace, or getTokenRelative instead */
var stepTokenUpOrDown = function (type, current, options) {
    var _a, _b, _c, _d;
    if (options === void 0) { options = defaultOptions; }
    var tokens = (0, web_1.getTokens)({ prefixed: true })[type];
    if (!(type in cacheVariables)) {
        cacheKeys[type] = [];
        cacheVariables[type] = [];
        cacheWholeKeys[type] = [];
        cacheWholeVariables[type] = [];
        var sorted = Object.keys(tokens)
            .map(function (k) { return tokens[k]; })
            .sort(function (a, b) { return a.val - b.val; });
        for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
            var token = sorted_1[_i];
            cacheKeys[type].push(token.key);
            cacheVariables[type].push(token);
        }
        var sortedExcludingHalfSteps = sorted.filter(function (x) { return !x.key.endsWith('.5'); });
        for (var _e = 0, sortedExcludingHalfSteps_1 = sortedExcludingHalfSteps; _e < sortedExcludingHalfSteps_1.length; _e++) {
            var token = sortedExcludingHalfSteps_1[_e];
            cacheWholeKeys[type].push(token.key);
            cacheWholeVariables[type].push(token);
        }
    }
    var isString = typeof current === 'string';
    var cache = options.excludeHalfSteps
        ? isString
            ? cacheWholeKeys
            : cacheWholeVariables
        : isString
            ? cacheKeys
            : cacheVariables;
    var tokensOrdered = cache[type];
    var min = (_b = (_a = options.bounds) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 0;
    var max = (_d = (_c = options.bounds) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : tokensOrdered.length - 1;
    var currentIndex = tokensOrdered.indexOf(current);
    var shift = options.shift || 0;
    if (shift) {
        if (current === '$true' || ((0, web_1.isVariable)(current) && current.name === 'true')) {
            shift += shift > 0 ? 1 : -1;
        }
    }
    var index = Math.min(max, Math.max(min, currentIndex + shift));
    var found = tokensOrdered[index];
    var result = (typeof found === 'string' ? tokens[found] : found) || tokens['$true'];
    // console.log('found', { current, shift, index, found, result })
    // @ts-ignore
    return result;
};
exports.stepTokenUpOrDown = stepTokenUpOrDown;
exports.getTokenRelative = exports.stepTokenUpOrDown;
