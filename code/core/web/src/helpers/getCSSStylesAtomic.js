"use strict";
/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */
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
exports.getStyleAtomic = void 0;
exports.getCSSStylesAtomic = getCSSStylesAtomic;
exports.styleToCSS = styleToCSS;
var helpers_1 = require("@hanzogui/helpers");
var config_1 = require("../config");
var useMedia_1 = require("../hooks/useMedia");
var defaultOffset_1 = require("./defaultOffset");
var normalizeColor_1 = require("./normalizeColor");
var normalizeValueWithProperty_1 = require("./normalizeValueWithProperty");
var pseudoDescriptors_1 = require("./pseudoDescriptors");
var transformsToString_1 = require("./transformsToString");
// refactor this file away next...
function getCSSStylesAtomic(style) {
    styleToCSS(style);
    var out = [];
    for (var key in style) {
        if (key === '$$css')
            continue;
        var val = style[key];
        if (key in pseudoDescriptors_1.pseudoDescriptors) {
            if (val) {
                out.push.apply(out, (0, exports.getStyleAtomic)(val, pseudoDescriptors_1.pseudoDescriptors[key]));
            }
        }
        else if ((0, useMedia_1.isMediaKey)(key)) {
            for (var subKey in val) {
                var so = getStyleObject(val, subKey);
                if (so) {
                    so[0] = key; // set the property to be eg $platform-web so we can use it above
                    out.push(so);
                }
            }
        }
        else {
            var so = getStyleObject(style, key);
            if (so) {
                out.push(so);
            }
        }
    }
    return out;
}
var getStyleAtomic = function (style, pseudo) {
    styleToCSS(style);
    var out = [];
    for (var key in style) {
        var so = getStyleObject(style, key, pseudo);
        if (so) {
            out.push(so);
        }
    }
    return out;
};
exports.getStyleAtomic = getStyleAtomic;
var conf = null;
// this could be cached for performance?
var getStyleObject = function (style, key, pseudo) {
    var val = style[key];
    if (val == null)
        return;
    // transform
    if (key === 'transform' && Array.isArray(style.transform)) {
        val = (0, transformsToString_1.transformsToString)(val);
    }
    var value = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(val, key);
    var hash = (0, helpers_1.simpleHash)(typeof value === 'string' ? value : "".concat(value));
    var pseudoPrefix = pseudo ? "0".concat(pseudo.name, "-") : '';
    conf || (conf = (0, config_1.getConfigMaybe)());
    var shortProp = (conf === null || conf === void 0 ? void 0 : conf.inverseShorthands[key]) || key;
    var identifier = "_".concat(shortProp, "-").concat(pseudoPrefix).concat(hash);
    if (key === 'pointerEvents' && !pseudo) {
        if (value === 'box-none')
            identifier = '_pe-boxnone';
        else if (value === 'box-only')
            identifier = '_pe-boxonly';
    }
    var rules = createAtomicRules(identifier, key, value, pseudo);
    return [
        // array for performance
        key,
        value,
        identifier,
        pseudo === null || pseudo === void 0 ? void 0 : pseudo.name,
        rules,
    ];
};
function styleToCSS(style) {
    // box-shadow
    var shadowOffset = style.shadowOffset, shadowRadius = style.shadowRadius, shadowColor = style.shadowColor, shadowOpacity = style.shadowOpacity;
    if (shadowRadius != null ||
        shadowColor ||
        shadowOffset != null ||
        shadowOpacity != null) {
        var offset = shadowOffset || defaultOffset_1.defaultOffset;
        var width = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(offset.width);
        var height = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(offset.height);
        var radius = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(shadowRadius);
        var color = (0, normalizeColor_1.normalizeColor)(shadowColor, shadowOpacity);
        if (color) {
            var shadow = "".concat(width, " ").concat(height, " ").concat(radius, " ").concat(color);
            style.boxShadow = style.boxShadow ? "".concat(style.boxShadow, ", ").concat(shadow) : shadow;
        }
        delete style.shadowOffset;
        delete style.shadowRadius;
        delete style.shadowColor;
        delete style.shadowOpacity;
    }
    // text-shadow
    var textShadowColor = style.textShadowColor, textShadowOffset = style.textShadowOffset, textShadowRadius = style.textShadowRadius;
    if (textShadowColor || textShadowOffset || textShadowRadius) {
        var _a = textShadowOffset || defaultOffset_1.defaultOffset, height = _a.height, width = _a.width;
        var radius = textShadowRadius || 0;
        var color = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(textShadowColor, 'textShadowColor');
        if (color && (height !== 0 || width !== 0 || radius !== 0)) {
            var blurRadius = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(radius);
            var offsetX = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(width);
            var offsetY = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(height);
            style.textShadow = "".concat(offsetX, " ").concat(offsetY, " ").concat(blurRadius, " ").concat(color);
        }
        delete style.textShadowColor;
        delete style.textShadowOffset;
        delete style.textShadowRadius;
    }
}
function createDeclarationBlock(style, important) {
    if (important === void 0) { important = false; }
    var next = '';
    for (var _i = 0, style_1 = style; _i < style_1.length; _i++) {
        var _a = style_1[_i], key = _a[0], value = _a[1];
        next += "".concat(hyphenateStyleName(key), ":").concat(value).concat(important ? ' !important' : '', ";");
    }
    return "{".concat(next, "}");
}
var hcache = {};
var toHyphenLower = function (match) { return "-".concat(match.toLowerCase()); };
var hyphenateStyleName = function (key) {
    if (key in hcache)
        return hcache[key];
    var val = key.replace(/[A-Z]/g, toHyphenLower);
    hcache[key] = val;
    return val;
};
// adding one more :root so we always override react native web styles :/
var selectorPriority = (function () {
    var res = {};
    for (var key in pseudoDescriptors_1.pseudoDescriptors) {
        var pseudo = pseudoDescriptors_1.pseudoDescriptors[key];
        res[pseudo.name] = "".concat(__spreadArray([], Array(pseudo.priority), true).map(function () { return ':root'; }).join(''), " ");
    }
    return res;
})();
function createAtomicRules(identifier, property, value, pseudo) {
    var pseudoIdPostfix = pseudo
        ? pseudo.name === 'disabled'
            ? "[aria-disabled]"
            : ":".concat(pseudo.name)
        : '';
    var pseudoSelector = pseudo === null || pseudo === void 0 ? void 0 : pseudo.selector;
    // longhands get .cls.cls for higher specificity over shorthands
    var cls = property in helpers_1.cssShorthandLonghands ? ".".concat(identifier, ".").concat(identifier) : ".".concat(identifier);
    var selector = pseudo
        ? pseudoSelector
            ? "".concat(pseudoSelector, " ").concat(cls)
            : "".concat(selectorPriority[pseudo.name], " ").concat(cls).concat(pseudoIdPostfix)
        : ":root ".concat(cls);
    // enter style on css driver needs both:
    //   .t_unmounted .selector
    //   .selector.t_unmounted
    if (pseudoSelector === pseudoDescriptors_1.pseudoDescriptors.enterStyle.selector) {
        selector = "".concat(selector, ", .").concat(identifier).concat(pseudoSelector);
    }
    var important = !!pseudo;
    var rules = [];
    // Handle non-standard properties and object values that require multiple
    // CSS rules to be created.
    switch (property) {
        // Equivalent to using '::placeholder'
        case 'placeholderTextColor': {
            var block = createDeclarationBlock([
                ['color', value],
                ['opacity', 1],
            ], important);
            rules.push("".concat(selector, "::placeholder").concat(block));
            break;
        }
        // all webkit prefixed rules
        case 'backgroundClip':
        case 'userSelect': {
            var propertyCapitalized = "".concat(property[0].toUpperCase()).concat(property.slice(1));
            var webkitProperty = "Webkit".concat(propertyCapitalized);
            var block = createDeclarationBlock([
                [property, value],
                [webkitProperty, value],
            ], important);
            rules.push("".concat(selector).concat(block));
            break;
        }
        // Polyfill for additional 'pointer-events' values
        case 'pointerEvents': {
            var finalValue = value;
            if (value === 'auto' || value === 'box-only') {
                finalValue = 'auto';
            }
            else if (value === 'none' || value === 'box-none') {
                finalValue = 'none';
            }
            var block = createDeclarationBlock([['pointerEvents', finalValue]], true);
            rules.push("".concat(selector).concat(block));
            break;
        }
        default: {
            var block = createDeclarationBlock([[property, value]], important);
            rules.push("".concat(selector).concat(block));
            break;
        }
    }
    // hover styles need to be conditional
    // perhaps this can be generalized but for now lets just shortcut
    // and hardcode for hover styles, if we need to later we can
    // WEIRD SYNTAX, SEE:
    //   https://stackoverflow.com/questions/40532204/media-query-for-devices-supporting-hover
    if ((pseudo === null || pseudo === void 0 ? void 0 : pseudo.name) === 'hover') {
        rules = rules.map(function (r) { return "@media (hover) {".concat(r, "}"); });
    }
    return rules;
}
