"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildClassNameLogic = exports.buildClassName = void 0;
var t = require("@babel/types");
var buildClassName = function (objectsIn, extras) {
    if (extras === void 0) { extras = ''; }
    var objects = (0, exports.buildClassNameLogic)(objectsIn);
    if (!objects)
        return null;
    if (t.isStringLiteral(objects)) {
        // objects.value = objects.value
        objects.value = "".concat(extras, " ").concat(objects.value);
    }
    else {
        objects = t.binaryExpression('+', t.stringLiteral(extras), objects);
    }
    return objects;
};
exports.buildClassName = buildClassName;
var buildClassNameLogic = function (objects) {
    return objects.reduce(function (acc, val) {
        if (acc == null) {
            if (
            // pass conditional expressions through
            t.isConditionalExpression(val) ||
                // pass non-null literals through
                t.isStringLiteral(val) ||
                t.isNumericLiteral(val)) {
                return val;
            }
            return t.logicalExpression('||', val, t.stringLiteral(''));
        }
        var inner;
        if (t.isStringLiteral(val)) {
            if (t.isStringLiteral(acc)) {
                // join adjacent string literals
                return t.stringLiteral("".concat(acc.value, " ").concat(val.value));
            }
            inner = t.stringLiteral(" ".concat(val.value));
        }
        else if (t.isLiteral(val)) {
            inner = t.binaryExpression('+', t.stringLiteral(' '), val);
        }
        else if (t.isConditionalExpression(val) || t.isBinaryExpression(val)) {
            if (t.isStringLiteral(acc)) {
                return t.binaryExpression('+', t.stringLiteral("".concat(acc.value, " ")), val);
            }
            inner = t.binaryExpression('+', t.stringLiteral(' '), val);
        }
        else if (t.isIdentifier(val) || t.isMemberExpression(val)) {
            // identifiers and member expressions make for reasonable ternaries
            inner = t.conditionalExpression(val, t.binaryExpression('+', t.stringLiteral(' '), val), t.stringLiteral(''));
        }
        else {
            if (t.isStringLiteral(acc)) {
                return t.binaryExpression('+', t.stringLiteral("".concat(acc.value, " ")), t.logicalExpression('||', val, t.stringLiteral('')));
            }
            // use a logical expression for more complex prop values
            inner = t.binaryExpression('+', t.stringLiteral(' '), t.logicalExpression('||', val, t.stringLiteral('')));
        }
        return t.binaryExpression('+', acc, inner);
    }, null);
};
exports.buildClassNameLogic = buildClassNameLogic;
