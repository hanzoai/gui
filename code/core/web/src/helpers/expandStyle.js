"use strict";
/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandStyle = expandStyle;
var constants_1 = require("@hanzogui/constants");
var config_1 = require("../config");
var parseBorderShorthand_1 = require("./parseBorderShorthand");
var parseOutlineShorthand_1 = require("./parseOutlineShorthand");
var neg1Flex = [
    ['flexGrow', 0],
    ['flexShrink', 1],
    ['flexBasis', 'auto'],
];
function expandStyle(key, value) {
    if (process.env.TAMAGUI_TARGET === 'web') {
        if (key === 'flex') {
            if (value === -1) {
                return neg1Flex;
            }
            return [
                ['flexGrow', value],
                ['flexShrink', 1],
                ['flexBasis', (0, config_1.getSetting)('styleCompat') === 'legacy' ? 'auto' : 0],
            ];
        }
        switch (key) {
            case 'writingDirection': {
                return [['direction', value]];
            }
            // some safari-based browsers seem not to support without -webkit prefix
            case 'backdropFilter': {
                return [
                    ['backdropFilter', value],
                    ['WebkitBackdropFilter', value],
                ];
            }
        }
    }
    if (process.env.TAMAGUI_TARGET === 'native') {
        if (constants_1.isAndroid && key === 'elevationAndroid') {
            return [['elevation', value]];
        }
        // native-only value transforms
        switch (key) {
            case 'objectFit': {
                var resizeMode = resizeModeMap[value] || 'cover';
                return [['resizeMode', resizeMode]];
            }
            case 'verticalAlign': {
                return [['textAlignVertical', verticalAlignMap[value] || 'auto']];
            }
            case 'position': {
                // position: fixed|sticky -> absolute on native
                if (value === 'fixed' || value === 'sticky') {
                    return [['position', 'absolute']];
                }
                return;
            }
            case 'backgroundImage': {
                // RN 0.76+ uses experimental_backgroundImage
                // value may be a parsed array (from parseNativeStyle) or a plain string
                return [['experimental_backgroundImage', value]];
            }
            case 'border': {
                // parse border shorthand string to individual properties
                // on native, only supports a single border (all sides)
                if (typeof value === 'string') {
                    var parsed = (0, parseBorderShorthand_1.parseBorderShorthand)(value);
                    if (parsed) {
                        return parsed;
                    }
                }
                return;
            }
            case 'outline': {
                if (typeof value === 'string') {
                    var parsed = (0, parseOutlineShorthand_1.parseOutlineShorthand)(value);
                    if (parsed) {
                        return parsed;
                    }
                }
                return;
            }
        }
        // native-only key expansions (logical properties)
        if (key in nativeExpansions) {
            return nativeExpansions[key].map(function (k) { return [k, value]; });
        }
    }
    if (key in EXPANSIONS) {
        return EXPANSIONS[key].map(function (k) { return [k, value]; });
    }
}
// native value transforms
var resizeModeMap = {
    fill: 'stretch',
    none: 'center',
    'scale-down': 'contain',
    contain: 'contain',
    cover: 'cover',
};
var verticalAlignMap = {
    top: 'top',
    middle: 'center',
    bottom: 'bottom',
    auto: 'auto',
};
// shared expansions
var all = ['Top', 'Right', 'Bottom', 'Left'];
var horiz = ['Right', 'Left'];
var vert = ['Top', 'Bottom'];
var xy = ['X', 'Y'];
var EXPANSIONS = __assign({ borderColor: ['TopColor', 'RightColor', 'BottomColor', 'LeftColor'], borderRadius: [
        'TopLeftRadius',
        'TopRightRadius',
        'BottomRightRadius',
        'BottomLeftRadius',
    ], borderWidth: ['TopWidth', 'RightWidth', 'BottomWidth', 'LeftWidth'], margin: all, marginHorizontal: horiz, marginVertical: vert, padding: all, paddingHorizontal: horiz, paddingVertical: vert }, (constants_1.isWeb && {
    // react-native only supports borderStyle
    borderStyle: ['TopStyle', 'RightStyle', 'BottomStyle', 'LeftStyle'],
    // react-native doesn't support X / Y
    overflow: xy,
    overscrollBehavior: xy,
}));
var _loop_1 = function (parent_1) {
    var prefix = parent_1.slice(0, (_b = (_a = /[A-Z]/.exec(parent_1)) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : parent_1.length);
    EXPANSIONS[parent_1] = EXPANSIONS[parent_1].map(function (k) { return "".concat(prefix).concat(k); });
};
for (var parent_1 in EXPANSIONS) {
    _loop_1(parent_1);
}
// native-only expansions (logical properties not supported in RN)
var nativeExpansions = {
    // logical border properties
    borderBlockColor: ['borderTopColor', 'borderBottomColor'],
    borderInlineColor: ['borderEndColor', 'borderStartColor'],
    borderBlockWidth: ['borderTopWidth', 'borderBottomWidth'],
    borderInlineWidth: ['borderEndWidth', 'borderStartWidth'],
    borderBlockStyle: ['borderTopStyle', 'borderBottomStyle'],
    borderInlineStyle: ['borderEndStyle', 'borderStartStyle'],
    borderBlockStartColor: ['borderTopColor'],
    borderBlockEndColor: ['borderBottomColor'],
    borderInlineStartColor: ['borderStartColor'],
    borderInlineEndColor: ['borderEndColor'],
    borderBlockStartWidth: ['borderTopWidth'],
    borderBlockEndWidth: ['borderBottomWidth'],
    borderInlineStartWidth: ['borderStartWidth'],
    borderInlineEndWidth: ['borderEndWidth'],
    borderBlockStartStyle: ['borderTopStyle'],
    borderBlockEndStyle: ['borderBottomStyle'],
    borderInlineStartStyle: ['borderStartStyle'],
    borderInlineEndStyle: ['borderEndStyle'],
    // logical margin/padding
    marginBlock: ['marginTop', 'marginBottom'],
    marginInline: ['marginEnd', 'marginStart'],
    paddingBlock: ['paddingTop', 'paddingBottom'],
    paddingInline: ['paddingEnd', 'paddingStart'],
    marginBlockStart: ['marginTop'],
    marginBlockEnd: ['marginBottom'],
    marginInlineStart: ['marginStart'],
    marginInlineEnd: ['marginEnd'],
    paddingBlockStart: ['paddingTop'],
    paddingBlockEnd: ['paddingBottom'],
    paddingInlineStart: ['paddingStart'],
    paddingInlineEnd: ['paddingEnd'],
    // logical sizing
    minBlockSize: ['minHeight'],
    maxBlockSize: ['maxHeight'],
    minInlineSize: ['minWidth'],
    maxInlineSize: ['maxWidth'],
    blockSize: ['height'],
    inlineSize: ['width'],
    // inset
    inset: ['top', 'right', 'bottom', 'left'],
    insetBlock: ['top', 'bottom'],
    insetBlockStart: ['top'],
    insetBlockEnd: ['bottom'],
    insetInlineStart: ['left'],
    insetInlineEnd: ['right'],
};
