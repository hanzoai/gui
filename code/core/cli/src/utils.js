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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadHanzogui = void 0;
exports.getOptions = getOptions;
exports.ensure = ensure;
exports.registerDispose = registerDispose;
exports.disposeAll = disposeAll;
var chalk_1 = require("chalk");
var fs_extra_1 = require("fs-extra");
var node_path_1 = require("node:path");
function getOptions() {
    return __awaiter(this, arguments, void 0, function (_a) {
        var dotDir, pkgJson, config, _b, filledOptions, finalOptions, loadHanzoguiBuildConfigSync;
        var _c = _a === void 0 ? {} : _a, _d = _c.root, root = _d === void 0 ? process.cwd() : _d, _e = _c.tsconfigPath, tsconfigPath = _e === void 0 ? 'tsconfig.json' : _e, hanzoguiOptions = _c.hanzoguiOptions, host = _c.host, debug = _c.debug, loadHanzoguiOptions = _c.loadHanzoguiOptions;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    dotDir = (0, node_path_1.join)(root, '.hanzogui');
                    pkgJson = {};
                    config = '';
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, getDefaultHanzoguiConfigPath()];
                case 2:
                    config = _f.sent();
                    return [4 /*yield*/, (0, fs_extra_1.readJSON)((0, node_path_1.join)(root, 'package.json'))];
                case 3:
                    pkgJson = _f.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _b = _f.sent();
                    if (loadHanzoguiOptions) {
                        console.warn(chalk_1.default.yellow("Warning: no hanzogui.config.ts found in ".concat(root, ". Commands that need a config may fail.")));
                    }
                    return [3 /*break*/, 5];
                case 5:
                    filledOptions = __assign({ platform: 'native', components: ['hanzogui'], config: config }, hanzoguiOptions);
                    finalOptions = filledOptions;
                    if (loadHanzoguiOptions) {
                        loadHanzoguiBuildConfigSync = require('@hanzogui/static/loadHanzogui').loadHanzoguiBuildConfigSync;
                        finalOptions = loadHanzoguiBuildConfigSync(filledOptions);
                    }
                    return [2 /*return*/, {
                            mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
                            root: root,
                            host: host || '127.0.0.1',
                            pkgJson: pkgJson,
                            debug: debug,
                            tsconfigPath: tsconfigPath,
                            hanzoguiOptions: finalOptions,
                            paths: {
                                root: root,
                                dotDir: dotDir,
                                conf: (0, node_path_1.join)(dotDir, 'hanzogui.config.json'),
                                types: (0, node_path_1.join)(dotDir, 'types.json'),
                            },
                        }];
            }
        });
    });
}
function ensure(condition, message) {
    if (!condition) {
        console.error(chalk_1.default.red.bold('Error:'), chalk_1.default.yellow("".concat(message)));
        process.exit(1);
    }
}
var defaultPaths = ['hanzogui.config.ts', (0, node_path_1.join)('src', 'hanzogui.config.ts')];
var cachedPath = '';
function getDefaultHanzoguiConfigPath() {
    return __awaiter(this, void 0, void 0, function () {
        var existingPaths, existing, found;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (cachedPath)
                        return [2 /*return*/, cachedPath];
                    return [4 /*yield*/, Promise.all(defaultPaths.map(function (path) { return (0, fs_extra_1.pathExists)(path); }))];
                case 1:
                    existingPaths = _a.sent();
                    existing = existingPaths.findIndex(function (x) { return !!x; });
                    found = defaultPaths[existing];
                    if (!found) {
                        throw new Error("No found hanzogui.config.ts");
                    }
                    cachedPath = found;
                    return [2 /*return*/, found];
            }
        });
    });
}
var loadHanzogui = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var loadHanzoguiStatic, loaded, _a, _b, _c;
    var _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                loadHanzoguiStatic = require('@hanzogui/static/loadHanzogui').loadHanzogui;
                _a = loadHanzoguiStatic;
                _b = [__assign({ components: ['hanzogui'] }, opts)];
                _d = {};
                if (!((_e = opts.config) !== null && _e !== void 0)) return [3 /*break*/, 1];
                _c = _e;
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, getDefaultHanzoguiConfigPath()];
            case 2:
                _c = (_f.sent());
                _f.label = 3;
            case 3: return [4 /*yield*/, _a.apply(void 0, [__assign.apply(void 0, _b.concat([(_d.config = _c, _d)]))])];
            case 4:
                loaded = _f.sent();
                return [2 /*return*/, loaded];
        }
    });
}); };
exports.loadHanzogui = loadHanzogui;
var disposers = new Set();
function registerDispose(cb) {
    disposers.add(cb);
}
function disposeAll() {
    disposers.forEach(function (cb) { return cb(); });
}
