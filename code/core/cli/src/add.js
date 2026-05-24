"use strict";
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
exports.installGeneratedPackage = exports.generatedPackageTypes = void 0;
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var chalk_1 = require("chalk");
var change_case_1 = require("change-case");
var fs_extra_1 = require("fs-extra");
var marked_1 = require("marked");
var marked_terminal_1 = require("marked-terminal");
var opener_1 = require("opener");
var prompts_1 = require("prompts");
marked_1.marked.setOptions({
    renderer: new marked_terminal_1.default(),
});
var home = (0, node_os_1.homedir)();
var hanzoguiDir = node_path_1.default.join(home, '.hanzogui');
exports.generatedPackageTypes = ['font', 'icon'];
var installGeneratedPackage = function (type, packagesPath) { return __awaiter(void 0, void 0, void 0, function () {
    var repoName, tempDir, meta, _a, _b, result, packageName, packageDir, finalDir, readmePath;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                packagesPath = packagesPath || node_path_1.default.join(process.cwd(), 'packages');
                if (!exports.generatedPackageTypes.includes(type)) {
                    throw new Error("".concat(type ? "Type \"".concat(type, "\" is Not supported.") : "No type provided.", " Supported types: ").concat(exports.generatedPackageTypes.join(', ')));
                }
                repoName = type === 'font' ? 'hanzogui-google-fonts' : 'hanzogui-iconify';
                console.info("Setting up ".concat(chalk_1.default.blueBright(hanzoguiDir), "..."));
                return [4 /*yield*/, (0, fs_extra_1.ensureDir)(hanzoguiDir)];
            case 1:
                _c.sent();
                tempDir = node_path_1.default.join(hanzoguiDir, repoName);
                if ((0, node_fs_1.existsSync)(tempDir)) {
                    (0, node_fs_1.rmSync)(tempDir, { recursive: true });
                }
                try {
                    process.chdir(hanzoguiDir);
                    try {
                        console.info('Attempting to clone with SSH');
                        (0, node_child_process_1.execSync)("git clone -n --depth=1  --branch generated --filter=tree:0 git@github.com:hanzogui/".concat(repoName, ".git"));
                    }
                    catch (error) {
                        console.info('SSH failed - Attempting to c  lone with HTTPS');
                        (0, node_child_process_1.execSync)("git clone -n --depth=1 --branch generated --filter=tree:0 https://github.com/hanzogui/".concat(repoName));
                    }
                    process.chdir(tempDir);
                    (0, node_child_process_1.execSync)(["git sparse-checkout set --no-cone meta", "git checkout"].join(' && '));
                }
                catch (error) {
                    if (error instanceof Error) {
                        if (error === null || error === void 0 ? void 0 : error.stderr.includes('Repository not found')) {
                            console.info(chalk_1.default.yellow("You don't have access to Hanzogui ".concat(type === 'font' ? 'fonts' : 'icons', ". Check \uD83E\uDD61 Hanzogui Takeout (https://hanzogui.dev/takeout) for more info.")));
                            (0, opener_1.default)('https://hanzogui.dev/takeout');
                            process.exit(0);
                        }
                        throw error;
                    }
                }
                _b = (_a = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(node_path_1.default.join(hanzoguiDir, repoName, "meta", "data.json")).then(function (r) {
                        return r.toString();
                    })];
            case 2:
                meta = _b.apply(_a, [_c.sent()]);
                console.info(chalk_1.default.gray("Use \u21E7/\u21E9 to navigate. Use tab to cycle the result. Use Page Up/Page Down (on Mac: fn + \u21E7 / \u21E9) to change page. Hit enter to select the highlighted item below the prompt."));
                return [4 /*yield*/, (0, prompts_1.default)({
                        name: 'packageName',
                        type: 'autocomplete',
                        message: type === 'icon'
                            ? "Pick an icon pack:"
                            : type === 'font'
                                ? "Pick a font:"
                                : "Pick one:",
                        choices: Object.entries(meta).map(function (_a) {
                            var slug = _a[0], data = _a[1];
                            return ({
                                title: type === 'font'
                                    ? "".concat(slug, ": ").concat(data.weights.length, " weights, ").concat(data.styles.length, " styles, ").concat(data.subsets.length, " subsets (https://fonts.google.com/specimen/").concat((0, change_case_1.pascalCase)(slug), ")")
                                    : "".concat(data.name, ": ").concat(data.total, " icons, ").concat(data.license.title, " license (").concat(data.author.url, ")"),
                                value: slug,
                            });
                        }),
                    })];
            case 3:
                result = _c.sent();
                packageName = "".concat(type, "-").concat(result.packageName);
                packageDir = node_path_1.default.join(tempDir, 'packages', packageName);
                process.chdir(tempDir);
                (0, node_child_process_1.execSync)(["git sparse-checkout set --no-cone packages/".concat(packageName), "git checkout"].join(' && '));
                finalDir = node_path_1.default.join(packagesPath, packageName);
                return [4 /*yield*/, (0, fs_extra_1.ensureDir)(packagesPath)];
            case 4:
                _c.sent();
                return [4 /*yield*/, (0, fs_extra_1.copy)(packageDir, finalDir)];
            case 5:
                _c.sent();
                console.info();
                console.info(chalk_1.default.green("Created the package under ".concat(finalDir)));
                console.info();
                readmePath = node_path_1.default.join(finalDir, 'README.md');
                if ((0, node_fs_1.existsSync)(readmePath)) {
                    console.info(marked_1.marked.parse((0, fs_extra_1.readFileSync)(readmePath).toString()));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.installGeneratedPackage = installGeneratedPackage;
function cloneGeneratedBranch(repoName) { }
