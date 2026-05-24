"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUnusedHooks = removeUnusedHooks;
var t = require("@babel/types");
var hooks = {
    useMedia: true,
    useTheme: true,
};
function removeUnusedHooks(compFn, shouldPrintDebug) {
    var _a;
    compFn.scope.crawl();
    // check the top level statements
    var bodyStatements = compFn === null || compFn === void 0 ? void 0 : compFn.get('body');
    if (!bodyStatements) {
        console.info('no body statemnts?', compFn);
        return;
    }
    if (!Array.isArray(bodyStatements)) {
        if (bodyStatements.isFunctionExpression()) {
            bodyStatements = bodyStatements.scope.path.get('body');
        }
        else {
            bodyStatements = bodyStatements.get('body');
        }
    }
    if (!bodyStatements || !Array.isArray(bodyStatements)) {
        return;
    }
    var statements = bodyStatements;
    var _loop_1 = function (statement) {
        if (!statement.isVariableDeclaration()) {
            return "continue";
        }
        var declarations = statement.get('declarations');
        if (!Array.isArray(declarations)) {
            return "continue";
        }
        var isBindingReferenced = function (name) {
            var _a;
            return !!((_a = statement.scope.getBinding(name)) === null || _a === void 0 ? void 0 : _a.referenced);
        };
        var _loop_2 = function (declarator) {
            var id = declarator.get('id');
            var init = declarator.node.init;
            if (Array.isArray(id) || Array.isArray(init)) {
                return "continue";
            }
            var shouldRemove = (function () {
                var isHook = init &&
                    t.isCallExpression(init) &&
                    t.isIdentifier(init.callee) &&
                    hooks[init.callee.name];
                if (!isHook) {
                    return false;
                }
                if (t.isIdentifier(id.node)) {
                    // remove "const media = useMedia()"
                    var name_1 = id.node.name;
                    return !isBindingReferenced(name_1);
                }
                if (t.isObjectPattern(id.node)) {
                    // remove "const { sm } = useMedia()"
                    var propPaths = id.get('properties');
                    return propPaths.every(function (prop) {
                        if (!prop.isObjectProperty())
                            return false;
                        var value = prop.get('value');
                        if (Array.isArray(value) || !value.isIdentifier())
                            return false;
                        var name = value.node.name;
                        return !isBindingReferenced(name);
                    });
                }
                return false;
            })();
            if (shouldRemove) {
                declarator.remove();
                if (shouldPrintDebug) {
                    console.info("  [\uD83E\uDE9D] removed ".concat((_a = id.node['name']) !== null && _a !== void 0 ? _a : ''));
                }
            }
        };
        for (var _b = 0, declarations_1 = declarations; _b < declarations_1.length; _b++) {
            var declarator = declarations_1[_b];
            _loop_2(declarator);
        }
    };
    for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
        var statement = statements_1[_i];
        _loop_1(statement);
    }
}
