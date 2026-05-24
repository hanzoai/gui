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
exports.esbuildIgnoreFilesRegex = exports.esbuildLoaderConfig = void 0;
exports.esbundleHanzoguiConfig = esbundleHanzoguiConfig;
var node_fs_1 = require("node:fs");
var esbuild_1 = require("esbuild");
var FS = require("fs-extra");
var detectModuleFormat_1 = require("./detectModuleFormat");
var esbuildAliasPlugin_1 = require("./esbuildAliasPlugin");
var hasTopLevelAwait_1 = require("./hasTopLevelAwait");
var loadHanzogui_1 = require("./loadHanzogui");
var esbuildTsconfigPaths_1 = require("./esbuildTsconfigPaths");
exports.esbuildLoaderConfig = {
    '.js': 'jsx',
    '.png': 'dataurl',
    '.jpg': 'dataurl',
    '.jpeg': 'dataurl',
    '.svg': 'dataurl',
    '.gif': 'dataurl',
    '.webp': 'dataurl',
    '.woff2': 'dataurl',
    '.woff': 'dataurl',
    '.eot': 'dataurl',
    '.otf': 'dataurl',
    '.ttf': 'dataurl',
    '.mp4': 'file',
    '.mpeg4': 'file',
    '.mov': 'file',
    '.avif': 'file',
    '.wmv': 'file',
    '.webm': 'file',
    '.wav': 'file',
    '.aac': 'file',
    '.ogg': 'file',
    '.flac': 'file',
    '.node': 'empty',
};
var dataExtensions = Object.keys(exports.esbuildLoaderConfig)
    .filter(function (k) { return exports.esbuildLoaderConfig[k] === 'file' || exports.esbuildLoaderConfig[k] === 'dataurl'; })
    .map(function (k) { return k.slice(1); });
exports.esbuildIgnoreFilesRegex = new RegExp(".(".concat(dataExtensions.join('|'), ")$"), 'i');
function getESBuildConfig(_a, platform, aliases) {
    var _b;
    var entryPoints = _a.entryPoints, resolvePlatformSpecificEntries = _a.resolvePlatformSpecificEntries, options = __rest(_a, ["entryPoints", "resolvePlatformSpecificEntries"]);
    if ((_b = process.env.DEBUG) === null || _b === void 0 ? void 0 : _b.startsWith('hanzogui')) {
        console.info("Building", entryPoints);
    }
    var resolvedEntryPoints = !resolvePlatformSpecificEntries
        ? entryPoints
        : entryPoints.map(loadHanzogui_1.resolveWebOrNativeSpecificEntry);
    // detect format from entry points if not explicitly provided by caller
    var detectedFormat = options.format || detectEntryFormat(resolvedEntryPoints[0]);
    var res = __assign(__assign(__assign({ bundle: true, entryPoints: resolvedEntryPoints, format: detectedFormat }, (detectedFormat === 'esm'
        ? {
            mainFields: ['module', 'main'],
            banner: {
                js: 'import { createRequire as __cr } from "module"; const require = __cr(import.meta.url);',
            },
        }
        : {})), { target: 'node24', jsx: 'transform', jsxFactory: 'react', allowOverwrite: true, keepNames: true, resolveExtensions: __spreadArray(__spreadArray([], (process.env.TAMAGUI_TARGET === 'web'
            ? ['.web.tsx', '.web.ts', '.web.jsx', '.web.js']
            : ['.native.tsx', '.native.ts', '.native.jsx', '.native.js']), true), [
            '.tsx',
            '.ts',
            '.jsx',
            '.js',
        ], false), platform: 'node', tsconfigRaw: {
            compilerOptions: {
                jsx: 'react-jsx',
            },
        }, loader: exports.esbuildLoaderConfig, logLevel: 'warning', plugins: [
            (0, esbuildTsconfigPaths_1.TsconfigPathsPlugin)(),
            // handle ESM-only features that can't be used with CJS output
            {
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
                                // Keep this as an ESM-shaped stub so esbuild doesn't inline a
                                // top-level `module.exports = {}` into the parent bundle.
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
            },
            {
                name: 'external',
                setup: function (build) {
                    var proxyWormPath = require.resolve('@hanzogui/proxy-worm');
                    // only externalize @hanzogui/core and @hanzogui/web - these are provided at runtime
                    // other @hanzogui/* packages (like @hanzogui/config/v3) must be bundled in to avoid
                    // ESM race conditions when multiple threads require() them concurrently
                    build.onResolve({ filter: /^@hanzogui\/(core|web)$/ }, function (args) {
                        if (args.kind === 'entry-point') {
                            return null;
                        }
                        return {
                            path: platform === 'native' ? '@hanzogui/core/native' : args.path,
                            external: true,
                        };
                    });
                    build.onResolve({ filter: /react-native\/package.json$/ }, function () {
                        return {
                            path: 'react-native/package.json',
                            external: true,
                        };
                    });
                    build.onResolve({ filter: /^(react-native|react-native\/.*)$/ }, function () {
                        return {
                            path: '@hanzogui/react-native-web-lite',
                            external: true,
                        };
                    });
                    build.onResolve({ filter: /^react-native-reanimated(?:\/.*)?$/ }, function () {
                        return {
                            path: proxyWormPath,
                        };
                    });
                    build.onResolve({ filter: /^react-native-worklets(?:\/.*)?$/ }, function () {
                        return {
                            path: proxyWormPath,
                        };
                    });
                    // externalize animation libraries - not needed for static extraction
                    build.onResolve({ filter: /^(framer-motion|motion)/ }, function (args) {
                        return {
                            path: args.path,
                            external: true,
                        };
                    });
                },
            },
            (0, esbuildAliasPlugin_1.esbuildAliasPlugin)(__assign({}, aliases)),
        ] }), options);
    return res;
}
function detectEntryFormat(entryPoint) {
    // file path - detect from file/package.json
    if (entryPoint.startsWith('/') || entryPoint.startsWith('.')) {
        return (0, detectModuleFormat_1.detectModuleFormat)(entryPoint);
    }
    // bare module specifier - check package.json type field
    try {
        var pkgJsonPath = require.resolve(entryPoint + '/package.json');
        var pkg = JSON.parse((0, node_fs_1.readFileSync)(pkgJsonPath, 'utf-8'));
        return pkg.type === 'module' ? 'esm' : 'cjs';
    }
    catch (_a) {
        return 'cjs';
    }
}
function esbundleHanzoguiConfig(props, platform, aliases) {
    return __awaiter(this, void 0, void 0, function () {
        var config, tmpFile, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = getESBuildConfig(props, platform, aliases);
                    tmpFile = props.outfile + '.tmp.' + process.pid;
                    return [4 /*yield*/, esbuild_1.default.build(__assign(__assign({}, config), { outfile: tmpFile }))
                        // atomic rename prevents other threads from reading partial files
                    ];
                case 1:
                    result = _a.sent();
                    // atomic rename prevents other threads from reading partial files
                    return [4 /*yield*/, FS.rename(tmpFile, props.outfile)];
                case 2:
                    // atomic rename prevents other threads from reading partial files
                    _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
