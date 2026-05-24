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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNameToPaths = void 0;
exports.setRequireResult = setRequireResult;
exports.registerRequire = registerRequire;
var node_1 = require("esbuild-register/dist/node");
var bundle_1 = require("./extractor/bundle");
var requireHanzoguiCore_1 = require("./helpers/requireHanzoguiCore");
var nameToPaths = {};
var getNameToPaths = function () { return nameToPaths; };
exports.getNameToPaths = getNameToPaths;
var Module = require('node:module');
var proxyWorm = require('@hanzogui/proxy-worm');
var isRegistered = false;
var og;
var whitelisted = {
    react: true,
};
var compiled = {};
function setRequireResult(name, result) {
    compiled[name] = result;
}
function getStaticExtractionStub(path) {
    var _this = this;
    switch (path) {
        case 'expo-constants':
            return {
                __esModule: true,
                default: {
                    executionEnvironment: null,
                },
                ExecutionEnvironment: {
                    Bare: 'bare',
                    Standalone: 'standalone',
                    StoreClient: 'storeClient',
                },
            };
        case 'expo-updates':
            return {
                __esModule: true,
                default: {
                    isEnabled: false,
                    isUsingEmbeddedAssets: true,
                },
                checkForUpdateAsync: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ isAvailable: false })];
                }); }); },
                fetchUpdateAsync: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ isNew: false })];
                }); }); },
                reloadAsync: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/];
                }); }); },
            };
        default:
            return null;
    }
}
function registerRequire(platform, _a) {
    var _b = _a === void 0 ? {
        proxyWormImports: false,
    } : _a, proxyWormImports = _b.proxyWormImports;
    // already registered
    if (isRegistered) {
        return {
            hanzoguiRequire: require,
            unregister: function () { },
        };
    }
    // capture original resolve BEFORE esbuild-register patches it
    // so we can use Node's native exports resolution for @hanzogui packages
    var originalResolveFilename = Module._resolveFilename;
    var unregister = (0, node_1.register)({
        hookIgnoreNodeModules: false,
        // don't transform @hanzogui packages - they have pre-built dist files
        hookMatcher: function (filename) {
            if (filename.includes('@hanzogui') ||
                /\/hanzogui\/code\/(core|ui|packages)\//.test(filename)) {
                return false;
            }
            return true;
        },
    }).unregister;
    // esbuild-register's registerTsconfigPaths replaces Module._resolveFilename
    // but tsconfig paths resolution bypasses Node's package exports
    // we need to restore Node's native resolution for @hanzogui packages
    var tsconfigPatchedResolve = Module._resolveFilename;
    Module._resolveFilename = function (request) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // for @hanzogui packages, use Node's native resolution (respects exports)
        if (request.startsWith('@hanzogui/')) {
            return originalResolveFilename.call.apply(originalResolveFilename, __spreadArray([this, request], args, false));
        }
        // for everything else, use tsconfig-paths resolution
        return tsconfigPatchedResolve.call.apply(tsconfigPatchedResolve, __spreadArray([this, request], args, false));
    };
    if (!og) {
        og = Module.prototype.require; // capture esbuild require
    }
    isRegistered = true;
    Module.prototype.require = hanzoguiRequire;
    function hanzoguiRequire(path) {
        var _this = this;
        var staticExtractionStub = getStaticExtractionStub(path);
        if (staticExtractionStub) {
            return staticExtractionStub;
        }
        if (path === 'hanzogui' && platform === 'native') {
            return og.apply(this, ['hanzogui/native']);
        }
        if (path === '@hanzogui/core') {
            return (0, requireHanzoguiCore_1.requireHanzoguiCore)(platform, function (path) {
                return og.apply(_this, [path]);
            });
        }
        if (path in knownIgnorableModules ||
            path.startsWith('react-native-reanimated') ||
            bundle_1.esbuildIgnoreFilesRegex.test(path)) {
            return proxyWorm;
        }
        if (path in compiled) {
            return compiled[path];
        }
        if (path === 'react-native-svg') {
            return og.apply(this, ['@hanzogui/react-native-svg']);
        }
        if (path === 'react-native/package.json') {
            return og.apply(this, ['react-native-web/package.json']);
        }
        if (path === '@hanzogui/react-native-web-lite' ||
            path === 'react-native' ||
            path.startsWith('react-native/')) {
            try {
                return og.apply('react-native');
            }
            catch (_a) {
                return og.apply(this, ['@hanzogui/react-native-web-lite']);
            }
        }
        if (!whitelisted[path]) {
            if (proxyWormImports && !path.includes('.hanzogui-dynamic-eval')) {
                // allow hanzogui and its sub-packages through - they re-export components
                // with staticConfig needed for dynamic eval optimization.
                // also allow requires FROM within hanzogui packages (relative imports like ./Separator.cjs)
                var callerFile = (this === null || this === void 0 ? void 0 : this.filename) || (this === null || this === void 0 ? void 0 : this.id) || '';
                var isFromHanzoguiPkg = callerFile.includes('@hanzogui') || callerFile.includes('node_modules/hanzogui/');
                var isFromStaticLoader = !callerFile ||
                    callerFile === '.' ||
                    callerFile === '[eval]' ||
                    callerFile.endsWith('/[eval]') ||
                    callerFile.includes('/code/compiler/static/') ||
                    callerFile.includes('/.hanzogui/');
                if (path === 'hanzogui' ||
                    path.startsWith('@hanzogui/') ||
                    isFromHanzoguiPkg ||
                    isFromStaticLoader) {
                    return og.apply(this, [path]);
                }
                return proxyWorm;
            }
        }
        try {
            var out = og.apply(this, arguments);
            // only for studio disable for now
            // if (!nameToPaths[path]) {
            //   if (out && typeof out === 'object') {
            //     for (const key in out) {
            //       try {
            //         const conf = out[key]?.staticConfig as StaticConfig
            //         if (conf) {
            //           if (conf.componentName) {
            //             nameToPaths[conf.componentName] ??= new Set()
            //             const fullName = path.startsWith('.')
            //               ? join(`${this.path.replace(/dist(\/cjs)?/, 'src')}`, path)
            //               : path
            //             nameToPaths[conf.componentName].add(fullName)
            //           } else {
            //             // console.log('no name component', path)
            //           }
            //         }
            //       } catch {
            //         // ok
            //       }
            //     }
            //   }
            // }
            return out;
        }
        catch (err) {
            if (!process.env.TAMAGUI_ENABLE_WARN_DYNAMIC_LOAD &&
                path.includes('hanzogui-dynamic-eval')) {
                // ok, dynamic eval fails
                return;
            }
            if (allowedIgnores[path] || IGNORES === 'true') {
                // ignore
            }
            else if (!process.env.TAMAGUI_SHOW_FULL_BUNDLE_ERRORS && !process.env.DEBUG) {
                if (hasWarnedForModules.has(path)) {
                    // ignore
                }
                else {
                    hasWarnedForModules.add(path);
                }
            }
            else {
                /**
                 * Allow errors to happen, we're just reading config and components but sometimes external modules cause problems
                 * We can't fix every problem, so just swap them out with proxyWorm which is a sort of generic object that can be read.
                 */
                console.warn("  [hanzogui] skipped \"".concat(path, "\" (set TAMAGUI_IGNORE_BUNDLE_ERRORS=\"").concat(path, "\" to silence)"));
            }
            return proxyWorm;
        }
    }
    return {
        hanzoguiRequire: hanzoguiRequire,
        unregister: function () {
            if (hasWarnedForModules.size) {
                console.info("  [hanzogui] skipped loading ".concat(hasWarnedForModules.size, " module, see: https://hanzogui.dev/docs/intro/errors#warning-001"));
                hasWarnedForModules.clear();
            }
            unregister();
            isRegistered = false;
            Module.prototype.require = og;
        },
    };
}
var IGNORES = process.env.TAMAGUI_IGNORE_BUNDLE_ERRORS;
var extraIgnores = IGNORES === 'true' ? [] : (_a = process.env.TAMAGUI_IGNORE_BUNDLE_ERRORS) === null || _a === void 0 ? void 0 : _a.split(',');
var knownIgnorableModules = __assign({ '@gorhom/bottom-sheet': true, 'expo-modules': true, solito: true, 'expo-linear-gradient': true, '@expo/vector-icons': true, 'hanzogui/linear-gradient': true, 
    // animation libraries not needed for static extraction
    '@emotion/is-prop-valid': true, 'framer-motion': true, motion: true }, Object.fromEntries((extraIgnores === null || extraIgnores === void 0 ? void 0 : extraIgnores.map(function (k) { return [k, true]; })) || []));
var hasWarnedForModules = new Set();
var allowedIgnores = {
    'expo-constants': true,
    './ExpoHaptics': true,
    './js/MaskedView': true,
};
