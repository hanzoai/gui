"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parserOptions = void 0;
exports.babelParse = babelParse;
var babelParser = require("@babel/parser");
var plugins = [
    'asyncGenerators',
    'classProperties',
    'dynamicImport',
    'functionBind',
    'jsx',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'decorators-legacy',
    'typescript',
    'optionalChaining',
    'nullishCoalescingOperator',
    'topLevelAwait',
];
exports.parserOptions = Object.freeze({
    plugins: plugins,
    sourceType: 'module',
});
var parser = babelParser.parse.bind(babelParser);
function babelParse(code, fileName) {
    var codeString = code.toString();
    try {
        return parser(codeString, exports.parserOptions);
    }
    catch (err) {
        throw new Error("Error parsing babel: ".concat(err, " in ").concat(fileName, ", code:\n").concat(codeString, "\n ").concat(err.stack));
    }
}
