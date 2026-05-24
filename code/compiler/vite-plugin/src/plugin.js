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
import * as Static from '@hanzogui/static-worker';
import { getPragmaOptions } from '@hanzogui/static-worker';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizePath } from 'vite';
import { loadHanzoguiBuildConfig, getLoadPromise, getHanzoguiOptions, ensureFullConfigLoaded, } from './loadHanzogui';
var resolve = function (name) { return fileURLToPath(import.meta.resolve(name)); };
var CACHE_KEY = '__hanzogui_vite_cache__';
var CACHE_SIZE_KEY = '__hanzogui_vite_cache_size__';
var PENDING_KEY = '__hanzogui_vite_pending__';
function getSharedCache() {
    if (!globalThis[CACHE_KEY]) {
        ;
        globalThis[CACHE_KEY] = {};
    }
    return globalThis[CACHE_KEY];
}
function getSharedCacheSize() {
    return globalThis[CACHE_SIZE_KEY] || 0;
}
function setSharedCacheSize(size) {
    ;
    globalThis[CACHE_SIZE_KEY] = size;
}
function clearSharedCache() {
    ;
    globalThis[CACHE_KEY] = {};
    globalThis[CACHE_SIZE_KEY] = 0;
}
// pending extractions map - dedupes concurrent requests for same file
function getPendingExtractions() {
    if (!globalThis[PENDING_KEY]) {
        ;
        globalThis[PENDING_KEY] = new Map();
    }
    return globalThis[PENDING_KEY];
}
/**
 * returns vite-compatible aliases for hanzogui
 * use this when you need control over alias ordering in your config
 */
export function hanzoguiAliases(options) {
    if (options === void 0) { options = {}; }
    var aliases = [];
    if (options.svg) {
        aliases.push({
            find: 'react-native-svg',
            replacement: resolve('@hanzogui/react-native-svg'),
        });
    }
    if (options.rnwLite) {
        // entry point for main import (may be without-animated variant)
        var rnwl = resolve(options.rnwLite === 'without-animated'
            ? '@hanzogui/react-native-web-lite/without-animated'
            : '@hanzogui/react-native-web-lite');
        // base package path for subpath imports (package directory, not entry file)
        var rnwlBase = path.dirname(resolve('@hanzogui/react-native-web-lite/package.json'));
        aliases.push({
            // map deep RNW paths like dist/exports/StyleSheet/preprocess to rnw-lite's flat structure
            // extracts the final path segment (e.g. "preprocess" or "createReactDOMStyle")
            find: /^react-native(?:-web)?\/dist\/(?:exports|modules)\/.*\/([^/]+)$/,
            replacement: "".concat(rnwlBase, "/dist/esm/$1.mjs"),
        }, {
            find: /^react-native$/,
            replacement: rnwl,
        }, {
            find: /^react-native\/(Libraries\/Utilities\/codegenNativeComponent|Libraries\/Utilities\/codegenNativeCommand)$/,
            replacement: "".concat(rnwlBase, "/$1"),
        }, {
            find: 'react-native/package.json',
            replacement: resolve('@hanzogui/react-native-web-lite/package.json'),
        }, {
            find: /^react-native-web$/,
            replacement: rnwl,
        });
    }
    return aliases;
}
export function hanzoguiPlugin(_a) {
    var _this = this;
    if (_a === void 0) { _a = {}; }
    var disableResolveConfig = _a.disableResolveConfig, hanzoguiOptionsIn = __rest(_a, ["disableResolveConfig"]);
    // extraction ON by default, set disableExtraction: true to opt out
    var shouldExtract = !hanzoguiOptionsIn.disableExtraction;
    var watcher;
    // TODO temporary fix
    var enableNativeEnv = !!globalThis.__vxrnEnableNativeEnv;
    var extensions = [
        ".web.mjs",
        ".web.js",
        ".web.jsx",
        ".web.ts",
        ".web.tsx",
        '.mjs',
        '.js',
        '.mts',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
    ];
    // start loading immediately but don't block
    loadHanzoguiBuildConfig(hanzoguiOptionsIn);
    // helper to await load when needed
    var ensureLoaded = function () { return __awaiter(_this, void 0, void 0, function () {
        var promise, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promise = getLoadPromise();
                    if (!promise) return [3 /*break*/, 2];
                    return [4 /*yield*/, promise];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    options = getHanzoguiOptions();
                    // update shouldExtract from loaded config (hanzogui.build.ts)
                    if (options) {
                        shouldExtract = !options.disableExtraction;
                    }
                    return [2 /*return*/, options];
            }
        });
    }); };
    // extract plugin state
    var getHash = function (input) { return createHash('sha1').update(input).digest('base64'); };
    // use shared cache across environments
    var memoryCache = getSharedCache();
    var cssMap = new Map();
    var config;
    var server;
    var virtualExt = ".hanzogui.css";
    var getAbsoluteVirtualFileId = function (filePath) {
        if (filePath.startsWith(config.root)) {
            return filePath;
        }
        return normalizePath(path.join(config.root, filePath));
    };
    function isNotClient(environment) {
        return (environment === null || environment === void 0 ? void 0 : environment.name) && environment.name !== 'client';
    }
    function isNative(environment) {
        return ((environment === null || environment === void 0 ? void 0 : environment.name) && (environment.name === 'ios' || environment.name === 'android'));
    }
    function invalidateModule(absoluteId) {
        if (!server)
            return;
        var moduleGraph = server.moduleGraph;
        var modules = moduleGraph.getModulesByFile(absoluteId);
        if (modules) {
            for (var _i = 0, modules_1 = modules; _i < modules_1.length; _i++) {
                var module_1 = modules_1[_i];
                moduleGraph.invalidateModule(module_1);
                module_1.lastHMRTimestamp = module_1.lastInvalidationTimestamp || Date.now();
            }
        }
    }
    var basePlugin = {
        name: 'hanzogui',
        enforce: 'pre',
        configureServer: function (_server) {
            server = _server;
        },
        buildEnd: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (watcher === null || watcher === void 0 ? void 0 : watcher.then(function (res) {
                                res === null || res === void 0 ? void 0 : res.dispose();
                            }))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        config: function (_, env) {
            return __awaiter(this, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ensureLoaded()];
                        case 1:
                            options = _a.sent();
                            if (!options) {
                                throw new Error("No hanzogui options loaded");
                            }
                            // start watching config if enabled
                            if (!options.disableWatchHanzoguiConfig) {
                                watcher = Static.watchHanzoguiConfig(__assign({ components: ['hanzogui'], config: './src/hanzogui.config.ts' }, options)).catch(function (err) {
                                    console.error(" [Hanzogui] Error watching config: ".concat(err));
                                });
                            }
                            return [2 /*return*/, {
                                    envPrefix: ['TAMAGUI_'],
                                    environments: {
                                        client: {
                                            define: {
                                                'process.env.TAMAGUI_IS_CLIENT': JSON.stringify(true),
                                                'process.env.TAMAGUI_ENVIRONMENT': '"client"',
                                            },
                                        },
                                    },
                                    define: __assign({ 
                                        // reanimated support
                                        _frameTimestamp: undefined, _WORKLET: false, __DEV__: "".concat(env.mode === 'development'), 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || env.mode), 'process.env.ENABLE_RSC': JSON.stringify(process.env.ENABLE_RSC || ''), 'process.env.ENABLE_STEPS': JSON.stringify(process.env.ENABLE_STEPS || ''), 'process.env.IS_STATIC': JSON.stringify(false) }, (env.mode === 'production' && {
                                        'process.env.TAMAGUI_OPTIMIZE_THEMES': JSON.stringify(true),
                                    })),
                                    resolve: disableResolveConfig || enableNativeEnv
                                        ? {}
                                        : {
                                            extensions: extensions,
                                            alias: __assign({}, (options.platform !== 'native' && __assign({ 'react-native/Libraries/Renderer/shims/ReactFabric': resolve('@hanzogui/proxy-worm'), 'react-native/Libraries/Utilities/codegenNativeComponent': resolve('@hanzogui/proxy-worm'), 'react-native-svg': resolve('@hanzogui/react-native-svg') }, (!(options === null || options === void 0 ? void 0 : options.useReactNativeWebLite) && {
                                                'react-native': resolve('react-native-web'),
                                            })))),
                                        },
                                }];
                    }
                });
            });
        },
    };
    var rnwLitePlugin = {
        name: 'hanzogui-rnw-lite',
        config: function () {
            if (enableNativeEnv) {
                return {};
            }
            var options = getHanzoguiOptions();
            if (!(options === null || options === void 0 ? void 0 : options.useReactNativeWebLite)) {
                return {};
            }
            return {
                resolve: {
                    alias: hanzoguiAliases({ rnwLite: options.useReactNativeWebLite }),
                },
                optimizeDeps: {
                    // upstream react-native-web must not be pre-bundled when aliased to lite
                    exclude: ['react-native-web'],
                },
            };
        },
    };
    // extract plugin for optimize mode
    // always included, but checks shouldExtract dynamically after config loads
    var extractPlugin = {
        name: 'hanzogui-extract',
        enforce: 'pre',
        config: function (userConf) {
            return __awaiter(this, void 0, void 0, function () {
                var options;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, ensureLoaded()];
                        case 1:
                            options = _b.sent();
                            userConf.optimizeDeps || (userConf.optimizeDeps = {});
                            (_a = userConf.optimizeDeps).include || (_a.include = []);
                            // inline-style-prefixer is CJS with __esModule and breaks without pre-bundling
                            // (ReferenceError: exports is not defined). always include it.
                            userConf.optimizeDeps.include.push('inline-style-prefixer');
                            if (!shouldExtract)
                                return [2 /*return*/];
                            userConf.optimizeDeps.include.push('@hanzogui/core/inject-styles');
                            return [2 /*return*/];
                    }
                });
            });
        },
        configResolved: function (resolvedConfig) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    config = resolvedConfig;
                    return [2 /*return*/];
                });
            });
        },
        resolveId: function (source) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, validId, query, absoluteId;
                return __generator(this, function (_b) {
                    if (!shouldExtract)
                        return [2 /*return*/];
                    if (isNative(this.environment)) {
                        return [2 /*return*/];
                    }
                    if (isNotClient(this.environment)) {
                        return [2 /*return*/];
                    }
                    _a = source.split('?'), validId = _a[0], query = _a[1];
                    if (!validId.endsWith(virtualExt)) {
                        return [2 /*return*/];
                    }
                    absoluteId = source.startsWith(config.root)
                        ? source
                        : getAbsoluteVirtualFileId(validId);
                    if (cssMap.has(absoluteId)) {
                        return [2 /*return*/, absoluteId + (query ? "?".concat(query) : '')];
                    }
                    return [2 /*return*/];
                });
            });
        },
        load: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var options, validId;
                return __generator(this, function (_a) {
                    if (!shouldExtract)
                        return [2 /*return*/];
                    options = getHanzoguiOptions();
                    if (options === null || options === void 0 ? void 0 : options.disable) {
                        return [2 /*return*/];
                    }
                    if (isNative(this.environment)) {
                        return [2 /*return*/];
                    }
                    if (isNotClient(this.environment)) {
                        return [2 /*return*/];
                    }
                    validId = id.split('?')[0];
                    return [2 /*return*/, cssMap.get(validId)];
                });
            });
        },
        transform: {
            order: 'pre',
            handler: function (code, id) {
                return __awaiter(this, void 0, void 0, function () {
                    var options, validId, _a, shouldDisable, shouldPrintDebug, isSSR, cacheKey, pending, formatResult, cached, pendingExtraction, result, extractionPromise, result;
                    var _this = this;
                    var _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, ensureLoaded()
                                // ensure full config (heavy bundling) is loaded before extraction
                            ];
                            case 1:
                                options = _f.sent();
                                // ensure full config (heavy bundling) is loaded before extraction
                                return [4 /*yield*/, ensureFullConfigLoaded()
                                    // fully disabled = no extraction AND no debug attrs
                                ];
                            case 2:
                                // ensure full config (heavy bundling) is loaded before extraction
                                _f.sent();
                                // fully disabled = no extraction AND no debug attrs
                                if (options === null || options === void 0 ? void 0 : options.disable) {
                                    return [2 /*return*/];
                                }
                                if (isNative(this.environment)) {
                                    return [2 /*return*/];
                                }
                                validId = id.split('?')[0];
                                if (!validId.endsWith('.tsx')) {
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, getPragmaOptions({
                                        source: code,
                                        path: validId,
                                    })];
                            case 3:
                                _a = _f.sent(), shouldDisable = _a.shouldDisable, shouldPrintDebug = _a.shouldPrintDebug;
                                if (shouldPrintDebug) {
                                    console.trace("Current file: ".concat(id, " in environment: ").concat((_b = this.environment) === null || _b === void 0 ? void 0 : _b.name, ", shouldDisable: ").concat(shouldDisable));
                                    console.info("\n\nOriginal source:\n".concat(code, "\n\n"));
                                }
                                if (shouldDisable) {
                                    return [2 /*return*/];
                                }
                                isSSR = isNotClient(this.environment);
                                cacheKey = getHash("".concat(code).concat(id));
                                pending = getPendingExtractions();
                                formatResult = function (entry) {
                                    var finalCode = !isSSR && entry.cssImport ? "".concat(entry.js, "\n").concat(entry.cssImport) : entry.js;
                                    return { code: finalCode, map: entry.map };
                                };
                                cached = memoryCache[cacheKey];
                                if (cached) {
                                    if (process.env.DEBUG_TAMAGUI_CACHE) {
                                        console.info("[hanzogui-cache] HIT ".concat(((_c = this.environment) === null || _c === void 0 ? void 0 : _c.name) || 'unknown', " ").concat(id.split('/').pop(), " key=").concat(cacheKey.slice(0, 8)));
                                    }
                                    return [2 /*return*/, formatResult(cached)];
                                }
                                pendingExtraction = pending.get(cacheKey);
                                if (!pendingExtraction) return [3 /*break*/, 5];
                                if (process.env.DEBUG_TAMAGUI_CACHE) {
                                    console.info("[hanzogui-cache] WAIT ".concat(((_d = this.environment) === null || _d === void 0 ? void 0 : _d.name) || 'unknown', " ").concat(id.split('/').pop(), " key=").concat(cacheKey.slice(0, 8)));
                                }
                                return [4 /*yield*/, pendingExtraction];
                            case 4:
                                result = _f.sent();
                                if (result) {
                                    return [2 /*return*/, formatResult(result)];
                                }
                                return [2 /*return*/];
                            case 5:
                                if (process.env.DEBUG_TAMAGUI_CACHE) {
                                    console.info("[hanzogui-cache] EXTRACT ".concat(((_e = this.environment) === null || _e === void 0 ? void 0 : _e.name) || 'unknown', " ").concat(id.split('/').pop(), " key=").concat(cacheKey.slice(0, 8)));
                                }
                                extractionPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                                    var extracted, err_1, rootRelativeId, absoluteId, cssImport, jsCode, cacheEntry, newSize;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4 /*yield*/, Static.extractToClassNames({
                                                        source: code,
                                                        sourcePath: validId,
                                                        options: options,
                                                        shouldPrintDebug: shouldPrintDebug,
                                                    })];
                                            case 1:
                                                extracted = _a.sent();
                                                return [3 /*break*/, 3];
                                            case 2:
                                                err_1 = _a.sent();
                                                if (process.env.DEBUG_TAMAGUI_CACHE) {
                                                    console.info("[hanzogui-cache] ERROR extracting ".concat(id.split('/').pop(), ":"), err_1);
                                                }
                                                console.error(err_1 instanceof Error ? err_1.message : String(err_1));
                                                return [2 /*return*/, null];
                                            case 3:
                                                if (!extracted) {
                                                    if (process.env.DEBUG_TAMAGUI_CACHE) {
                                                        console.info("[hanzogui-cache] no extraction result for ".concat(id.split('/').pop()));
                                                    }
                                                    return [2 /*return*/, null];
                                                }
                                                rootRelativeId = "".concat(validId).concat(virtualExt);
                                                absoluteId = getAbsoluteVirtualFileId(rootRelativeId);
                                                cssImport = null;
                                                // store CSS and prepare import (but don't include in cached JS)
                                                if (extracted.styles) {
                                                    this.addWatchFile(rootRelativeId);
                                                    if (server && cssMap.has(absoluteId)) {
                                                        invalidateModule(rootRelativeId);
                                                    }
                                                    cssImport = "import \"".concat(rootRelativeId, "\";");
                                                    cssMap.set(absoluteId, extracted.styles);
                                                }
                                                jsCode = extracted.js.toString();
                                                cacheEntry = {
                                                    js: jsCode,
                                                    map: extracted.map,
                                                    cssImport: cssImport,
                                                };
                                                newSize = getSharedCacheSize() + jsCode.length;
                                                if (newSize > 67108864) {
                                                    clearSharedCache();
                                                }
                                                else {
                                                    setSharedCacheSize(newSize);
                                                }
                                                memoryCache[cacheKey] = cacheEntry;
                                                if (process.env.DEBUG_TAMAGUI_CACHE) {
                                                    console.info("[hanzogui-cache] WRITE key=".concat(cacheKey.slice(0, 8), " cacheSize=").concat(Object.keys(memoryCache).length));
                                                }
                                                return [2 /*return*/, cacheEntry];
                                        }
                                    });
                                }); })();
                                // store pending promise for deduplication
                                pending.set(cacheKey, extractionPromise);
                                _f.label = 6;
                            case 6:
                                _f.trys.push([6, , 8, 9]);
                                return [4 /*yield*/, extractionPromise];
                            case 7:
                                result = _f.sent();
                                if (result) {
                                    return [2 /*return*/, formatResult(result)];
                                }
                                return [2 /*return*/];
                            case 8:
                                // clean up pending map
                                pending.delete(cacheKey);
                                return [7 /*endfinally*/];
                            case 9: return [2 /*return*/];
                        }
                    });
                });
            },
        },
    };
    return [basePlugin, rnwLitePlugin, extractPlugin];
}
