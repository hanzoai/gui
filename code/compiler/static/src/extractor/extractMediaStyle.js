"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.extractMediaStyle = extractMediaStyle;
exports.isValidMediaCall = isValidMediaCall;
var t = require("@babel/types");
var core = require("@hanzogui/core");
var requireHanzoguiCore_1 = require("../helpers/requireHanzoguiCore");
var extractHelpers_1 = require("./extractHelpers");
function extractMediaStyle(props, ternary, jsxPath, hanzoguiConfig, sourcePath, importance, shouldPrintDebug) {
    if (importance === void 0) { importance = 0; }
    if (shouldPrintDebug === void 0) { shouldPrintDebug = false; }
    var getCSSStylesAtomic = (0, requireHanzoguiCore_1.requireHanzoguiCore)('web').getCSSStylesAtomic;
    var mt = getMediaQueryTernary(props, ternary, jsxPath, sourcePath);
    if (!mt) {
        return null;
    }
    var key = mt.key;
    var mq = hanzoguiConfig.media[key];
    if (!mq) {
        console.error("Media query \"".concat(key, "\" not found: ").concat(Object.keys(hanzoguiConfig.media)));
        return null;
    }
    var getStyleObj = function (styleObj, negate) {
        if (negate === void 0) { negate = false; }
        return styleObj ? { styleObj: styleObj, negate: negate } : null;
    };
    var styleOpts = [
        getStyleObj(ternary.consequent, false),
        getStyleObj(ternary.alternate, true),
    ].filter(extractHelpers_1.isPresent);
    if (shouldPrintDebug && !styleOpts.length) {
        console.info('  media query, no styles?');
        return null;
    }
    // for now order first strongest
    var mediaKeys = Object.keys(hanzoguiConfig.media);
    var mediaKeyPrecendence = mediaKeys.reduce(function (acc, cur, i) {
        acc[cur] = new Array(importance + 1).fill(':root').join('');
        return acc;
    }, {});
    var mediaStyles = [];
    var _loop_1 = function (styleObj, negate) {
        var styles = getCSSStylesAtomic(styleObj);
        var singleMediaStyles = styles.map(function (style) {
            var mediaStyle = core.createMediaStyle(style, key, hanzoguiConfig.media, true, negate);
            var className = ".".concat(mediaStyle[core.StyleObjectIdentifier]);
            return __assign(__assign({}, mediaStyle), { className: className });
        });
        if (shouldPrintDebug === 'verbose') {
            console.info('  media styles:', importance, styleObj, singleMediaStyles.map(function (x) { return x[core.StyleObjectIdentifier]; }).join(', '));
        }
        // add to output
        mediaStyles = __spreadArray(__spreadArray([], mediaStyles, true), singleMediaStyles, true);
    };
    // TODO this should NOT be here
    // this should be done using the same logic as createMediaStyle
    for (var _i = 0, styleOpts_1 = styleOpts; _i < styleOpts_1.length; _i++) {
        var _a = styleOpts_1[_i], styleObj = _a.styleObj, negate = _a.negate;
        _loop_1(styleObj, negate);
    }
    // filter out
    ternary.remove();
    return { mediaStyles: mediaStyles, ternaryWithoutMedia: mt.ternaryWithoutMedia };
}
function getMediaQueryTernary(props, ternary, jsxPath, sourcePath) {
    // this handles unwrapping logical && media query ternarys
    // first, unwrap if it has media logicalExpression
    if (t.isLogicalExpression(ternary.test) && ternary.test.operator === '&&') {
        // *should* be normalized to always be on left side
        var mediaLeft = getMediaInfoFromExpression(props, ternary.test.left, jsxPath, sourcePath, ternary.inlineMediaQuery);
        if (mediaLeft) {
            return __assign(__assign({}, mediaLeft), { ternaryWithoutMedia: __assign(__assign({}, ternary), { test: ternary.test.right }) });
        }
    }
    // const media = useMedia()
    // ... media.sm
    var result = getMediaInfoFromExpression(props, ternary.test, jsxPath, sourcePath, ternary.inlineMediaQuery);
    if (result) {
        return __assign(__assign({}, result), { ternaryWithoutMedia: null });
    }
    return null;
}
function getMediaInfoFromExpression(props, test, jsxPath, sourcePath, inlineMediaQuery) {
    var _a, _b, _c;
    if (inlineMediaQuery) {
        return {
            key: inlineMediaQuery,
            bindingName: inlineMediaQuery,
        };
    }
    if (t.isMemberExpression(test) &&
        t.isIdentifier(test.object) &&
        t.isIdentifier(test.property)) {
        var name_1 = test.object['name'];
        var key = test.property['name'];
        var bindings = jsxPath.scope.getAllBindings();
        var binding = bindings[name_1];
        if (!binding)
            return false;
        var bindingNode = (_a = binding.path) === null || _a === void 0 ? void 0 : _a.node;
        if (!t.isVariableDeclarator(bindingNode) || !bindingNode.init)
            return false;
        if (!isValidMediaCall(props, jsxPath, bindingNode.init, sourcePath))
            return false;
        return { key: key, bindingName: name_1 };
    }
    if (t.isIdentifier(test)) {
        var key = test.name;
        var node = (_c = (_b = jsxPath.scope.getBinding(test.name)) === null || _b === void 0 ? void 0 : _b.path) === null || _c === void 0 ? void 0 : _c.node;
        if (!t.isVariableDeclarator(node))
            return false;
        if (!node.init || !isValidMediaCall(props, jsxPath, node.init, sourcePath))
            return false;
        return { key: key, bindingName: key };
    }
    return null;
}
function isValidMediaCall(props, jsxPath, init, sourcePath) {
    if (!init || !t.isCallExpression(init))
        return false;
    if (!t.isIdentifier(init.callee))
        return false;
    // TODO could support renaming useMedia by looking up import first
    if (init.callee.name !== 'useMedia')
        return false;
    var bindings = jsxPath.scope.getAllBindings();
    var mediaBinding = bindings['useMedia'];
    if (!mediaBinding)
        return false;
    var useMediaImport = mediaBinding.path.parent;
    if (!t.isImportDeclaration(useMediaImport))
        return false;
    if (!(0, extractHelpers_1.isValidImport)(props, sourcePath)) {
        return false;
    }
    return true;
}
