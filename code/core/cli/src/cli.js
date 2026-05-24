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
var arg_1 = require("arg");
var chalk_1 = require("chalk");
var utils_1 = require("./utils");
['exit', 'SIGINT'].forEach(function (_) {
    process.on(_, function () {
        (0, utils_1.disposeAll)();
        process.exit();
    });
});
var COMMAND_MAP = {
    check: {
        description: "Checks for inconsistent versions, duplicate installs, lockfile issues, and missing config.",
        shorthands: [],
        flags: {
            '--help': Boolean,
            '--debug': Boolean,
            '--verbose': Boolean,
        },
        run: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _, flags, options, checkDeps;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = (0, arg_1.default)(this.flags), _ = _a._, flags = __rest(_a, ["_"]);
                            return [4 /*yield*/, (0, utils_1.getOptions)({
                                    debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
                                })];
                        case 1:
                            options = _b.sent();
                            checkDeps = require('@hanzogui/static/checkDeps').checkDeps;
                            return [4 /*yield*/, checkDeps(options.paths.root)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
    generate: {
        description: "Builds your entire hanzogui configuration and outputs any CSS.",
        shorthands: [],
        flags: {
            '--help': Boolean,
            '--debug': Boolean,
            '--verbose': Boolean,
        },
        run: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _, flags, options, loadHanzogui, generatePrompt, join;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = (0, arg_1.default)(this.flags), _ = _a._, flags = __rest(_a, ["_"]);
                            return [4 /*yield*/, (0, utils_1.getOptions)({
                                    debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
                                    loadHanzoguiOptions: true,
                                })];
                        case 1:
                            options = _b.sent();
                            loadHanzogui = require('@hanzogui/static/loadHanzogui').loadHanzogui;
                            process.env.TAMAGUI_KEEP_THEMES = '1';
                            return [4 /*yield*/, loadHanzogui(__assign(__assign({}, options.hanzoguiOptions), { platform: 'web' }))
                                // also generate prompt to .hanzogui/prompt.md
                            ];
                        case 2:
                            _b.sent();
                            generatePrompt = require('./generate-prompt').generatePrompt;
                            join = require('node:path').join;
                            return [4 /*yield*/, generatePrompt(__assign(__assign({}, options), { output: join(options.paths.dotDir, 'prompt.md') }))];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
    'generate-css': {
        shorthands: [],
        description: "Generate the hanzogui.generated.css file from your config",
        flags: {
            '--help': Boolean,
            '--debug': Boolean,
            '--verbose': Boolean,
            '--output': String,
        },
        run: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _, flags, options, outputPath, loadHanzogui;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = (0, arg_1.default)(this.flags), _ = _a._, flags = __rest(_a, ["_"]);
                            return [4 /*yield*/, (0, utils_1.getOptions)({
                                    debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
                                    loadHanzoguiOptions: true,
                                })];
                        case 1:
                            options = _b.sent();
                            outputPath = flags['--output'] || options.hanzoguiOptions.outputCSS || './hanzogui.generated.css';
                            loadHanzogui = require('@hanzogui/static/loadHanzogui').loadHanzogui;
                            process.env.TAMAGUI_KEEP_THEMES = '1';
                            return [4 /*yield*/, loadHanzogui(__assign(__assign({}, options.hanzoguiOptions), { outputCSS: outputPath, platform: 'web' }))];
                        case 2:
                            _b.sent();
                            console.info("Generated CSS to ".concat(outputPath));
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
    'generate-themes': {
        shorthands: [],
        description: "Use to pre-build your themes",
        flags: {
            '--help': Boolean,
            '--debug': Boolean,
            '--verbose': Boolean,
        },
        run: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _, flags, options, _cmd, inPath, outPath, _b, generateThemes, writeGeneratedThemes, generated, err_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = (0, arg_1.default)(this.flags), _ = _a._, flags = __rest(_a, ["_"]);
                            return [4 /*yield*/, (0, utils_1.getOptions)({
                                    debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
                                })];
                        case 1:
                            options = _c.sent();
                            _cmd = _[0], inPath = _[1], outPath = _[2];
                            if (!inPath || !outPath) {
                                throw new Error("Must supply both input and output paths, missing one (inPath: ".concat(inPath, ", outPath: ").concat(outPath, ")"));
                            }
                            _b = require('@hanzogui/generate-themes'), generateThemes = _b.generateThemes, writeGeneratedThemes = _b.writeGeneratedThemes;
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 7, , 8]);
                            return [4 /*yield*/, generateThemes(inPath)];
                        case 3:
                            generated = _c.sent();
                            if (!generated) return [3 /*break*/, 5];
                            return [4 /*yield*/, writeGeneratedThemes(options.paths.dotDir, outPath, generated)];
                        case 4:
                            _c.sent();
                            console.info("Successfully generated themes to ".concat(outPath));
                            return [3 /*break*/, 6];
                        case 5:
                            process.exit(1);
                            _c.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            err_1 = _c.sent();
                            console.error("Error generating themes: ".concat(err_1));
                            return [2 /*return*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        },
    },
    add: {
        shorthands: [],
        description: "Use to add fonts and icons to your monorepo.",
        flags: {
            '--help': Boolean,
            '--debug': Boolean,
            '--verbose': Boolean,
        },
        run: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _, flags, installGeneratedPackage, cmd, type, path;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = (0, arg_1.default)(this.flags), _ = _a._, flags = __rest(_a, ["_"]);
                            installGeneratedPackage = require('./add').installGeneratedPackage;
                            cmd = _[0], type = _[1], path = _[2];
                            return [4 /*yield*/, installGeneratedPackage(type, path)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
    build: {
        shorthands: ['b'],
        description: "Use to pre-build a Hanzogui component directory. Use -- to run a command after optimization, then auto-restore files.",
        flags: {
            '--help': Boolean,
            '--debug': Boolean,
            '--verbose': Boolean,
            '--dry-run': Boolean,
            '--target': String,
            '--include': String,
            '--exclude': String,
            '--output': String,
            '--output-around': Boolean,
            '--expect-optimizations': Number,
        },
        run: function () {
            return __awaiter(this, void 0, void 0, function () {
                var argvSeparatorIdx, runCommand, argsBeforeSeparator, _a, _, flags, _command, dir, dryRun, debug, build, options;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            argvSeparatorIdx = process.argv.indexOf('--');
                            if (argvSeparatorIdx !== -1) {
                                // Everything after -- is the command to run
                                runCommand = process.argv.slice(argvSeparatorIdx + 1);
                                argsBeforeSeparator = process.argv.slice(0, argvSeparatorIdx);
                                process.argv = argsBeforeSeparator;
                            }
                            _a = (0, arg_1.default)(this.flags), _ = _a._, flags = __rest(_a, ["_"]);
                            _command = _[0], dir = _[1];
                            dryRun = flags['--dry-run'] || false;
                            debug = flags['--debug']
                                ? flags['--verbose']
                                    ? 'verbose'
                                    : true
                                : false;
                            build = require('./build.cjs').build;
                            return [4 /*yield*/, (0, utils_1.getOptions)({
                                    debug: debug,
                                })];
                        case 1:
                            options = _b.sent();
                            return [4 /*yield*/, build(__assign(__assign({}, options), { dir: dir, include: flags['--include'], target: flags['--target'] || 'both', exclude: flags['--exclude'], output: flags['--output'], outputAround: flags['--output-around'], expectOptimizations: flags['--expect-optimizations'], runCommand: runCommand, dryRun: dryRun }))];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
    upgrade: {
        shorthands: ['up'],
        description: "Upgrade all hanzogui packages in your workspace to the latest version",
        flags: {
            '--help': Boolean,
            '--debug': Boolean,
            '--from': String,
            '--to': String,
            '--changelog-only': Boolean,
            '--dry-run': Boolean,
        },
        run: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _, flags, upgrade;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = (0, arg_1.default)(this.flags), _ = _a._, flags = __rest(_a, ["_"]);
                            upgrade = require('./upgrade').upgrade;
                            return [4 /*yield*/, upgrade({
                                    from: flags['--from'],
                                    to: flags['--to'],
                                    changelogOnly: flags['--changelog-only'],
                                    dryRun: flags['--dry-run'],
                                    debug: flags['--debug'],
                                })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
    'update-template': {
        shorthands: ['ut'],
        description: "Used to update your git repo with the source template. (e.g. Takeout)",
        flags: {
            '--help': Boolean,
            '--template-repo': String,
            '--ignored-patterns': String,
        },
        run: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _, flags, updateTemplate;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = (0, arg_1.default)(this.flags), _ = _a._, flags = __rest(_a, ["_"]);
                            updateTemplate = require('./update-template').updateTemplate;
                            if (!flags['--template-repo']) {
                                throw new Error('--template-repo is required');
                            }
                            return [4 /*yield*/, updateTemplate(flags['--template-repo'], (_b = flags['--ignored-patterns']) === null || _b === void 0 ? void 0 : _b.split(' '))];
                        case 1:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
    'generate-prompt': {
        shorthands: [],
        description: "Generate an LLM-friendly markdown file from your Hanzogui config",
        flags: {
            '--help': Boolean,
            '--debug': Boolean,
            '--output': String,
        },
        run: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _, flags, generatePrompt, options;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = (0, arg_1.default)(this.flags), _ = _a._, flags = __rest(_a, ["_"]);
                            generatePrompt = require('./generate-prompt').generatePrompt;
                            return [4 /*yield*/, (0, utils_1.getOptions)({
                                    debug: flags['--debug'] ? true : false,
                                    loadHanzoguiOptions: true,
                                })];
                        case 1:
                            options = _b.sent();
                            return [4 /*yield*/, generatePrompt(__assign(__assign({}, options), { output: flags['--output'] }))];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
};
var commandEntries = Object.keys(COMMAND_MAP).flatMap(function (command) {
    var definition = COMMAND_MAP[command];
    var entries = __spreadArray([command], definition.shorthands, true).map(function (cmd) {
        return [cmd, definition];
    });
    return entries;
});
var commands = Object.fromEntries(commandEntries);
var _a = (0, arg_1.default)({
    '--help': Boolean,
    '--version': Boolean,
}, {
    permissive: true,
}), command = _a._[0], flags = __rest(_a, ["_"]);
if (flags['--version']) {
    console.info(require('../package.json').version);
    process.exit(0);
}
if (!command && flags['--help']) {
    console.info("$ hanzogui\n\ncommands:\n\n".concat(Object.keys(COMMAND_MAP)
        .map(function (key) {
        return "  ".concat(key);
    })
        .join('\n')));
    process.exit(0);
}
if (!(command in commands)) {
    console.error();
    console.warn(chalk_1.default.yellow("Not a valid command: ".concat(command)));
    process.exit(1);
}
var definition = commands[command];
main();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _, cmdFlags, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (flags['--help']) {
                        console.info("\n$ hanzogui ".concat(command, ": ").concat(definition.description, "\n"));
                        console.info("Flags: ".concat(Object.entries(definition.flags).map(function (_a) {
                            var k = _a[0], v = _a[1];
                            return "".concat(k, " (").concat(v.name, ")");
                        })));
                        process.exit(0);
                    }
                    _a = (0, arg_1.default)(definition.flags), _ = _a._, cmdFlags = __rest(_a, ["_"]);
                    // help for any command
                    if (cmdFlags['--help']) {
                        console.info("$ hanzogui ".concat(_, "\n\n    Flags: ").concat(JSON.stringify(cmdFlags, null, 2), "\n\n"));
                        process.exit(0);
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, definition.run()];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _b.sent();
                    console.error("Error running command: ".concat(err_2.message));
                    return [3 /*break*/, 4];
                case 4:
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
