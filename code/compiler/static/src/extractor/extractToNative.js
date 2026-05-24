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
exports.extractToNative = extractToNative;
exports.getBabelPlugin = getBabelPlugin;
exports.getBabelParseDefinition = getBabelParseDefinition;
var core_1 = require("@babel/core");
var generator_1 = require("@babel/generator");
var helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
var parser_1 = require("@babel/parser");
var template_1 = require("@babel/template");
var t = require("@babel/types");
var node_path_1 = require("node:path");
var getPragmaOptions_1 = require("../getPragmaOptions");
var createExtractor_1 = require("./createExtractor");
var createLogger_1 = require("./createLogger");
var extractHelpers_1 = require("./extractHelpers");
var literalToAst_1 = require("./literalToAst");
var loadHanzogui_1 = require("./loadHanzogui");
var importNativeView = (0, template_1.default)("\nconst __ReactNativeView = require('react-native').View;\nconst __ReactNativeText = require('react-native').Text;\n");
var importStyleSheet = (0, template_1.default)("\nconst __ReactNativeStyleSheet = require('react-native').StyleSheet;\n");
var importWithStyle = template_1.default.ast("import { _withStableStyle } from '@hanzogui/core';");
var extractor = (0, createExtractor_1.createExtractor)({ platform: 'native' });
var hanzoguiBuildOptionsLoaded;
function extractToNative(sourceFileName, sourceCode, options) {
    var ast = (0, parser_1.parse)(sourceCode, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
    });
    var babelPlugin = getBabelPlugin();
    var out = (0, core_1.transformFromAstSync)(ast, sourceCode, {
        plugins: [[babelPlugin, options]],
        configFile: false,
        sourceFileName: sourceFileName,
        filename: sourceFileName,
    });
    if (!out) {
        throw new Error("No output returned");
    }
    return out;
}
function getBabelPlugin() {
    return (0, helper_plugin_utils_1.declare)(function (api, options) {
        api.assertVersion(7);
        return getBabelParseDefinition(options);
    });
}
function getBabelParseDefinition(options) {
    return {
        name: 'hanzogui',
        visitor: {
            Program: {
                enter: function (root) {
                    var _a, _b, _c, _d;
                    var sourcePath = this.file.opts.filename;
                    if (sourcePath === null || sourcePath === void 0 ? void 0 : sourcePath.includes('node_modules')) {
                        return;
                    }
                    // by default only pick up .jsx / .tsx
                    if (!(sourcePath === null || sourcePath === void 0 ? void 0 : sourcePath.endsWith('.jsx')) && !(sourcePath === null || sourcePath === void 0 ? void 0 : sourcePath.endsWith('.tsx'))) {
                        return;
                    }
                    // this filename comes back incorrect in react-native, it adds /ios/ for some reason
                    // adding a fix here, but it's a bit tentative...
                    if ((_a = process.env.SOURCE_ROOT) === null || _a === void 0 ? void 0 : _a.endsWith('ios')) {
                        sourcePath = sourcePath.replace('/ios', '');
                    }
                    var hasImportedView = false;
                    var hasImportedViewWrapper = false;
                    var wrapperCount = 0;
                    var sheetStyles = {};
                    var sheetIdentifier = root.scope.generateUidIdentifier('sheet');
                    // babel doesnt append the `//` so we need to
                    var firstCommentContents = // join because you can join together multiple pragmas
                     (_d = (_c = (_b = root.node.body[0]) === null || _b === void 0 ? void 0 : _b.leadingComments) === null || _c === void 0 ? void 0 : _c.map(function (comment) { return (comment === null || comment === void 0 ? void 0 : comment.value) || ' '; }).join(' ')) !== null && _d !== void 0 ? _d : '';
                    var firstComment = firstCommentContents ? "//".concat(firstCommentContents) : '';
                    var _e = (0, getPragmaOptions_1.getPragmaOptions)({
                        source: firstComment,
                        path: sourcePath,
                    }), shouldPrintDebug = _e.shouldPrintDebug, shouldDisable = _e.shouldDisable;
                    if (shouldDisable) {
                        return;
                    }
                    if (!options.config && !options.components) {
                        // if no config/components given try and load from the hanzogui.build.ts file
                        hanzoguiBuildOptionsLoaded || (hanzoguiBuildOptionsLoaded = (0, loadHanzogui_1.loadHanzoguiBuildConfigSync)({}));
                    }
                    var finalOptions = __assign(__assign({ 
                        // @ts-ignore just in case they leave it out
                        platform: 'native' }, hanzoguiBuildOptionsLoaded), options);
                    var printLog = (0, createLogger_1.createLogger)(sourcePath, finalOptions);
                    function addSheetStyle(style, node) {
                        var styleIndex = "".concat(Object.keys(sheetStyles).length);
                        var key = "".concat(styleIndex);
                        if (process.env.NODE_ENV === 'development') {
                            var lineNumbers = node.loc
                                ? node.loc.start.line +
                                    (node.loc.start.line !== node.loc.end.line
                                        ? "-".concat(node.loc.end.line)
                                        : '')
                                : '';
                            key += ":".concat((0, node_path_1.basename)(sourcePath), ":").concat(lineNumbers);
                        }
                        sheetStyles[key] = style;
                        return readStyleExpr(key);
                    }
                    function readStyleExpr(key) {
                        return (0, template_1.default)("SHEET['KEY']")({
                            SHEET: sheetIdentifier.name,
                            KEY: key,
                        })['expression'];
                    }
                    var res;
                    try {
                        res = extractor.parseSync(root, __assign(__assign({ importsWhitelist: ['constants.js', 'colors.js'], excludeProps: new Set([
                                'className',
                                'userSelect',
                                'whiteSpace',
                                'textOverflow',
                                'cursor',
                                'contain',
                            ]), 
                            // native props that should pass through without preventing extraction
                            inlineProps: new Set([
                                'testID',
                                'nativeID',
                                'accessibilityLabel',
                                'accessibilityHint',
                                'accessibilityRole',
                                'accessibilityState',
                                'accessibilityValue',
                                'accessibilityActions',
                                'accessibilityLabelledBy',
                                'accessibilityLiveRegion',
                                'accessibilityElementsHidden',
                                'accessibilityViewIsModal',
                                'importantForAccessibility',
                                'onAccessibilityAction',
                                'onAccessibilityEscape',
                                'onAccessibilityTap',
                                'onMagicTap',
                                'collapsable',
                                'needsOffscreenAlphaCompositing',
                                'removeClippedSubviews',
                                'renderToHardwareTextureAndroid',
                                'shouldRasterizeIOS',
                                'hitSlop',
                                'pointerEvents',
                            ]), shouldPrintDebug: shouldPrintDebug }, finalOptions), { 
                            // disable extracting variables as no native concept of them (only theme values)
                            disableExtractVariables: false, sourcePath: sourcePath, 
                            // disabling flattening for now
                            // it's flattening a plain <Paragraph>hello</Paragraph> which breaks things because themes
                            // thinking it's not really worth the effort to do much compilation on native
                            // for now just disable flatten as it can only run in narrow places on native
                            // disableFlattening: 'styled',
                            getFlattenedNode: function (_a) {
                                var isTextView = _a.isTextView;
                                if (!hasImportedView) {
                                    hasImportedView = true;
                                    root.unshiftContainer('body', importNativeView());
                                }
                                return isTextView ? '__ReactNativeText' : '__ReactNativeView';
                            }, onExtractTag: function (props) {
                                assertValidTag(props.node);
                                var stylesExpr = t.arrayExpression([]);
                                var hocStylesExpr = t.arrayExpression([]);
                                var expressions = [];
                                var finalAttrs = [];
                                var themeKeysUsed = new Set();
                                function getStyleExpression(style, forTernary) {
                                    if (forTernary === void 0) { forTernary = false; }
                                    if (!style)
                                        return;
                                    // split theme properties and leave them as props since RN has no concept of theme
                                    var _a = splitThemeStyles(style), plain = _a.plain, themed = _a.themed;
                                    // TODO: themed is not a good name, because it's not just theme it also includes tokens
                                    var themeExpr = null;
                                    if (themed) {
                                        for (var key in themed) {
                                            themeKeysUsed.add(themed[key].split('$')[1]);
                                        }
                                        // make a sub-array
                                        themeExpr = getThemedStyleExpression(themed);
                                    }
                                    var hasPlainKeys = Object.keys(plain).length > 0;
                                    var ident = hasPlainKeys ? addSheetStyle(plain, props.node) : null;
                                    if (themeExpr) {
                                        if (forTernary) {
                                            // for ternary branches, return combined expression
                                            // without adding plain styles unconditionally
                                            if (ident) {
                                                return t.arrayExpression([ident, themeExpr]);
                                            }
                                            return themeExpr;
                                        }
                                        // for base styles, add unconditionally
                                        if (ident) {
                                            addStyleExpression(ident);
                                            addStyleExpression(ident, true);
                                        }
                                        return themeExpr;
                                    }
                                    return ident;
                                }
                                function addStyleExpression(expr, HOC) {
                                    var _a;
                                    if (HOC === void 0) { HOC = false; }
                                    if (Array.isArray(expr)) {
                                        ;
                                        (_a = (HOC ? hocStylesExpr : stylesExpr).elements).push.apply(_a, expr);
                                    }
                                    else {
                                        ;
                                        (HOC ? hocStylesExpr : stylesExpr).elements.push(expr);
                                    }
                                }
                                function getThemedStyleExpression(styles) {
                                    var themedStylesAst = (0, literalToAst_1.literalToAst)(styles);
                                    themedStylesAst.properties.forEach(function (_) {
                                        var prop = _;
                                        if (prop.value.type === 'StringLiteral') {
                                            var propVal = prop.value.value.slice(1);
                                            var isComputed = !t.isValidIdentifier(propVal);
                                            prop.value = t.callExpression(t.memberExpression(t.memberExpression(t.identifier('theme'), isComputed ? t.stringLiteral(propVal) : t.identifier(propVal), isComputed), t.identifier('get')), []);
                                        }
                                    });
                                    return themedStylesAst;
                                }
                                var hasDynamicStyle = false;
                                var hasMediaKeys = false;
                                for (var _i = 0, _a = props.attrs; _i < _a.length; _i++) {
                                    var attr = _a[_i];
                                    switch (attr.type) {
                                        case 'style': {
                                            var styleExpr = getStyleExpression(attr.value);
                                            addStyleExpression(styleExpr);
                                            addStyleExpression(styleExpr, true);
                                            break;
                                        }
                                        case 'ternary': {
                                            var _b = attr.value, consequent = _b.consequent, alternate = _b.alternate;
                                            var consExpr = getStyleExpression(consequent, true);
                                            var altExpr = getStyleExpression(alternate, true);
                                            if (attr.value.inlineMediaQuery) {
                                                hasMediaKeys = true;
                                            }
                                            expressions.push(attr.value.test);
                                            addStyleExpression(t.conditionalExpression(t.identifier("_expressions[".concat(expressions.length - 1, "]")), consExpr || t.nullLiteral(), altExpr || t.nullLiteral()), true);
                                            var styleExpr = t.conditionalExpression(attr.value.test, consExpr || t.nullLiteral(), altExpr || t.nullLiteral());
                                            addStyleExpression(styleExpr);
                                            break;
                                        }
                                        case 'attr': {
                                            if (t.isJSXSpreadAttribute(attr.value)) {
                                                if ((0, extractHelpers_1.isSimpleSpread)(attr.value)) {
                                                    stylesExpr.elements.push(t.memberExpression(attr.value.argument, t.identifier('style')));
                                                    hocStylesExpr.elements.push(t.memberExpression(attr.value.argument, t.identifier('style')));
                                                }
                                            }
                                            finalAttrs.push(attr.value);
                                            break;
                                        }
                                    }
                                }
                                props.node.attributes = finalAttrs;
                                if (themeKeysUsed.size ||
                                    hocStylesExpr.elements.length > 1 ||
                                    hasDynamicStyle) {
                                    if (!hasImportedViewWrapper) {
                                        root.unshiftContainer('body', importWithStyle);
                                        hasImportedViewWrapper = true;
                                    }
                                    var name_1 = props.flatNodeName || props.node.name['name'];
                                    // Use a unique name that won't conflict with the base component
                                    var wrapperName = "_".concat(name_1.replace(/^_+/, ''), "Styled").concat(wrapperCount++);
                                    // Use regular identifier for variable declarations, JSX identifier for JSX elements
                                    var WrapperIdentifier = t.identifier(wrapperName);
                                    var WrapperJSXIdentifier = t.jsxIdentifier(wrapperName);
                                    var hasThemeKeysFlag = themeKeysUsed.size > 0;
                                    root.pushContainer('body', t.variableDeclaration('const', [
                                        t.variableDeclarator(WrapperIdentifier, t.callExpression(t.identifier('_withStableStyle'), [
                                            t.identifier(name_1),
                                            t.arrowFunctionExpression([t.identifier('theme'), t.identifier('_expressions')], 
                                            // return styles directly - no useMemo, theme changes must trigger style recalc
                                            t.arrayExpression(__spreadArray([], hocStylesExpr.elements, true))),
                                            t.booleanLiteral(hasThemeKeysFlag),
                                            t.booleanLiteral(hasMediaKeys),
                                        ])),
                                    ]));
                                    // @ts-ignore - use JSX identifier for JSX elements
                                    props.node.name = WrapperJSXIdentifier;
                                    // Also set the opening element directly via the path
                                    props.jsxPath.node.openingElement.name = WrapperJSXIdentifier;
                                    if (props.jsxPath.node.closingElement) {
                                        // @ts-ignore
                                        props.jsxPath.node.closingElement.name = t.jsxIdentifier(wrapperName);
                                    }
                                    if (expressions.length) {
                                        // coerce runtime expressions to boolean so they can't be
                                        // confused with string media keys at runtime
                                        var safeExpressions = expressions.map(function (expr) {
                                            return t.isStringLiteral(expr)
                                                ? expr
                                                : t.unaryExpression('!', t.unaryExpression('!', expr));
                                        });
                                        props.node.attributes.push(t.jsxAttribute(t.jsxIdentifier('_expressions'), t.jsxExpressionContainer(t.arrayExpression(safeExpressions))));
                                    }
                                }
                                else {
                                    props.node.attributes.push(t.jsxAttribute(t.jsxIdentifier('style'), t.jsxExpressionContainer(stylesExpr.elements.length === 1
                                        ? stylesExpr.elements[0]
                                        : stylesExpr)));
                                }
                            } }));
                    }
                    catch (err) {
                        if (err instanceof Error) {
                            // metro doesn't show stack so we can
                            var message = "".concat(shouldPrintDebug === 'verbose' ? err : err.message);
                            if (message.includes('Unexpected return value from visitor method')) {
                                message = 'Unexpected return value from visitor method';
                            }
                            console.warn('Error in Hanzogui parse, skipping', message, err.stack);
                            return;
                        }
                    }
                    if (!Object.keys(sheetStyles).length) {
                        if (shouldPrintDebug) {
                            console.info('END no styles');
                        }
                        if (res)
                            printLog(res);
                        return;
                    }
                    var sheetObject = (0, literalToAst_1.literalToAst)(sheetStyles);
                    var sheetOuter = (0, template_1.default)('const SHEET = __ReactNativeStyleSheet.create(null)')({
                        SHEET: sheetIdentifier.name,
                    });
                    // replace the null with our object
                    sheetOuter.declarations[0].init.arguments[0] = sheetObject;
                    root.unshiftContainer('body', sheetOuter);
                    // add import
                    root.unshiftContainer('body', importStyleSheet());
                    if (shouldPrintDebug) {
                        console.info('\n -------- output code ------- \n');
                        console.info((0, generator_1.default)(root.parent)
                            .code.split('\n')
                            .filter(function (x) { return !x.startsWith('//'); })
                            .join('\n'));
                    }
                    if (res)
                        printLog(res);
                },
            },
        },
    };
}
function assertValidTag(node) {
    var _a;
    if (node.attributes.find(function (x) { return x.type === 'JSXAttribute' && x.name.name === 'style'; })) {
        // we can just deopt here instead and log warning
        // need to make onExtractTag have a special catch error or similar
        if ((_a = process.env.DEBUG) === null || _a === void 0 ? void 0 : _a.startsWith('hanzogui')) {
            console.warn('⚠️ Cannot pass style attribute to extracted style');
        }
    }
}
function splitThemeStyles(style) {
    var themed = {};
    var plain = {};
    var noTheme = true;
    for (var key in style) {
        var val = style[key];
        if (val && val[0] === '$') {
            themed[key] = val;
            noTheme = false;
        }
        else {
            plain[key] = val;
        }
    }
    return { themed: noTheme ? null : themed, plain: plain };
}
