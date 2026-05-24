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
exports.createFont = void 0;
var fontWeights = [
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
];
var processSection = function (section, keys, defaultValue) {
    if (typeof section === 'string')
        return section;
    var sectionKeys = Object.keys(section);
    var fillValue = section[sectionKeys[0]];
    return Object.fromEntries(__spreadArray([], new Set(__spreadArray(__spreadArray([], keys, true), sectionKeys, true)), true).map(function (key) {
        var _a, _b;
        var value = (_b = (_a = section[key]) !== null && _a !== void 0 ? _a : defaultValue) !== null && _b !== void 0 ? _b : fillValue;
        fillValue = value;
        defaultValue = value;
        return [key, value];
    }));
};
var createFont = function (font) {
    var sizeKeys = Object.keys(font.size || {});
    var processedFont = Object.fromEntries(Object.entries(font).map(function (_a) {
        var key = _a[0], section = _a[1];
        return [
            key,
            processSection(section, key === 'face' ? fontWeights : sizeKeys, key === 'face' ? { normal: font.family } : undefined),
        ];
    }));
    return Object.freeze(processedFont);
};
exports.createFont = createFont;
