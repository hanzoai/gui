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
exports.literalToAst = literalToAst;
exports.astToLiteral = astToLiteral;
var t = require("@babel/types");
function literalToAst(literal) {
    if (literal === null) {
        return t.nullLiteral();
    }
    switch (typeof literal) {
        case 'function':
            throw new Error('Unsupported');
        case 'number':
            return t.numericLiteral(literal);
        case 'string':
            return t.stringLiteral(literal);
        case 'boolean':
            return t.booleanLiteral(literal);
        case 'undefined':
            return t.unaryExpression('void', t.numericLiteral(0), true);
        default:
            if (Array.isArray(literal)) {
                return t.arrayExpression(literal.map(literalToAst));
            }
            return t.objectExpression(Object.keys(literal)
                .filter(function (k) {
                return typeof literal[k] !== 'undefined';
            })
                .map(function (k) {
                return t.objectProperty(t.stringLiteral(k), literalToAst(literal[k]));
            }));
    }
}
var easyPeasies = ['BooleanLiteral', 'StringLiteral', 'NumericLiteral'];
function astToLiteral(node) {
    if (!node) {
        return;
    }
    if (easyPeasies.includes(node.type)) {
        return node.value;
    }
    if (node.name === 'undefined' && !node.value) {
        return undefined;
    }
    if (t.isNullLiteral(node)) {
        return null;
    }
    if (t.isObjectExpression(node)) {
        return computeProps(node.properties);
    }
    if (t.isArrayExpression(node)) {
        return node.elements.reduce(
        // @ts-ignore
        function (acc, element) { return __spreadArray(__spreadArray([], acc, true), ((element === null || element === void 0 ? void 0 : element.type) === 'SpreadElement'
            ? astToLiteral(element.argument)
            : [astToLiteral(element)]), true); }, []);
    }
}
function computeProps(props) {
    return props.reduce(function (acc, prop) {
        var _a;
        if (prop.type === 'SpreadElement') {
            return __assign(__assign({}, acc), astToLiteral(prop.argument));
        }
        if (prop.type !== 'ObjectMethod') {
            var val = astToLiteral(prop.value);
            if (val !== undefined) {
                return __assign(__assign({}, acc), (_a = {}, _a[prop.key.name] = val, _a));
            }
        }
        return acc;
    }, {});
}
