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
exports.build = void 0;
exports.insertCssImport = insertCssImport;
var static_1 = require("@hanzogui/static");
var chokidar_1 = require("chokidar");
var fs_extra_1 = require("fs-extra");
var micromatch_1 = require("micromatch");
var node_path_1 = require("node:path");
var node_os_1 = require("node:os");
var node_child_process_1 = require("node:child_process");
var node_crypto_1 = require("node:crypto");
/**
 * Inserts a CSS import statement into JS code, placing it after any
 * 'use client' or 'use server' directives at the top of the file.
 */
function insertCssImport(jsContent, cssImport) {
    // Match 'use client' or 'use server' directives at the start of the file
    // Only consume one optional semicolon and one optional newline to preserve formatting
    var directiveMatch = jsContent.match(/^(['"])use (client|server)\1;?\n?/);
    if (directiveMatch) {
        // Directive found at start - insert CSS import after it
        var directive = directiveMatch[0];
        var rest = jsContent.slice(directive.length);
        return "".concat(directive).concat(cssImport, "\n").concat(rest);
    }
    return "".concat(cssImport, "\n").concat(jsContent);
}
var build = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var sourceDir, outputDir, outputAround, promises, isDryRun, loadedOptions, buildOptions, targets, webHanzoguiOptions, allFiles, watchPattern, fileToTargets, _loop_1, _i, allFiles_1, sourcePath, stats, trackedFiles, restoreDir, trackFile, recordMtime, _loop_2, _a, fileToTargets_1, _b, sourcePath, filePlatforms, totalOptimizations, command, err_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                sourceDir = (_c = options.dir) !== null && _c !== void 0 ? _c : '.';
                outputDir = options.output;
                outputAround = options.outputAround || false;
                promises = [];
                isDryRun = options.dryRun || false;
                if (isDryRun) {
                    console.info('[dry-run] no files will be written\n');
                }
                if (!outputDir) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, fs_extra_1.mkdir)(outputDir, { recursive: true })];
            case 1:
                _d.sent();
                _d.label = 2;
            case 2:
                loadedOptions = (0, static_1.loadHanzoguiBuildConfigSync)(options.hanzoguiOptions);
                // when running CLI build directly, ignore disable since user explicitly wants to build
                if (loadedOptions.disable) {
                    console.warn("[hanzogui] Note: \"disable\" option in hanzogui.build.ts is being ignored for CLI build command");
                }
                buildOptions = __assign(__assign({}, loadedOptions), { disable: false, disableExtraction: false });
                targets = options.target === 'both' || !options.target
                    ? ['web', 'native']
                    : [options.target];
                webHanzoguiOptions = __assign(__assign({}, buildOptions), { platform: 'web' });
                return [4 /*yield*/, (0, static_1.loadHanzogui)(webHanzoguiOptions)
                    // Collect all files first
                ];
            case 3:
                _d.sent();
                allFiles = [];
                watchPattern = sourceDir.match(/\.(tsx|jsx)$/)
                    ? sourceDir // Single file
                    : "".concat(sourceDir, "/**/*.{tsx,jsx}") // Directory
                ;
                return [4 /*yield*/, new Promise(function (res) {
                        var watcher = chokidar_1.default.watch(watchPattern, {
                            ignoreInitial: false,
                        });
                        watcher
                            .on('add', function (relativePath) {
                            var sourcePath = (0, node_path_1.resolve)(process.cwd(), relativePath);
                            if (options.exclude && micromatch_1.default.contains(relativePath, options.exclude)) {
                                return;
                            }
                            if (options.include && !micromatch_1.default.contains(relativePath, options.include)) {
                                return;
                            }
                            allFiles.push(sourcePath);
                        })
                            .on('ready', function () {
                            watcher.close().then(function () { return res(); });
                        });
                    })
                    // Now determine what to optimize for each file
                ];
            case 4:
                _d.sent();
                fileToTargets = new Map();
                _loop_1 = function (sourcePath) {
                    var platformMatch = sourcePath.match(/\.(web|native|ios|android)\.(tsx|jsx)$/);
                    var filePlatforms = [];
                    if (platformMatch) {
                        // Platform-specific file - only optimize for that platform
                        var platform = platformMatch[1];
                        if (platform === 'web') {
                            filePlatforms = ['web'];
                        }
                        else if (platform === 'native' || platform === 'ios' || platform === 'android') {
                            filePlatforms = ['native'];
                        }
                    }
                    else {
                        // Base file without platform extension
                        // Check if platform-specific versions exist in the collected files
                        var basePath_1 = sourcePath.replace(/\.(tsx|jsx)$/, '');
                        var hasNative_1 = allFiles.some(function (f) {
                            return f === "".concat(basePath_1, ".native.tsx") ||
                                f === "".concat(basePath_1, ".native.jsx") ||
                                f === "".concat(basePath_1, ".ios.tsx") ||
                                f === "".concat(basePath_1, ".ios.jsx") ||
                                f === "".concat(basePath_1, ".android.tsx") ||
                                f === "".concat(basePath_1, ".android.jsx");
                        });
                        var hasWeb_1 = allFiles.some(function (f) { return f === "".concat(basePath_1, ".web.tsx") || f === "".concat(basePath_1, ".web.jsx"); });
                        // Only optimize for targets that don't have platform-specific files
                        filePlatforms = targets.filter(function (target) {
                            if (target === 'native' && hasNative_1)
                                return false;
                            if (target === 'web' && hasWeb_1)
                                return false;
                            return true;
                        });
                        // Special case: if BOTH .web and .native exist, don't touch base file at all
                        if (hasWeb_1 && hasNative_1) {
                            filePlatforms = [];
                        }
                    }
                    if (filePlatforms.length > 0) {
                        fileToTargets.set(sourcePath, filePlatforms);
                    }
                };
                for (_i = 0, allFiles_1 = allFiles; _i < allFiles_1.length; _i++) {
                    sourcePath = allFiles_1[_i];
                    _loop_1(sourcePath);
                }
                stats = {
                    filesProcessed: 0,
                    optimized: 0,
                    flattened: 0,
                    styled: 0,
                    found: 0,
                };
                trackedFiles = [];
                restoreDir = options.runCommand
                    ? (0, node_path_1.join)((0, node_os_1.tmpdir)(), "hanzogui-restore-".concat(process.pid))
                    : null;
                if (!restoreDir) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, fs_extra_1.mkdir)(restoreDir, { recursive: true })];
            case 5:
                _d.sent();
                _d.label = 6;
            case 6:
                trackFile = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
                    var hash, backupPath;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!restoreDir)
                                    return [2 /*return*/];
                                hash = (0, node_crypto_1.createHash)('md5').update(filePath).digest('hex');
                                backupPath = (0, node_path_1.join)(restoreDir, hash);
                                // Use copy instead of hardlink - hardlinks share content, so modifying
                                // the original would also modify the "backup"
                                return [4 /*yield*/, (0, fs_extra_1.copyFile)(filePath, backupPath)];
                            case 1:
                                // Use copy instead of hardlink - hardlinks share content, so modifying
                                // the original would also modify the "backup"
                                _a.sent();
                                trackedFiles.push({ path: filePath, hardlinkPath: backupPath, mtimeAfterWrite: 0 });
                                return [2 /*return*/];
                        }
                    });
                }); };
                recordMtime = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
                    var tracked, fileStat;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!restoreDir)
                                    return [2 /*return*/];
                                tracked = trackedFiles.find(function (t) { return t.path === filePath; });
                                if (!tracked) return [3 /*break*/, 2];
                                return [4 /*yield*/, (0, fs_extra_1.stat)(filePath)];
                            case 1:
                                fileStat = _a.sent();
                                tracked.mtimeAfterWrite = fileStat.mtimeMs;
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); };
                _loop_2 = function (sourcePath, filePlatforms) {
                    promises.push((function () { return __awaiter(void 0, void 0, void 0, function () {
                        var originalSource, extractor, out, jsContent, relPath, cssName, outputBase, stylePath, cssImport, jsContent, code, webOutputPath, _a, _b, nativeHanzoguiOptions, nativeOut, nativeOutputPath, isPlatformSpecific, needsNativeSuffix, exists, relPath, outputRelPath, hasExtraction, wrapperMatches, _c, _d;
                        var _e, _f;
                        var _g;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0:
                                    if (options.debug) {
                                        (_g = process.env).NODE_ENV || (_g.NODE_ENV = 'development');
                                    }
                                    return [4 /*yield*/, (0, fs_extra_1.readFile)(sourcePath, 'utf-8')];
                                case 1:
                                    originalSource = _h.sent();
                                    if (isDryRun) {
                                        console.info("\n".concat(sourcePath, " [").concat(filePlatforms.join(', '), "]"));
                                    }
                                    if (!filePlatforms.includes('web')) return [3 /*break*/, 15];
                                    process.env.TAMAGUI_TARGET = 'web';
                                    extractor = (0, static_1.createExtractor)({
                                        platform: 'web',
                                    });
                                    return [4 /*yield*/, (0, static_1.extractToClassNames)({
                                            extractor: extractor,
                                            source: originalSource,
                                            sourcePath: sourcePath,
                                            options: __assign(__assign({}, buildOptions), { platform: 'web' }),
                                            shouldPrintDebug: options.debug || false,
                                        })];
                                case 2:
                                    out = _h.sent();
                                    if (!out) return [3 /*break*/, 14];
                                    stats.filesProcessed++;
                                    stats.optimized += out.stats.optimized;
                                    stats.flattened += out.stats.flattened;
                                    stats.styled += out.stats.styled;
                                    stats.found += out.stats.found;
                                    if (!isDryRun) return [3 /*break*/, 3];
                                    jsContent = typeof out.js === 'string' ? out.js : out.js.toString('utf-8');
                                    if (out.styles) {
                                        console.info("\ncss:\n".concat(out.styles));
                                    }
                                    console.info("\njs:\n".concat(jsContent));
                                    return [3 /*break*/, 13];
                                case 3:
                                    relPath = outputDir
                                        ? (0, node_path_1.relative)((0, node_path_1.resolve)(sourceDir), sourcePath)
                                        : (0, node_path_1.basename)(sourcePath);
                                    cssName = '_' + (0, node_path_1.basename)(sourcePath, (0, node_path_1.extname)(sourcePath));
                                    outputBase = outputDir
                                        ? (0, node_path_1.join)(outputDir, (0, node_path_1.dirname)(relPath))
                                        : (0, node_path_1.dirname)(sourcePath);
                                    if (!outputDir) return [3 /*break*/, 5];
                                    return [4 /*yield*/, (0, fs_extra_1.mkdir)(outputBase, { recursive: true })];
                                case 4:
                                    _h.sent();
                                    _h.label = 5;
                                case 5:
                                    stylePath = (0, node_path_1.join)(outputBase, cssName + '.css');
                                    cssImport = "import \"./".concat(cssName, ".css\"");
                                    jsContent = typeof out.js === 'string' ? out.js : out.js.toString('utf-8');
                                    code = insertCssImport(jsContent, cssImport);
                                    webOutputPath = outputDir ? (0, node_path_1.join)(outputDir, relPath) : sourcePath;
                                    if (!!outputDir) return [3 /*break*/, 7];
                                    return [4 /*yield*/, trackFile(sourcePath)];
                                case 6:
                                    _h.sent();
                                    _h.label = 7;
                                case 7: 
                                // Write web output
                                return [4 /*yield*/, (0, fs_extra_1.writeFile)(webOutputPath, code, 'utf-8')];
                                case 8:
                                    // Write web output
                                    _h.sent();
                                    if (!!outputDir) return [3 /*break*/, 10];
                                    return [4 /*yield*/, recordMtime(sourcePath)];
                                case 9:
                                    _h.sent();
                                    _h.label = 10;
                                case 10: 
                                // CSS file is new, track for cleanup (skip if using output dir)
                                return [4 /*yield*/, (0, fs_extra_1.writeFile)(stylePath, out.styles, 'utf-8')];
                                case 11:
                                    // CSS file is new, track for cleanup (skip if using output dir)
                                    _h.sent();
                                    if (!!outputDir) return [3 /*break*/, 13];
                                    // Note: CSS files are new (generated), we'll delete them on restore
                                    _b = (_a = trackedFiles).push;
                                    _e = {
                                        path: stylePath,
                                        hardlinkPath: ''
                                    };
                                    return [4 /*yield*/, (0, fs_extra_1.stat)(stylePath)];
                                case 12:
                                    // Note: CSS files are new (generated), we'll delete them on restore
                                    _b.apply(_a, [(_e.mtimeAfterWrite = (_h.sent()).mtimeMs,
                                            _e)]);
                                    _h.label = 13;
                                case 13: return [3 /*break*/, 15];
                                case 14:
                                    if (isDryRun) {
                                        console.info("  web: no output");
                                    }
                                    _h.label = 15;
                                case 15:
                                    if (!filePlatforms.includes('native')) return [3 /*break*/, 29];
                                    process.env.TAMAGUI_TARGET = 'native';
                                    nativeHanzoguiOptions = __assign(__assign({}, buildOptions), { platform: 'native' });
                                    nativeOut = (0, static_1.extractToNative)(sourcePath, originalSource, nativeHanzoguiOptions);
                                    if (!isDryRun) return [3 /*break*/, 16];
                                    if (nativeOut.code) {
                                        console.info("\nnative:\n".concat(nativeOut.code));
                                    }
                                    else {
                                        console.info("  native: no output");
                                    }
                                    return [3 /*break*/, 29];
                                case 16:
                                    nativeOutputPath = sourcePath;
                                    isPlatformSpecific = /\.(web|native|ios|android)\.(tsx|jsx)$/.test(sourcePath);
                                    needsNativeSuffix = !isPlatformSpecific && (filePlatforms.length > 1 || outputAround);
                                    if (!outputAround) return [3 /*break*/, 18];
                                    // Output .native.tsx next to source file
                                    nativeOutputPath = sourcePath.replace(/\.(tsx|jsx)$/, '.native.$1');
                                    return [4 /*yield*/, (0, fs_extra_1.stat)(nativeOutputPath).catch(function () { return null; })];
                                case 17:
                                    exists = _h.sent();
                                    if (exists) {
                                        throw new Error("--output-around: ".concat(nativeOutputPath, " already exists. Remove it first or use --output instead."));
                                    }
                                    return [3 /*break*/, 21];
                                case 18:
                                    if (!outputDir) return [3 /*break*/, 20];
                                    relPath = (0, node_path_1.relative)((0, node_path_1.resolve)(sourceDir), sourcePath);
                                    outputRelPath = needsNativeSuffix
                                        ? relPath.replace(/\.(tsx|jsx)$/, '.native.$1')
                                        : relPath;
                                    nativeOutputPath = (0, node_path_1.join)(outputDir, outputRelPath);
                                    // ensure output subdirectory exists
                                    return [4 /*yield*/, (0, fs_extra_1.mkdir)((0, node_path_1.dirname)(nativeOutputPath), { recursive: true })];
                                case 19:
                                    // ensure output subdirectory exists
                                    _h.sent();
                                    return [3 /*break*/, 21];
                                case 20:
                                    if (needsNativeSuffix) {
                                        // Base file building both targets - create separate .native.tsx
                                        nativeOutputPath = sourcePath.replace(/\.(tsx|jsx)$/, '.native.$1');
                                    }
                                    _h.label = 21;
                                case 21:
                                    if (!nativeOut.code) return [3 /*break*/, 29];
                                    hasExtraction = nativeOut.code.includes('__ReactNativeStyleSheet') ||
                                        nativeOut.code.includes('_withStableStyle');
                                    if (hasExtraction) {
                                        stats.filesProcessed++;
                                        wrapperMatches = nativeOut.code.match(/_withStableStyle/g);
                                        if (wrapperMatches) {
                                            stats.flattened += wrapperMatches.length;
                                        }
                                    }
                                    if (!(!outputDir &&
                                        !outputAround &&
                                        (nativeOutputPath === sourcePath || filePlatforms.length === 1))) return [3 /*break*/, 23];
                                    return [4 /*yield*/, trackFile(nativeOutputPath)];
                                case 22:
                                    _h.sent();
                                    _h.label = 23;
                                case 23: return [4 /*yield*/, (0, fs_extra_1.writeFile)(nativeOutputPath, nativeOut.code, 'utf-8')];
                                case 24:
                                    _h.sent();
                                    if (!(!outputDir && !outputAround)) return [3 /*break*/, 26];
                                    return [4 /*yield*/, recordMtime(nativeOutputPath)];
                                case 25:
                                    _h.sent();
                                    _h.label = 26;
                                case 26:
                                    if (!(!outputDir &&
                                        !outputAround &&
                                        nativeOutputPath !== sourcePath &&
                                        filePlatforms.length > 1)) return [3 /*break*/, 28];
                                    _d = (_c = trackedFiles).push;
                                    _f = {
                                        path: nativeOutputPath,
                                        hardlinkPath: ''
                                    };
                                    return [4 /*yield*/, (0, fs_extra_1.stat)(nativeOutputPath)];
                                case 27:
                                    _d.apply(_c, [(_f.mtimeAfterWrite = (_h.sent()).mtimeMs,
                                            _f)]);
                                    _h.label = 28;
                                case 28:
                                    if (outputAround) {
                                        console.info("  \u2192 ".concat(nativeOutputPath));
                                    }
                                    _h.label = 29;
                                case 29: return [2 /*return*/];
                            }
                        });
                    }); })());
                };
                // Process all files
                for (_a = 0, fileToTargets_1 = fileToTargets; _a < fileToTargets_1.length; _a++) {
                    _b = fileToTargets_1[_a], sourcePath = _b[0], filePlatforms = _b[1];
                    _loop_2(sourcePath, filePlatforms);
                }
                return [4 /*yield*/, Promise.all(promises)];
            case 7:
                _d.sent();
                if (isDryRun) {
                    console.info("\n".concat(stats.filesProcessed, " files | ").concat(stats.found, " found | ").concat(stats.optimized, " optimized | ").concat(stats.flattened, " flattened | ").concat(stats.styled, " styled\n"));
                }
                // Verify expected optimizations if specified
                if (options.expectOptimizations !== undefined) {
                    totalOptimizations = stats.optimized + stats.flattened;
                    if (totalOptimizations < options.expectOptimizations) {
                        console.error("\nExpected at least ".concat(options.expectOptimizations, " optimizations but only got ").concat(totalOptimizations));
                        console.error("Stats: ".concat(JSON.stringify(stats, null, 2)));
                        process.exit(1);
                    }
                    console.info("\n\u2713 Met optimization target: ".concat(totalOptimizations, " >= ").concat(options.expectOptimizations));
                }
                if (!(options.runCommand && options.runCommand.length > 0)) return [3 /*break*/, 12];
                command = options.runCommand.join(' ');
                console.info("\nRunning: ".concat(command, "\n"));
                _d.label = 8;
            case 8:
                _d.trys.push([8, 9, 10, 12]);
                (0, node_child_process_1.execSync)(command, { stdio: 'inherit' });
                return [3 /*break*/, 12];
            case 9:
                err_1 = _d.sent();
                console.error("\nCommand failed with exit code ".concat(err_1.status || 1));
                process.exitCode = err_1.status || 1;
                return [3 /*break*/, 12];
            case 10: 
            // Always restore files
            return [4 /*yield*/, restoreFiles(trackedFiles, restoreDir)];
            case 11:
                // Always restore files
                _d.sent();
                return [7 /*endfinally*/];
            case 12: return [2 /*return*/, { stats: stats, trackedFiles: trackedFiles }];
        }
    });
}); };
exports.build = build;
function restoreFiles(trackedFiles, restoreDir) {
    return __awaiter(this, void 0, void 0, function () {
        var restored, skipped, deleted, _i, trackedFiles_1, tracked, currentStat, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!restoreDir || trackedFiles.length === 0)
                        return [2 /*return*/];
                    console.info("\nRestoring ".concat(trackedFiles.length, " files..."));
                    restored = 0;
                    skipped = 0;
                    deleted = 0;
                    _i = 0, trackedFiles_1 = trackedFiles;
                    _a.label = 1;
                case 1:
                    if (!(_i < trackedFiles_1.length)) return [3 /*break*/, 10];
                    tracked = trackedFiles_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, , 9]);
                    return [4 /*yield*/, (0, fs_extra_1.stat)(tracked.path).catch(function () { return null; })
                        // Check if file was modified during command execution
                    ];
                case 3:
                    currentStat = _a.sent();
                    // Check if file was modified during command execution
                    if (currentStat && currentStat.mtimeMs !== tracked.mtimeAfterWrite) {
                        console.warn("  Skipping ".concat(tracked.path, " - modified during build"));
                        skipped++;
                        return [3 /*break*/, 9];
                    }
                    if (!(tracked.hardlinkPath === '')) return [3 /*break*/, 5];
                    // This was a generated file, delete it
                    return [4 /*yield*/, (0, fs_extra_1.rm)(tracked.path, { force: true })];
                case 4:
                    // This was a generated file, delete it
                    _a.sent();
                    deleted++;
                    return [3 /*break*/, 7];
                case 5: 
                // Restore from hardlink
                return [4 /*yield*/, (0, fs_extra_1.copyFile)(tracked.hardlinkPath, tracked.path)];
                case 6:
                    // Restore from hardlink
                    _a.sent();
                    restored++;
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_2 = _a.sent();
                    console.warn("  Failed to restore ".concat(tracked.path, ": ").concat(err_2.message));
                    skipped++;
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 1];
                case 10: 
                // Clean up tmpdir
                return [4 /*yield*/, (0, fs_extra_1.rm)(restoreDir, { recursive: true, force: true })];
                case 11:
                    // Clean up tmpdir
                    _a.sent();
                    console.info("  Restored: ".concat(restored, ", Deleted: ").concat(deleted, ", Skipped: ").concat(skipped));
                    return [2 /*return*/];
            }
        });
    });
}
