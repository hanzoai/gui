"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokens = exports.radius = exports.color = exports.lightColors = exports.darkColors = exports.colorTokens = exports.zIndex = exports.space = exports.size = void 0;
var legacy_1 = require("@hanzogui/colors/legacy");
var web_1 = require("@hanzogui/web");
// should roughly map to button/input etc height at each level
// fonts should match that height/lineHeight at each stop
// so these are really non-linear on purpose
// why?
//   - at sizes <1, used for fine grained things (borders, smallest paddingY)
//     - so smallest padY should be roughly 1-4px so it can join with lineHeight
//   - at sizes >=1, have to consider "pressability" (jumps up)
//   - after that it should go upwards somewhat naturally
//   - H1 / headings top out at 10 naturally, so after 10 we can go upwards faster
//  but also one more wrinkle...
//  space is used in conjunction with size
//  i'm setting space to generally just a fixed fraction of size (~1/3-2/3 still fine tuning)
exports.size = {
    $0: 0,
    '$0.25': 2,
    '$0.5': 4,
    '$0.75': 8,
    $1: 20,
    '$1.5': 24,
    $2: 28,
    '$2.5': 32,
    $3: 36,
    '$3.5': 40,
    $4: 44,
    $true: 44,
    '$4.5': 48,
    $5: 52,
    $6: 64,
    $7: 74,
    $8: 84,
    $9: 94,
    $10: 104,
    $11: 124,
    $12: 144,
    $13: 164,
    $14: 184,
    $15: 204,
    $16: 224,
    $17: 224,
    $18: 244,
    $19: 264,
    $20: 284,
};
var spaces = Object.entries(exports.size).map(function (_a) {
    var k = _a[0], v = _a[1];
    return [k, sizeToSpace(v)];
});
// a bit odd but keeping backward compat for values >8 while fixing below
function sizeToSpace(v) {
    if (v === 0)
        return 0;
    if (v === 2)
        return 0.5;
    if (v === 4)
        return 1;
    if (v === 8)
        return 1.5;
    if (v <= 16)
        return Math.round(v * 0.333);
    return Math.floor(v * 0.7 - 12);
}
var spacesNegative = spaces.slice(1).map(function (_a) {
    var k = _a[0], v = _a[1];
    return ["-".concat(k.slice(1)), -v];
});
exports.space = __assign(__assign({}, Object.fromEntries(spaces)), Object.fromEntries(spacesNegative));
exports.zIndex = {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
};
exports.colorTokens = {
    light: {
        blue: legacy_1.blue,
        gray: legacy_1.gray,
        green: legacy_1.green,
        orange: legacy_1.orange,
        pink: legacy_1.pink,
        purple: legacy_1.purple,
        red: legacy_1.red,
        yellow: legacy_1.yellow,
    },
    dark: {
        blue: legacy_1.blueDark,
        gray: legacy_1.grayDark,
        green: legacy_1.greenDark,
        orange: legacy_1.orangeDark,
        pink: legacy_1.pinkDark,
        purple: legacy_1.purpleDark,
        red: legacy_1.redDark,
        yellow: legacy_1.yellowDark,
    },
};
exports.darkColors = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, exports.colorTokens.dark.blue), exports.colorTokens.dark.gray), exports.colorTokens.dark.green), exports.colorTokens.dark.orange), exports.colorTokens.dark.pink), exports.colorTokens.dark.purple), exports.colorTokens.dark.red), exports.colorTokens.dark.yellow);
exports.lightColors = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, exports.colorTokens.light.blue), exports.colorTokens.light.gray), exports.colorTokens.light.green), exports.colorTokens.light.orange), exports.colorTokens.light.pink), exports.colorTokens.light.purple), exports.colorTokens.light.red), exports.colorTokens.light.yellow);
exports.color = __assign(__assign({}, postfixObjKeys(exports.lightColors, 'Light')), postfixObjKeys(exports.darkColors, 'Dark'));
function postfixObjKeys(obj, postfix) {
    return Object.fromEntries(Object.entries(obj).map(function (_a) {
        var k = _a[0], v = _a[1];
        return ["".concat(k).concat(postfix), v];
    }));
}
exports.radius = {
    0: 0,
    1: 3,
    2: 5,
    3: 7,
    4: 9,
    true: 9,
    5: 10,
    6: 16,
    7: 19,
    8: 22,
    9: 26,
    10: 34,
    11: 42,
    12: 50,
};
exports.tokens = (0, web_1.createTokens)({
    color: exports.color,
    radius: exports.radius,
    zIndex: exports.zIndex,
    space: exports.space,
    size: exports.size,
});
