"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTopLevelAwait = hasTopLevelAwait;
var traverse_1 = require("@babel/traverse");
var babelParse_1 = require("./babelParse");
function hasTopLevelAwait(contents, fileName) {
    if (!contents.includes('await')) {
        return false;
    }
    var ast = (0, babelParse_1.babelParse)(contents, fileName);
    var found = false;
    (0, traverse_1.default)(ast, {
        AwaitExpression: function (path) {
            if (!path.getFunctionParent()) {
                found = true;
                path.stop();
            }
        },
        ForOfStatement: function (path) {
            if (path.node.await && !path.getFunctionParent()) {
                found = true;
                path.stop();
            }
        },
    });
    return found;
}
