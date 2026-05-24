"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropValueFromAttributes = getPropValueFromAttributes;
var generator_1 = require("@babel/generator");
var t = require("@babel/types");
var accessSafe_1 = require("./accessSafe");
/**
 * getPropValueFromAttributes gets a prop by name from a list of attributes and accounts for potential spread operators.
 * Here's an example. Given this component:
 * ```
 * <Block coolProp="wow" {...spread1} neatProp="ok" {...spread2} />```
 * getPropValueFromAttributes will return the following:
 * - for propName `coolProp`:
 *   ```
 * accessSafe(spread1, 'coolProp') || accessSafe(spread2, 'coolProp') || 'wow'```
 * - for propName `neatProp`:
 *   ```
 * accessSafe(spread2, 'neatProp') || 'ok'```
 * - for propName `notPresent`: `null`
 *
 * The returned value should (obviously) be placed after spread operators.
 */
function getPropValueFromAttributes(propName, attrs) {
    var propIndex = -1;
    var jsxAttr = null;
    for (var idx = -1, len = attrs.length; ++idx < len;) {
        var attr = attrs[idx];
        if (t.isJSXAttribute(attr) && attr.name && attr.name.name === propName) {
            propIndex = idx;
            jsxAttr = attr;
            break;
        }
    }
    if (!jsxAttr || jsxAttr.value == null) {
        return null;
    }
    var propValue = jsxAttr.value;
    if (t.isJSXExpressionContainer(propValue)) {
        propValue = propValue.expression;
    }
    // TODO how to handle this??
    if (t.isJSXEmptyExpression(propValue)) {
        console.error('encountered JSXEmptyExpression');
        return null;
    }
    // filter out spread props that occur before propValue
    var applicableSpreads = attrs
        .filter(
    // 1. idx is greater than propValue prop index
    // 2. attr is a spread operator
    function (attr, idx) {
        if (t.isJSXSpreadAttribute(attr)) {
            if (t.isIdentifier(attr.argument) || t.isMemberExpression(attr.argument)) {
                return idx > propIndex;
            }
            if (t.isLogicalExpression(attr.argument)) {
                return false;
            }
            throw new Error("unsupported spread of type \"".concat(attr.argument.type, "\": ").concat(
            // @ts-ignore
            (0, generator_1.default)(attr).code));
        }
        return false;
    })
        .map(function (attr) { return attr.argument; });
    // if spread operators occur after propValue, create a binary expression for each operator
    // i.e. before1.propValue || before2.propValue || propValue
    // TODO: figure out how to do this without all the extra parens
    if (applicableSpreads.length > 0) {
        propValue = applicableSpreads.reduce(function (acc, val) { return t.logicalExpression('||', (0, accessSafe_1.accessSafe)(val, propName), acc); }, propValue);
    }
    return propValue;
}
