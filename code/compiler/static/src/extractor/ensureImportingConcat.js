"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureImportingConcat = ensureImportingConcat;
var t = require("@babel/types");
var importConcatPkg = '@hanzogui/helpers';
function ensureImportingConcat(path) {
    var bodyPath = path.get('body');
    var imported = bodyPath.find(function (x) { return x.isImportDeclaration() && x.node.source.value === importConcatPkg; });
    var importSpecifier = t.importSpecifier(t.identifier('concatClassName'), t.identifier('concatClassName'));
    if (!imported) {
        path.node.body.push(t.importDeclaration([importSpecifier], t.stringLiteral(importConcatPkg)));
        return;
    }
    var specifiers = imported.node.specifiers;
    var alreadyImported = specifiers.some(function (x) {
        return t.isImportSpecifier(x) &&
            t.isIdentifier(x.imported) &&
            x.imported.name === 'concatClassName';
    });
    if (!alreadyImported) {
        specifiers.push(t.importSpecifier(t.identifier('concatClassName'), t.identifier('concatClassName')));
    }
}
