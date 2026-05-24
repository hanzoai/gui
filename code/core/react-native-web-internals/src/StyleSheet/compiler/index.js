"use strict";
// @ts-nocheck
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.atomic = atomic;
exports.classic = classic;
exports.inline = inline;
exports.stringifyValueWithProperty = stringifyValueWithProperty;
var simple_hash_1 = require("@hanzogui/simple-hash");
var createReactDOMStyle_1 = require("./createReactDOMStyle");
var hyphenateStyleName_1 = require("./hyphenateStyleName");
var normalizeValueWithProperty_1 = require("./normalizeValueWithProperty");
var cache = new Map();
var emptyObject = {};
var classicGroup = 1;
var atomicGroup = 2.2;
var customGroup = {
    borderColor: 2,
    borderRadius: 2,
    borderStyle: 2,
    borderWidth: 2,
    display: 2,
    flex: 2,
    margin: 2,
    overflow: 2,
    overscrollBehavior: 2,
    padding: 2,
    marginHorizontal: 2.1,
    marginVertical: 2.1,
    paddingHorizontal: 2.1,
    paddingVertical: 2.1,
};
var borderTopLeftRadius = 'borderTopLeftRadius';
var borderTopRightRadius = 'borderTopRightRadius';
var borderBottomLeftRadius = 'borderBottomLeftRadius';
var borderBottomRightRadius = 'borderBottomRightRadius';
var borderLeftColor = 'borderLeftColor';
var borderLeftStyle = 'borderLeftStyle';
var borderLeftWidth = 'borderLeftWidth';
var borderRightColor = 'borderRightColor';
var borderRightStyle = 'borderRightStyle';
var borderRightWidth = 'borderRightWidth';
var right = 'right';
var marginLeft = 'marginLeft';
var marginRight = 'marginRight';
var paddingLeft = 'paddingLeft';
var paddingRight = 'paddingRight';
var left = 'left';
// Map of LTR property names to their BiDi equivalent.
var PROPERTIES_FLIP = (_a = {},
    _a[borderTopLeftRadius] = borderTopRightRadius,
    _a[borderTopRightRadius] = borderTopLeftRadius,
    _a[borderBottomLeftRadius] = borderBottomRightRadius,
    _a[borderBottomRightRadius] = borderBottomLeftRadius,
    _a[borderLeftColor] = borderRightColor,
    _a[borderLeftStyle] = borderRightStyle,
    _a[borderLeftWidth] = borderRightWidth,
    _a[borderRightColor] = borderLeftColor,
    _a[borderRightStyle] = borderLeftStyle,
    _a[borderRightWidth] = borderLeftWidth,
    _a[left] = right,
    _a[marginLeft] = marginRight,
    _a[marginRight] = marginLeft,
    _a[paddingLeft] = paddingRight,
    _a[paddingRight] = paddingLeft,
    _a[right] = left,
    _a);
// Map of I18N property names to their LTR equivalent.
var PROPERTIES_I18N = {
    borderTopStartRadius: borderTopLeftRadius,
    borderTopEndRadius: borderTopRightRadius,
    borderBottomStartRadius: borderBottomLeftRadius,
    borderBottomEndRadius: borderBottomRightRadius,
    borderStartColor: borderLeftColor,
    borderStartStyle: borderLeftStyle,
    borderStartWidth: borderLeftWidth,
    borderEndColor: borderRightColor,
    borderEndStyle: borderRightStyle,
    borderEndWidth: borderRightWidth,
    end: right,
    marginStart: marginLeft,
    marginEnd: marginRight,
    paddingStart: paddingLeft,
    paddingEnd: paddingRight,
    start: left,
};
var PROPERTIES_VALUE = ['clear', 'float', 'textAlign'];
function atomic(style) {
    var compiledStyle = { $$css: true };
    var compiledRules = [];
    function atomicCompile(prop, value) {
        var valueString = stringifyValueWithProperty(value, prop);
        var cacheKey = prop + valueString;
        var cachedResult = cache.get(cacheKey);
        var identifier;
        if (cachedResult != null) {
            identifier = cachedResult[0];
            compiledRules.push(cachedResult[1]);
        }
        else {
            identifier = createIdentifier('r', prop, value);
            var order = customGroup[prop] || atomicGroup;
            var rules = createAtomicRules(identifier, prop, value);
            var orderedRules = [rules, order];
            compiledRules.push(orderedRules);
            cache.set(cacheKey, [identifier, orderedRules]);
        }
        return identifier;
    }
    Object.keys(style)
        .sort()
        .forEach(function (prop) {
        var value = style[prop];
        if (value != null) {
            var localizeableValue_1;
            // BiDi flip values
            if (PROPERTIES_VALUE.indexOf(prop) > -1) {
                var left_1 = atomicCompile(prop, 'left');
                var right_1 = atomicCompile(prop, 'right');
                if (value === 'start') {
                    localizeableValue_1 = [left_1, right_1];
                }
                else if (value === 'end') {
                    localizeableValue_1 = [right_1, left_1];
                }
            }
            // BiDi flip properties
            var propPolyfill = PROPERTIES_I18N[prop];
            if (propPolyfill != null) {
                var ltr = atomicCompile(propPolyfill, value);
                var rtl = atomicCompile(PROPERTIES_FLIP[propPolyfill], value);
                localizeableValue_1 = [ltr, rtl];
            }
            // BiDi flip transitionProperty value
            if (prop === 'transitionProperty') {
                var values = Array.isArray(value) ? value : [value];
                var polyfillIndices = [];
                for (var i = 0; i < values.length; i++) {
                    var val = values[i];
                    if (typeof val === 'string' && PROPERTIES_I18N[val] != null) {
                        polyfillIndices.push(i);
                    }
                }
                if (polyfillIndices.length > 0) {
                    var ltrPolyfillValues_1 = __spreadArray([], values, true);
                    var rtlPolyfillValues_1 = __spreadArray([], values, true);
                    polyfillIndices.forEach(function (i) {
                        var ltrVal = ltrPolyfillValues_1[i];
                        if (typeof ltrVal === 'string') {
                            var ltrPolyfill = PROPERTIES_I18N[ltrVal];
                            var rtlPolyfill = PROPERTIES_FLIP[ltrPolyfill];
                            ltrPolyfillValues_1[i] = ltrPolyfill;
                            rtlPolyfillValues_1[i] = rtlPolyfill;
                            var ltr = atomicCompile(prop, ltrPolyfillValues_1);
                            var rtl = atomicCompile(prop, rtlPolyfillValues_1);
                            localizeableValue_1 = [ltr, rtl];
                        }
                    });
                }
            }
            if (localizeableValue_1 == null) {
                localizeableValue_1 = atomicCompile(prop, value);
            }
            else {
                compiledStyle['$$css$localize'] = true;
            }
            compiledStyle[prop] = localizeableValue_1;
        }
    });
    return [compiledStyle, compiledRules];
}
/**
 * Compile simple style object to classic CSS rules.
 * No support for 'placeholderTextColor', 'scrollbarWidth', or 'pointerEvents'.
 */
function classic(style, name) {
    var compiledStyle = { $$css: true };
    var compiledRules = [];
    var animationKeyframes = style.animationKeyframes, rest = __rest(style, ["animationKeyframes"]);
    var identifier = createIdentifier('css', name, style);
    var selector = ".".concat(identifier);
    var animationName;
    if (animationKeyframes != null) {
        var _a = processKeyframesValue(animationKeyframes), animationNames = _a[0], keyframesRules = _a[1];
        animationName = animationNames.join(',');
        compiledRules.push.apply(compiledRules, keyframesRules);
    }
    var block = createDeclarationBlock(__assign(__assign({}, rest), { animationName: animationName }));
    compiledRules.push("".concat(selector).concat(block));
    compiledStyle[identifier] = identifier;
    return [compiledStyle, [[compiledRules, classicGroup]]];
}
/**
 * Compile simple style object to inline DOM styles.
 * No support for 'animationKeyframes', 'placeholderTextColor', 'scrollbarWidth', or 'pointerEvents'.
 */
function inline(originalStyle, isRTL) {
    var style = originalStyle || emptyObject;
    var frozenProps = {};
    var nextStyle = {};
    var _loop_1 = function (originalProp) {
        var originalValue = style[originalProp];
        var prop = originalProp;
        var value = originalValue;
        if (!Object.prototype.hasOwnProperty.call(style, originalProp) ||
            originalValue == null) {
            return "continue";
        }
        // BiDi flip values
        if (PROPERTIES_VALUE.indexOf(originalProp) > -1) {
            if (originalValue === 'start') {
                value = isRTL ? 'right' : 'left';
            }
            else if (originalValue === 'end') {
                value = isRTL ? 'left' : 'right';
            }
        }
        // BiDi flip properties
        var propPolyfill = PROPERTIES_I18N[originalProp];
        if (propPolyfill != null) {
            prop = isRTL ? PROPERTIES_FLIP[propPolyfill] : propPolyfill;
        }
        // BiDi flip transitionProperty value
        if (originalProp === 'transitionProperty') {
            // @ts-ignore
            var originalValues_1 = Array.isArray(originalValue)
                ? originalValue
                : [originalValue];
            originalValues_1.forEach(function (val, i) {
                if (typeof val === 'string') {
                    var valuePolyfill = PROPERTIES_I18N[val];
                    if (valuePolyfill != null) {
                        originalValues_1[i] = isRTL ? PROPERTIES_FLIP[valuePolyfill] : valuePolyfill;
                    }
                }
            });
        }
        // Create finalized style
        if (!frozenProps[prop]) {
            nextStyle[prop] = value;
        }
        if (PROPERTIES_I18N.hasOwnProperty(originalProp)) {
            frozenProps[prop] = true;
        }
    };
    for (var originalProp in style) {
        _loop_1(originalProp);
    }
    return (0, createReactDOMStyle_1.createReactDOMStyle)(nextStyle, true);
}
/**
 * Create a value string that normalizes different input values with a common
 * output.
 */
function stringifyValueWithProperty(value, property) {
    // e.g., 0 => '0px', 'black' => 'rgba(0,0,0,1)'
    var normalizedValue = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(value, property);
    return typeof normalizedValue !== 'string'
        ? JSON.stringify(normalizedValue || '')
        : normalizedValue;
}
/**
 * Create the Atomic CSS rules needed for a given StyleSheet rule.
 * Translates StyleSheet declarations to CSS.
 */
function createAtomicRules(identifier, property, value) {
    var _a;
    var rules = [];
    var selector = ".".concat(identifier);
    // Handle non-standard properties and object values that require multiple
    // CSS rules to be created.
    switch (property) {
        case 'animationKeyframes': {
            var _b = processKeyframesValue(value), animationNames = _b[0], keyframesRules = _b[1];
            var block = createDeclarationBlock({
                animationName: animationNames.join(','),
            });
            rules.push.apply(rules, __spreadArray(["".concat(selector).concat(block)], keyframesRules, false));
            break;
        }
        // Equivalent to using '::placeholder'
        case 'placeholderTextColor': {
            var block = createDeclarationBlock({ color: value, opacity: 1 });
            rules.push("".concat(selector, "::-webkit-input-placeholder").concat(block), "".concat(selector, "::-moz-placeholder").concat(block), "".concat(selector, ":-ms-input-placeholder").concat(block), "".concat(selector, "::placeholder").concat(block));
            break;
        }
        // Polyfill for additional 'pointer-events' values
        // See d13f78622b233a0afc0c7a200c0a0792c8ca9e58
        case 'pointerEvents': {
            var finalValue = value;
            if (value === 'auto' || value === 'box-only') {
                finalValue = 'auto!important';
                if (value === 'box-only') {
                    var block_1 = createDeclarationBlock({ pointerEvents: 'none' });
                    rules.push("".concat(selector, ">*").concat(block_1));
                }
            }
            else if (value === 'none' || value === 'box-none') {
                finalValue = 'none!important';
                if (value === 'box-none') {
                    var block_2 = createDeclarationBlock({ pointerEvents: 'auto' });
                    rules.push("".concat(selector, ">*").concat(block_2));
                }
            }
            var block = createDeclarationBlock({ pointerEvents: finalValue });
            rules.push("".concat(selector).concat(block));
            break;
        }
        // Polyfill for draft spec
        // https://drafts.csswg.org/css-scrollbars-1/
        case 'scrollbarWidth': {
            if (value === 'none') {
                rules.push("".concat(selector, "::-webkit-scrollbar{display:none}"));
            }
            var block = createDeclarationBlock({ scrollbarWidth: value });
            rules.push("".concat(selector).concat(block));
            break;
        }
        default: {
            var block = createDeclarationBlock((_a = {}, _a[property] = value, _a));
            rules.push("".concat(selector).concat(block));
            break;
        }
    }
    return rules;
}
/**
 * Creates a CSS declaration block from a StyleSheet object.
 */
function createDeclarationBlock(style) {
    var domStyle = (0, createReactDOMStyle_1.createReactDOMStyle)(style);
    var declarationsString = Object.keys(domStyle)
        .map(function (property) {
        var value = domStyle[property];
        var prop = (0, hyphenateStyleName_1.hyphenateStyleName)(property);
        // The prefixer may return an array of values:
        // { display: [ '-webkit-flex', 'flex' ] }
        // to represent "fallback" declarations
        // { display: -webkit-flex; display: flex; }
        if (Array.isArray(value)) {
            return value.map(function (v) { return "".concat(prop, ":").concat(v); }).join(';');
        }
        else {
            return "".concat(prop, ":").concat(value);
        }
    })
        // Once properties are hyphenated, this will put the vendor
        // prefixed and short-form properties first in the list.
        .sort()
        .join(';');
    return "{".concat(declarationsString, ";}");
}
/**
 * An identifier is associated with a unique set of styles.
 */
function createIdentifier(prefix, name, value) {
    var hashedString = (0, simple_hash_1.simpleHash)(name + stringifyValueWithProperty(value, name));
    return process.env.NODE_ENV !== 'production'
        ? "".concat(prefix, "-").concat(name, "-").concat(hashedString)
        : "".concat(prefix, "-").concat(hashedString);
}
/**
 * Create individual CSS keyframes rules.
 */
function createKeyframes(keyframes) {
    var prefixes = ['-webkit-', ''];
    var identifier = createIdentifier('r', 'animation', keyframes);
    var steps = '{' +
        Object.keys(keyframes)
            .map(function (stepName) {
            var rule = keyframes[stepName];
            var block = createDeclarationBlock(rule);
            return "".concat(stepName).concat(block);
        })
            .join('') +
        '}';
    var rules = prefixes.map(function (prefix) {
        return "@".concat(prefix, "keyframes ").concat(identifier).concat(steps);
    });
    return [identifier, rules];
}
/**
 * Create CSS keyframes rules and names from a StyleSheet keyframes object.
 */
function processKeyframesValue(keyframesValue) {
    if (typeof keyframesValue === 'number') {
        throw new Error("Invalid CSS keyframes type: ".concat(typeof keyframesValue));
    }
    var animationNames = [];
    var rules = [];
    var value = Array.isArray(keyframesValue) ? keyframesValue : [keyframesValue];
    value.forEach(function (keyframes) {
        if (typeof keyframes === 'string') {
            // Support external animation libraries (identifiers only)
            animationNames.push(keyframes);
        }
        else {
            // Create rules for each of the keyframes
            var _a = createKeyframes(keyframes), identifier = _a[0], keyframesRules = _a[1];
            animationNames.push(identifier);
            rules.push.apply(rules, keyframesRules);
        }
    });
    return [animationNames, rules];
}
