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
exports.tokens = exports.radius = exports.zIndex = exports.space = exports.spacesNegative = exports.spaces = exports.size = void 0;
var utils_1 = require("./utils");
// the same as v3 for now, but duplicated to avoid accidental changes to both
// --- tokens ---
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
exports.spaces = Object.entries(exports.size).map(function (_a) {
    var k = _a[0], v = _a[1];
    return [k, (0, utils_1.sizeToSpace)(v)];
});
exports.spacesNegative = exports.spaces.slice(1).map(function (_a) {
    var k = _a[0], v = _a[1];
    return ["-".concat(k.slice(1)), -v];
});
exports.space = __assign(__assign({}, Object.fromEntries(exports.spaces)), Object.fromEntries(exports.spacesNegative));
exports.zIndex = {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
};
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
exports.tokens = {
    radius: exports.radius,
    zIndex: exports.zIndex,
    space: exports.space,
    size: exports.size,
};
