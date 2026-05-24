"use strict";
/**
 * Worker thread implementation for Hanzogui extraction
 * Used by both piscina (async) and synckit (sync for babel)
 */
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
exports.runTask = runTask;
var createExtractor_1 = require("./extractor/createExtractor");
var extractToClassNames_1 = require("./extractor/extractToClassNames");
var extractToNative_1 = require("./extractor/extractToNative");
// Create extractors lazily to avoid loading unused ones
var webExtractor = null;
var nativeExtractor = null;
function getWebExtractor() {
    if (!webExtractor) {
        webExtractor = (0, createExtractor_1.createExtractor)({ platform: 'web' });
    }
    return webExtractor;
}
function getNativeExtractor() {
    if (!nativeExtractor) {
        nativeExtractor = (0, createExtractor_1.createExtractor)({ platform: 'native' });
    }
    return nativeExtractor;
}
// Cache config loading to avoid reloading
var configCache = new Map();
/**
 * Main worker function that handles both extraction types
 * This is called by piscina for async usage
 */
function runTask(task) {
    return __awaiter(this, void 0, void 0, function () {
        var isFullyDisabled, cacheKey, result, cacheKey, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    if (!(task.type === 'extractToClassNames')) return [3 /*break*/, 4];
                    isFullyDisabled = task.options.disableExtraction && task.options.disableDebugAttr;
                    if (!(!isFullyDisabled && !task.options['_disableLoadHanzogui'])) return [3 /*break*/, 2];
                    cacheKey = JSON.stringify({
                        config: task.options.config,
                        components: task.options.components,
                    });
                    if (!configCache.has(cacheKey)) {
                        configCache.set(cacheKey, getWebExtractor().loadHanzogui(task.options));
                    }
                    return [4 /*yield*/, configCache.get(cacheKey)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, (0, extractToClassNames_1.extractToClassNames)({
                        extractor: getWebExtractor(),
                        source: task.source,
                        sourcePath: task.sourcePath,
                        options: task.options,
                        shouldPrintDebug: task.shouldPrintDebug,
                    })];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/, { success: true, data: result }];
                case 4:
                    if (!(task.type === 'extractToNative')) return [3 /*break*/, 6];
                    cacheKey = JSON.stringify({
                        config: task.options.config,
                        components: task.options.components,
                    });
                    if (!configCache.has(cacheKey)) {
                        configCache.set(cacheKey, getNativeExtractor().loadHanzogui(task.options));
                    }
                    return [4 /*yield*/, configCache.get(cacheKey)
                        // extractToNative uses its own module-level extractor
                        // This is for babel plugin which uses visitor pattern
                    ];
                case 5:
                    _a.sent();
                    result = (0, extractToNative_1.extractToNative)(task.sourceFileName, task.sourceCode, task.options);
                    return [2 /*return*/, { success: true, data: result }];
                case 6:
                    if (task.type === 'clearCache') {
                        // Clear config caches when files change
                        configCache.clear();
                        return [2 /*return*/, { success: true, data: null }];
                    }
                    return [2 /*return*/, {
                            success: false,
                            error: "Unknown task type: ".concat(task.type),
                        }];
                case 7:
                    error_1 = _a.sent();
                    return [2 /*return*/, {
                            success: false,
                            error: error_1 instanceof Error ? error_1.message : String(error_1),
                            stack: error_1 instanceof Error ? error_1.stack : undefined,
                        }];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * For synckit compatibility - exports the runTask as default
 * Synckit will call this function synchronously using worker threads
 */
exports.default = runTask;
