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
exports.regenerateConfig = regenerateConfig;
exports.regenerateConfigSync = regenerateConfigSync;
exports.generateHanzoguiThemes = generateHanzoguiThemes;
var node_path_1 = require("node:path");
var generate_themes_1 = require("@hanzogui/generate-themes");
var FS = require("fs-extra");
var requireHanzoguiCore_1 = require("../helpers/requireHanzoguiCore");
var bundleConfig_1 = require("./bundleConfig");
var hanzoguiDir = (0, node_path_1.join)(process.cwd(), '.hanzogui');
var confFile = (0, node_path_1.join)(hanzoguiDir, 'hanzogui.config.json');
/**
 * Sort of a super-set of bundleConfig(), this code needs some refactoring ideally
 */
function regenerateConfig(hanzoguiOptions_1, configIn_1) {
    return __awaiter(this, arguments, void 0, function (hanzoguiOptions, configIn, rebuild) {
        var config, _a, out, err_1;
        var _b;
        if (rebuild === void 0) { rebuild = false; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    if (!(configIn !== null && configIn !== void 0)) return [3 /*break*/, 1];
                    _a = configIn;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, bundleConfig_1.getBundledConfig)(hanzoguiOptions, rebuild)];
                case 2:
                    _a = (_c.sent());
                    _c.label = 3;
                case 3:
                    config = _a;
                    if (!config)
                        return [2 /*return*/];
                    out = transformConfig(config, hanzoguiOptions.platform || 'web');
                    return [4 /*yield*/, FS.ensureDir((0, node_path_1.dirname)(confFile))];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, FS.writeJSON(confFile, out, {
                            spaces: 2,
                        })];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _c.sent();
                    if (((_b = process.env.DEBUG) === null || _b === void 0 ? void 0 : _b.includes('hanzogui')) || process.env.IS_TAMAGUI_DEV) {
                        console.warn('regenerateConfig error', err_1);
                    }
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function regenerateConfigSync(_hanzoguiOptions, config) {
    var _a;
    try {
        FS.ensureDirSync((0, node_path_1.dirname)(confFile));
        FS.writeJSONSync(confFile, transformConfig(config, _hanzoguiOptions.platform || 'web'), {
            spaces: 2,
        });
    }
    catch (err) {
        if (((_a = process.env.DEBUG) === null || _a === void 0 ? void 0 : _a.includes('hanzogui')) || process.env.IS_TAMAGUI_DEV) {
            console.warn('regenerateConfig error', err);
        }
        // ignore for now
    }
}
function generateHanzoguiThemes(hanzoguiOptions_1) {
    return __awaiter(this, arguments, void 0, function (hanzoguiOptions, force) {
        var _a, input, output, inPath, outPath, generatedOutput, hasChanged, _b;
        var _this = this;
        if (force === void 0) { force = false; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!hanzoguiOptions.themeBuilder) {
                        return [2 /*return*/];
                    }
                    _a = hanzoguiOptions.themeBuilder, input = _a.input, output = _a.output;
                    inPath = resolveRelativePath(input);
                    outPath = resolveRelativePath(output);
                    return [4 /*yield*/, (0, generate_themes_1.generateThemes)(inPath)
                        // because this runs in parallel (its cheap) lets avoid logging a bunch, so check to see if changed:
                    ];
                case 1:
                    generatedOutput = _c.sent();
                    _b = force;
                    if (_b) return [3 /*break*/, 3];
                    return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                            var next, current, err_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        if (!generatedOutput)
                                            return [2 /*return*/, false];
                                        next = generatedOutput.generated;
                                        return [4 /*yield*/, FS.readFile(outPath, 'utf-8')];
                                    case 1:
                                        current = _a.sent();
                                        return [2 /*return*/, next !== current];
                                    case 2:
                                        err_2 = _a.sent();
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/, true];
                                }
                            });
                        }); })()];
                case 2:
                    _b = (_c.sent());
                    _c.label = 3;
                case 3:
                    hasChanged = _b;
                    if (!hasChanged) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, generate_themes_1.writeGeneratedThemes)(hanzoguiDir, outPath, generatedOutput)];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5: return [2 /*return*/, hasChanged];
            }
        });
    });
}
var resolveRelativePath = function (inputPath) {
    return inputPath.startsWith('.') ? (0, node_path_1.join)(process.cwd(), inputPath) : require.resolve(inputPath);
};
function cloneDeepSafe(x, excludeKeys) {
    if (excludeKeys === void 0) { excludeKeys = {}; }
    if (!x)
        return x;
    if (Array.isArray(x))
        return x.map(function (_) { return cloneDeepSafe(_); });
    if (typeof x === 'function')
        return "Function";
    if (typeof x !== 'object')
        return x;
    if ('$$typeof' in x)
        return 'Component';
    return Object.fromEntries(Object.entries(x).flatMap(function (_a) {
        var k = _a[0], v = _a[1];
        return (excludeKeys[k] ? [] : [[k, cloneDeepSafe(v)]]);
    }));
}
function transformConfig(config, platform) {
    if (!config) {
        return null;
    }
    var getVariableValue = (0, requireHanzoguiCore_1.requireHanzoguiCore)(platform).getVariableValue;
    // ensure we don't mangle anything in the original
    var next = cloneDeepSafe(config, {
        validStyles: true,
    });
    var components = next.components, nameToPaths = next.nameToPaths, hanzoguiConfig = next.hanzoguiConfig;
    var themes = hanzoguiConfig.themes, tokens = hanzoguiConfig.tokens;
    // reduce down to usable, smaller json
    // slim themes, add name
    for (var key in themes) {
        var theme = themes[key];
        // @ts-ignore
        theme.id = key;
        for (var tkey in theme) {
            theme[tkey] = getVariableValue(theme[tkey]);
        }
    }
    // flatten variables
    for (var key in tokens) {
        var token = __assign({}, tokens[key]);
        for (var tkey in token) {
            token[tkey] = getVariableValue(token[tkey]);
        }
    }
    // remove bulky stuff in components
    for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
        var component = components_1[_i];
        for (var _1 in component.nameToInfo) {
            // avoid mutating
            var compDefinition = __assign({}, component.nameToInfo[_1]);
            component.nameToInfo[_1] = compDefinition;
            var _a = compDefinition.staticConfig, parentStaticConfig = _a.parentStaticConfig, rest = __rest(_a, ["parentStaticConfig"]);
            compDefinition.staticConfig = rest;
        }
    }
    // set to array
    next.nameToPaths = {};
    for (var key in nameToPaths) {
        next.nameToPaths[key] = __spreadArray([], nameToPaths[key], true);
    }
    // remove stuff we dont need to send
    var _b = next.hanzoguiConfig, fontsParsed = _b.fontsParsed, getCSS = _b.getCSS, tokensParsed = _b.tokensParsed, themeConfig = _b.themeConfig, _shorthands = _b.shorthands, userShorthands = _b.userShorthands, cleanedConfig = __rest(_b, ["fontsParsed", "getCSS", "tokensParsed", "themeConfig", "shorthands", "userShorthands"]);
    return {
        components: components,
        nameToPaths: nameToPaths,
        hanzoguiConfig: __assign(__assign({}, cleanedConfig), { 
            // Output userShorthands as shorthands (excludes built-ins)
            shorthands: userShorthands }),
    };
}
