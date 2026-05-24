"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvaluator = createEvaluator;
exports.createSafeEvaluator = createSafeEvaluator;
var node_vm_1 = require("node:vm");
var generator_1 = require("@babel/generator");
var t = require("@babel/types");
var esbuild_1 = require("esbuild");
var constants_1 = require("../constants");
var evaluateAstNode_1 = require("./evaluateAstNode");
function createEvaluator(_a) {
    var props = _a.props, staticNamespace = _a.staticNamespace, sourcePath = _a.sourcePath, traversePath = _a.traversePath, shouldPrintDebug = _a.shouldPrintDebug;
    // called when evaluateAstNode encounters a dynamic-looking prop
    var evalFn = function (n) {
        // variable
        if (t.isIdentifier(n) && typeof staticNamespace[n.name] !== 'undefined') {
            return staticNamespace[n.name];
        }
        var evalContext = node_vm_1.default.createContext(staticNamespace);
        // @ts-ignore
        var codeWithTypescriptAnnotations = "(".concat((0, generator_1.default)(n).code, ")");
        var code = esbuild_1.default
            .transformSync(codeWithTypescriptAnnotations, { loader: 'tsx' })
            .code.replace(/;\n$/, '');
        if (shouldPrintDebug) {
            console.info('evaluating', code);
        }
        var result1 = node_vm_1.default.runInContext(code, evalContext);
        var result2 = node_vm_1.default.runInContext(code, evalContext);
        var isDeterministic = Object.is(result1, result2) ||
            (typeof result1 === 'object' &&
                typeof result2 === 'object' &&
                JSON.stringify(result1) === JSON.stringify(result2));
        if (!isDeterministic) {
            if (shouldPrintDebug) {
                console.info('Bailing on non-deterministic expression:', code, '\nFirst result:', result1, 'Second result:', result2);
            }
            throw new Error("Non-deterministic value, bailing");
        }
        return result1;
    };
    return function (n) {
        return (0, evaluateAstNode_1.evaluateAstNode)(n, evalFn);
    };
}
function createSafeEvaluator(attemptEval) {
    return function (n) {
        try {
            return attemptEval(n);
        }
        catch (err) {
            return constants_1.FAILED_EVAL;
        }
    };
}
