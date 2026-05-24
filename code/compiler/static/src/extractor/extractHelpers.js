"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidComponentsPaths = exports.isValidImport = exports.getValidImport = exports.isValidModule = exports.isComponentPackage = exports.isInsideComponentPackage = exports.ternaryStr = exports.objToStr = exports.attrStr = void 0;
exports.isPresent = isPresent;
exports.isSimpleSpread = isSimpleSpread;
exports.findComponentName = findComponentName;
exports.isValidThemeHook = isValidThemeHook;
exports.getValidComponent = getValidComponent;
var node_path_1 = require("node:path");
var generator_1 = require("@babel/generator");
var t = require("@babel/types");
var find_root_1 = require("find-root");
var memoize_1 = require("../helpers/memoize");
// import { astToLiteral } from './literalToAst'
function isPresent(input) {
    return input != null;
}
function isSimpleSpread(node) {
    return t.isIdentifier(node.argument) || t.isMemberExpression(node.argument);
}
var attrStr = function (attr) {
    return !attr
        ? ''
        : attr.type === 'attr'
            ? getNameAttr(attr.value)
            : attr.type === 'ternary'
                ? "...".concat((0, exports.ternaryStr)(attr.value))
                : "".concat(attr.type, "(").concat((0, exports.objToStr)(attr.value), ")");
};
exports.attrStr = attrStr;
var objToStr = function (obj, spacer) {
    if (spacer === void 0) { spacer = ', '; }
    if (!obj) {
        return "".concat(obj);
    }
    return "{".concat(Object.entries(obj)
        .map(function (_a) {
        var k = _a[0], v = _a[1];
        return "".concat(k, ":").concat(Array.isArray(v)
            ? "[...]"
            : v && typeof v === 'object'
                ? "".concat((0, exports.objToStr)(v, ','))
                : JSON.stringify(v));
    })
        .join(spacer), "}");
};
exports.objToStr = objToStr;
var getNameAttr = function (attr) {
    if (t.isJSXSpreadAttribute(attr)) {
        return "...".concat(attr.argument['name']);
    }
    return 'name' in attr ? attr.name.name : "unknown-".concat(attr['type']);
};
var ternaryStr = function (x) {
    var conditional = t.isIdentifier(x.test)
        ? x.test.name
        : t.isMemberExpression(x.test)
            ? [x.test.object['name'], x.test.property['name']]
            : // @ts-ignore
                (0, generator_1.default)(x.test).code;
    return [
        'ternary(',
        conditional,
        isFilledObj(x.consequent) ? " ? ".concat((0, exports.objToStr)(x.consequent)) : ' ? 🚫',
        isFilledObj(x.alternate) ? " : ".concat((0, exports.objToStr)(x.alternate)) : ' : 🚫',
        ')',
    ]
        .flat()
        .join('');
};
exports.ternaryStr = ternaryStr;
var isFilledObj = function (obj) { return obj && Object.keys(obj).length; };
function findComponentName(scope) {
    var _a;
    var componentName = '';
    var cur = scope.path;
    while (cur.parentPath && !t.isProgram(cur.parentPath.parent)) {
        cur = cur.parentPath;
    }
    var node = cur.parent;
    if (t.isExportNamedDeclaration(node)) {
        node = node.declaration;
    }
    if (t.isVariableDeclaration(node)) {
        var dec = node.declarations[0];
        if (t.isVariableDeclarator(dec) && t.isIdentifier(dec.id)) {
            return dec.id.name;
        }
    }
    if (t.isFunctionDeclaration(node)) {
        return (_a = node.id) === null || _a === void 0 ? void 0 : _a.name;
    }
    return componentName;
}
function isValidThemeHook(props, jsxPath, n, sourcePath) {
    var _a;
    if (!t.isIdentifier(n.object) || !t.isIdentifier(n.property))
        return false;
    var bindings = jsxPath.scope.getAllBindings();
    var binding = bindings[n.object.name];
    if (!(binding === null || binding === void 0 ? void 0 : binding.path))
        return false;
    if (!binding.path.isVariableDeclarator())
        return false;
    var init = binding.path.node.init;
    if (!init || !t.isCallExpression(init))
        return false;
    if (!t.isIdentifier(init.callee))
        return false;
    // TODO could support renaming useTheme by looking up import first
    if (init.callee.name !== 'useTheme')
        return false;
    var importNode = (_a = binding.scope.getBinding('useTheme')) === null || _a === void 0 ? void 0 : _a.path.parent;
    if (!t.isImportDeclaration(importNode))
        return false;
    if (sourcePath && !(0, exports.isValidImport)(props, sourcePath)) {
        return false;
    }
    return true;
}
var isInsideComponentPackage = function (props, moduleName) {
    return (0, exports.getValidComponentsPaths)(props).some(function (path) {
        return moduleName.startsWith(path);
    });
};
exports.isInsideComponentPackage = isInsideComponentPackage;
var isComponentPackage = function (props, srcName) {
    return (0, exports.getValidComponentsPaths)(props).some(function (path) {
        return srcName.startsWith(path);
    });
};
exports.isComponentPackage = isComponentPackage;
function getValidComponent(props, moduleName, componentName) {
    // must be uppercase of course
    if (componentName[0].toUpperCase() !== componentName[0]) {
        return false;
    }
    for (var _i = 0, _a = props.allLoadedComponents; _i < _a.length; _i++) {
        var loaded = _a[_i];
        if (!loaded)
            continue;
        var isInModule = moduleName === '*' || moduleName.startsWith(loaded.moduleName);
        var foundComponent = loaded.nameToInfo[componentName];
        if (isInModule && foundComponent) {
            return foundComponent;
        }
    }
    return null;
}
var isValidModule = function (props, moduleName) {
    if (typeof moduleName !== 'string') {
        throw new Error("No module name");
    }
    var isLocal = moduleName.startsWith('.');
    return {
        isLocal: isLocal,
        isValid: isLocal
            ? (0, exports.isInsideComponentPackage)(props, moduleName)
            : (0, exports.isComponentPackage)(props, moduleName),
    };
};
exports.isValidModule = isValidModule;
var getValidImport = function (props, moduleName, componentName) {
    var _a = (0, exports.isValidModule)(props, moduleName), isValid = _a.isValid, isLocal = _a.isLocal;
    if (!isValid || !componentName) {
        return null;
    }
    return getValidComponent(props, isLocal ? '*' : moduleName, componentName) || null;
};
exports.getValidImport = getValidImport;
var isValidImport = function (props, moduleName, componentName) {
    if (!componentName) {
        return (0, exports.isValidModule)(props, moduleName).isValid;
    }
    return Boolean((0, exports.getValidImport)(props, moduleName, componentName));
};
exports.isValidImport = isValidImport;
var getValidComponentPackages = (0, memoize_1.memoize)(function (props) {
    // just always look for `hanzogui` and `@hanzogui/core`
    return __spreadArray([], new Set(__spreadArray(['@hanzogui/core', 'hanzogui'], (props.components || []), true)), true);
});
exports.getValidComponentsPaths = (0, memoize_1.memoize)(function (props) {
    return getValidComponentPackages(props).flatMap(function (pkg) {
        var root = (0, find_root_1.default)(pkg);
        var based = (0, node_path_1.basename)(root);
        return [based, pkg].filter(Boolean);
    });
});
