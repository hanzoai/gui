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
exports.getLoadedConfig = exports.esbuildOptionsWithPlugins = exports.esbuildOptions = void 0;
exports.hasBundledConfigChanged = hasBundledConfigChanged;
exports.getBundledConfig = getBundledConfig;
exports.bundleConfig = bundleConfig;
exports.writeHanzoguiCSS = writeHanzoguiCSS;
exports.loadComponents = loadComponents;
exports.loadComponentsSync = loadComponentsSync;
exports.loadComponentsInner = loadComponentsInner;
exports.loadComponentsInnerSync = loadComponentsInnerSync;
var generator_1 = require("@babel/generator");
var traverse_1 = require("@babel/traverse");
var t = require("@babel/types");
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
// @ts-ignore why
var cli_color_1 = require("@hanzogui/cli-color");
var esbuild_1 = require("esbuild");
var FS = require("fs-extra");
var promises_1 = require("node:fs/promises");
var registerRequire_1 = require("../registerRequire");
var babelParse_1 = require("./babelParse");
var bundle_1 = require("./bundle");
var getHanzoguiConfigPathFromOptionsConfig_1 = require("./getHanzoguiConfigPathFromOptionsConfig");
var hasTopLevelAwait_1 = require("./hasTopLevelAwait");
var requireHanzoguiCore_1 = require("../helpers/requireHanzoguiCore");
var detectModuleFormat_1 = require("./detectModuleFormat");
// track temp files for cleanup on exit
var activeTempFiles = new Set();
function getDynamicEvalOutfile(name, format, contents) {
    var ext = format === 'esm' ? 'mjs' : 'cjs';
    var hash = (0, node_crypto_1.createHash)('sha1')
        .update(name)
        .update('\0')
        .update(format)
        .update('\0')
        .update(contents)
        .digest('hex')
        .slice(0, 10);
    return (0, node_path_1.join)(process.cwd(), '.hanzogui', "dynamic-eval-".concat(hash, "-").concat((0, node_path_1.basename)(name), ".").concat(ext));
}
function getEsbuildStdinLoader(filePath) {
    if (filePath.endsWith('.tsx'))
        return 'tsx';
    if (filePath.endsWith('.ts'))
        return 'ts';
    if (filePath.endsWith('.jsx'))
        return 'jsx';
    return 'js';
}
function resolvePackageEntry(packageName, format) {
    var _a;
    if (format === 'cjs') {
        return require.resolve(packageName);
    }
    var packageJsonPath = require.resolve("".concat(packageName, "/package.json"));
    var packageJson = JSON.parse((0, node_fs_1.readFileSync)(packageJsonPath, 'utf-8'));
    var packageRoot = (0, node_path_1.dirname)(packageJsonPath);
    var exportEntry = (_a = packageJson.exports) === null || _a === void 0 ? void 0 : _a['.'];
    var esmEntry = (exportEntry === null || exportEntry === void 0 ? void 0 : exportEntry.import) ||
        (exportEntry === null || exportEntry === void 0 ? void 0 : exportEntry.module) ||
        (exportEntry === null || exportEntry === void 0 ? void 0 : exportEntry.browser) ||
        packageJson.module;
    if (typeof esmEntry === 'string') {
        return (0, node_path_1.join)(packageRoot, esmEntry);
    }
    return require.resolve(packageName);
}
function cleanupTempFiles() {
    for (var _i = 0, activeTempFiles_1 = activeTempFiles; _i < activeTempFiles_1.length; _i++) {
        var f = activeTempFiles_1[_i];
        try {
            (0, node_fs_1.unlinkSync)(f);
        }
        catch (_a) { }
    }
    activeTempFiles.clear();
}
process.on('exit', cleanupTempFiles);
process.on('SIGINT', function () {
    cleanupTempFiles();
    process.exit();
});
process.on('SIGTERM', function () {
    cleanupTempFiles();
    process.exit();
});
var external = [
    '@hanzogui/core',
    '@hanzogui/web',
    'react',
    'react-dom',
    'react-native-svg',
];
var esbuildExtraOptions = {
    define: {
        __DEV__: "".concat(process.env.NODE_ENV === 'development'),
    },
};
// plugin to handle ESM-only features when bundling to CJS
var handleEsmFeaturesPlugin = {
    name: 'handle-esm-features',
    setup: function (build) {
        // only apply transforms for CJS output - ESM supports these natively
        var isCjs = build.initialOptions.format === 'cjs' || !build.initialOptions.format;
        build.onLoad({ filter: /\.(ts|tsx|js|jsx|mjs)$/ }, function (args) {
            var _a;
            // skip if ESM output - import.meta and top-level await work natively
            if (!isCjs) {
                return null;
            }
            // skip most node_modules
            if (args.path.includes('node_modules') && !args.path.includes('@hanzogui')) {
                return null;
            }
            var contents = (0, node_fs_1.readFileSync)(args.path, 'utf8');
            var modified = false;
            // transform import.meta.env -> process.env (Vite-style env vars)
            if (contents.includes('import.meta.env')) {
                contents = contents.replace(/import\.meta\.env/g, 'process.env');
                modified = true;
            }
            // transform import.meta.url -> "" (not needed for static extraction)
            if (contents.includes('import.meta.url')) {
                contents = contents.replace(/import\.meta\.url/g, '""');
                modified = true;
            }
            // transform import.meta.main -> false
            if (contents.includes('import.meta.main')) {
                contents = contents.replace(/import\.meta\.main/g, 'false');
                modified = true;
            }
            // stub files with top-level await - they're typically runtime-only
            if ((0, hasTopLevelAwait_1.hasTopLevelAwait)(contents, args.path)) {
                if ((_a = process.env.DEBUG) === null || _a === void 0 ? void 0 : _a.startsWith('hanzogui')) {
                    console.info("[hanzogui] stubbing file with top-level await: ".concat(args.path));
                }
                return {
                    // Keep this as an ESM-shaped stub so esbuild doesn't inline a top-level
                    // `module.exports = {}` into the parent bundle and wipe its exports.
                    contents: "// stubbed - contains top-level await\nexport default {}",
                    loader: 'js',
                };
            }
            if (modified) {
                return {
                    contents: contents,
                    loader: args.path.endsWith('.tsx')
                        ? 'tsx'
                        : args.path.endsWith('.ts')
                            ? 'ts'
                            : args.path.endsWith('.jsx')
                                ? 'jsx'
                                : 'js',
                };
            }
            return null;
        });
    },
};
// base options for transformSync (no plugins)
var esbuildTransformOptions = __assign({ target: 'es2022', format: 'cjs', jsx: 'automatic', platform: 'node' }, esbuildExtraOptions);
// options for buildSync - NO plugins (buildSync doesn't support plugins)
exports.esbuildOptions = __assign({}, esbuildTransformOptions);
// options for async build (with plugins)
exports.esbuildOptionsWithPlugins = __assign(__assign({}, esbuildTransformOptions), { plugins: [handleEsmFeaturesPlugin] });
// will use cached one if watching
var currentBundle = null;
var isBundling = false;
var lastBundle = null;
var waitForBundle = new Set();
function hasBundledConfigChanged() {
    if (lastBundle === currentBundle) {
        return false;
    }
    lastBundle = currentBundle;
    return true;
}
var loadedConfig = null;
var getLoadedConfig = function () { return loadedConfig; };
exports.getLoadedConfig = getLoadedConfig;
function getBundledConfig(props_1) {
    return __awaiter(this, arguments, void 0, function (props, rebuild) {
        if (rebuild === void 0) { rebuild = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isBundling) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (res) {
                            waitForBundle.add(res);
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    if (!(!currentBundle || rebuild)) return [3 /*break*/, 4];
                    return [4 /*yield*/, bundleConfig(props)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: return [2 /*return*/, currentBundle];
            }
        });
    });
}
global.hanzoguiLastLoaded || (global.hanzoguiLastLoaded = 0);
function updateLastLoaded(config) {
    global.hanzoguiLastLoaded = Date.now();
    global.hanzoguiLastBundledConfig = config;
}
var hasBundledOnce = false;
// use global to dedupe logging - this works within a single process
// but may log multiple times if worker threads are recreated
// that's acceptable - better than nothing
var hasLoggedBuild = false;
function bundleConfig(props) {
    return __awaiter(this, void 0, void 0, function () {
        var configEntry, tmpDir_1, configFormat, configExt, configOutPath, baseComponents, componentFormats_1, componentOutPaths_2, shouldBuild, allOutFiles, stats, allExistAndRecent, _a, _b, start, _i, componentOutPaths_1, p, out, config, createHanzogui, components, _c, components_1, component, res, err_1;
        var _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    // webpack is calling this a ton for no reason
                    if (global.hanzoguiLastBundledConfig && Date.now() - global.hanzoguiLastLoaded < 3000) {
                        // just loaded recently
                        return [2 /*return*/, global.hanzoguiLastBundledConfig];
                    }
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 18, 19, 20]);
                    isBundling = true;
                    configEntry = props.config
                        ? (0, getHanzoguiConfigPathFromOptionsConfig_1.getHanzoguiConfigPathFromOptionsConfig)(props.config)
                        : '';
                    tmpDir_1 = (0, node_path_1.join)(process.cwd(), '.hanzogui');
                    configFormat = configEntry ? (0, detectModuleFormat_1.detectModuleFormat)(configEntry) : 'cjs';
                    configExt = configFormat === 'esm' ? '.mjs' : '.cjs';
                    configOutPath = (0, node_path_1.join)(tmpDir_1, "hanzogui.config".concat(configExt));
                    baseComponents = (props.components || []).filter(function (x) { return x !== '@hanzogui/core'; });
                    componentFormats_1 = baseComponents.map(function (mod) {
                        try {
                            var pkgJson = require.resolve(mod + '/package.json');
                            var pkg = JSON.parse((0, node_fs_1.readFileSync)(pkgJson, 'utf-8'));
                            return pkg.type === 'module' ? 'esm' : 'cjs';
                        }
                        catch (_a) {
                            return 'cjs';
                        }
                    });
                    componentOutPaths_2 = baseComponents.map(function (componentModule, i) {
                        var ext = componentFormats_1[i] === 'esm' ? '.mjs' : '.cjs';
                        return (0, node_path_1.join)(tmpDir_1, "".concat(componentModule
                            .split(node_path_1.sep)
                            .join('-')
                            .replace(/[^a-z0-9]+/gi, ''), "-components.config").concat(ext));
                    });
                    if (process.env.NODE_ENV === 'development' &&
                        ((_d = process.env.DEBUG) === null || _d === void 0 ? void 0 : _d.startsWith('hanzogui'))) {
                        console.info("Building config entry", configEntry);
                    }
                    shouldBuild = !props.disableInitialBuild;
                    if (!(shouldBuild && props.config)) return [3 /*break*/, 5];
                    allOutFiles = __spreadArray([configOutPath], componentOutPaths_2, true);
                    _j.label = 2;
                case 2:
                    _j.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, Promise.all(allOutFiles.map(function (f) { return FS.stat(f).catch(function () { return null; }); }))];
                case 3:
                    stats = _j.sent();
                    allExistAndRecent = stats.every(function (s) { return s !== null && Date.now() - s.mtimeMs < 3000; });
                    if (allExistAndRecent) {
                        shouldBuild = false;
                    }
                    return [3 /*break*/, 5];
                case 4:
                    _a = _j.sent();
                    return [3 /*break*/, 5];
                case 5:
                    if (!shouldBuild) return [3 /*break*/, 11];
                    _j.label = 6;
                case 6:
                    _j.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, FS.ensureDir(tmpDir_1)];
                case 7:
                    _j.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = _j.sent();
                    return [3 /*break*/, 9];
                case 9:
                    start = Date.now();
                    return [4 /*yield*/, Promise.all(__spreadArray([
                            props.config
                                ? (0, bundle_1.esbundleHanzoguiConfig)(__assign({ entryPoints: [configEntry], external: external, outfile: configOutPath, target: 'node24', format: configFormat }, esbuildExtraOptions), props.platform || 'web')
                                : null
                        ], baseComponents.map(function (componentModule, i) {
                            return (0, bundle_1.esbundleHanzoguiConfig)(__assign({ entryPoints: [componentModule], resolvePlatformSpecificEntries: true, external: external, outfile: componentOutPaths_2[i], target: 'node24', format: componentFormats_1[i] }, esbuildExtraOptions), props.platform || 'web');
                        }), true))
                        // only log once per process to avoid duplicate messages
                        // also skip if _skipBuildLog is set (used during worker recycle warmup)
                    ];
                case 10:
                    _j.sent();
                    // only log once per process to avoid duplicate messages
                    // also skip if _skipBuildLog is set (used during worker recycle warmup)
                    if (!hasLoggedBuild && !props['_skipBuildLog']) {
                        hasLoggedBuild = true;
                        (0, cli_color_1.colorLog)(cli_color_1.Color.FgYellow, "\n  \u27A1 [hanzogui] built config, components, prompt (".concat(Date.now() - start, "ms)"));
                        if ((_e = process.env.DEBUG) === null || _e === void 0 ? void 0 : _e.startsWith('hanzogui')) {
                            (0, cli_color_1.colorLog)(cli_color_1.Color.Dim, "\n          Config     .".concat(node_path_1.sep).concat((0, node_path_1.relative)(process.cwd(), configOutPath), "\n          Components ").concat(componentOutPaths_2.map(function (p) { return ".".concat(node_path_1.sep).concat((0, node_path_1.relative)(process.cwd(), p)); }).join('\n             '), "\n          "));
                        }
                    }
                    _j.label = 11;
                case 11:
                    // clear specific output file caches so we pick up the fresh (or newly discovered) build
                    // only clear the built output files - not all require.cache entries, since that breaks
                    // external requires like @hanzogui/config/v3 that are externalized in the bundled CJS
                    if (hasBundledOnce) {
                        try {
                            delete require.cache[require.resolve(configOutPath)];
                        }
                        catch (_k) {
                            // file may not exist yet
                        }
                        for (_i = 0, componentOutPaths_1 = componentOutPaths_2; _i < componentOutPaths_1.length; _i++) {
                            p = componentOutPaths_1[_i];
                            try {
                                delete require.cache[require.resolve(p)];
                            }
                            catch (_l) {
                                // file may not exist yet
                            }
                        }
                    }
                    else {
                        hasBundledOnce = true;
                    }
                    out = void 0;
                    if (!(configFormat === 'esm')) return [3 /*break*/, 13];
                    return [4 /*yield*/, Promise.resolve("".concat((0, node_url_1.pathToFileURL)(configOutPath).href)).then(function (s) { return require(s); })];
                case 12:
                    // use file:// URL for proper ESM resolution
                    out = _j.sent();
                    return [3 /*break*/, 14];
                case 13:
                    out = require(configOutPath);
                    _j.label = 14;
                case 14:
                    config = out.default || out || out.config;
                    if (config && config.config && !config.tokens) {
                        config = config.config;
                    }
                    if (!config) {
                        throw new Error("No config: ".concat(config));
                    }
                    // check for ProxyWorm - indicates a module loading error
                    if (config._isProxyWorm) {
                        throw new Error("Got a proxied config - likely a module loading error. Set DEBUG=hanzogui for details.");
                    }
                    loadedConfig = config;
                    if (!config.parsed) {
                        createHanzogui = (0, requireHanzoguiCore_1.requireHanzoguiCore)(props.platform || 'web').createHanzogui;
                        // need to create it
                        config = createHanzogui(config);
                    }
                    if (!props.outputCSS) return [3 /*break*/, 16];
                    return [4 /*yield*/, writeHanzoguiCSS(props.outputCSS, config)];
                case 15:
                    _j.sent();
                    _j.label = 16;
                case 16: return [4 /*yield*/, loadComponents(__assign(__assign({}, props), { components: componentOutPaths_2 }))];
                case 17:
                    components = _j.sent();
                    if (!components) {
                        throw new Error("No components found: ".concat(componentOutPaths_2.join(', ')));
                    }
                    // map from built back to original module names
                    for (_c = 0, components_1 = components; _c < components_1.length; _c++) {
                        component = components_1[_c];
                        component.moduleName =
                            baseComponents[componentOutPaths_2.indexOf(component.moduleName)] ||
                                component.moduleName;
                        if (!component.moduleName) {
                            if (((_f = process.env.DEBUG) === null || _f === void 0 ? void 0 : _f.includes('hanzogui')) || process.env.IS_TAMAGUI_DEV) {
                                console.warn("\u26A0\uFE0F no module name found: ".concat(component.moduleName, " ").concat(JSON.stringify(baseComponents), " in ").concat(JSON.stringify(componentOutPaths_2)));
                            }
                        }
                    }
                    if (process.env.NODE_ENV === 'development' &&
                        ((_g = process.env.DEBUG) === null || _g === void 0 ? void 0 : _g.startsWith('hanzogui'))) {
                        console.info('Loaded components', components);
                    }
                    res = {
                        components: components,
                        nameToPaths: {},
                        hanzoguiConfig: config,
                    };
                    currentBundle = res;
                    updateLastLoaded(res);
                    return [2 /*return*/, res];
                case 18:
                    err_1 = _j.sent();
                    console.error("Error bundling hanzogui config: ".concat(err_1 === null || err_1 === void 0 ? void 0 : err_1.message, " (run with DEBUG=hanzogui to see stack)"));
                    if ((_h = process.env.DEBUG) === null || _h === void 0 ? void 0 : _h.includes('hanzogui')) {
                        console.error(err_1.stack);
                    }
                    return [3 /*break*/, 20];
                case 19:
                    isBundling = false;
                    waitForBundle.forEach(function (cb) { return cb(); });
                    waitForBundle.clear();
                    return [7 /*endfinally*/];
                case 20: return [2 /*return*/];
            }
        });
    });
}
function writeHanzoguiCSS(outputCSS, config) {
    return __awaiter(this, void 0, void 0, function () {
        var flush, css, _a, err_2;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    flush = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    (0, cli_color_1.colorLog)(cli_color_1.Color.FgYellow, "  \u27A1 [hanzogui] output css: ".concat(outputCSS));
                                    return [4 /*yield*/, FS.writeFile(outputCSS, css)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    css = config.getCSS();
                    if (typeof css !== 'string') {
                        throw new Error("Invalid CSS: ".concat(typeof css, " ").concat(css));
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    _a = (0, node_fs_1.existsSync)(outputCSS);
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, promises_1.readFile)(outputCSS, 'utf8')];
                case 2:
                    _a = (_b.sent()) === css;
                    _b.label = 3;
                case 3:
                    if (!_a) return [3 /*break*/, 4];
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, flush()];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_2 = _b.sent();
                    console.info('Error writing themes', err_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function loadComponents(props_1) {
    return __awaiter(this, arguments, void 0, function (props, forceExports) {
        var coreComponents, otherComponents;
        if (forceExports === void 0) { forceExports = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    coreComponents = getCoreComponentsSync(props);
                    return [4 /*yield*/, loadComponentsInner(props, forceExports)];
                case 1:
                    otherComponents = _a.sent();
                    return [2 /*return*/, __spreadArray(__spreadArray([], coreComponents, true), (otherComponents || []), true)];
            }
        });
    });
}
function loadComponentsSync(props, forceExports) {
    if (forceExports === void 0) { forceExports = false; }
    var coreComponents = getCoreComponentsSync(props);
    var otherComponents = loadComponentsInnerSync(props, forceExports);
    return __spreadArray(__spreadArray([], coreComponents, true), (otherComponents || []), true);
}
function getCoreComponentsSync(props) {
    var loaded = loadComponentsInnerSync(__assign(__assign({}, props), { components: ['@hanzogui/core'] }));
    if (!loaded) {
        throw new Error("Core should always load");
    }
    // always load core so we can optimize if directly importing
    return [
        __assign(__assign({}, loaded[0]), { moduleName: '@hanzogui/core' }),
    ];
}
function loadComponentsInner(props_1) {
    return __awaiter(this, arguments, void 0, function (props, forceExports) {
        var componentsModules, key, unregister, results, _loop_1, _i, componentsModules_1, name_1, err_3;
        var _this = this;
        var _a;
        if (forceExports === void 0) { forceExports = false; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    componentsModules = props.components || [];
                    key = componentsModules.join('\0');
                    if (!forceExports && cacheComponents[key]) {
                        return [2 /*return*/, cacheComponents[key]];
                    }
                    unregister = (0, registerRequire_1.registerRequire)(props.platform || 'web', {
                        proxyWormImports: forceExports,
                    }).unregister;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    results = [];
                    _loop_1 = function (name_1) {
                        var extension, isLocal, isDynamic, format, fileContents, loadModule, writtenContents, didBabel, attemptLoad, dispose, loaded, err_4, err2_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    extension = (0, node_path_1.extname)(name_1);
                                    isLocal = Boolean(extension);
                                    isDynamic = isLocal && forceExports;
                                    format = isLocal ? (0, detectModuleFormat_1.detectModuleFormat)(name_1) : 'cjs';
                                    fileContents = isDynamic ? (0, node_fs_1.readFileSync)(name_1, 'utf-8') : '';
                                    loadModule = name_1;
                                    writtenContents = fileContents;
                                    didBabel = false;
                                    attemptLoad = function () {
                                        var args_1 = [];
                                        for (var _i = 0; _i < arguments.length; _i++) {
                                            args_1[_i] = arguments[_i];
                                        }
                                        return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (_a) {
                                            var moduleResult, nameToInfo;
                                            var _b = _a === void 0 ? {} : _a, _c = _b.forceExports, forceExports = _c === void 0 ? false : _c;
                                            return __generator(this, function (_d) {
                                                switch (_d.label) {
                                                    case 0:
                                                        if (!isDynamic) return [3 /*break*/, 2];
                                                        writtenContents = forceExports
                                                            ? transformAddExports((0, babelParse_1.babelParse)(esbuildit(fileContents, 'modern'), name_1))
                                                            : fileContents;
                                                        loadModule = getDynamicEvalOutfile(name_1, format, writtenContents);
                                                        FS.ensureDirSync((0, node_path_1.dirname)(loadModule));
                                                        activeTempFiles.add(loadModule);
                                                        return [4 /*yield*/, esbuild_1.default.build(__assign(__assign({}, exports.esbuildOptionsWithPlugins), { format: format, outfile: loadModule, stdin: {
                                                                    contents: writtenContents,
                                                                    resolveDir: (0, node_path_1.dirname)(name_1),
                                                                    sourcefile: name_1,
                                                                    loader: getEsbuildStdinLoader(name_1),
                                                                }, alias: {
                                                                    'react-native': resolvePackageEntry('@hanzogui/react-native-web-lite', format),
                                                                    '@hanzogui/react-native-web-lite': resolvePackageEntry('@hanzogui/react-native-web-lite', format),
                                                                    '@hanzogui/react-native-web-internals': resolvePackageEntry('@hanzogui/react-native-web-internals', format),
                                                                }, bundle: true, packages: 'external', allowOverwrite: true, sourcemap: false, loader: bundle_1.esbuildLoaderConfig }))];
                                                    case 1:
                                                        _d.sent();
                                                        _d.label = 2;
                                                    case 2:
                                                        if (process.env.DEBUG === 'hanzogui') {
                                                            console.info("loadModule", loadModule, format);
                                                        }
                                                        if (!(format === 'esm')) return [3 /*break*/, 4];
                                                        return [4 /*yield*/, Promise.resolve("".concat((0, node_url_1.pathToFileURL)(loadModule).href)).then(function (s) { return require(s); })];
                                                    case 3:
                                                        // use file:// URL for proper ESM resolution
                                                        moduleResult = _d.sent();
                                                        return [3 /*break*/, 5];
                                                    case 4:
                                                        moduleResult = require(loadModule);
                                                        _d.label = 5;
                                                    case 5:
                                                        if (!forceExports) {
                                                            (0, registerRequire_1.setRequireResult)(name_1, moduleResult);
                                                        }
                                                        nameToInfo = getComponentStaticConfigByName(name_1, interopDefaultExport(moduleResult));
                                                        return [2 /*return*/, {
                                                                moduleName: name_1,
                                                                nameToInfo: nameToInfo,
                                                            }];
                                                }
                                            });
                                        });
                                    };
                                    dispose = function () {
                                        if (isDynamic) {
                                            FS.removeSync(loadModule);
                                            activeTempFiles.delete(loadModule);
                                        }
                                    };
                                    loaded = void 0;
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, 8, 9]);
                                    return [4 /*yield*/, attemptLoad({ forceExports: true })];
                                case 2:
                                    loaded = _c.sent();
                                    didBabel = true;
                                    return [3 /*break*/, 9];
                                case 3:
                                    err_4 = _c.sent();
                                    console.info('babel err', err_4, writtenContents);
                                    writtenContents = fileContents;
                                    if ((_a = process.env.DEBUG) === null || _a === void 0 ? void 0 : _a.startsWith('hanzogui')) {
                                        console.info("Error parsing babel likely", err_4);
                                    }
                                    _c.label = 4;
                                case 4:
                                    _c.trys.push([4, 6, , 7]);
                                    return [4 /*yield*/, attemptLoad({ forceExports: false })];
                                case 5:
                                    loaded = _c.sent();
                                    return [3 /*break*/, 7];
                                case 6:
                                    err2_1 = _c.sent();
                                    if (process.env.TAMAGUI_ENABLE_WARN_DYNAMIC_LOAD) {
                                        console.info("\nHanzogui attempted but failed to dynamically optimize components in:\n  ".concat(name_1, "\n"));
                                        console.info(err2_1);
                                        console.info("At: ".concat(loadModule), "\ndidBabel: ".concat(didBabel), "\nIn:", writtenContents, "\nisDynamic: ", isDynamic);
                                    }
                                    loaded = [];
                                    return [3 /*break*/, 7];
                                case 7: return [3 /*break*/, 9];
                                case 8:
                                    dispose();
                                    return [7 /*endfinally*/];
                                case 9:
                                    if (Array.isArray(loaded)) {
                                        results.push.apply(results, loaded);
                                    }
                                    else if (loaded) {
                                        results.push(loaded);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, componentsModules_1 = componentsModules;
                    _b.label = 2;
                case 2:
                    if (!(_i < componentsModules_1.length)) return [3 /*break*/, 5];
                    name_1 = componentsModules_1[_i];
                    return [5 /*yield**/, _loop_1(name_1)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    cacheComponents[key] = results;
                    return [2 /*return*/, results];
                case 6:
                    err_3 = _b.sent();
                    console.info("Hanzogui error bundling components", err_3.message, err_3.stack);
                    return [2 /*return*/, null];
                case 7:
                    unregister();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// sync version - uses cjs format for buildSync (no plugin support)
function loadComponentsInnerSync(props, forceExports) {
    if (forceExports === void 0) { forceExports = false; }
    var componentsModules = props.components || [];
    var key = componentsModules.join('\0');
    if (!forceExports && cacheComponents[key]) {
        return cacheComponents[key];
    }
    var unregister = (0, registerRequire_1.registerRequire)(props.platform || 'web', {
        proxyWormImports: forceExports,
    }).unregister;
    try {
        var info = componentsModules.flatMap(function (name) {
            var _a;
            var extension = (0, node_path_1.extname)(name);
            var isLocal = Boolean(extension);
            var isDynamic = isLocal && forceExports;
            var fileContents = isDynamic ? (0, node_fs_1.readFileSync)(name, 'utf-8') : '';
            var loadModule = name;
            var writtenContents = fileContents;
            var didBabel = false;
            function attemptLoad(_a) {
                var _b = _a === void 0 ? {} : _a, _c = _b.forceExports, forceExports = _c === void 0 ? false : _c;
                if (isDynamic) {
                    writtenContents = forceExports
                        ? transformAddExports((0, babelParse_1.babelParse)(esbuildit(fileContents, 'modern'), name))
                        : fileContents;
                    loadModule = getDynamicEvalOutfile(name, 'cjs', writtenContents);
                    FS.ensureDirSync((0, node_path_1.dirname)(loadModule));
                    activeTempFiles.add(loadModule);
                    esbuild_1.default.buildSync(__assign(__assign({}, exports.esbuildOptions), { outfile: loadModule, stdin: {
                            contents: writtenContents,
                            resolveDir: (0, node_path_1.dirname)(name),
                            sourcefile: name,
                            loader: getEsbuildStdinLoader(name),
                        }, alias: {
                            'react-native': resolvePackageEntry('@hanzogui/react-native-web-lite', 'esm'),
                            '@hanzogui/react-native-web-lite': resolvePackageEntry('@hanzogui/react-native-web-lite', 'esm'),
                            '@hanzogui/react-native-web-internals': resolvePackageEntry('@hanzogui/react-native-web-internals', 'esm'),
                        }, bundle: true, packages: 'external', allowOverwrite: true, sourcemap: false, loader: bundle_1.esbuildLoaderConfig }));
                }
                if (process.env.DEBUG === 'hanzogui') {
                    console.info("loadModule", loadModule, require.resolve(loadModule));
                }
                var moduleResult = require(loadModule);
                if (!forceExports) {
                    (0, registerRequire_1.setRequireResult)(name, moduleResult);
                }
                var nameToInfo = getComponentStaticConfigByName(name, interopDefaultExport(moduleResult));
                return {
                    moduleName: name,
                    nameToInfo: nameToInfo,
                };
            }
            var dispose = function () {
                if (isDynamic) {
                    FS.removeSync(loadModule);
                    activeTempFiles.delete(loadModule);
                }
            };
            try {
                var res = attemptLoad({ forceExports: true });
                didBabel = true;
                return res;
            }
            catch (err) {
                console.info('babel err', err, writtenContents);
                writtenContents = fileContents;
                if ((_a = process.env.DEBUG) === null || _a === void 0 ? void 0 : _a.startsWith('hanzogui')) {
                    console.info("Error parsing babel likely", err);
                }
            }
            finally {
                dispose();
            }
            try {
                return attemptLoad({ forceExports: false });
            }
            catch (err) {
                if (process.env.TAMAGUI_ENABLE_WARN_DYNAMIC_LOAD) {
                    console.info("\nHanzogui attempted but failed to dynamically optimize components in:\n  ".concat(name, "\n"));
                    console.info(err);
                    console.info("At: ".concat(loadModule), "\ndidBabel: ".concat(didBabel), "\nIn:", writtenContents, "\nisDynamic: ", isDynamic);
                }
                return [];
            }
            finally {
                dispose();
            }
        });
        cacheComponents[key] = info;
        return info;
    }
    catch (err) {
        console.info("Hanzogui error bundling components", err.message, err.stack);
        return null;
    }
    finally {
        unregister();
    }
}
var esbuildit = function (src, target) {
    return esbuild_1.default.transformSync(src, __assign(__assign({}, esbuildTransformOptions), (target === 'modern' && {
        target: 'es2022',
        jsx: 'automatic',
        loader: 'tsx',
        platform: 'neutral',
        format: 'esm',
    }))).code;
};
function getComponentStaticConfigByName(name, exported) {
    var components = {};
    try {
        if (!exported || typeof exported !== 'object' || Array.isArray(exported)) {
            throw new Error("Invalid export from package ".concat(name, ": ").concat(typeof exported));
        }
        for (var key in exported) {
            var found = getHanzoguiComponent(key, exported[key]);
            if (found) {
                // remove non-stringifyable
                var _a = found.staticConfig, Component = _a.Component, sc = __rest(_a, ["Component"]);
                components[key] = { staticConfig: sc };
            }
        }
    }
    catch (err) {
        if (process.env.TAMAGUI_ENABLE_WARN_DYNAMIC_LOAD) {
            console.error("Hanzogui failed getting components from ".concat(name, " (Disable error by setting environment variable TAMAGUI_ENABLE_WARN_DYNAMIC_LOAD=1)"));
            console.error(err);
        }
    }
    return components;
}
function getHanzoguiComponent(name, Component) {
    if (name[0].toUpperCase() !== name[0]) {
        return;
    }
    var staticConfig = Component === null || Component === void 0 ? void 0 : Component.staticConfig;
    if (staticConfig) {
        return Component;
    }
}
function interopDefaultExport(mod) {
    var _a;
    return (_a = mod === null || mod === void 0 ? void 0 : mod.default) !== null && _a !== void 0 ? _a : mod;
}
var cacheComponents = {};
function transformAddExports(ast) {
    var usedNames = new Set();
    // avoid clobbering
    // @ts-ignore
    (0, traverse_1.default)(ast, {
        ExportNamedDeclaration: function (nodePath) {
            if (nodePath.node.specifiers) {
                for (var _i = 0, _a = nodePath.node.specifiers; _i < _a.length; _i++) {
                    var spec = _a[_i];
                    usedNames.add(t.isIdentifier(spec.exported) ? spec.exported.name : spec.exported.value);
                }
            }
        },
    });
    // @ts-ignore
    (0, traverse_1.default)(ast, {
        VariableDeclaration: function (nodePath) {
            // top level only
            if (!t.isProgram(nodePath.parent))
                return;
            var decs = nodePath.node.declarations;
            if (decs.length > 1)
                return;
            var dec = decs[0];
            if (!t.isIdentifier(dec.id))
                return;
            if (!dec.init)
                return;
            if (usedNames.has(dec.id.name))
                return;
            usedNames.add(dec.id.name);
            nodePath.replaceWith(t.exportNamedDeclaration(t.variableDeclaration('let', [dec]), [
                t.exportSpecifier(t.identifier(dec.id.name), t.identifier(dec.id.name)),
            ]));
        },
    });
    // @ts-ignore
    return (0, generator_1.default)(ast, {
        concise: false,
        filename: 'test.tsx',
        retainLines: false,
        sourceMaps: false,
    }).code;
}
