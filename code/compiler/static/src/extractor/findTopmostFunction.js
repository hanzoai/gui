"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTopmostFunction = findTopmostFunction;
function findTopmostFunction(jsxPath) {
    // get topmost fn
    var isFunction = function (path) {
        return path.isArrowFunctionExpression() ||
            path.isFunctionDeclaration() ||
            path.isFunctionExpression();
    };
    var compFn = jsxPath.findParent(isFunction);
    while (compFn) {
        var parent_1 = compFn.findParent(isFunction);
        if (parent_1) {
            compFn = parent_1;
        }
        else {
            break;
        }
    }
    if (!compFn) {
        // console.error(`Couldn't find a topmost function for media query extraction`)
        return null;
    }
    return compFn;
}
