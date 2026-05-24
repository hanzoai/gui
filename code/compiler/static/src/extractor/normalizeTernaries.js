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
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTernaries = normalizeTernaries;
var generator_1 = require("@babel/generator");
var t = require("@babel/types");
var web_1 = require("@hanzogui/web");
var invariant_1 = require("invariant");
var propsToFontFamilyCache_1 = require("./propsToFontFamilyCache");
function normalizeTernaries(ternaries) {
    var _a, _b;
    (0, invariant_1.default)(Array.isArray(ternaries), 'extractStaticTernaries expects param 1 to be an array of ternaries');
    if (ternaries.length === 0) {
        return [];
    }
    var ternariesByKey = {};
    for (var idx = -1, len = ternaries.length; ++idx < len;) {
        var _c = ternaries[idx], test_1 = _c.test, consequent = _c.consequent, alternate = _c.alternate, remove = _c.remove, rest = __rest(_c, ["test", "consequent", "alternate", "remove"]);
        var ternaryTest = test_1;
        // strip parens
        if (t.isExpressionStatement(test_1)) {
            ternaryTest = test_1.expression;
        }
        // convert `!thing` to `thing` with swapped consequent and alternate
        var shouldSwap = false;
        if (t.isUnaryExpression(test_1) && test_1.operator === '!') {
            ternaryTest = test_1.argument;
            shouldSwap = true;
        }
        else if (t.isBinaryExpression(test_1)) {
            if (test_1.operator === '!==' || test_1.operator === '!=') {
                ternaryTest = t.binaryExpression(test_1.operator.replace('!', '='), test_1.left, test_1.right);
                shouldSwap = true;
            }
        }
        // @ts-ignore
        var key = (0, generator_1.default)(ternaryTest).code;
        if (!ternariesByKey[key]) {
            ternariesByKey[key] = __assign(__assign({}, rest), { alternate: {}, consequent: {}, test: ternaryTest, remove: remove });
        }
        var altStyle = (_a = (shouldSwap ? consequent : alternate)) !== null && _a !== void 0 ? _a : {};
        var consStyle = (_b = (shouldSwap ? alternate : consequent)) !== null && _b !== void 0 ? _b : {};
        var nextAlt = ternariesByKey[key].alternate;
        ternariesByKey[key].alternate = (0, web_1.mergeProps)(altStyle, nextAlt);
        (0, propsToFontFamilyCache_1.forwardFontFamilyName)(altStyle, ternariesByKey[key].alternate);
        var nextCons = ternariesByKey[key].consequent;
        ternariesByKey[key].consequent = (0, web_1.mergeProps)(consStyle, nextCons);
        (0, propsToFontFamilyCache_1.forwardFontFamilyName)(consStyle, ternariesByKey[key].consequent);
    }
    var ternaryExpression = Object.keys(ternariesByKey).map(function (key) {
        return ternariesByKey[key];
    });
    return ternaryExpression;
}
