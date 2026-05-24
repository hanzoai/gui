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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.extractToClassNames = extractToClassNames;
var generator_1 = require("@babel/generator");
var t = require("@babel/types");
var web_1 = require("@hanzogui/web");
var path = require("node:path");
var util = require("node:util");
var requireHanzoguiCore_1 = require("../helpers/requireHanzoguiCore");
var babelParse_1 = require("./babelParse");
var createLogger_1 = require("./createLogger");
var extractMediaStyle_1 = require("./extractMediaStyle");
var normalizeTernaries_1 = require("./normalizeTernaries");
var propsToFontFamilyCache_1 = require("./propsToFontFamilyCache");
var timer_1 = require("./timer");
var errors_1 = require("./errors");
var concatClassName_1 = require("./concatClassName");
// we only expand into ternaries or plain attr, all style is turned into a always-true ternary
// this lets us more easily combine everything easily
// all ternaries in this array ONLY have consequent, they are normalized
var remove = function () { }; // we dont remove after this step
var spaceString = t.stringLiteral(' ');
function extractToClassNames(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var tm, _c, getCSSStylesAtomic, createMediaStyle, printLog, ast, cssMap, hanzoguiConfig, res, styles, result;
        var extractor = _b.extractor, source = _b.source, _d = _b.sourcePath, sourcePath = _d === void 0 ? '' : _d, options = _b.options, shouldPrintDebug = _b.shouldPrintDebug;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    tm = (0, timer_1.timer)();
                    _c = (0, requireHanzoguiCore_1.requireHanzoguiCore)('web'), getCSSStylesAtomic = _c.getCSSStylesAtomic, createMediaStyle = _c.createMediaStyle;
                    if (sourcePath.includes('node_modules')) {
                        return [2 /*return*/, null];
                    }
                    if (shouldPrintDebug) {
                        console.warn("--- ".concat(sourcePath, " --- \n\n"));
                    }
                    if (typeof source !== 'string') {
                        throw new Error('`source` must be a string of javascript');
                    }
                    if (!path.isAbsolute(sourcePath)) {
                        throw new Error('`sourcePath` must be an absolute path to a .js file, got: ' + sourcePath);
                    }
                    if (!/.[tj]sx?$/i.test(sourcePath || '')) {
                        console.warn("".concat(sourcePath.slice(0, 100), " - bad filename."));
                    }
                    if (!(!options.disableExtraction && !options['_disableLoadHanzogui'])) return [3 /*break*/, 2];
                    // dont include loading in timing of parsing (one time cost)
                    return [4 /*yield*/, extractor.loadHanzogui(options)];
                case 1:
                    // dont include loading in timing of parsing (one time cost)
                    _e.sent();
                    _e.label = 2;
                case 2:
                    printLog = (0, createLogger_1.createLogger)(sourcePath, options);
                    try {
                        ast = (0, babelParse_1.babelParse)(source, sourcePath);
                    }
                    catch (err) {
                        console.error('babel parse error:', sourcePath.slice(0, 100));
                        throw err;
                    }
                    tm.mark("babel-parse", shouldPrintDebug === 'verbose');
                    cssMap = new Map();
                    hanzoguiConfig = extractor.getHanzogui();
                    return [4 /*yield*/, extractor.parse(ast, __assign(__assign({ shouldPrintDebug: shouldPrintDebug }, options), { platform: 'web', sourcePath: sourcePath, extractStyledDefinitions: true, onStyledDefinitionRule: function (identifier, rules) {
                                var css = rules.join('\n');
                                if (shouldPrintDebug) {
                                    console.info("adding styled() rule: .".concat(identifier, " ").concat(css));
                                }
                                cssMap.set(".".concat(identifier), { css: css, commentTexts: [] });
                            }, getFlattenedNode: function (_a) {
                                var tag = _a.tag;
                                return tag;
                            }, onExtractTag: function (_a) {
                                var parserProps = _a.parserProps, attrs = _a.attrs, node = _a.node, attemptEval = _a.attemptEval, jsxPath = _a.jsxPath, originalNodeName = _a.originalNodeName, filePath = _a.filePath, lineNumbers = _a.lineNumbers, staticConfig = _a.staticConfig;
                                // bail out of views that don't accept className (falls back to runtime + style={})
                                if (staticConfig.acceptsClassName === false) {
                                    throw new errors_1.BailOptimizationError();
                                }
                                // re-worked how we do this
                                // merging ternaries on top of base styles is not simple, because we need to ensure the final
                                // className has no duplicate style props and selector order is preserved
                                // before we tried to be smart and build a big binary expression
                                // instead, what we'll do now is pre-calculate the entire className for every possible path
                                // for super complex components that means we *will* output a lot of bigger classNames
                                // but its so much simpler than trying to implement a multi-stage solver here
                                // and in the end its just strings that gzip very well
                                // its also much easier to intuit/debug for end users and ourselves
                                // example:
                                //    a ? 'a' : 'b'
                                //    b ? 'c' : 'd'
                                // we want:
                                //    a && b ? 'a c' : ''
                                //    !a && b ? 'b c' : ''
                                //    a && !b ? 'a d' : ''
                                //    !a && !b ? 'b d' : ''
                                // we also simplified the compiler to only handle views that can be fully flattened
                                // this means we don't need to account for strange in-between spreads, so we can merge things
                                // fairly simply. first, we just merge forward all the non-ternary styles into ternaries.
                                // save for the end
                                var finalAttrs = [];
                                var mergeForwardBaseStyle = null;
                                var attrClassName = null;
                                var baseFontFamily = '';
                                var mediaStylesSeen = 1;
                                var comment = util.format('/* %s:%s (%s) */', filePath, lineNumbers, originalNodeName);
                                function addStyle(style) {
                                    var identifier = style[web_1.StyleObjectIdentifier];
                                    var rules = style[web_1.StyleObjectRules];
                                    var selector = ".".concat(identifier);
                                    if (cssMap.has(selector)) {
                                        var val = cssMap.get(selector);
                                        val.commentTexts.push(comment);
                                    }
                                    else if (rules.length) {
                                        cssMap.set(selector, {
                                            css: rules.join('\n'),
                                            commentTexts: [comment],
                                        });
                                    }
                                    return identifier;
                                }
                                function addStyles(style) {
                                    var cssStyles = getCSSStylesAtomic(style);
                                    var classNames = [];
                                    for (var _i = 0, cssStyles_1 = cssStyles; _i < cssStyles_1.length; _i++) {
                                        var style_1 = cssStyles_1[_i];
                                        var property = style_1[0];
                                        var mediaName = property.slice(1);
                                        // $group- styles must bail out entirely - they need runtime handling because
                                        // group changes can affect children that may be animated and need hard values.
                                        // In the future, CSS animation drivers could potentially optimize this.
                                        if (mediaName.startsWith('group-')) {
                                            throw new errors_1.BailOptimizationError();
                                        }
                                        // Check for theme/platform media queries (e.g., $theme-dark, $platform-web)
                                        var mediaTypeMatch = mediaName.match(/^(theme|platform)-/);
                                        if (mediaTypeMatch) {
                                            var mediaType = mediaTypeMatch[1];
                                            var mediaStyle = createMediaStyle(style_1, mediaName, extractor.getHanzogui().media, mediaType, false, mediaStylesSeen);
                                            var identifier_1 = addStyle(mediaStyle);
                                            classNames.push(identifier_1);
                                            continue;
                                        }
                                        if (mediaName in hanzoguiConfig.media) {
                                            var mediaStyle = createMediaStyle(style_1, mediaName, extractor.getHanzogui().media, true, false, mediaStylesSeen);
                                            var identifier_2 = addStyle(mediaStyle);
                                            classNames.push(identifier_2);
                                            continue;
                                        }
                                        var identifier = addStyle(style_1);
                                        classNames.push(identifier);
                                    }
                                    return classNames;
                                }
                                var onlyTernaries = attrs.flatMap(function (attr) {
                                    var _a;
                                    if (attr.type === 'attr') {
                                        var value = attr.value;
                                        if (t.isJSXSpreadAttribute(value)) {
                                            // we only handle flattened stuff now so skip this
                                            console.error("Should never happen");
                                            return [];
                                        }
                                        if (value.name.name === 'className') {
                                            var inner = value.value;
                                            if (t.isJSXExpressionContainer(inner)) {
                                                inner = inner.expression;
                                            }
                                            try {
                                                var evaluatedValue = inner ? attemptEval(inner) : null;
                                                if (typeof evaluatedValue === 'string') {
                                                    attrClassName = t.stringLiteral(evaluatedValue);
                                                }
                                            }
                                            catch (e) {
                                                if (inner) {
                                                    attrClassName || (attrClassName = inner);
                                                }
                                            }
                                            return [];
                                        }
                                        finalAttrs.push(value);
                                        return [];
                                    }
                                    if (attr.type === 'style') {
                                        mergeForwardBaseStyle = (0, web_1.mergeProps)(mergeForwardBaseStyle || {}, attr.value);
                                        baseFontFamily = (0, propsToFontFamilyCache_1.getFontFamilyNameFromProps)(attr.value) || '';
                                        return [];
                                    }
                                    var ternary = attr.value;
                                    if (ternary.inlineMediaQuery) {
                                        var mediaExtraction = (0, extractMediaStyle_1.extractMediaStyle)(parserProps, attr.value, jsxPath, extractor.getHanzogui(), sourcePath || '', mediaStylesSeen++, shouldPrintDebug);
                                        if (mediaExtraction) {
                                            if (mediaExtraction.mediaStyles) {
                                                mergeForwardBaseStyle = (0, web_1.mergeProps)(mergeForwardBaseStyle || {}, (_a = {},
                                                    _a["$".concat(ternary.inlineMediaQuery)] = attr.value.consequent,
                                                    _a));
                                            }
                                            if (mediaExtraction.ternaryWithoutMedia) {
                                                ternary = mediaExtraction.ternaryWithoutMedia;
                                            }
                                            else {
                                                return [];
                                            }
                                        }
                                    }
                                    var mergedAlternate;
                                    var mergedConsequent;
                                    if (ternary.alternate && Object.keys(ternary.alternate).length) {
                                        mergedAlternate = (0, web_1.mergeProps)(mergeForwardBaseStyle || {}, ternary.alternate || {});
                                        (0, propsToFontFamilyCache_1.forwardFontFamilyName)(ternary.alternate, mergedAlternate, baseFontFamily);
                                    }
                                    if (ternary.consequent && Object.keys(ternary.consequent).length) {
                                        mergedConsequent = (0, web_1.mergeProps)(mergeForwardBaseStyle || {}, ternary.consequent || {});
                                        (0, propsToFontFamilyCache_1.forwardFontFamilyName)(ternary.consequent, mergedConsequent, baseFontFamily);
                                    }
                                    // merge the base style forward into both sides
                                    return __assign(__assign({}, ternary), { alternate: mergedAlternate, consequent: mergedConsequent });
                                });
                                var hasTernaries = Boolean(onlyTernaries.length);
                                var baseClassNames = mergeForwardBaseStyle
                                    ? addStyles(mergeForwardBaseStyle)
                                    : null;
                                var baseClassNameStr = !baseClassNames ? '' : baseClassNames.join(' ');
                                if (baseFontFamily) {
                                    baseClassNameStr = "font_".concat(baseFontFamily).concat(baseClassNameStr ? " ".concat(baseClassNameStr) : '');
                                }
                                // add is_View or is_Text base class matching runtime behavior
                                var baseTypeClass = staticConfig.isText ? 'is_Text' : 'is_View';
                                baseClassNameStr = "".concat(baseTypeClass).concat(baseClassNameStr ? " ".concat(baseClassNameStr) : '');
                                // add component name class (skip 'Text' since is_Text already covers it)
                                var componentNameFinal = staticConfig.componentName;
                                var base = componentNameFinal && componentNameFinal !== 'Text'
                                    ? t.stringLiteral("is_".concat(componentNameFinal).concat(baseClassNameStr ? " ".concat(baseClassNameStr) : ''))
                                    : t.stringLiteral(baseClassNameStr || '');
                                attrClassName = attrClassName; // actual typescript bug, flatMap doesn't update from never
                                var baseClassNameExpression = (function () {
                                    if (attrClassName) {
                                        if (t.isStringLiteral(attrClassName)) {
                                            return t.stringLiteral(base.value ? "".concat(base.value, " ").concat(attrClassName.value) : attrClassName.value);
                                        }
                                        else {
                                            // space after to ensure its a string and its spaced
                                            return t.binaryExpression('+', t.binaryExpression('+', attrClassName, spaceString), base);
                                        }
                                    }
                                    return base;
                                })();
                                var expandedTernaries = [];
                                if (onlyTernaries.length) {
                                    // normalize tests to reduce duplicates
                                    var normalizedTernaries = (0, normalizeTernaries_1.normalizeTernaries)(onlyTernaries);
                                    for (var _i = 0, normalizedTernaries_1 = normalizedTernaries; _i < normalizedTernaries_1.length; _i++) {
                                        var ternary = normalizedTernaries_1[_i];
                                        if (!expandedTernaries.length) {
                                            expandTernary(ternary);
                                            continue;
                                        }
                                        // snapshot current array before iterating - expandTernary mutates expandedTernaries
                                        var prevTernaries = __spreadArray([], expandedTernaries, true);
                                        for (var _b = 0, prevTernaries_1 = prevTernaries; _b < prevTernaries_1.length; _b++) {
                                            var prev = prevTernaries_1[_b];
                                            expandTernary(ternary, prev);
                                        }
                                    }
                                }
                                function expandTernary(ternary, prev) {
                                    // need to diverge into two (or four if alternate)
                                    if (ternary.consequent && Object.keys(ternary.consequent).length) {
                                        var fontFamily = (0, propsToFontFamilyCache_1.getFontFamilyNameFromProps)(ternary.consequent);
                                        expandedTernaries.push({
                                            fontFamily: fontFamily,
                                            // prevTest && test: merge consequent
                                            test: prev
                                                ? t.logicalExpression('&&', prev.test, ternary.test)
                                                : ternary.test,
                                            consequent: prev
                                                ? (0, web_1.mergeProps)(prev.consequent, ternary.consequent)
                                                : ternary.consequent,
                                            remove: remove,
                                            alternate: null,
                                        });
                                        if (prev) {
                                            expandedTernaries.push({
                                                fontFamily: fontFamily,
                                                // !prevTest && test: just consequent
                                                test: t.logicalExpression('&&', t.unaryExpression('!', prev.test), ternary.test),
                                                consequent: ternary.consequent,
                                                alternate: null,
                                                remove: remove,
                                            });
                                        }
                                    }
                                    if (ternary.alternate && Object.keys(ternary.alternate).length) {
                                        var fontFamily = (0, propsToFontFamilyCache_1.getFontFamilyNameFromProps)(ternary.alternate);
                                        var negated = t.unaryExpression('!', ternary.test);
                                        expandedTernaries.push({
                                            fontFamily: fontFamily,
                                            // prevTest && !test: merge alternate
                                            test: prev ? t.logicalExpression('&&', prev.test, negated) : negated,
                                            consequent: prev
                                                ? (0, web_1.mergeProps)(prev.alternate, ternary.alternate)
                                                : ternary.alternate,
                                            remove: remove,
                                            alternate: null,
                                        });
                                        if (prev) {
                                            expandedTernaries.push({
                                                fontFamily: fontFamily,
                                                test: t.logicalExpression('&&', t.unaryExpression('!', prev.test), ternary.test),
                                                consequent: ternary.alternate,
                                                remove: remove,
                                                alternate: null,
                                            });
                                        }
                                    }
                                }
                                var ternaryClassNameExpr = null;
                                // next: create all CSS, build className strings and hoist, and create final node with props
                                if (hasTernaries) {
                                    for (var _c = 0, expandedTernaries_1 = expandedTernaries; _c < expandedTernaries_1.length; _c++) {
                                        var ternary = expandedTernaries_1[_c];
                                        if (!ternary.consequent)
                                            continue;
                                        var classNames = addStyles(ternary.consequent);
                                        if (ternary.fontFamily) {
                                            classNames.unshift("font_".concat(ternary.fontFamily));
                                        }
                                        var baseString = t.isStringLiteral(baseClassNameExpression)
                                            ? baseClassNameExpression.value
                                            : '';
                                        var fullClassNameWithDups = (baseString ? "".concat(baseString, " ") : '') + classNames.join(' ');
                                        // we concat here as the base could be conditionally overriden by our classNames
                                        var fullClassName = (0, concatClassName_1.concatClassName)(fullClassNameWithDups);
                                        var classNameLiteral = t.stringLiteral(fullClassName);
                                        if (!ternaryClassNameExpr) {
                                            ternaryClassNameExpr = t.conditionalExpression(ternary.test, classNameLiteral, baseClassNameExpression);
                                        }
                                        else {
                                            ternaryClassNameExpr = t.conditionalExpression(ternary.test, classNameLiteral, ternaryClassNameExpr);
                                        }
                                    }
                                }
                                var finalExpression = ternaryClassNameExpr || baseClassNameExpression || null;
                                if (shouldPrintDebug) {
                                    console.info('attrs', JSON.stringify(attrs, null, 2));
                                    console.info('expandedTernaries', JSON.stringify(expandedTernaries, null, 2));
                                    console.info('finalExpression', JSON.stringify(finalExpression, null, 2));
                                    console.info({ hasTernaries: hasTernaries, baseClassNameExpression: baseClassNameExpression });
                                }
                                if (finalExpression) {
                                    // hoist to global variables
                                    finalExpression = hoistClassNames(jsxPath, finalExpression);
                                    // console.log('finalExpression', finalExpression)
                                    var classNameProp = t.jsxAttribute(t.jsxIdentifier('className'), t.jsxExpressionContainer(finalExpression));
                                    finalAttrs.unshift(classNameProp);
                                }
                                node.attributes = finalAttrs;
                            } }))];
                case 3:
                    res = _e.sent();
                    if (!res || (!res.modified && !res.optimized && !res.flattened && !res.styled)) {
                        if (shouldPrintDebug) {
                            console.info('no res or none modified', res);
                        }
                        return [2 /*return*/, null];
                    }
                    styles = Array.from(cssMap.values())
                        .map(function (x) { return x.css; })
                        .join('\n')
                        .trim();
                    result = (0, generator_1.default)(ast, {
                        concise: false,
                        filename: sourcePath,
                        // this makes the debug output terrible, and i think sourcemap works already
                        retainLines: false,
                        sourceFileName: sourcePath,
                        sourceMaps: true,
                    }, source);
                    if (shouldPrintDebug) {
                        console.info('\n -------- output code ------- \n\n', result.code
                            .split('\n')
                            .filter(function (x) { return !x.startsWith('//'); })
                            .join('\n'));
                        console.info('\n -------- output style -------- \n\n', styles);
                    }
                    printLog(res);
                    return [2 /*return*/, {
                            ast: ast,
                            styles: styles,
                            js: result.code,
                            map: result.map,
                            stats: {
                                styled: res.styled,
                                flattened: res.flattened,
                                optimized: res.optimized,
                                found: res.found,
                            },
                        }];
            }
        });
    });
}
function hoistClassNames(path, expr) {
    if (t.isStringLiteral(expr)) {
        return hoistClassName(path, expr.value);
    }
    if (t.isLogicalExpression(expr)) {
        var left = t.isStringLiteral(expr.left)
            ? hoistClassName(path, expr.left.value)
            : expr.left;
        var right = t.isStringLiteral(expr.right)
            ? hoistClassName(path, expr.right.value)
            : hoistClassNames(path, expr.right);
        return t.logicalExpression(expr.operator, left, right);
    }
    if (t.isConditionalExpression(expr)) {
        var cons = t.isStringLiteral(expr.consequent)
            ? hoistClassName(path, expr.consequent.value)
            : hoistClassNames(path, expr.consequent);
        var alt = t.isStringLiteral(expr.alternate)
            ? hoistClassName(path, expr.alternate.value)
            : hoistClassNames(path, expr.alternate);
        return t.conditionalExpression(expr.test, cons, alt);
    }
    return expr;
}
function hoistClassName(path, str) {
    var uid = path.scope.generateUidIdentifier('cn');
    var parent = path.findParent(function (path) { return path.isProgram(); });
    if (!parent)
        throw new Error("no program?");
    var variable = t.variableDeclaration('const', [
        t.variableDeclarator(uid, t.stringLiteral(cleanupClassName(str))),
    ]);
    // @ts-ignore
    parent.unshiftContainer('body', variable);
    return uid;
}
function cleanupClassName(inStr) {
    var out = new Set();
    for (var _i = 0, _a = inStr.split(' '); _i < _a.length; _i++) {
        var part = _a[_i];
        if (!part || part === ' ')
            continue;
        if (part === 'font_')
            continue;
        out.add(part);
    }
    return __spreadArray([], out, true).join(' ');
}
