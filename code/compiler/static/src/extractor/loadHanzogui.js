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
exports.generateThemesAndLog = void 0;
exports.loadHanzogui = loadHanzogui;
exports.loadHanzoguiBuildConfigAsync = loadHanzoguiBuildConfigAsync;
exports.loadHanzoguiBuildConfigSync = loadHanzoguiBuildConfigSync;
exports.loadHanzoguiSync = loadHanzoguiSync;
exports.getOptions = getOptions;
exports.resolveWebOrNativeSpecificEntry = resolveWebOrNativeSpecificEntry;
exports.esbuildWatchFiles = esbuildWatchFiles;
var node_path_1 = require("node:path");
// @ts-ignore why
var cli_color_1 = require("@hanzogui/cli-color");
var esbuild_1 = require("esbuild");
var esbuildWasm = require("esbuild-wasm");
var fsExtra = require("fs-extra");
var constants_1 = require("../constants");
var requireHanzoguiCore_1 = require("../helpers/requireHanzoguiCore");
var registerRequire_1 = require("../registerRequire");
var bundleConfig_1 = require("./bundleConfig");
var getHanzoguiConfigPathFromOptionsConfig_1 = require("./getHanzoguiConfigPathFromOptionsConfig");
var regenerateConfig_1 = require("./regenerateConfig");
var getFilledOptions = function (propsIn) { return (__assign({ 
    // defaults
    platform: process.env.TAMAGUI_TARGET || 'web', config: 'hanzogui.config.ts', components: ['hanzogui'] }, propsIn)); };
var isLoadingPromise;
function loadHanzogui(propsIn) {
    return __awaiter(this, void 0, void 0, function () {
        var resolvePromise, rejectPromise, props, bundleInfo, maybeHanzoguiConfig, createHanzogui, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isLoadingPromise) return [3 /*break*/, 2];
                    return [4 /*yield*/, isLoadingPromise];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    isLoadingPromise = new Promise(function (res, rej) {
                        resolvePromise = res;
                        rejectPromise = rej;
                    });
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 7, 8, 9]);
                    props = getFilledOptions(propsIn);
                    return [4 /*yield*/, (0, bundleConfig_1.getBundledConfig)(props)];
                case 4:
                    bundleInfo = _a.sent();
                    if (!bundleInfo) {
                        console.warn("No bundled config generated, maybe an error in bundling. Set DEBUG=hanzogui and re-run to get logs.");
                        resolvePromise(null);
                        return [2 /*return*/, null];
                    }
                    // this affects the bundled config so run it first
                    return [4 /*yield*/, (0, exports.generateThemesAndLog)(props)
                        // if they accidently pass in a config without createHanzogui called,call it
                    ];
                case 5:
                    // this affects the bundled config so run it first
                    _a.sent();
                    maybeHanzoguiConfig = bundleInfo.hanzoguiConfig;
                    if (maybeHanzoguiConfig && !maybeHanzoguiConfig.parsed) {
                        createHanzogui = (0, requireHanzoguiCore_1.requireHanzoguiCore)(props.platform || 'web').createHanzogui;
                        bundleInfo.hanzoguiConfig = createHanzogui(bundleInfo.hanzoguiConfig);
                    }
                    if (!(0, bundleConfig_1.hasBundledConfigChanged)()) {
                        resolvePromise(bundleInfo);
                        return [2 /*return*/, bundleInfo];
                    }
                    return [4 /*yield*/, (0, regenerateConfig_1.regenerateConfig)(props, bundleInfo)];
                case 6:
                    _a.sent();
                    resolvePromise(bundleInfo);
                    return [2 /*return*/, bundleInfo];
                case 7:
                    err_1 = _a.sent();
                    rejectPromise();
                    throw err_1;
                case 8:
                    isLoadingPromise = null;
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// debounce a bit
var waiting = false;
var generateThemesAndLog = function (options_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([options_1], args_1, true), void 0, function (options, force) {
        var didGenerate, whitespaceBefore, loadedConfig;
        if (force === void 0) { force = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (waiting)
                        return [2 /*return*/];
                    if (!options.themeBuilder)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 6, 7]);
                    waiting = true;
                    return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 30); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, regenerateConfig_1.generateHanzoguiThemes)(options, force)
                        // only logs when changed
                    ];
                case 3:
                    didGenerate = _a.sent();
                    if (!didGenerate) return [3 /*break*/, 5];
                    whitespaceBefore = "  ";
                    (0, cli_color_1.colorLog)(cli_color_1.Color.FgYellow, "".concat(whitespaceBefore, "\u27A1 [hanzogui] generated themes: ").concat((0, node_path_1.relative)(process.cwd(), options.themeBuilder.output)));
                    if (!options.outputCSS) return [3 /*break*/, 5];
                    loadedConfig = (0, bundleConfig_1.getLoadedConfig)();
                    if (!loadedConfig) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, bundleConfig_1.writeHanzoguiCSS)(options.outputCSS, loadedConfig)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    waiting = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
};
exports.generateThemesAndLog = generateThemesAndLog;
var last = {};
var lastVersion = {};
// esbuild-wasm state - initialized once per process
var esbuildWasmInitialized = false;
/**
 * Load hanzogui.build.ts config using esbuild-wasm transform
 * Uses WASM to avoid native esbuild service lifecycle issues (EPIPE errors)
 */
function loadHanzoguiBuildConfigAsync(hanzoguiOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var buildFilePath, absolutePath, source, result, module_1, fn, out, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    buildFilePath = (_a = hanzoguiOptions === null || hanzoguiOptions === void 0 ? void 0 : hanzoguiOptions.buildFile) !== null && _a !== void 0 ? _a : './hanzogui.build.ts';
                    absolutePath = buildFilePath[0] === '.' ? (0, node_path_1.join)(process.cwd(), buildFilePath) : buildFilePath;
                    if (!fsExtra.existsSync(absolutePath)) return [3 /*break*/, 7];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fsExtra.readFile(absolutePath, 'utf-8')
                        // initialize esbuild-wasm once
                    ];
                case 2:
                    source = _b.sent();
                    if (!!esbuildWasmInitialized) return [3 /*break*/, 4];
                    return [4 /*yield*/, esbuildWasm.initialize({})];
                case 3:
                    _b.sent();
                    esbuildWasmInitialized = true;
                    _b.label = 4;
                case 4: return [4 /*yield*/, esbuildWasm.transform(source, {
                        loader: 'ts',
                        format: 'cjs',
                        target: 'node18',
                        sourcefile: absolutePath,
                    })
                    // evaluate the compiled code to get the exports
                    // pass process so process.env works in the config
                ];
                case 5:
                    result = _b.sent();
                    module_1 = { exports: {} };
                    fn = new Function('module', 'exports', 'require', 'process', result.code);
                    fn(module_1, module_1.exports, require, process);
                    out = module_1.exports.default || module_1.exports;
                    if (!out || typeof out !== 'object') {
                        throw new Error("No default export found in ".concat(buildFilePath, ": ").concat(out));
                    }
                    hanzoguiOptions = __assign(__assign({}, hanzoguiOptions), out);
                    return [3 /*break*/, 7];
                case 6:
                    err_2 = _b.sent();
                    console.error("[hanzogui] Error loading ".concat(buildFilePath, ":"), err_2);
                    throw err_2;
                case 7:
                    if (!hanzoguiOptions) {
                        throw new Error("No hanzogui build options found either via input props or at hanzogui.build.ts");
                    }
                    return [2 /*return*/, __assign({ config: 'hanzogui.config.ts', components: ['hanzogui', '@hanzogui/core'] }, hanzoguiOptions)];
            }
        });
    });
}
/**
 * @deprecated Use loadHanzoguiBuildConfigAsync instead to avoid EPIPE errors
 */
function loadHanzoguiBuildConfigSync(hanzoguiOptions) {
    var _a;
    var buildFilePath = (_a = hanzoguiOptions === null || hanzoguiOptions === void 0 ? void 0 : hanzoguiOptions.buildFile) !== null && _a !== void 0 ? _a : './hanzogui.build.ts';
    if (fsExtra.existsSync(buildFilePath)) {
        var registered = (0, registerRequire_1.registerRequire)('web');
        try {
            var out = require(buildFilePath[0] === '.' ? (0, node_path_1.join)(process.cwd(), buildFilePath) : buildFilePath).default;
            if (!out) {
                throw new Error("No default export found in ".concat(buildFilePath, ": ").concat(out));
            }
            hanzoguiOptions = __assign(__assign({}, hanzoguiOptions), out);
        }
        finally {
            registered.unregister();
        }
    }
    if (!hanzoguiOptions) {
        throw new Error("No hanzogui build options found either via input props or at hanzogui.build.ts");
    }
    return __assign({ config: 'hanzogui.config.ts', components: ['hanzogui', '@hanzogui/core'] }, hanzoguiOptions);
}
// loads in-process using esbuild-register
function loadHanzoguiSync(_a) {
    var forceExports = _a.forceExports, cacheKey = _a.cacheKey, propsIn = __rest(_a, ["forceExports", "cacheKey"]);
    var key = JSON.stringify(propsIn);
    if (last[key] && !(0, bundleConfig_1.hasBundledConfigChanged)()) {
        if (!lastVersion[key] || lastVersion[key] === cacheKey) {
            return last[key];
        }
    }
    lastVersion[key] = cacheKey || '';
    var props = getFilledOptions(propsIn);
    // lets shim require and avoid importing react-native + react-native-web
    // we just need to read the config around them
    process.env.IS_STATIC = 'is_static';
    process.env.TAMAGUI_IS_SERVER = 'true';
    var unregister = (0, registerRequire_1.registerRequire)(props.platform || 'web', {
        proxyWormImports: !!forceExports,
    }).unregister;
    try {
        var devValueOG = globalThis['__DEV__'];
        globalThis['__DEV__'] = process.env.NODE_ENV === 'development';
        try {
            // config
            var hanzoguiConfig = null;
            if (propsIn.config) {
                var configPath = (0, getHanzoguiConfigPathFromOptionsConfig_1.getHanzoguiConfigPathFromOptionsConfig)(propsIn.config);
                var exp = require(configPath);
                if (!exp || exp._isProxyWorm) {
                    throw new Error("Got a empty / proxied config!");
                }
                hanzoguiConfig = (exp['default'] || exp['config'] || exp);
                if (!hanzoguiConfig || !hanzoguiConfig.parsed) {
                    var confPath = require.resolve(configPath);
                    throw new Error("Can't find valid config in ".concat(confPath, ":\n          \n  Be sure you \"export default\" or \"export const config\" the config."));
                }
                // set up core
                if (hanzoguiConfig) {
                    var createHanzogui = (0, requireHanzoguiCore_1.requireHanzoguiCore)(props.platform || 'web').createHanzogui;
                    createHanzogui(hanzoguiConfig);
                }
            }
            // components
            var components = (0, bundleConfig_1.loadComponentsSync)(props, forceExports);
            if (!components) {
                throw new Error("No components loaded");
            }
            if (process.env.DEBUG === 'hanzogui') {
                console.info("components", components);
            }
            // undo shims
            process.env.IS_STATIC = undefined;
            globalThis['__DEV__'] = devValueOG;
            var info = {
                components: components,
                hanzoguiConfig: hanzoguiConfig,
                nameToPaths: (0, registerRequire_1.getNameToPaths)(),
            };
            if (hanzoguiConfig) {
                var outputCSS = props.outputCSS;
                if (outputCSS) {
                    (0, bundleConfig_1.writeHanzoguiCSS)(outputCSS, hanzoguiConfig);
                }
                (0, regenerateConfig_1.regenerateConfigSync)(props, info);
            }
            last[key] = __assign(__assign({}, info), { cached: true });
            return info;
        }
        catch (err) {
            if (err instanceof Error) {
                if (!constants_1.SHOULD_DEBUG && !forceExports) {
                    console.warn("Error loading hanzogui.config.ts (set DEBUG=hanzogui to see full stack), running hanzogui without custom config");
                    console.info("\n\n    ".concat(err.message, "\n\n"));
                }
                else {
                    if (constants_1.SHOULD_DEBUG) {
                        console.error(err);
                    }
                }
            }
            else {
                console.error("Error loading hanzogui.config.ts", err);
            }
            return {
                components: [],
                hanzoguiConfig: null,
                nameToPaths: {},
            };
        }
    }
    finally {
        unregister();
    }
}
function getOptions() {
    return __awaiter(this, arguments, void 0, function (_a) {
        var dotDir, pkgJson, err_3, _b, _c;
        var _d, _e;
        var _f;
        var _g = _a === void 0 ? {} : _a, _h = _g.root, root = _h === void 0 ? process.cwd() : _h, _j = _g.tsconfigPath, tsconfigPath = _j === void 0 ? 'tsconfig.json' : _j, hanzoguiOptions = _g.hanzoguiOptions, host = _g.host, debug = _g.debug;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    dotDir = (0, node_path_1.join)(root, '.hanzogui');
                    pkgJson = {};
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fsExtra.readJSON((0, node_path_1.join)(root, 'package.json'))];
                case 2:
                    pkgJson = _k.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _k.sent();
                    return [3 /*break*/, 4];
                case 4:
                    _d = {
                        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
                        root: root,
                        host: host || '127.0.0.1',
                        pkgJson: pkgJson,
                        debug: debug,
                        tsconfigPath: tsconfigPath
                    };
                    _b = [__assign({ platform: process.env.TAMAGUI_TARGET || 'web', components: ['hanzogui'] }, hanzoguiOptions)];
                    _e = {};
                    if (!((_f = hanzoguiOptions === null || hanzoguiOptions === void 0 ? void 0 : hanzoguiOptions.config) !== null && _f !== void 0)) return [3 /*break*/, 5];
                    _c = _f;
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, getDefaultHanzoguiConfigPath(root, hanzoguiOptions === null || hanzoguiOptions === void 0 ? void 0 : hanzoguiOptions.config)];
                case 6:
                    _c = (_k.sent());
                    _k.label = 7;
                case 7: return [2 /*return*/, (_d.hanzoguiOptions = __assign.apply(void 0, _b.concat([(_e.config = _c, _e)])),
                        _d.paths = {
                            root: root,
                            dotDir: dotDir,
                            conf: (0, node_path_1.join)(dotDir, 'hanzogui.config.json'),
                            types: (0, node_path_1.join)(dotDir, 'types.json'),
                        },
                        _d)];
            }
        });
    });
}
function resolveWebOrNativeSpecificEntry(entry) {
    var workspaceRoot = (0, node_path_1.resolve)();
    var resolved = require.resolve(entry, { paths: [workspaceRoot] });
    var ext = (0, node_path_1.extname)(resolved);
    var fileName = (0, node_path_1.basename)(resolved).replace(ext, '');
    var specificExt = process.env.TAMAGUI_TARGET === 'web' ? 'web' : 'native';
    var specificFile = (0, node_path_1.join)((0, node_path_1.dirname)(resolved), fileName + '.' + specificExt + ext);
    if (fsExtra.existsSync(specificFile)) {
        return specificFile;
    }
    return entry;
}
var defaultPaths = ['hanzogui.config.ts', (0, node_path_1.join)('src', 'hanzogui.config.ts')];
var hasWarnedOnce = false;
function getDefaultHanzoguiConfigPath(root, configPath) {
    return __awaiter(this, void 0, void 0, function () {
        var searchPaths, _i, searchPaths_1, path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    searchPaths = __spreadArray([], new Set(__spreadArray([configPath], defaultPaths, true).filter(Boolean).map(function (p) { return (0, node_path_1.join)(root, p); })), true);
                    _i = 0, searchPaths_1 = searchPaths;
                    _a.label = 1;
                case 1:
                    if (!(_i < searchPaths_1.length)) return [3 /*break*/, 4];
                    path = searchPaths_1[_i];
                    return [4 /*yield*/, fsExtra.pathExists(path)];
                case 2:
                    if (_a.sent()) {
                        return [2 /*return*/, path];
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!hasWarnedOnce) {
                        hasWarnedOnce = true;
                        console.warn("Warning: couldn't find hanzogui.config.ts in the following paths given configuration \"".concat(configPath, "\":\n    ").concat(searchPaths.join("\n  "), "\n  "));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function esbuildWatchFiles(entry, onChanged) {
    return __awaiter(this, void 0, void 0, function () {
        var hasRunOnce, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hasRunOnce = false;
                    return [4 /*yield*/, esbuild_1.default.context({
                            bundle: true,
                            entryPoints: [entry],
                            resolveExtensions: ['.ts', '.tsx', '.js', '.mjs'],
                            logLevel: 'silent',
                            write: false,
                            alias: {
                                '@react-native/normalize-color': '@hanzogui/proxy-worm',
                                'react-native-web': '@hanzogui/react-native-web-lite',
                                'react-native': '@hanzogui/proxy-worm',
                            },
                            plugins: [
                                // to log what its watching:
                                // {
                                //   name: 'test',
                                //   setup({ onResolve }) {
                                //     onResolve({ filter: /.*/ }, (args) => {
                                //       console.log('wtf', args.path)
                                //     })
                                //   },
                                // },
                                {
                                    name: "on-rebuild",
                                    setup: function (_a) {
                                        var onEnd = _a.onEnd, onResolve = _a.onResolve;
                                        // external node modules
                                        var filter = /^[^./]|^\.[^./]|^\.\.[^/]/; // Must not start with "/" or "./" or "../"
                                        onResolve({ filter: filter }, function (args) { return ({ path: args.path, external: true }); });
                                        onEnd(function () {
                                            if (!hasRunOnce) {
                                                hasRunOnce = true;
                                            }
                                            else {
                                                onChanged();
                                            }
                                        });
                                    },
                                },
                            ],
                        })
                        // just returns after dispose is called i think
                    ];
                case 1:
                    context = _a.sent();
                    // just returns after dispose is called i think
                    void context.watch();
                    return [2 /*return*/, function () {
                            context.dispose();
                        }];
            }
        });
    });
}
