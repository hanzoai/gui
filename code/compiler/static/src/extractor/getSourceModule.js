"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceModule = getSourceModule;
var t = require("@babel/types");
function getSourceModule(itemName, itemBinding) {
    // TODO: deal with reassignment
    if (!itemBinding.constant) {
        return null;
    }
    var sourceModule;
    var imported;
    var local;
    var destructured;
    var usesImportSyntax = false;
    var itemNode = itemBinding.path.node;
    if (t.isImportDefaultSpecifier(itemNode) || t.isImportSpecifier(itemNode)) {
        if (t.isImportDeclaration(itemBinding.path.parent)) {
            sourceModule = itemBinding.path.parent.source.value;
            local = itemNode.local.name;
            usesImportSyntax = true;
            if (t.isImportSpecifier(itemNode)) {
                imported = itemNode.imported['name'];
                destructured = true;
            }
            else {
                imported = itemNode.local.name;
                destructured = false;
            }
        }
    }
    else if (t.isVariableDeclarator(itemNode) &&
        itemNode.init != null &&
        t.isCallExpression(itemNode.init) &&
        t.isIdentifier(itemNode.init.callee) &&
        itemNode.init.callee.name === 'require' &&
        itemNode.init.arguments.length === 1) {
        var firstArg = itemNode.init.arguments[0];
        if (!t.isStringLiteral(firstArg)) {
            return null;
        }
        sourceModule = firstArg.value;
        if (t.isIdentifier(itemNode.id)) {
            local = itemNode.id.name;
            imported = itemNode.id.name;
            destructured = false;
        }
        else if (t.isObjectPattern(itemNode.id)) {
            for (var _i = 0, _a = itemNode.id.properties; _i < _a.length; _i++) {
                var objProp = _a[_i];
                if (t.isObjectProperty(objProp) &&
                    t.isIdentifier(objProp.value) &&
                    objProp.value.name === itemName) {
                    local = objProp.value.name;
                    // @ts-ignore TODO remove this is only an issue on CI
                    imported = objProp.key.name;
                    destructured = true;
                    break;
                }
            }
            if (!local || !imported) {
                console.error('could not find prop with value `%s`', itemName);
                return null;
            }
        }
        else {
            console.error('Unhandled id type: %s', itemNode.id.type);
            return null;
        }
    }
    else {
        return null;
    }
    return {
        destructured: destructured,
        imported: imported,
        local: local,
        sourceModule: sourceModule,
        usesImportSyntax: usesImportSyntax,
    };
}
