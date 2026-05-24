"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hoistClassNames = hoistClassNames;
var t = require("@babel/types");
function hoistClassNames(path, existing, expr) {
    var hoist = hoistClassNames.bind(null, path, existing);
    if (t.isStringLiteral(expr)) {
        if (expr.value.trim() === '') {
            return expr;
        }
        if (existing[expr.value]) {
            return existing[expr.value];
        }
        var identifier = replaceStringWithVariable(expr);
        existing[expr.value] = identifier;
        return identifier;
    }
    if (t.isBinaryExpression(expr)) {
        if (t.isPrivateName(expr.left)) {
            throw new Error("no private name");
        }
        return t.binaryExpression(expr.operator, hoist(expr.left), hoist(expr.right));
    }
    if (t.isLogicalExpression(expr)) {
        return t.logicalExpression(expr.operator, hoist(expr.left), hoist(expr.right));
    }
    if (t.isConditionalExpression(expr)) {
        return t.conditionalExpression(expr.test, hoist(expr.consequent), hoist(expr.alternate));
    }
    return expr;
    function replaceStringWithVariable(str) {
        // hoist outside fn!
        var uid = path.scope.generateUidIdentifier('cn');
        var parent = path.findParent(function (path) { return path.isProgram(); });
        if (!parent)
            throw new Error("no program?");
        var variable = t.variableDeclaration('const', [
            // adding a space for extra safety
            t.variableDeclarator(uid, t.stringLiteral(" ".concat(str.value))),
        ]);
        // @ts-ignore
        parent.unshiftContainer('body', variable);
        return uid;
    }
}
