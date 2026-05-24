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
exports.createStrengthenMask = exports.createSoftenMask = exports.createWeakenMask = exports.createShiftMask = exports.createInverseMask = exports.createIdentityMask = exports.skipMask = exports.createMask = void 0;
var helpers_1 = require("./helpers");
var isMinusZero_1 = require("./isMinusZero");
var createMask = function (createMask) {
    return typeof createMask === 'function'
        ? { name: createMask.name || 'unnamed', mask: createMask }
        : createMask;
};
exports.createMask = createMask;
exports.skipMask = {
    name: 'skip-mask',
    mask: function (template, opts) {
        var skip = opts.skip;
        var result = Object.fromEntries(Object.entries(template)
            .filter(function (_a) {
            var k = _a[0];
            return !skip || !(k in skip);
        })
            .map(function (_a) {
            var k = _a[0], v = _a[1];
            return [k, applyOverrides(k, v, opts)];
        }));
        return result;
    },
};
function applyOverrides(key, value, opts) {
    var _a, _b, _c;
    var override;
    var strategy = opts.overrideStrategy;
    var overrideSwap = (_a = opts.overrideSwap) === null || _a === void 0 ? void 0 : _a[key];
    if (typeof overrideSwap !== 'undefined') {
        override = overrideSwap;
        strategy = 'swap';
    }
    else {
        var overrideShift = (_b = opts.overrideShift) === null || _b === void 0 ? void 0 : _b[key];
        if (typeof overrideShift !== 'undefined') {
            override = overrideShift;
            strategy = 'shift';
        }
        else {
            var overrideDefault = (_c = opts.override) === null || _c === void 0 ? void 0 : _c[key];
            if (typeof overrideDefault !== 'undefined') {
                override = overrideDefault;
                strategy = opts.overrideStrategy;
            }
        }
    }
    if (typeof override === 'undefined')
        return value;
    if (typeof override === 'string')
        return value;
    if (strategy === 'swap') {
        return override;
    }
    return value;
}
var createIdentityMask = function () { return ({
    name: 'identity-mask',
    mask: function (template, opts) { return exports.skipMask.mask(template, opts); },
}); };
exports.createIdentityMask = createIdentityMask;
var createInverseMask = function () {
    var mask = {
        name: 'inverse-mask',
        mask: function (template, opts) {
            var inversed = (0, helpers_1.objectFromEntries)((0, helpers_1.objectEntries)(template).map(function (_a) {
                var k = _a[0], v = _a[1];
                return [k, -v];
            }));
            return exports.skipMask.mask(inversed, opts);
        },
    };
    return mask;
};
exports.createInverseMask = createInverseMask;
var createShiftMask = function (_a, defaultOptions) {
    var _b = _a === void 0 ? {} : _a, inverse = _b.inverse;
    var mask = {
        name: 'shift-mask',
        mask: function (template, opts) {
            var _a = __assign(__assign({}, defaultOptions), opts), override = _a.override, _b = _a.overrideStrategy, overrideStrategy = _b === void 0 ? 'shift' : _b, maxIn = _a.max, palette = _a.palette, _c = _a.min, min = _c === void 0 ? 0 : _c, _d = _a.strength, strength = _d === void 0 ? 1 : _d;
            var values = Object.entries(template);
            var max = maxIn !== null && maxIn !== void 0 ? maxIn : (palette ? Object.values(palette).length - 1 : Number.POSITIVE_INFINITY);
            var out = {};
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var _e = values_1[_i], key = _e[0], value = _e[1];
                if (typeof value === 'string')
                    continue;
                if (typeof (override === null || override === void 0 ? void 0 : override[key]) === 'number') {
                    var overrideVal = override[key];
                    out[key] = overrideStrategy === 'shift' ? value + overrideVal : overrideVal;
                    continue;
                }
                if (typeof (override === null || override === void 0 ? void 0 : override[key]) === 'string') {
                    out[key] = override[key];
                    continue;
                }
                var isPositive = value === 0 ? !(0, isMinusZero_1.isMinusZero)(value) : value >= 0;
                var direction = isPositive ? 1 : -1;
                var invert = inverse ? -1 : 1;
                var next = value + strength * direction * invert;
                var clamped = isPositive
                    ? Math.max(min, Math.min(max, next))
                    : Math.min(-min, Math.max(-max, next));
                out[key] = clamped;
            }
            var skipped = exports.skipMask.mask(out, opts);
            return skipped;
        },
    };
    return mask;
};
exports.createShiftMask = createShiftMask;
var createWeakenMask = function (defaultOptions) { return ({
    name: 'soften-mask',
    mask: (0, exports.createShiftMask)({}, defaultOptions).mask,
}); };
exports.createWeakenMask = createWeakenMask;
exports.createSoftenMask = exports.createWeakenMask;
var createStrengthenMask = function (defaultOptions) { return ({
    name: 'strengthen-mask',
    mask: (0, exports.createShiftMask)({ inverse: true }, defaultOptions).mask,
}); };
exports.createStrengthenMask = createStrengthenMask;
