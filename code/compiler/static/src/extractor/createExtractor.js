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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.createExtractor = createExtractor;
var traverse_1 = require("@babel/traverse");
var t = require("@babel/types");
var cli_color_1 = require("@hanzogui/cli-color");
var reactNativeWebInternals = require("@hanzogui/react-native-web-internals");
var web_1 = require("@hanzogui/web");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var typescript_1 = require("typescript");
var constants_1 = require("../constants");
var requireHanzoguiCore_1 = require("../helpers/requireHanzoguiCore");
var createEvaluator_1 = require("./createEvaluator");
var evaluateAstNode_1 = require("./evaluateAstNode");
var extractHelpers_1 = require("./extractHelpers");
var findTopmostFunction_1 = require("./findTopmostFunction");
var getStaticBindingsForScope_1 = require("./getStaticBindingsForScope");
var literalToAst_1 = require("./literalToAst");
var loadHanzogui_1 = require("./loadHanzogui");
var logLines_1 = require("./logLines");
var normalizeTernaries_1 = require("./normalizeTernaries");
var propsToFontFamilyCache_1 = require("./propsToFontFamilyCache");
var timer_1 = require("./timer");
var validHTMLAttributes_1 = require("./validHTMLAttributes");
var errors_1 = require("./errors");
var esbuildTsconfigPaths_1 = require("./esbuildTsconfigPaths");
var UNTOUCHED_PROPS = {
    key: true,
    style: true,
    className: true,
};
// Platform variants that can't be resolved at compile time on native builds.
// Defined at module level (not inside the loop) to avoid repeated Set allocations during compilation.
// (requires runtime Platform.OS + Platform.isTV checks via react-native-tvos)
var nativeOnlyPlatforms = new Set(['android', 'ios', 'tv', 'androidtv', 'tvos']);
var createTernary = function (x) { return x; };
var hasLoggedBaseInfo = false;
function isFullyDisabled(props) {
    return props.disableExtraction && props.disableDebugAttr;
}
function createExtractor(_a) {
    var _this = this;
    var _b = _a === void 0 ? { logger: console } : _a, _c = _b.logger, logger = _c === void 0 ? console : _c, _d = _b.platform, platform = _d === void 0 ? 'web' : _d;
    var INLINE_EXTRACTABLE = __assign(__assign({ ref: 'ref', key: 'key' }, (platform === 'web' && {
        onPress: 'onClick',
        onHoverIn: 'onMouseEnter',
        onHoverOut: 'onMouseLeave',
        onPressIn: 'onMouseDown',
        onPressOut: 'onMouseUp',
    })), (platform === 'native' && {
        // native view props that should pass through without preventing flattening
        testID: 'testID',
        nativeID: 'nativeID',
        accessibilityLabel: 'accessibilityLabel',
        accessibilityHint: 'accessibilityHint',
        accessibilityRole: 'accessibilityRole',
        accessibilityState: 'accessibilityState',
        accessibilityValue: 'accessibilityValue',
        accessibilityActions: 'accessibilityActions',
        accessibilityLabelledBy: 'accessibilityLabelledBy',
        accessibilityLiveRegion: 'accessibilityLiveRegion',
        accessibilityElementsHidden: 'accessibilityElementsHidden',
        accessibilityViewIsModal: 'accessibilityViewIsModal',
        importantForAccessibility: 'importantForAccessibility',
        collapsable: 'collapsable',
        needsOffscreenAlphaCompositing: 'needsOffscreenAlphaCompositing',
        removeClippedSubviews: 'removeClippedSubviews',
        renderToHardwareTextureAndroid: 'renderToHardwareTextureAndroid',
        shouldRasterizeIOS: 'shouldRasterizeIOS',
        hitSlop: 'hitSlop',
        pointerEvents: 'pointerEvents',
    }));
    var componentState = {
        focus: false,
        focusVisible: false,
        focusWithin: false,
        hover: false,
        unmounted: true,
        press: false,
        pressIn: false,
        disabled: false,
    };
    var styleProps = {
        resolveValues: platform === 'native' ? 'value' : 'variable',
        noClass: false,
        isAnimated: false,
    };
    var shouldAddDebugProp = 
    // really basic disable this for next.js because it messes with ssr
    !process.env.npm_package_dependencies_next &&
        platform !== 'native' &&
        process.env.IDENTIFY_TAGS !== 'false' &&
        (process.env.NODE_ENV === 'development' || process.env.IDENTIFY_TAGS);
    var projectInfo = null;
    // cache of dynamically discovered styled components, keyed by absolute file path
    // persists across files within the same worker/extractor instance
    var dynamicComponentCache = new Map();
    var dynamicLoadingInProgress = new Set();
    // lazily loaded tsconfig compiler options for path alias resolution
    var _compilerOptions = null;
    function getCompilerOptions() {
        if (!_compilerOptions) {
            try {
                _compilerOptions = (0, esbuildTsconfigPaths_1.loadCompilerOptionsFromTsconfig)();
            }
            catch (_a) {
                _compilerOptions = {};
            }
        }
        return _compilerOptions;
    }
    function resolveImportPath(fromFile, importPath) {
        if (importPath.startsWith('.')) {
            // relative path resolution
            var dir = (0, node_path_1.dirname)(fromFile);
            var base = (0, node_path_1.resolve)(dir, importPath);
            var extensions = ['.tsx', '.ts', '.jsx', '.js'];
            for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                var ext = extensions_1[_i];
                var full = base + ext;
                if ((0, node_fs_1.existsSync)(full))
                    return full;
            }
            // try index files
            for (var _a = 0, extensions_2 = extensions; _a < extensions_2.length; _a++) {
                var ext = extensions_2[_a];
                var full = (0, node_path_1.resolve)(base, "index".concat(ext));
                if ((0, node_fs_1.existsSync)(full))
                    return full;
            }
            return null;
        }
        // tsconfig path alias resolution (e.g. ~/foo, @/bar)
        var compilerOptions = getCompilerOptions();
        if (compilerOptions.paths) {
            try {
                var resolvedModule = (0, typescript_1.nodeModuleNameResolver)(importPath, fromFile, compilerOptions, typescript_1.sys).resolvedModule;
                if (resolvedModule &&
                    !resolvedModule.resolvedFileName.endsWith('.d.ts') &&
                    !resolvedModule.isExternalLibraryImport) {
                    return resolvedModule.resolvedFileName;
                }
            }
            catch (_b) {
                // fallback - tsconfig resolution failed
            }
        }
        return null;
    }
    var styledCheckCache = new Map();
    function mightHaveStyledComponents(filePath) {
        var cached = styledCheckCache.get(filePath);
        if (cached !== undefined)
            return cached;
        try {
            var content = (0, node_fs_1.readFileSync)(filePath, 'utf-8');
            var result = content.includes('styled(');
            styledCheckCache.set(filePath, result);
            return result;
        }
        catch (_a) {
            styledCheckCache.set(filePath, false);
            return false;
        }
    }
    // we load hanzogui delayed because we need to set some global/env stuff before importing
    // otherwise we'd import `rnw` and cause it to evaluate react-native-web which causes errors
    function loadSync(props) {
        if (isFullyDisabled(props)) {
            return null;
        }
        return (projectInfo || (projectInfo = (0, loadHanzogui_1.loadHanzoguiSync)(props)));
    }
    function load(props) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (isFullyDisabled(props)) {
                            return [2 /*return*/, null];
                        }
                        _a = projectInfo;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, loadHanzogui_1.loadHanzogui)(props)];
                    case 1:
                        _a = (projectInfo = _b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, (_a)];
                }
            });
        });
    }
    return {
        options: {
            logger: logger,
        },
        cleanupBeforeExit: getStaticBindingsForScope_1.cleanupBeforeExit,
        loadHanzogui: load,
        loadHanzoguiSync: loadSync,
        getHanzogui: function () {
            return projectInfo === null || projectInfo === void 0 ? void 0 : projectInfo.hanzoguiConfig;
        },
        parseSync: function (f, props) {
            globalThis.expo || (globalThis.expo = {}); // expo-modules-core checks this and avoids loading "native" modules if exists
            var projectInfo = loadSync(props);
            return parseWithConfig(projectInfo || {}, f, props);
        },
        parse: function (f, props) { return __awaiter(_this, void 0, void 0, function () {
            var projectInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        globalThis.expo || (globalThis.expo = {}); // expo-modules-core checks this and avoids loading "native" modules if exists
                        return [4 /*yield*/, load(props)];
                    case 1:
                        projectInfo = _a.sent();
                        return [2 /*return*/, parseWithConfig(projectInfo || {}, f, props)];
                }
            });
        }); },
    };
    function parseWithConfig(_a, fileOrPath, options) {
        var _b;
        var components = _a.components, hanzoguiConfig = _a.hanzoguiConfig;
        var _c = options.config, config = _c === void 0 ? 'hanzogui.config.ts' : _c, _d = options.importsWhitelist, importsWhitelist = _d === void 0 ? ['constants.js'] : _d, _e = options.evaluateVars, evaluateVars = _e === void 0 ? true : _e, _f = options.sourcePath, sourcePath = _f === void 0 ? '' : _f, onExtractTag = options.onExtractTag, onStyledDefinitionRule = options.onStyledDefinitionRule, getFlattenedNode = options.getFlattenedNode, disable = options.disable, disableExtraction = options.disableExtraction, disableExtractVariables = options.disableExtractVariables, disableDebugAttr = options.disableDebugAttr, _g = options.enableDynamicEvaluation, enableDynamicEvaluation = _g === void 0 ? false : _g, _h = options.includeExtensions, includeExtensions = _h === void 0 ? ['.ts', '.tsx', '.jsx'] : _h, _j = options.extractStyledDefinitions, extractStyledDefinitions = _j === void 0 ? false : _j, prefixLogs = options.prefixLogs, excludeProps = options.excludeProps, platform = options.platform, restProps = __rest(options
        // invalidate dynamic cache for this file on re-parse (HMR)
        , ["config", "importsWhitelist", "evaluateVars", "sourcePath", "onExtractTag", "onStyledDefinitionRule", "getFlattenedNode", "disable", "disableExtraction", "disableExtractVariables", "disableDebugAttr", "enableDynamicEvaluation", "includeExtensions", "extractStyledDefinitions", "prefixLogs", "excludeProps", "platform"]);
        // invalidate dynamic cache for this file on re-parse (HMR)
        if (sourcePath && dynamicComponentCache.has(sourcePath)) {
            dynamicComponentCache.delete(sourcePath);
            styledCheckCache.delete(sourcePath);
        }
        if (sourcePath.includes('.hanzogui-dynamic-eval')) {
            return null;
        }
        var _k = (0, requireHanzoguiCore_1.requireHanzoguiCore)(platform), normalizeStyle = _k.normalizeStyle, getSplitStyles = _k.getSplitStyles, mediaQueryConfig = _k.mediaQueryConfig, propMapper = _k.propMapper, proxyThemeVariables = _k.proxyThemeVariables, getDefaultProps = _k.getDefaultProps, pseudoDescriptors = _k.pseudoDescriptors;
        var shouldPrintDebug = options.shouldPrintDebug || false;
        if (disable === true || (Array.isArray(disable) && disable.includes(sourcePath))) {
            return null;
        }
        if (!isFullyDisabled(options)) {
            if (!components) {
                throw new Error("Must provide components");
            }
        }
        if (sourcePath &&
            includeExtensions &&
            !includeExtensions.some(function (ext) { return sourcePath.endsWith(ext); })) {
            if (shouldPrintDebug) {
                logger.info("Ignoring file due to includeExtensions: ".concat(sourcePath, ", includeExtensions: ").concat(includeExtensions.join(', ')));
            }
            return null;
        }
        function isValidStyleKey(name, staticConfig) {
            var _a, _b, _c;
            if (!projectInfo) {
                throw new Error("Hanzogui extractor not loaded yet");
            }
            if (platform === 'native' && name[0] === '$' && mediaQueryConfig[name.slice(1)]) {
                return false;
            }
            // Check for $theme-, $platform-, $group- prefixed keys
            if (name[0] === '$') {
                var mediaName = name.slice(1);
                if (mediaName.startsWith('theme-') ||
                    mediaName.startsWith('platform-') ||
                    mediaName.startsWith('group-')) {
                    return true;
                }
                if (mediaQueryConfig[mediaName]) {
                    return true;
                }
            }
            return !!(((_a = staticConfig.validStyles) === null || _a === void 0 ? void 0 : _a[name]) ||
                pseudoDescriptors[name] ||
                (
                // don't disable variants or else you lose many things flattening
                (_b = staticConfig.variants) === null || _b === void 0 ? void 0 : _b[name]) ||
                ((_c = projectInfo === null || projectInfo === void 0 ? void 0 : projectInfo.hanzoguiConfig) === null || _c === void 0 ? void 0 : _c.shorthands[name]));
        }
        /**
         * Step 1: Determine if importing any statically extractable components
         */
        var isTargetingHTML = platform === 'web';
        var ogDebug = shouldPrintDebug;
        var tm = (0, timer_1.timer)();
        var propsWithFileInfo = __assign(__assign({}, options), { sourcePath: sourcePath, allLoadedComponents: components ? __spreadArray([], components, true) : [] });
        if (!hasLoggedBaseInfo) {
            hasLoggedBaseInfo = true;
            if (shouldPrintDebug) {
                logger.info([
                    'loaded components:',
                    propsWithFileInfo.allLoadedComponents
                        .map(function (comp) { return Object.keys(comp.nameToInfo).join(', '); })
                        .join(', '),
                ].join(' '));
            }
            if ((_b = process.env.DEBUG) === null || _b === void 0 ? void 0 : _b.startsWith('hanzogui')) {
                logger.info([
                    'loaded:',
                    propsWithFileInfo.allLoadedComponents.map(function (x) { return x.moduleName; }),
                ].join('\n'));
            }
        }
        tm.mark('load-hanzogui', !!shouldPrintDebug);
        if (!isFullyDisabled(options)) {
            if (!(hanzoguiConfig === null || hanzoguiConfig === void 0 ? void 0 : hanzoguiConfig.themes)) {
                console.error("\u26D4\uFE0F Error: Missing \"themes\" in your hanzogui.config file:\n\n            You may not need the compiler! Remember you can run Hanzogui with no configuration at all.\n\n            You may have not \"export default\" your config (you can also \"export const config\").\n            \n            Or this may be due to duplicated dependency versions:\n              - try out https://github.com/bmish/check-dependency-version-consistency to see if there are mis-matches.\n              - or search your lockfile for mis-matches.\n          ");
                console.info("  Got config:", hanzoguiConfig);
                process.exit(0);
            }
        }
        var firstThemeName = Object.keys((hanzoguiConfig === null || hanzoguiConfig === void 0 ? void 0 : hanzoguiConfig.themes) || {})[0];
        var firstTheme = (hanzoguiConfig === null || hanzoguiConfig === void 0 ? void 0 : hanzoguiConfig.themes[firstThemeName]) || {};
        if (!firstTheme || typeof firstTheme !== 'object') {
            var err = "Missing theme ".concat(firstThemeName, ", an error occurred when importing your config");
            console.info(err, "Got config:", hanzoguiConfig);
            console.info("Looking for theme:", firstThemeName);
            throw new Error(err);
        }
        var proxiedTheme = proxyThemeVariables(firstTheme);
        var themeAccessListeners = new Set();
        var defaultTheme = new Proxy(proxiedTheme, {
            get: function (target, key) {
                if (Reflect.has(target, key)) {
                    themeAccessListeners.forEach(function (cb) { return cb(String(key)); });
                }
                return Reflect.get(target, key);
            },
        });
        var body = fileOrPath.type === 'Program' ? fileOrPath.get('body') : fileOrPath.program.body;
        if (!isFullyDisabled(options)) {
            if (Object.keys(components || []).length === 0) {
                console.warn("Warning: Hanzogui didn't find any valid components (DEBUG=hanzogui for more)");
                if (process.env.DEBUG === 'hanzogui') {
                    console.info("components", Object.keys(components || []), components);
                }
            }
        }
        if (shouldPrintDebug === 'verbose') {
            logger.info("allLoadedComponent modules ".concat(propsWithFileInfo.allLoadedComponents
                .map(function (k) { return k.moduleName; })
                .join(', ')));
            logger.info("valid import paths: ".concat(JSON.stringify((0, extractHelpers_1.getValidComponentsPaths)(propsWithFileInfo))));
        }
        var doesUseValidImport = false;
        var hasImportedTheme = false;
        var importDeclarations = [];
        var _loop_1 = function (bodyPath) {
            if (bodyPath.type !== 'ImportDeclaration')
                return "continue";
            var node = ('node' in bodyPath ? bodyPath.node : bodyPath);
            var moduleName = node.source.value;
            // if importing valid module
            var valid = (0, extractHelpers_1.isValidImport)(propsWithFileInfo, moduleName);
            if (valid) {
                importDeclarations.push(node);
            }
            if (shouldPrintDebug === 'verbose') {
                logger.info(" - import via ".concat(moduleName, " ").concat(valid));
            }
            if (extractStyledDefinitions && enableDynamicEvaluation) {
                // check all imports for `styled`, not just valid packages
                // styled( is basically guaranteed to be hanzogui regardless of source
                if (node.specifiers.some(function (specifier) { return specifier.local.name === 'styled'; })) {
                    doesUseValidImport = true;
                    // don't break - need to collect all import declarations for the styled() handler
                }
            }
            if (valid) {
                var names = node.specifiers.map(function (specifier) { return specifier.local.name; });
                var isValidComponent = names.some(function (name) {
                    return Boolean((0, extractHelpers_1.isValidImport)(propsWithFileInfo, moduleName, name));
                });
                if (shouldPrintDebug === 'verbose') {
                    logger.info(" - import ".concat(isValidComponent ? '✅' : '⇣', " - ").concat(names.join(', '), " via package '").concat(moduleName, "' - (valid: ").concat(JSON.stringify((0, extractHelpers_1.getValidComponentsPaths)(propsWithFileInfo)), ")"));
                }
                if (isValidComponent) {
                    doesUseValidImport = true;
                    if (!(extractStyledDefinitions && enableDynamicEvaluation))
                        return "break";
                }
            }
        };
        for (var _i = 0, body_1 = body; _i < body_1.length; _i++) {
            var bodyPath = body_1[_i];
            var state_1 = _loop_1(bodyPath);
            if (state_1 === "break")
                break;
        }
        if (shouldPrintDebug) {
            logger.info("".concat(JSON.stringify({ doesUseValidImport: doesUseValidImport, hasImportedTheme: hasImportedTheme }, null, 2), "\n"));
        }
        if (!doesUseValidImport &&
            extractStyledDefinitions &&
            enableDynamicEvaluation &&
            sourcePath) {
            // check if any local import is in the dynamic cache or has styled components
            for (var _l = 0, body_2 = body; _l < body_2.length; _l++) {
                var bodyPath = body_2[_l];
                if (bodyPath.type !== 'ImportDeclaration')
                    continue;
                var node = ('node' in bodyPath ? bodyPath.node : bodyPath);
                var moduleName = node.source.value;
                var resolved = resolveImportPath(sourcePath, moduleName);
                if (!resolved)
                    continue;
                if (dynamicComponentCache.has(resolved)) {
                    doesUseValidImport = true;
                    break;
                }
                if (mightHaveStyledComponents(resolved)) {
                    doesUseValidImport = true;
                    break;
                }
            }
        }
        if (!doesUseValidImport) {
            return null;
        }
        function getValidImportedComponent(componentName) {
            var importDeclaration = importDeclarations.find(function (dec) {
                return dec.specifiers.some(function (spec) { return spec.local.name === componentName; });
            });
            if (!importDeclaration) {
                return null;
            }
            return (0, extractHelpers_1.getValidImport)(propsWithFileInfo, importDeclaration.source.value, componentName);
        }
        tm.mark('import-check', !!shouldPrintDebug);
        var couldntParse = false;
        var modifiedComponents = new Set();
        // only keeping a cache around per-file, reset it if it changes
        var bindingCache = {};
        var callTraverse = function (a) {
            // @ts-ignore
            return fileOrPath.type === 'File' ? (0, traverse_1.default)(fileOrPath, a) : fileOrPath.traverse(a);
        };
        var shouldDisableExtraction = disableExtraction === true ||
            (Array.isArray(disableExtraction) && disableExtraction.includes(sourcePath));
        /**
         * Step 2: Statically extract from JSX < /> nodes
         */
        var programPath = null;
        var res = {
            styled: 0,
            flattened: 0,
            optimized: 0,
            modified: 0,
            found: 0,
        };
        var version = "".concat(Math.random());
        callTraverse({
            // @ts-ignore
            Program: {
                enter: function (path) {
                    programPath = path;
                },
            },
            // styled() calls
            CallExpression: function (path) {
                var _a;
                var _b, _c;
                if (disable || shouldDisableExtraction || extractStyledDefinitions === false) {
                    return;
                }
                if (!t.isIdentifier(path.node.callee) || path.node.callee.name !== 'styled') {
                    return;
                }
                var variableName = t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)
                    ? path.parent.id.name
                    : 'unknown';
                if (shouldPrintDebug) {
                    logger.info(" [styled] Found styled(".concat(variableName, ")"));
                }
                var parentNode = path.node.arguments[0];
                if (!t.isIdentifier(parentNode)) {
                    return;
                }
                var parentName = parentNode.name;
                var definition = path.node.arguments[1];
                if (!parentName || !definition || !t.isObjectExpression(definition)) {
                    return;
                }
                // look up by parent first (e.g. View in `styled(View, {...})`), then by self
                var Component = getValidImportedComponent(parentName) || getValidImportedComponent(variableName);
                if (!Component) {
                    if (!enableDynamicEvaluation) {
                        return;
                    }
                    try {
                        if (shouldPrintDebug) {
                            logger.info("Unknown component: ".concat(variableName, " = styled(").concat(parentName, ") attempting dynamic load: ").concat(sourcePath));
                        }
                        var out_1 = (0, loadHanzogui_1.loadHanzoguiSync)({
                            forceExports: true,
                            components: [sourcePath],
                            cacheKey: version,
                        });
                        if (!(out_1 === null || out_1 === void 0 ? void 0 : out_1.components)) {
                            if (shouldPrintDebug) {
                                logger.info("Couldn't load, got ".concat(out_1));
                            }
                            return;
                        }
                        propsWithFileInfo.allLoadedComponents = __spreadArray(__spreadArray([], propsWithFileInfo.allLoadedComponents, true), out_1.components, true);
                        Component = out_1.components.flatMap(function (x) { var _a; return (_a = x.nameToInfo[variableName]) !== null && _a !== void 0 ? _a : []; })[0];
                        if (!out_1.cached) {
                            var foundNames = (_b = out_1.components) === null || _b === void 0 ? void 0 : _b.map(function (x) { return Object.keys(x.nameToInfo).join(', '); }).join(', ').trim();
                            if (foundNames) {
                                (0, cli_color_1.colorLog)(cli_color_1.Color.FgYellow, "      | Hanzogui found dynamic components: ".concat(foundNames));
                            }
                        }
                    }
                    catch (err) {
                        if (shouldPrintDebug) {
                            logger.info("skip optimize styled(".concat(variableName, "), unable to pre-process (DEBUG=hanzogui for more)"));
                        }
                    }
                }
                if (!Component) {
                    if (shouldPrintDebug) {
                        logger.info(" No component found");
                    }
                    /**
                     * We could/should still extract CSS just limited to validStyleProps
                     */
                    return;
                }
                var componentSkipProps = new Set(__spreadArray(__spreadArray(__spreadArray([], (Component.staticConfig.inlineWhenUnflattened || []), true), (Component.staticConfig.inlineProps || []), true), [
                    // for now skip variants, will return to them
                    'variants',
                    'defaultVariants',
                    // skip fontFamily its basically a "variant", important for theme use to be value always
                    'fontFamily',
                    'name',
                    'focusStyle',
                    'focusVisibleStyle',
                    'focusWithinStyle',
                    'disabledStyle',
                    'hoverStyle',
                    'pressStyle',
                ], false));
                // for now dont parse variants, spreads, etc
                var skipped = new Set();
                var styles = {};
                var staticDefaultProps = {};
                // Generate scope object at this level
                var staticNamespace = (0, getStaticBindingsForScope_1.getStaticBindingsForScope)(path.scope, importsWhitelist, sourcePath, bindingCache, shouldPrintDebug);
                var attemptEval = !evaluateVars
                    ? evaluateAstNode_1.evaluateAstNode
                    : (0, createEvaluator_1.createEvaluator)({
                        props: propsWithFileInfo,
                        staticNamespace: staticNamespace,
                        sourcePath: sourcePath,
                        shouldPrintDebug: shouldPrintDebug,
                    });
                var attemptEvalSafe = (0, createEvaluator_1.createSafeEvaluator)(attemptEval);
                for (var _i = 0, _d = definition.properties; _i < _d.length; _i++) {
                    var property = _d[_i];
                    if (t.isObjectProperty(property) &&
                        (t.isIdentifier(property.key) || t.isStringLiteral(property.key))) {
                        var key = t.isIdentifier(property.key)
                            ? property.key.name
                            : property.key.value;
                        var defaultPropValue = attemptEvalSafe(property.value);
                        if (defaultPropValue !== constants_1.FAILED_EVAL) {
                            staticDefaultProps[key] = defaultPropValue;
                        }
                    }
                    if (!t.isObjectProperty(property) ||
                        !t.isIdentifier(property.key) ||
                        !isValidStyleKey(property.key.name, Component.staticConfig) ||
                        // TODO make pseudos and variants work
                        // skip pseudos
                        pseudoDescriptors[property.key.name] ||
                        (
                        // skip variants
                        (_c = Component.staticConfig.variants) === null || _c === void 0 ? void 0 : _c[property.key.name]) ||
                        componentSkipProps.has(property.key.name)) {
                        skipped.add(property);
                        continue;
                    }
                    // attempt eval
                    var out_2 = attemptEvalSafe(property.value);
                    if (out_2 === constants_1.FAILED_EVAL) {
                        skipped.add(property);
                    }
                    else {
                        styles[property.key.name] = out_2;
                    }
                }
                var out = getSplitStyles(styles, Component.staticConfig, defaultTheme, '', componentState, styleProps, undefined, undefined, undefined, undefined, false, shouldPrintDebug);
                var classNames = __assign({}, out.classNames);
                // // add in the style object as classnames
                // const atomics = getPropsAtomic(out.style)
                // for (const atomic of atomics) {
                //   out.rulesToInsert = out.rulesToInsert || []
                //   out.rulesToInsert.push(atomic)
                //   classNames[atomic.property] = atomic.identifier
                // }
                if (shouldPrintDebug) {
                    logger.info([
                        "Extracted styled(".concat(variableName, ")\n"),
                        JSON.stringify(styles, null, 2),
                        '\n classNames:',
                        JSON.stringify(classNames, null, 2),
                        '\n  rulesToInsert:',
                        out.rulesToInsert,
                    ].join(' '));
                }
                // don't replace definition values with class name strings -
                // the runtime needs real values for animations, context, and group styles.
                // we only emit the CSS rules so they're available if the runtime uses classNames.
                if (out.rulesToInsert) {
                    for (var key in out.rulesToInsert) {
                        var styleObject = out.rulesToInsert[key];
                        onStyledDefinitionRule === null || onStyledDefinitionRule === void 0 ? void 0 : onStyledDefinitionRule(styleObject[web_1.StyleObjectIdentifier], styleObject[web_1.StyleObjectRules]);
                    }
                }
                res.styled++;
                // register so JSX handler can find this component (same-file and cross-file)
                if (extractStyledDefinitions && enableDynamicEvaluation && Component) {
                    var dynamicStaticConfig = __assign(__assign({}, Component.staticConfig), { defaultProps: __assign(__assign({}, Component.staticConfig.defaultProps), staticDefaultProps) });
                    // add to allLoadedComponents with '' so getValidComponent matches when moduleName is ''
                    // (same-file styled components have '' as moduleName in JSX handler)
                    propsWithFileInfo.allLoadedComponents.push({
                        moduleName: '',
                        nameToInfo: (_a = {}, _a[variableName] = { staticConfig: dynamicStaticConfig }, _a),
                    });
                    // also cache by file path so other files importing from this path can find it
                    if (sourcePath) {
                        var existing = dynamicComponentCache.get(sourcePath);
                        if (!existing) {
                            existing = { moduleName: sourcePath, nameToInfo: {} };
                            dynamicComponentCache.set(sourcePath, existing);
                        }
                        existing.nameToInfo[variableName] = { staticConfig: dynamicStaticConfig };
                    }
                }
                if (shouldPrintDebug) {
                    logger.info("Extracted styled(".concat(variableName, ")"));
                }
            },
            JSXElement: function (traversePath) {
                var _a;
                var _b, _c, _d, _e;
                tm.mark('jsx-element', !!shouldPrintDebug);
                var node = traversePath.node.openingElement;
                var ogAttributes = node.attributes.map(function (attr) { return (__assign({}, attr)); });
                var componentName = (0, extractHelpers_1.findComponentName)(traversePath.scope);
                var closingElement = traversePath.node.closingElement;
                // skip non-identifier opening elements (member expressions, etc.)
                if ((closingElement && t.isJSXMemberExpression(closingElement === null || closingElement === void 0 ? void 0 : closingElement.name)) ||
                    !t.isJSXIdentifier(node.name)) {
                    if (shouldPrintDebug) {
                        logger.info(" skip non-identifier element");
                    }
                    return;
                }
                // validate its a proper import from hanzogui (or internally inside hanzogui)
                var binding = traversePath.scope.getBinding(node.name.name);
                var moduleName = '';
                var dynamicComponent = null;
                if (binding) {
                    if (t.isImportDeclaration(binding.path.parent)) {
                        moduleName = binding.path.parent.source.value;
                        if (!(0, extractHelpers_1.isValidImport)(propsWithFileInfo, moduleName, binding.identifier.name)) {
                            // fallback: try dynamic component cache for local imports (relative or tsconfig alias)
                            if (enableDynamicEvaluation && sourcePath) {
                                var resolved = resolveImportPath(sourcePath, moduleName);
                                if (resolved) {
                                    // check cache first
                                    var cached = dynamicComponentCache.get(resolved);
                                    if (cached === null || cached === void 0 ? void 0 : cached.nameToInfo[binding.identifier.name]) {
                                        dynamicComponent = cached.nameToInfo[binding.identifier.name];
                                    }
                                    else if (!dynamicLoadingInProgress.has(resolved) &&
                                        mightHaveStyledComponents(resolved)) {
                                        // proactively load the file
                                        dynamicLoadingInProgress.add(resolved);
                                        try {
                                            var out = (0, loadHanzogui_1.loadHanzoguiSync)({
                                                forceExports: true,
                                                components: [resolved],
                                            });
                                            if (out === null || out === void 0 ? void 0 : out.components) {
                                                for (var _i = 0, _f = out.components; _i < _f.length; _i++) {
                                                    var comp = _f[_i];
                                                    // merge into cache
                                                    var existing = dynamicComponentCache.get(resolved);
                                                    if (!existing) {
                                                        existing = { moduleName: resolved, nameToInfo: {} };
                                                        dynamicComponentCache.set(resolved, existing);
                                                    }
                                                    Object.assign(existing.nameToInfo, comp.nameToInfo);
                                                    // also add to allLoadedComponents so getValidComponent works
                                                    propsWithFileInfo.allLoadedComponents.push({
                                                        moduleName: resolved,
                                                        nameToInfo: comp.nameToInfo,
                                                    });
                                                }
                                                var cachedNow = dynamicComponentCache.get(resolved);
                                                if (cachedNow === null || cachedNow === void 0 ? void 0 : cachedNow.nameToInfo[binding.identifier.name]) {
                                                    dynamicComponent = cachedNow.nameToInfo[binding.identifier.name];
                                                }
                                            }
                                        }
                                        catch (err) {
                                            if (shouldPrintDebug) {
                                                logger.info(" - Failed to dynamically load ".concat(resolved, ": ").concat(err));
                                            }
                                        }
                                        finally {
                                            dynamicLoadingInProgress.delete(resolved);
                                        }
                                    }
                                }
                            }
                            if (!dynamicComponent) {
                                if (shouldPrintDebug) {
                                    logger.info(" - Binding in component ".concat(componentName, " not valid import: \"").concat(binding.identifier.name, "\" isn't in ").concat(moduleName, "\n"));
                                }
                                return;
                            }
                        }
                    }
                }
                var component = dynamicComponent ||
                    (0, extractHelpers_1.getValidComponent)(propsWithFileInfo, moduleName, node.name.name);
                if (!component || !component.staticConfig) {
                    if (shouldPrintDebug) {
                        logger.info("\n - No Hanzogui conf for: ".concat(node.name.name, "\n"));
                    }
                    return;
                }
                var originalNodeName = node.name.name;
                // found a valid tag
                res.found++;
                var filePath = "./".concat((0, node_path_1.relative)(process.cwd(), sourcePath));
                var lineNumbers = node.loc
                    ? node.loc.start.line +
                        (node.loc.start.line !== node.loc.end.line ? "-".concat(node.loc.end.line) : '')
                    : '';
                var codePosition = "".concat(filePath, ":").concat(lineNumbers);
                // debug just one
                var debugPropValue = node.attributes
                    .filter(function (n) {
                    return t.isJSXAttribute(n) && t.isJSXIdentifier(n.name) && n.name.name === 'debug';
                })
                    // @ts-ignore
                    .map(function (n) {
                    if (n.value === null)
                        return true;
                    if (t.isStringLiteral(n.value))
                        return n.value.value;
                    return false;
                })[0];
                if (debugPropValue) {
                    shouldPrintDebug = debugPropValue;
                }
                if (shouldPrintDebug) {
                    logger.info("\u001B[33m\u001B[0m " + "".concat(componentName, " | ").concat(codePosition, " -------------------"));
                    // prettier-ignore
                    logger.info([
                        '\x1b[1m',
                        '\x1b[32m',
                        "<".concat(originalNodeName, " />"),
                        disableDebugAttr ? '' : '🐛',
                    ].join(' '));
                }
                // add data-* debug attributes
                if (platform !== 'native') {
                    if (shouldAddDebugProp && !disableDebugAttr) {
                        res.modified++;
                        node.attributes.unshift(t.jsxAttribute(t.jsxIdentifier('data-is'), t.stringLiteral(node.name.name)));
                        if (componentName) {
                            node.attributes.unshift(t.jsxAttribute(t.jsxIdentifier('data-in'), t.stringLiteral(componentName)));
                        }
                        node.attributes.unshift(t.jsxAttribute(t.jsxIdentifier('data-at'), t.stringLiteral("".concat((0, node_path_1.basename)(filePath), ":").concat(lineNumbers))));
                    }
                }
                if (shouldDisableExtraction) {
                    if (shouldPrintDebug === 'verbose') {
                        logger.info(" \u274C Extraction disabled: ".concat(JSON.stringify(disableExtraction), "\n"));
                    }
                    return;
                }
                try {
                    var staticConfig_1 = component.staticConfig;
                    var defaultProps_1 = __assign({}, getDefaultProps(staticConfig_1));
                    var variants_1 = staticConfig_1.variants || {};
                    var isTextView_1 = staticConfig_1.isText || false;
                    var validStyles_1 = (_b = staticConfig_1 === null || staticConfig_1 === void 0 ? void 0 : staticConfig_1.validStyles) !== null && _b !== void 0 ? _b : {};
                    // find render="a" render="main" etc dom indicators
                    var tagName_1 = (_c = defaultProps_1.render) !== null && _c !== void 0 ? _c : (isTextView_1 ? 'span' : 'div');
                    traversePath
                        .get('openingElement')
                        .get('attributes')
                        .forEach(function (path) {
                        var attr = path.node;
                        if (t.isJSXSpreadAttribute(attr))
                            return;
                        if (attr.name.name !== 'render')
                            return;
                        var val = attr.value;
                        if (!t.isStringLiteral(val))
                            return;
                        tagName_1 = val.value;
                    });
                    if (shouldPrintDebug === 'verbose') {
                        console.info(" Start tag ".concat(tagName_1));
                    }
                    var flatNodeName = getFlattenedNode === null || getFlattenedNode === void 0 ? void 0 : getFlattenedNode({ isTextView: isTextView_1, tag: tagName_1 });
                    var inlineProps_1 = new Set(__spreadArray(__spreadArray([], (restProps.inlineProps || []), true), (staticConfig_1.inlineProps || []), true));
                    var deoptProps_1 = new Set(__spreadArray(__spreadArray([
                        // always de-opt animation these
                        'animation',
                        'animateOnly',
                        'animatePresence',
                        'disableOptimization'
                    ], (!isTargetingHTML
                        ? [
                            'pressStyle',
                            'focusStyle',
                            'focusVisibleStyle',
                            'focusWithinStyle',
                            'disabledStyle',
                        ]
                        : []), true), ((hanzoguiConfig === null || hanzoguiConfig === void 0 ? void 0 : hanzoguiConfig.animations.isReactNative)
                        ? ['enterStyle', 'exitStyle']
                        : []), true));
                    var inlineWhenUnflattened_1 = new Set(staticConfig_1.inlineWhenUnflattened || []);
                    // Generate scope object at this level
                    var staticNamespace = (0, getStaticBindingsForScope_1.getStaticBindingsForScope)(traversePath.scope, importsWhitelist, sourcePath, bindingCache, shouldPrintDebug);
                    var attemptEval_1 = !evaluateVars
                        ? evaluateAstNode_1.evaluateAstNode
                        : (0, createEvaluator_1.createEvaluator)({
                            props: propsWithFileInfo,
                            staticNamespace: staticNamespace,
                            sourcePath: sourcePath,
                            traversePath: traversePath,
                            shouldPrintDebug: shouldPrintDebug,
                        });
                    var attemptEvalSafe_1 = (0, createEvaluator_1.createSafeEvaluator)(attemptEval_1);
                    if (shouldPrintDebug) {
                        logger.info("  staticNamespace ".concat(Object.keys(staticNamespace).join(', ')));
                    }
                    //
                    //  SPREADS SETUP
                    //
                    if (couldntParse) {
                        return;
                    }
                    tm.mark('jsx-element-flattened', !!shouldPrintDebug);
                    var attrs_2 = [];
                    var shouldDeopt_1 = false;
                    var inlined_2 = new Map();
                    var variantValues_1 = new Map();
                    var hasSetOptimized_1 = false;
                    var inlineWhenUnflattenedOGVals_1 = {};
                    // RUN first pass
                    // normalize all conditionals so we can evaluate away easier later
                    // at the same time lets normalize shorthand media queries into spreads:
                    // that way we can parse them with the same logic later on
                    //
                    // {...media.sm && { color: x ? 'red' : 'blue' }}
                    // => {...media.sm && x && { color: 'red' }}
                    // => {...media.sm && !x && { color: 'blue' }}
                    //
                    // $sm={{ color: 'red' }}
                    // => {...media.sm && { color: 'red' }}
                    //
                    // $sm={{ color: x ? 'red' : 'blue' }}
                    // => {...media.sm && x && { color: 'red' }}
                    // => {...media.sm && !x && { color: 'blue' }}
                    var propMapperStyleState_1 = {
                        staticConfig: staticConfig_1,
                        usedKeys: {},
                        classNames: {},
                        style: {},
                        theme: defaultTheme,
                        viewProps: defaultProps_1,
                        conf: hanzoguiConfig,
                        props: defaultProps_1,
                        componentState: componentState,
                        styleProps: __assign(__assign({}, styleProps), { resolveValues: 'auto' }),
                        debug: shouldPrintDebug,
                    };
                    attrs_2 = traversePath
                        .get('openingElement')
                        .get('attributes')
                        .flatMap(function (path) {
                        var _a;
                        // avoid work
                        if (shouldDeopt_1) {
                            return;
                        }
                        try {
                            var res_1 = evaluateAttribute(path);
                            if (!res_1) {
                                path.remove();
                            }
                            return res_1;
                        }
                        catch (err) {
                            if (shouldPrintDebug) {
                                logger.info([
                                    'Recoverable error extracting attribute',
                                    err.message,
                                    shouldPrintDebug === 'verbose' ? err.stack : '',
                                ].join(' '));
                                if (shouldPrintDebug === 'verbose') {
                                    logger.info("node ".concat((_a = path.node) === null || _a === void 0 ? void 0 : _a.type));
                                }
                            }
                            // dont flatten if we run into error
                            inlined_2.set("".concat(Math.random()), 'spread');
                            return {
                                type: 'attr',
                                value: path.node,
                            };
                        }
                    })
                        .flat(4)
                        .filter(extractHelpers_1.isPresent);
                    if (shouldPrintDebug) {
                        logger.info(['  - attrs (before):\n', (0, logLines_1.logLines)(attrs_2.map(extractHelpers_1.attrStr).join(', '))].join(' '));
                    }
                    // START function evaluateAttribute
                    function evaluateAttribute(path) {
                        var _a;
                        var attribute = path.node;
                        var attr = { type: 'attr', value: attribute };
                        // ...spreads
                        if (t.isJSXSpreadAttribute(attribute)) {
                            var arg = attribute.argument;
                            var conditional = t.isConditionalExpression(arg)
                                ? // <YStack {...isSmall ? { color: 'red } : { color: 'blue }}
                                    [arg.test, arg.consequent, arg.alternate]
                                : t.isLogicalExpression(arg) && arg.operator === '&&'
                                    ? // <YStack {...isSmall && { color: 'red }}
                                        [arg.left, arg.right, null]
                                    : null;
                            if (conditional) {
                                var test_1 = conditional[0], alt = conditional[1], cons = conditional[2];
                                if (!test_1)
                                    throw new Error("no test");
                                if ([alt, cons].some(function (side) { return side && !isStaticObject(side); })) {
                                    if (shouldPrintDebug) {
                                        logger.info("not extractable ".concat(alt, " ").concat(cons));
                                    }
                                    return attr;
                                }
                                // split into individual ternaries per object property
                                return __spreadArray(__spreadArray([], (flattenNestedTernaries(test_1, alt) || []), true), ((cons &&
                                    flattenNestedTernaries(t.unaryExpression('!', test_1), cons)) ||
                                    []), true).map(function (ternary) { return ({
                                    type: 'ternary',
                                    value: ternary,
                                }); });
                            }
                        }
                        // END ...spreads
                        // directly keep these
                        // couldn't evaluate spread, undefined name, or name is not string
                        if (t.isJSXSpreadAttribute(attribute) ||
                            !attribute.name ||
                            typeof attribute.name.name !== 'string') {
                            if (shouldPrintDebug) {
                                logger.info('  ! inlining, spread attr');
                            }
                            inlined_2.set("".concat(Math.random()), 'spread');
                            return attr;
                        }
                        var name = attribute.name.name;
                        // in hanzogui style is handled at the end of the style loop so its not as simple as just
                        // adding this as a "style" property
                        // its not used often when using hanzogui so not optimizing it for now
                        if (name === 'style') {
                            shouldDeopt_1 = true;
                            return null;
                        }
                        if (excludeProps === null || excludeProps === void 0 ? void 0 : excludeProps.has(name)) {
                            if (shouldPrintDebug) {
                                logger.info(['  excluding prop', name].join(' '));
                            }
                            return null;
                        }
                        if (inlineProps_1.has(name)) {
                            inlined_2.set(name, name);
                            if (shouldPrintDebug) {
                                logger.info(['  ! inlining, inline prop', name].join(' '));
                            }
                            return attr;
                        }
                        // pass className, key, and style props through untouched
                        if (UNTOUCHED_PROPS[name]) {
                            return attr;
                        }
                        if (INLINE_EXTRACTABLE[name]) {
                            inlined_2.set(name, INLINE_EXTRACTABLE[name]);
                            return attr;
                        }
                        if (name.startsWith('data-') ||
                            name.startsWith('aria-') ||
                            validHTMLAttributes_1.validHTMLAttributes[name]) {
                            return attr;
                        }
                        // de-opt on enterStyle={expression}
                        if ((name === 'enterStyle' || name === 'exitStyle') &&
                            t.isJSXExpressionContainer(attribute === null || attribute === void 0 ? void 0 : attribute.value)) {
                            shouldDeopt_1 = true;
                            return attr;
                        }
                        // shorthand media queries
                        if (name[0] === '$' && t.isJSXExpressionContainer(attribute === null || attribute === void 0 ? void 0 : attribute.value)) {
                            var shortname = name.slice(1);
                            if (mediaQueryConfig[shortname]) {
                                var expression = attribute.value.expression;
                                if (!t.isJSXEmptyExpression(expression)) {
                                    var ternaries_1 = flattenNestedTernaries(t.stringLiteral(shortname), expression, {
                                        inlineMediaQuery: shortname,
                                    });
                                    if (ternaries_1) {
                                        return ternaries_1.map(function (value) { return ({
                                            type: 'ternary',
                                            value: value,
                                        }); });
                                    }
                                }
                            }
                        }
                        var _b = (function () {
                            if (t.isJSXExpressionContainer(attribute === null || attribute === void 0 ? void 0 : attribute.value)) {
                                return [attribute.value.expression, path.get('value')];
                            }
                            return [attribute.value, path.get('value')];
                        })(), value = _b[0], valuePath = _b[1];
                        var remove = function () {
                            Array.isArray(valuePath)
                                ? valuePath.map(function (p) { return p.remove(); })
                                : valuePath.remove();
                        };
                        if (name === 'ref') {
                            if (shouldPrintDebug) {
                                logger.info(['  ! inlining, ref', name].join(' '));
                            }
                            inlined_2.set('ref', 'ref');
                            return attr;
                        }
                        if (name === 'render') {
                            // Only optimize string literal render props
                            // JSX elements and functions should deopt
                            if (!value || value.type !== 'StringLiteral') {
                                if (shouldPrintDebug) {
                                    logger.info("  ! deopt on render prop (not a string literal)");
                                }
                                shouldDeopt_1 = true;
                            }
                            return {
                                type: 'attr',
                                value: path.node,
                            };
                        }
                        // native shouldn't extract variables
                        if (disableExtractVariables === true) {
                            if (value) {
                                if (value.type === 'StringLiteral' && value.value[0] === '$') {
                                    if (shouldPrintDebug) {
                                        logger.info([
                                            "  ! inlining, native disable extract: ".concat(name, " ="),
                                            value.value,
                                        ].join(' '));
                                    }
                                    inlined_2.set(name, true);
                                    return attr;
                                }
                            }
                        }
                        if (name === 'theme') {
                            inlined_2.set('theme', attr.value);
                            return attr;
                        }
                        // if value can be evaluated, extract it and filter it out
                        var styleValue = attemptEvalSafe_1(value);
                        // never flatten if a prop isn't a valid static attribute
                        // only post prop-mapping
                        if (!variants_1[name] && !isValidStyleKey(name, staticConfig_1)) {
                            var out_3 = null;
                            // for now passing empty props {}, a bit odd, need to at least document
                            // for now we don't expose custom components so just noting behavior
                            propMapper(name, styleValue, propMapperStyleState_1, false, function (key, val) {
                                out_3 || (out_3 = {});
                                out_3[key] = val;
                            });
                            if (out_3) {
                                if (isTargetingHTML) {
                                    // translate to DOM-compat
                                    out_3 = reactNativeWebInternals.createDOMProps(isTextView_1 ? 'span' : 'div', out_3);
                                    // remove className - we dont use rnw styling
                                    delete out_3.className;
                                }
                            }
                            var didInline_1 = false;
                            var attributes = Object.keys(out_3).map(function (key) {
                                var _a;
                                var val = out_3[key];
                                var isStyle = isValidStyleKey(key, staticConfig_1);
                                if (isStyle) {
                                    return {
                                        type: 'style',
                                        value: (_a = {}, _a[key] = styleValue, _a),
                                        name: key,
                                        attr: path.node,
                                    };
                                }
                                if (validHTMLAttributes_1.validHTMLAttributes[key] ||
                                    key.startsWith('aria-') ||
                                    key.startsWith('data-') ||
                                    // this is debug stuff added by vite / new jsx transform
                                    key === '__source' ||
                                    key === '__self') {
                                    return attr;
                                }
                                if (shouldPrintDebug) {
                                    logger.info('  ! inlining, non-static ' + key);
                                }
                                didInline_1 = true;
                                inlined_2.set(key, val);
                                return val;
                            });
                            // weird logic whats going on here
                            if (didInline_1) {
                                if (shouldPrintDebug) {
                                    logger.info("  bailing flattening due to attributes ".concat(attributes.map(function (x) {
                                        return x.toString();
                                    })));
                                }
                                // bail
                                return attr;
                            }
                            // return evaluated attributes
                            return attributes;
                        }
                        // FAILED = dynamic or ternary, keep going
                        if (styleValue !== constants_1.FAILED_EVAL) {
                            if (inlineWhenUnflattened_1.has(name)) {
                                // preserve original value for restoration
                                inlineWhenUnflattenedOGVals_1[name] = { styleValue: styleValue, attr: attr };
                            }
                            if (isValidStyleKey(name, staticConfig_1)) {
                                // $theme-, $group- styles should not be flattened (needs runtime handling)
                                // $platform- can be flattened if the platform matches
                                if (name[0] === '$') {
                                    if (name.startsWith('$theme-') || name.startsWith('$group-')) {
                                        if (shouldPrintDebug) {
                                            logger.info("  ! not flattening media-like style: ".concat(name));
                                        }
                                        inlined_2.set(name, true);
                                        return attr;
                                    }
                                    // $platform-web, $platform-native, $platform-ios, $platform-android, $platform-tv, $platform-androidtv, $platform-tvos
                                    if (name.startsWith('$platform-')) {
                                        var platformName = name.slice(10); // remove '$platform-'
                                        var isMatchingPlatform = platformName === platform ||
                                            (platformName === 'native' && platform === 'native') ||
                                            (platformName === 'web' && platform === 'web');
                                        if (isMatchingPlatform && typeof styleValue === 'object') {
                                            // Flatten the inner styles directly
                                            if (shouldPrintDebug) {
                                                logger.info("  flattening $platform-".concat(platformName, ": ").concat(JSON.stringify(styleValue)));
                                            }
                                            return Object.entries(styleValue).map(function (_a) {
                                                var _b;
                                                var key = _a[0], val = _a[1];
                                                return ({
                                                    type: 'style',
                                                    value: (_b = {}, _b[key] = val, _b),
                                                    name: key,
                                                    attr: path.node,
                                                });
                                            });
                                        }
                                        else {
                                            // On native builds, sub-platform variants (android, ios, tv, androidtv, tvos)
                                            // can't be resolved at compile time - leave for runtime evaluation
                                            if (platform === 'native' &&
                                                nativeOnlyPlatforms.has(platformName)) {
                                                if (shouldPrintDebug) {
                                                    logger.info("  ! keeping platform-specific style for runtime evaluation: ".concat(name));
                                                }
                                                inlined_2.set(name, true);
                                                return attr;
                                            }
                                            // Platform doesn't match, skip these styles entirely
                                            if (shouldPrintDebug) {
                                                logger.info("  ! skipping non-matching platform style: ".concat(name));
                                            }
                                            return [];
                                        }
                                    }
                                }
                                if (shouldPrintDebug) {
                                    logger.info("  style: ".concat(name, " = ").concat(JSON.stringify(styleValue)));
                                }
                                if (!(name in defaultProps_1)) {
                                    if (!hasSetOptimized_1) {
                                        res.optimized++;
                                        hasSetOptimized_1 = true;
                                    }
                                }
                                return {
                                    type: 'style',
                                    value: (_a = {}, _a[name] = styleValue, _a),
                                    name: name,
                                    attr: path.node,
                                };
                            }
                            if (variants_1[name]) {
                                variantValues_1.set(name, styleValue);
                            }
                            inlined_2.set(name, true);
                            return attr;
                        }
                        // ternaries!
                        // binary ternary, we can eventually make this smarter but step 1
                        // basically for the common use case of:
                        // opacity={(conditional ? 0 : 1) * scale}
                        if (t.isBinaryExpression(value)) {
                            if (shouldPrintDebug) {
                                logger.info(" binary expression ".concat(name, " = ").concat(value));
                            }
                            var operator = value.operator, left = value.left, right = value.right;
                            // if one side is a ternary, and the other side is evaluatable, we can maybe extract
                            var lVal = attemptEvalSafe_1(left);
                            var rVal = attemptEvalSafe_1(right);
                            if (shouldPrintDebug) {
                                logger.info("  evalBinaryExpression lVal ".concat(String(lVal), ", rVal ").concat(String(rVal)));
                            }
                            if (lVal !== constants_1.FAILED_EVAL && t.isConditionalExpression(right)) {
                                var ternary = addBinaryConditional(operator, left, right);
                                if (ternary)
                                    return ternary;
                            }
                            if (rVal !== constants_1.FAILED_EVAL && t.isConditionalExpression(left)) {
                                var ternary = addBinaryConditional(operator, right, left);
                                if (ternary)
                                    return ternary;
                            }
                            if (shouldPrintDebug) {
                                logger.info("  evalBinaryExpression cant extract");
                            }
                            inlined_2.set(name, true);
                            return attr;
                        }
                        var staticConditional = getStaticConditional(value);
                        if (staticConditional) {
                            if (shouldPrintDebug === 'verbose') {
                                logger.info(" static conditional ".concat(name, " ").concat(value));
                            }
                            return { type: 'ternary', value: staticConditional };
                        }
                        var staticLogical = getStaticLogical(value);
                        if (staticLogical) {
                            if (shouldPrintDebug === 'verbose') {
                                logger.info(" static ternary ".concat(name, " =  ").concat(value));
                            }
                            return { type: 'ternary', value: staticLogical };
                        }
                        // if we've made it this far, the prop stays inline
                        inlined_2.set(name, true);
                        if (shouldPrintDebug) {
                            logger.info(" ! inline no match ".concat(name, " ").concat(value));
                        }
                        //
                        // RETURN ATTR
                        //
                        return attr;
                        // attr helpers:
                        function addBinaryConditional(operator, staticExpr, cond) {
                            var _a, _b;
                            if (getStaticConditional(cond)) {
                                var alt = attemptEval_1(t.binaryExpression(operator, staticExpr, cond.alternate));
                                var cons = attemptEval_1(t.binaryExpression(operator, staticExpr, cond.consequent));
                                if (shouldPrintDebug) {
                                    logger.info(['  binaryConditional', cond.test, cons, alt].join(' '));
                                }
                                return {
                                    type: 'ternary',
                                    value: {
                                        test: cond.test,
                                        remove: remove,
                                        alternate: (_a = {}, _a[name] = alt, _a),
                                        consequent: (_b = {}, _b[name] = cons, _b),
                                    },
                                };
                            }
                            return null;
                        }
                        function getStaticConditional(value) {
                            var _a, _b;
                            if (t.isConditionalExpression(value)) {
                                try {
                                    var aVal = attemptEval_1(value.alternate);
                                    var cVal = attemptEval_1(value.consequent);
                                    if (shouldPrintDebug) {
                                        var type = value.test.type;
                                        logger.info(['      static ternary', type, cVal, aVal].join(' '));
                                    }
                                    return {
                                        test: value.test,
                                        remove: remove,
                                        consequent: (_a = {}, _a[name] = cVal, _a),
                                        alternate: (_b = {}, _b[name] = aVal, _b),
                                    };
                                }
                                catch (err) {
                                    if (shouldPrintDebug) {
                                        logger.info(['       cant eval ternary', err.message].join(' '));
                                    }
                                }
                            }
                            return null;
                        }
                        function getStaticLogical(value) {
                            var _a;
                            if (t.isLogicalExpression(value)) {
                                if (value.operator === '&&') {
                                    try {
                                        var val = attemptEval_1(value.right);
                                        if (shouldPrintDebug) {
                                            logger.info(['  staticLogical', value.left, name, val].join(' '));
                                        }
                                        return {
                                            test: value.left,
                                            remove: remove,
                                            consequent: (_a = {}, _a[name] = val, _a),
                                            alternate: null,
                                        };
                                    }
                                    catch (err) {
                                        if (shouldPrintDebug) {
                                            logger.info(['  cant static eval logical', err].join(' '));
                                        }
                                    }
                                }
                            }
                            return null;
                        }
                    } // END function evaluateAttribute
                    function isStaticObject(obj) {
                        return (t.isObjectExpression(obj) &&
                            obj.properties.every(function (prop) {
                                if (!t.isObjectProperty(prop)) {
                                    // console.warn('not an object prop?', prop)
                                    return false;
                                }
                                var propName = prop.key['name'];
                                if (!isValidStyleKey(propName, staticConfig_1) && propName !== 'render') {
                                    if (shouldPrintDebug) {
                                        logger.info(['  not a valid style prop!', propName].join(' '));
                                    }
                                    return false;
                                }
                                return true;
                            }));
                    }
                    // side = {
                    //   color: 'red',
                    //   background: x ? 'red' : 'green',
                    //   $gtSm: { color: 'green' }
                    // }
                    // => Ternary<test, { color: 'red' }, null>
                    // => Ternary<test && x, { background: 'red' }, null>
                    // => Ternary<test && !x, { background: 'green' }, null>
                    // => Ternary<test && '$gtSm', { color: 'green' }, null>
                    function flattenNestedTernaries(test, side, ternaryPartial) {
                        if (ternaryPartial === void 0) { ternaryPartial = {}; }
                        if (!side) {
                            return null;
                        }
                        if (!isStaticObject(side)) {
                            throw new Error('not extractable');
                        }
                        return side.properties.flatMap(function (property) {
                            if (!t.isObjectProperty(property)) {
                                throw new Error('expected object property');
                            }
                            // this could be a recurse here if we want to get fancy
                            if (t.isConditionalExpression(property.value)) {
                                // merge up into the parent conditional, split into two
                                var _a = [
                                    t.objectExpression([
                                        t.objectProperty(property.key, property.value.consequent),
                                    ]),
                                    t.objectExpression([
                                        t.objectProperty(property.key, property.value.alternate),
                                    ]),
                                ].map(function (x) { return attemptEval_1(x); }), truthy = _a[0], falsy = _a[1];
                                return [
                                    createTernary(__assign(__assign({ remove: function () { } }, ternaryPartial), { test: t.logicalExpression('&&', test, property.value.test), consequent: truthy, alternate: null })),
                                    createTernary(__assign(__assign({}, ternaryPartial), { test: t.logicalExpression('&&', test, t.unaryExpression('!', property.value.test)), consequent: falsy, alternate: null, remove: function () { } })),
                                ];
                            }
                            var obj = t.objectExpression([
                                t.objectProperty(property.key, property.value),
                            ]);
                            var consequent = attemptEval_1(obj);
                            return createTernary(__assign(__assign({ remove: function () { } }, ternaryPartial), { test: test, consequent: consequent, alternate: null }));
                        });
                    }
                    if (couldntParse || shouldDeopt_1) {
                        if (shouldPrintDebug) {
                            logger.info(["  avoid optimizing:", { couldntParse: couldntParse, shouldDeopt: shouldDeopt_1 }].join(' '));
                        }
                        node.attributes = ogAttributes;
                        return;
                    }
                    // before deopt, can still optimize
                    var parentFn = (0, findTopmostFunction_1.findTopmostFunction)(traversePath);
                    if (parentFn) {
                        modifiedComponents.add(parentFn);
                    }
                    // flatten logic!
                    // fairly simple check to see if all children are text
                    var hasSpread = attrs_2.some(function (x) { return x.type === 'attr' && t.isJSXSpreadAttribute(x.value); });
                    var hasOnlyStringChildren = !hasSpread &&
                        (node.selfClosing ||
                            (traversePath.node.children &&
                                traversePath.node.children.every(function (x) { return x.type === 'JSXText'; })));
                    var themeVal_1 = inlined_2.get('theme');
                    // on native we can't flatten when theme prop is set
                    if (platform !== 'native') {
                        inlined_2.delete('theme');
                    }
                    for (var _g = 0, inlined_1 = inlined_2; _g < inlined_1.length; _g++) {
                        var key = inlined_1[_g][0];
                        var isStaticObjectVariant = ((_d = staticConfig_1.variants) === null || _d === void 0 ? void 0 : _d[key]) && variantValues_1.has(key);
                        if (INLINE_EXTRACTABLE[key] || isStaticObjectVariant) {
                            inlined_2.delete(key);
                        }
                    }
                    var canFlattenProps = inlined_2.size === 0;
                    var shouldFlatten_1 = Boolean(flatNodeName &&
                        !shouldDeopt_1 &&
                        canFlattenProps &&
                        !hasSpread &&
                        !staticConfig_1.isStyledHOC &&
                        !staticConfig_1.isHOC &&
                        !staticConfig_1.isReactNative &&
                        staticConfig_1.neverFlatten !== true &&
                        (staticConfig_1.neverFlatten === 'jsx' ? hasOnlyStringChildren : true));
                    var usedThemeKeys_1 = new Set();
                    // if it accesses any theme values during evaluation
                    themeAccessListeners.add(function (key) {
                        if (disableExtractVariables) {
                            usedThemeKeys_1.add(key);
                            shouldFlatten_1 = false;
                            if (shouldPrintDebug === 'verbose') {
                                logger.info([' ! accessing theme key, avoid flatten', key].join(' '));
                            }
                        }
                    });
                    if (!shouldFlatten_1) {
                        // were no longer partially optimizing, it adds a lot of complexity for dubious performance
                        if (shouldPrintDebug) {
                            logger.info("Deopting ".concat(JSON.stringify({
                                shouldFlatten: shouldFlatten_1,
                                shouldDeopt: shouldDeopt_1,
                                canFlattenProps: canFlattenProps,
                                hasSpread: hasSpread,
                                neverFlatten: staticConfig_1.neverFlatten,
                            })));
                        }
                        node.attributes = ogAttributes;
                        return;
                    }
                    // ensure the default styles are there
                    var skipMap_1 = false;
                    var defaultStyleAttrs = Object.keys(defaultProps_1).flatMap(function (key) {
                        var _a;
                        if (skipMap_1)
                            return [];
                        var value = defaultProps_1[key];
                        if (key === 'theme' && !themeVal_1) {
                            if (platform === 'native') {
                                shouldFlatten_1 = false;
                                skipMap_1 = true;
                                inlined_2.set('theme', { value: t.stringLiteral(value) });
                            }
                            themeVal_1 = { value: t.stringLiteral(value) };
                            return [];
                        }
                        if (!isValidStyleKey(key, staticConfig_1)) {
                            return [];
                        }
                        var name = (hanzoguiConfig === null || hanzoguiConfig === void 0 ? void 0 : hanzoguiConfig.shorthands[key]) || key;
                        if (value === undefined) {
                            logger.warn("\u26A0\uFE0F Error evaluating default style for component, prop ".concat(key, " ").concat(value));
                            shouldDeopt_1 = true;
                            return;
                        }
                        if (name[0] === '$' && mediaQueryConfig[name.slice(1)]) {
                            defaultProps_1[key] = undefined;
                            return evaluateAttribute({
                                node: t.jsxAttribute(t.jsxIdentifier(name), t.jsxExpressionContainer(t.objectExpression(Object.keys(value)
                                    .filter(function (k) {
                                    return typeof value[k] !== 'undefined';
                                })
                                    .map(function (k) {
                                    return t.objectProperty(t.identifier(k), (0, literalToAst_1.literalToAst)(value[k]));
                                })))),
                            });
                        }
                        var attr = {
                            type: 'style',
                            name: name,
                            value: (_a = {}, _a[name] = value, _a),
                        };
                        return attr;
                    });
                    if (!skipMap_1) {
                        if (defaultStyleAttrs.length) {
                            attrs_2 = __spreadArray(__spreadArray([], defaultStyleAttrs, true), attrs_2, true);
                        }
                    }
                    // combine ternaries
                    var ternaries_2 = [];
                    attrs_2 = attrs_2
                        .reduce(function (out, cur) {
                        var next = attrs_2[attrs_2.indexOf(cur) + 1];
                        if (cur.type === 'ternary') {
                            ternaries_2.push(cur.value);
                        }
                        if ((!next || next.type !== 'ternary') && ternaries_2.length) {
                            // finish, process
                            var normalized = (0, normalizeTernaries_1.normalizeTernaries)(ternaries_2).map(function (_a) {
                                var alternate = _a.alternate, consequent = _a.consequent, rest = __rest(_a, ["alternate", "consequent"]);
                                return {
                                    type: 'ternary',
                                    value: __assign(__assign({}, rest), { alternate: alternate || null, consequent: consequent || null }),
                                };
                            });
                            try {
                                return __spreadArray(__spreadArray([], out, true), normalized, true);
                            }
                            finally {
                                if (shouldPrintDebug) {
                                    logger.info("    normalizeTernaries (".concat(ternaries_2.length, " => ").concat(normalized.length, ")"));
                                }
                                ternaries_2 = [];
                            }
                        }
                        if (cur.type === 'ternary') {
                            return out;
                        }
                        out.push(cur);
                        return out;
                    }, [])
                        .flat();
                    // wrap theme around children on flatten
                    // account for shouldFlatten could change w the above block "if (disableExtractVariables)"
                    if (themeVal_1) {
                        if (!programPath) {
                            console.warn("No program path found, avoiding importing flattening / importing theme in ".concat(sourcePath));
                        }
                        else {
                            if (shouldPrintDebug) {
                                logger.info(['  - wrapping theme', themeVal_1].join(' '));
                            }
                            // remove theme attribute from flattened node
                            attrs_2 = attrs_2.filter(function (x) {
                                return !(x.type === 'attr' &&
                                    t.isJSXAttribute(x.value) &&
                                    x.value.name.name === 'theme');
                            });
                            // add import
                            if (!hasImportedTheme) {
                                hasImportedTheme = true;
                                programPath.node.body.push(t.importDeclaration([
                                    t.importSpecifier(t.identifier('_HanzoguiTheme'), t.identifier('Theme')),
                                ], t.stringLiteral('@hanzogui/web')));
                            }
                            traversePath.replaceWith(t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier('_HanzoguiTheme'), [
                                t.jsxAttribute(t.jsxIdentifier('name'), themeVal_1.value),
                            ]), t.jsxClosingElement(t.jsxIdentifier('_HanzoguiTheme')), [traversePath.node]));
                        }
                    }
                    if (shouldPrintDebug) {
                        logger.info(['  - attrs (flattened): \n', (0, logLines_1.logLines)(attrs_2.map(extractHelpers_1.attrStr).join(', '))].join(' '));
                    }
                    function mergeToEnd(obj, key, val) {
                        if (key in obj) {
                            delete obj[key];
                        }
                        obj[key] = val;
                    }
                    // preserves order
                    function normalizeStyleWithoutVariants(style) {
                        var _a;
                        var res = {};
                        for (var key in style) {
                            if (staticConfig_1.variants && key in staticConfig_1.variants) {
                                mergeToEnd(res, key, style[key]);
                            }
                            else {
                                var expanded = normalizeStyle((_a = {}, _a[key] = style[key], _a), true);
                                for (var key_1 in expanded) {
                                    mergeToEnd(res, key_1, expanded[key_1]);
                                }
                            }
                        }
                        return res;
                    }
                    // evaluates all static attributes into a simple object
                    var foundStaticProps = {};
                    for (var key in attrs_2) {
                        var cur = attrs_2[key];
                        if (cur.type === 'style') {
                            // remove variants because they are processed later, and can lead to invalid values here
                            // see <Spacer flex /> where flex looks like a valid style, but is a variant
                            var expanded = normalizeStyleWithoutVariants(cur.value);
                            // preserve order
                            for (var key_2 in expanded) {
                                mergeToEnd(foundStaticProps, key_2, expanded[key_2]);
                            }
                            continue;
                        }
                        if (cur.type === 'attr') {
                            if (t.isJSXSpreadAttribute(cur.value)) {
                                continue;
                            }
                            if (!t.isJSXIdentifier(cur.value.name)) {
                                continue;
                            }
                            var key_3 = cur.value.name.name;
                            // undefined = boolean true
                            var value = attemptEvalSafe_1(cur.value.value || t.booleanLiteral(true));
                            if (value !== constants_1.FAILED_EVAL) {
                                mergeToEnd(foundStaticProps, key_3, value);
                            }
                        }
                    }
                    // must preserve exact order
                    var completeProps_1 = {};
                    for (var key in defaultProps_1) {
                        if (!(key in foundStaticProps)) {
                            completeProps_1[key] = defaultProps_1[key];
                        }
                    }
                    for (var key in foundStaticProps) {
                        completeProps_1[key] = foundStaticProps[key];
                    }
                    // expand shorthands, de-opt variables
                    attrs_2 = attrs_2.reduce(function (acc, cur) {
                        var _a, _b;
                        if (!cur)
                            return acc;
                        if (cur.type === 'attr' && !t.isJSXSpreadAttribute(cur.value)) {
                            if (shouldFlatten_1) {
                                var name_1 = cur.value.name.name;
                                if (typeof name_1 === 'string') {
                                    if (name_1 === 'render') {
                                        // remove render=""
                                        return acc;
                                    }
                                    // if flattening, expand variants
                                    if (variants_1[name_1] && variantValues_1.has(name_1)) {
                                        var styleState = __assign(__assign({}, propMapperStyleState_1), { props: completeProps_1 });
                                        var out_4 = {};
                                        propMapper(name_1, variantValues_1.get(name_1), styleState, false, function (key, val) {
                                            out_4[key] = val;
                                        });
                                        if (out_4 && isTargetingHTML) {
                                            var cn = out_4.className;
                                            // translate to DOM-compat
                                            out_4 = reactNativeWebInternals.createDOMProps(isTextView_1 ? 'span' : 'div', out_4);
                                            // remove rnw className use ours
                                            out_4.className = cn;
                                        }
                                        if (shouldPrintDebug) {
                                            logger.info([' - expanded variant', name_1, out_4].join(' '));
                                        }
                                        for (var key_4 in out_4) {
                                            var value_1 = out_4[key_4];
                                            if (isValidStyleKey(key_4, staticConfig_1)) {
                                                acc.push({
                                                    type: 'style',
                                                    value: (_a = {}, _a[key_4] = value_1, _a),
                                                    name: key_4,
                                                    attr: cur.value,
                                                });
                                            }
                                            else {
                                                acc.push({
                                                    type: 'attr',
                                                    value: t.jsxAttribute(t.jsxIdentifier(key_4), t.jsxExpressionContainer(typeof value_1 === 'string'
                                                        ? t.stringLiteral(value_1)
                                                        : (0, literalToAst_1.literalToAst)(value_1))),
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (cur.type !== 'style') {
                            acc.push(cur);
                            return acc;
                        }
                        var key = Object.keys(cur.value)[0];
                        var value = cur.value[key];
                        var fullKey = hanzoguiConfig === null || hanzoguiConfig === void 0 ? void 0 : hanzoguiConfig.shorthands[key];
                        // expand shorthands
                        if (fullKey) {
                            cur.value = (_b = {}, _b[fullKey] = value, _b);
                            key = fullKey;
                        }
                        // finally we have all styles + expansions, lets see if we need to skip
                        // any and keep them as attrs
                        if (disableExtractVariables) {
                            if (value[0] === '$' &&
                                (usedThemeKeys_1.has(key) || usedThemeKeys_1.has(fullKey))) {
                                if (shouldPrintDebug) {
                                    logger.info(["   keeping variable inline: ".concat(key, " ="), value].join(' '));
                                }
                                acc.push({
                                    type: 'attr',
                                    value: t.jsxAttribute(t.jsxIdentifier(key), t.jsxExpressionContainer(t.stringLiteral(value))),
                                });
                                return acc;
                            }
                        }
                        acc.push(cur);
                        return acc;
                    }, []);
                    tm.mark('jsx-element-expanded', !!shouldPrintDebug);
                    if (shouldPrintDebug) {
                        logger.info(['  - attrs (expanded): \n', (0, logLines_1.logLines)(attrs_2.map(extractHelpers_1.attrStr).join(', '))].join(' '));
                    }
                    // merge styles, leave undefined values
                    var prev_1 = null;
                    function mergeStyles(prev, next) {
                        for (var key in next) {
                            // merge pseudos
                            if (pseudoDescriptors[key]) {
                                prev[key] = prev[key] || {};
                                Object.assign(prev[key], next[key]);
                            }
                            else {
                                mergeToEnd(prev, key, next[key]);
                            }
                        }
                    }
                    // post process
                    var getProps = function (props, includeProps, debugName) {
                        if (includeProps === void 0) { includeProps = false; }
                        if (debugName === void 0) { debugName = ''; }
                        if (!props) {
                            if (shouldPrintDebug)
                                logger.info([' getProps() no props'].join(' '));
                            return {};
                        }
                        if (excludeProps === null || excludeProps === void 0 ? void 0 : excludeProps.size) {
                            for (var key in props) {
                                if (excludeProps.has(key)) {
                                    if (shouldPrintDebug)
                                        logger.info([' delete excluded', key].join(' '));
                                    delete props[key];
                                }
                            }
                        }
                        var before = process.env.IS_STATIC;
                        process.env.IS_STATIC = 'is_static';
                        try {
                            var out = getSplitStyles(props, staticConfig_1, defaultTheme, '', componentState, __assign(__assign(__assign({}, styleProps), { noClass: true, fallbackProps: completeProps_1 }), (platform === 'native' && {
                                resolveValues: 'except-theme',
                            })), undefined, undefined, undefined, undefined, false, debugPropValue || shouldPrintDebug);
                            var outProps = __assign(__assign(__assign({}, (includeProps ? out.viewProps : {})), out.style), out.pseudos);
                            // check de-opt props again
                            for (var key in outProps) {
                                if (deoptProps_1.has(key)) {
                                    shouldFlatten_1 = false;
                                }
                            }
                            if (shouldPrintDebug) {
                                logger.info("(".concat(debugName, ")"));
                                // prettier-ignore
                                logger.info("\n       getProps (props in): ".concat((0, logLines_1.logLines)((0, extractHelpers_1.objToStr)(props))));
                                // prettier-ignore
                                logger.info("\n       getProps (outProps): ".concat((0, logLines_1.logLines)((0, extractHelpers_1.objToStr)(outProps))));
                            }
                            if (out.fontFamily) {
                                (0, propsToFontFamilyCache_1.setPropsToFontFamily)(outProps, out.fontFamily);
                                if (shouldPrintDebug) {
                                    logger.info("\n      \uD83D\uDCAC new font fam: ".concat(out.fontFamily));
                                }
                            }
                            return outProps;
                        }
                        catch (err) {
                            logger.info(['error', err.message, err.stack].join(' '));
                            return {};
                        }
                        finally {
                            process.env.IS_STATIC = before;
                        }
                    };
                    // add default props
                    attrs_2.unshift({
                        type: 'style',
                        value: defaultProps_1,
                    });
                    attrs_2 = attrs_2.reduce(function (acc, cur) {
                        if (cur.type === 'style') {
                            var keys = Object.keys(cur.value || {});
                            if (!keys.length) {
                                return acc;
                            }
                            var key = keys[0];
                            var value = cur.value[key];
                            // Check if this is a media-like key ($theme-, $platform-, $group-, or $mediaQuery)
                            var isMediaLikeKey = key[0] === '$' &&
                                (key.startsWith('$theme-') ||
                                    key.startsWith('$platform-') ||
                                    key.startsWith('$group-') ||
                                    mediaQueryConfig[key.slice(1)]);
                            var shouldKeepOriginalAttr = 
                            // !isStyleAndAttr[key] &&
                            !shouldFlatten_1 &&
                                // de-opt if non-style
                                !validStyles_1[key] &&
                                !pseudoDescriptors[key] &&
                                !isMediaLikeKey &&
                                !(key.startsWith('data-') || key.startsWith('aria-'));
                            if (shouldKeepOriginalAttr) {
                                if (shouldPrintDebug) {
                                    logger.info(['     - keeping as non-style', key].join(' '));
                                }
                                prev_1 = cur;
                                acc.push({
                                    type: 'attr',
                                    value: t.jsxAttribute(t.jsxIdentifier(key), t.jsxExpressionContainer(typeof value === 'string'
                                        ? t.stringLiteral(value)
                                        : (0, literalToAst_1.literalToAst)(value))),
                                });
                                acc.push(cur);
                                return acc;
                            }
                            if ((prev_1 === null || prev_1 === void 0 ? void 0 : prev_1.type) === 'style') {
                                mergeStyles(prev_1.value, cur.value);
                                return acc;
                            }
                        }
                        if (cur.type === 'style') {
                            prev_1 = cur;
                        }
                        acc.push(cur);
                        return acc;
                    }, []);
                    if (shouldPrintDebug) {
                        logger.info([
                            '  - attrs (combined 🔀): \n',
                            (0, logLines_1.logLines)(attrs_2.map(extractHelpers_1.attrStr).join(', ')),
                        ].join(' '));
                    }
                    var getStyleError = null;
                    // fix up ternaries, combine final style values
                    for (var _h = 0, attrs_1 = attrs_2; _h < attrs_1.length; _h++) {
                        var attr = attrs_1[_h];
                        try {
                            if (shouldPrintDebug) {
                                console.info("  Processing ".concat(attr.type, ":"));
                            }
                            switch (attr.type) {
                                case 'ternary': {
                                    var a = getProps(attr.value.alternate, false, 'ternary.alternate');
                                    var c = getProps(attr.value.consequent, false, 'ternary.consequent');
                                    if (a)
                                        attr.value.alternate = a;
                                    if (c)
                                        attr.value.consequent = c;
                                    if (shouldPrintDebug)
                                        logger.info(['     => tern ', (0, extractHelpers_1.attrStr)(attr)].join(' '));
                                    continue;
                                }
                                case 'style': {
                                    // expand variants and such
                                    var styles = getProps(attr.value, false, 'style');
                                    if (styles) {
                                        // @ts-ignore
                                        attr.value = styles;
                                    }
                                    // prettier-ignore
                                    if (shouldPrintDebug)
                                        logger.info(['  * styles (in)', (0, logLines_1.logLines)((0, extractHelpers_1.objToStr)(attr.value))].join(' '));
                                    // prettier-ignore
                                    if (shouldPrintDebug)
                                        logger.info(['  * styles (out)', (0, logLines_1.logLines)((0, extractHelpers_1.objToStr)(styles))].join(' '));
                                    continue;
                                }
                                case 'attr': {
                                    if (shouldFlatten_1 && t.isJSXAttribute(attr.value)) {
                                        // we know all attributes are static
                                        // this only does one at a time but it should really do the whole group together...
                                        // also awkward to be doing it using jsxAttributes...
                                        var key = attr.value.name.name;
                                        // dont process style/className can just stay attrs
                                        if (key === 'style' || key === 'className' || key === 'render') {
                                            continue;
                                        }
                                        // undefined = boolean true
                                        var value = attemptEvalSafe_1(attr.value.value || t.booleanLiteral(true));
                                        if (value !== constants_1.FAILED_EVAL) {
                                            var outProps = getProps((_a = {}, _a[key] = value, _a), true, "attr.".concat(key));
                                            var outKey = Object.keys(outProps)[0];
                                            if (outKey) {
                                                var outVal = outProps[outKey];
                                                attr.value = t.jsxAttribute(t.jsxIdentifier(outKey), t.jsxExpressionContainer(typeof outVal === 'string'
                                                    ? t.stringLiteral(outVal)
                                                    : (0, literalToAst_1.literalToAst)(outVal)));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        catch (err) {
                            // any error de-opt
                            getStyleError = err;
                        }
                    }
                    if (shouldPrintDebug) {
                        // prettier-ignore
                        logger.info([
                            '  - attrs (ternaries/combined):\n',
                            (0, logLines_1.logLines)(attrs_2.map(extractHelpers_1.attrStr).join(', ')),
                        ].join(' '));
                    }
                    tm.mark('jsx-element-styles', !!shouldPrintDebug);
                    if (getStyleError) {
                        logger.info([' ⚠️ postprocessing error, deopt', getStyleError].join(' '));
                        node.attributes = ogAttributes;
                        return null;
                    }
                    // final lazy extra loop:
                    var existingStyleKeys = new Set();
                    for (var i = attrs_2.length - 1; i >= 0; i--) {
                        var attr = attrs_2[i];
                        // if flattening map inline props to proper flattened names
                        if (shouldFlatten_1) {
                            if (attr.type === 'attr') {
                                if (t.isJSXAttribute(attr.value)) {
                                    if (t.isJSXIdentifier(attr.value.name)) {
                                        var name_2 = attr.value.name.name;
                                        if (INLINE_EXTRACTABLE[name_2]) {
                                            // map to HTML only name
                                            attr.value.name.name = INLINE_EXTRACTABLE[name_2];
                                        }
                                    }
                                }
                            }
                        }
                        // remove duplicate styles
                        // so if you have:
                        //   style({ color: 'red' }), ...someProps, style({ color: 'green' })
                        // this will mutate:
                        //   style({}), ...someProps, style({ color: 'green' })
                        if (attr.type === 'style') {
                            for (var key in attr.value) {
                                if (existingStyleKeys.has(key)) {
                                    if (shouldPrintDebug) {
                                        logger.info(["  >> delete existing ".concat(key)].join(' '));
                                    }
                                    delete attr.value[key];
                                }
                                else {
                                    existingStyleKeys.add(key);
                                }
                            }
                        }
                    }
                    attrs_2 = attrs_2.filter(Boolean);
                    // inlineWhenUnflattened
                    if (!shouldFlatten_1) {
                        if (inlineWhenUnflattened_1.size) {
                            for (var _j = 0, _k = attrs_2.entries(); _j < _k.length; _j++) {
                                var _l = _k[_j], index = _l[0], attr = _l[1];
                                if (attr.type === 'style') {
                                    for (var key in attr.value) {
                                        if (!inlineWhenUnflattened_1.has(key))
                                            continue;
                                        var val = inlineWhenUnflattenedOGVals_1[key];
                                        if (val) {
                                            // delete the style
                                            delete attr.value[key];
                                            // and insert it before
                                            attrs_2.splice(index - 1, 0, val.attr);
                                        }
                                        else {
                                            // just delete it, it was added during expansion but should be left inline
                                            delete attr.value[key];
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // delete empty styles:
                    attrs_2 = attrs_2.filter(function (x) {
                        if (x.type === 'style' && Object.keys(x.value).length === 0) {
                            return false;
                        }
                        return true;
                    });
                    var isNativeNotFlat = !shouldFlatten_1 && platform === 'native';
                    if (isNativeNotFlat) {
                        if (shouldPrintDebug) {
                            logger.info("Disabled flattening except for simple cases on native for now: ".concat(JSON.stringify({
                                flatNode: flatNodeName,
                                shouldDeopt: shouldDeopt_1,
                                canFlattenProps: canFlattenProps,
                                hasSpread: hasSpread,
                                'staticConfig.isStyledHOC': staticConfig_1.isStyledHOC,
                                '!staticConfig.isHOC': !staticConfig_1.isHOC,
                                'staticConfig.isReactNative': staticConfig_1.isReactNative,
                                'staticConfig.neverFlatten': staticConfig_1.neverFlatten,
                            }, null, 2)));
                        }
                        node.attributes = ogAttributes;
                        return null;
                    }
                    if (shouldPrintDebug) {
                        // prettier-ignore
                        logger.info([
                            " - inlined props (".concat(inlined_2.size, "):"),
                            shouldDeopt_1 ? ' deopted' : '',
                            hasSpread ? ' has spread' : '',
                            staticConfig_1.neverFlatten ? 'neverFlatten' : '',
                        ].join(' '));
                        logger.info("  - attrs (end):\n ".concat((0, logLines_1.logLines)(attrs_2.map(extractHelpers_1.attrStr).join(', '))));
                    }
                    onExtractTag({
                        parserProps: propsWithFileInfo,
                        attrs: attrs_2,
                        node: node,
                        lineNumbers: lineNumbers,
                        filePath: filePath,
                        config: hanzoguiConfig,
                        flatNodeName: flatNodeName,
                        attemptEval: attemptEval_1,
                        jsxPath: traversePath,
                        originalNodeName: originalNodeName,
                        programPath: programPath,
                        completeProps: completeProps_1,
                        staticConfig: staticConfig_1,
                    });
                    if (shouldFlatten_1) {
                        if (shouldPrintDebug) {
                            logger.info(['  [✅] flattened', originalNodeName, flatNodeName].join(' '));
                        }
                        // Only rename if onExtractTag hasn't already renamed to a custom wrapper
                        // @ts-ignore - check if already renamed by callback (e.g., to a styled wrapper)
                        var currentName = (_e = node.name) === null || _e === void 0 ? void 0 : _e.name;
                        if (!currentName ||
                            currentName === originalNodeName ||
                            currentName.startsWith('__ReactNative')) {
                            // @ts-ignore
                            node.name.name = flatNodeName;
                            if (closingElement) {
                                // @ts-ignore
                                closingElement.name.name = flatNodeName;
                            }
                        }
                        res.flattened++;
                    }
                }
                catch (err) {
                    node.attributes = ogAttributes;
                    if (!(err instanceof errors_1.BailOptimizationError)) {
                        console.error("@hanzogui/static error, reverting optimization. In ".concat(filePath, " ").concat(lineNumbers, " on ").concat(originalNodeName, ": ").concat(err.message, ". For stack trace set environment TAMAGUI_DEBUG=1"));
                        if (process.env.TAMAGUI_DEBUG === '1') {
                            console.error(err.stack);
                        }
                    }
                }
                finally {
                    if (debugPropValue) {
                        shouldPrintDebug = ogDebug;
                    }
                }
            },
        });
        tm.mark('jsx-done', !!shouldPrintDebug);
        tm.done(shouldPrintDebug === 'verbose');
        return res;
    }
}
