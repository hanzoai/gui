"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateAstNode = evaluateAstNode;
var t = require("@babel/types");
function evaluateAstNode(exprNode, evalFn, shouldPrintDebug) {
    if (exprNode === undefined) {
        return undefined;
    }
    // null === boolean true (at least in our use cases for jsx eval)
    if (exprNode === null) {
        return true;
    }
    if (t.isJSXExpressionContainer(exprNode)) {
        return evaluateAstNode(exprNode.expression);
    }
    // loop through ObjectExpression keys
    if (t.isObjectExpression(exprNode)) {
        var ret = {};
        for (var idx = -1, len = exprNode.properties.length; ++idx < len;) {
            var value = exprNode.properties[idx];
            if (!t.isObjectProperty(value)) {
                throw new Error('evaluateAstNode can only evaluate object properties');
            }
            var key = void 0;
            if (value.computed) {
                if (typeof evalFn !== 'function') {
                    throw new Error('evaluateAstNode does not support computed keys unless an eval function is provided');
                }
                key = evaluateAstNode(value.key, evalFn);
            }
            else if (t.isIdentifier(value.key)) {
                key = value.key.name;
            }
            else if (t.isStringLiteral(value.key) || t.isNumericLiteral(value.key)) {
                key = value.key.value;
            }
            else {
                throw new Error('Unsupported key type: ' + value.key.type);
            }
            if (typeof key !== 'string' && typeof key !== 'number') {
                throw new Error('key must be either a string or a number');
            }
            ret[key] = evaluateAstNode(value.value, evalFn);
        }
        return ret;
    }
    if (t.isArrayExpression(exprNode)) {
        return exprNode.elements.map(function (x) {
            return evaluateAstNode(x, evalFn);
        });
    }
    if (t.isUnaryExpression(exprNode) && exprNode.operator === '-') {
        var ret = evaluateAstNode(exprNode.argument, evalFn);
        if (ret == null) {
            return null;
        }
        return -ret;
    }
    if (t.isTemplateLiteral(exprNode)) {
        if (typeof evalFn !== 'function') {
            throw new Error('evaluateAstNode does not support template literals unless an eval function is provided');
        }
        var ret = '';
        for (var idx = -1, len = exprNode.quasis.length; ++idx < len;) {
            var quasi = exprNode.quasis[idx];
            var expr = exprNode.expressions[idx];
            ret += quasi.value.raw;
            if (expr) {
                ret += evaluateAstNode(expr, evalFn);
            }
        }
        return ret;
    }
    // In the interest of representing the "evaluated" prop
    // as the user intended, we support negative null. Why not.
    if (t.isNullLiteral(exprNode)) {
        return null;
    }
    if (t.isNumericLiteral(exprNode) ||
        t.isStringLiteral(exprNode) ||
        t.isBooleanLiteral(exprNode)) {
        // In the interest of representing the "evaluated" prop
        // as the user intended, we support negative null. Why not.
        return exprNode.value;
    }
    if (t.isBinaryExpression(exprNode)) {
        if (exprNode.operator === '+') {
            return (evaluateAstNode(exprNode.left, evalFn) + evaluateAstNode(exprNode.right, evalFn));
        }
        if (exprNode.operator === '-') {
            return (evaluateAstNode(exprNode.left, evalFn) - evaluateAstNode(exprNode.right, evalFn));
        }
        if (exprNode.operator === '*') {
            return (evaluateAstNode(exprNode.left, evalFn) * evaluateAstNode(exprNode.right, evalFn));
        }
        if (exprNode.operator === '/') {
            return (evaluateAstNode(exprNode.left, evalFn) / evaluateAstNode(exprNode.right, evalFn));
        }
    }
    // if we've made it this far, the value has to be evaluated
    if (typeof evalFn !== 'function') {
        throw new Error('evaluateAstNode does not support non-literal values unless an eval function is provided');
    }
    return evalFn(exprNode);
}
