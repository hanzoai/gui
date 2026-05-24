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
exports.DEPENDENCY_TYPE = void 0;
exports.checkDeps = checkDeps;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var check_dep_versions_1 = require("./check-dep-versions");
var DEPENDENCY_TYPE;
(function (DEPENDENCY_TYPE) {
    DEPENDENCY_TYPE["dependencies"] = "dependencies";
    DEPENDENCY_TYPE["devDependencies"] = "devDependencies";
    DEPENDENCY_TYPE["optionalDependencies"] = "optionalDependencies";
    DEPENDENCY_TYPE["peerDependencies"] = "peerDependencies";
    DEPENDENCY_TYPE["resolutions"] = "resolutions";
})(DEPENDENCY_TYPE || (exports.DEPENDENCY_TYPE = DEPENDENCY_TYPE = {}));
// critical packages that must not be duplicated at runtime
var CRITICAL_PACKAGES = ['@hanzogui/web', '@hanzogui/core', 'hanzogui'];
/**
 * Walks node_modules to find duplicate physical copies of critical hanzogui packages.
 * Detects nested node_modules that would cause multiple runtime instances.
 */
function checkDuplicateInstalls(root) {
    var nodeModules = (0, node_path_1.join)(root, 'node_modules');
    if (!(0, node_fs_1.existsSync)(nodeModules))
        return '';
    var duplicates = new Map();
    for (var _i = 0, CRITICAL_PACKAGES_1 = CRITICAL_PACKAGES; _i < CRITICAL_PACKAGES_1.length; _i++) {
        var pkg = CRITICAL_PACKAGES_1[_i];
        var locations = findAllInstances(nodeModules, pkg);
        if (locations.length > 1) {
            // resolve symlinks to find truly distinct copies
            var realPaths = new Set();
            var distinctLocations = [];
            for (var _a = 0, locations_1 = locations; _a < locations_1.length; _a++) {
                var loc = locations_1[_a];
                try {
                    var real = (0, node_fs_1.realpathSync)(loc);
                    if (!realPaths.has(real)) {
                        realPaths.add(real);
                        distinctLocations.push((0, node_path_1.relative)(root, loc));
                    }
                }
                catch (_b) {
                    distinctLocations.push((0, node_path_1.relative)(root, loc));
                }
            }
            if (distinctLocations.length > 1) {
                duplicates.set(pkg, distinctLocations);
            }
        }
    }
    if (duplicates.size === 0)
        return '';
    var lines = [
        'Found duplicate hanzogui installations in node_modules:',
        '',
        'This causes multiple runtime instances, which breaks theme/config detection.',
        '',
    ];
    for (var _c = 0, duplicates_1 = duplicates; _c < duplicates_1.length; _c++) {
        var _d = duplicates_1[_c], pkg = _d[0], locations = _d[1];
        // read versions from each location
        lines.push("  ".concat(pkg, ":"));
        for (var _e = 0, locations_2 = locations; _e < locations_2.length; _e++) {
            var loc = locations_2[_e];
            var pkgJsonPath = (0, node_path_1.join)(root, loc, 'package.json');
            var version = '?';
            try {
                version = JSON.parse((0, node_fs_1.readFileSync)(pkgJsonPath, 'utf8')).version;
            }
            catch (_f) { }
            lines.push("    ".concat(version, " at ").concat(loc));
        }
        lines.push('');
    }
    lines.push("Fix: run your package manager's dedupe command:");
    lines.push('  bun install  (bun auto-dedupes)');
    lines.push('  npx yarn-deduplicate && yarn install');
    lines.push('  npm dedupe');
    lines.push('');
    lines.push("If that doesn't help, delete node_modules and lockfile, then reinstall.");
    return lines.join('\n');
}
/**
 * Recursively find all instances of a package in node_modules.
 * Handles both scoped (@hanzogui/web) and unscoped (hanzogui) packages.
 */
function findAllInstances(nodeModulesDir, packageName, found, depth) {
    if (found === void 0) { found = []; }
    if (depth === void 0) { depth = 0; }
    // don't go too deep, typical hoisting issues show up within a few levels
    if (depth > 4 || !(0, node_fs_1.existsSync)(nodeModulesDir))
        return found;
    var pkgDir = node_path_1.join.apply(void 0, __spreadArray([nodeModulesDir], packageName.split('/'), false));
    if ((0, node_fs_1.existsSync)((0, node_path_1.join)(pkgDir, 'package.json'))) {
        found.push(pkgDir);
    }
    // scan nested node_modules inside direct children
    try {
        var entries = (0, node_fs_1.readdirSync)(nodeModulesDir);
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            if (entry.startsWith('.'))
                continue;
            if (entry.startsWith('@')) {
                // scoped packages have another level
                var scopeDir = (0, node_path_1.join)(nodeModulesDir, entry);
                try {
                    var scopeEntries = (0, node_fs_1.readdirSync)(scopeDir);
                    for (var _a = 0, scopeEntries_1 = scopeEntries; _a < scopeEntries_1.length; _a++) {
                        var scopeEntry = scopeEntries_1[_a];
                        var nested = (0, node_path_1.join)(scopeDir, scopeEntry, 'node_modules');
                        if ((0, node_fs_1.existsSync)(nested)) {
                            findAllInstances(nested, packageName, found, depth + 1);
                        }
                    }
                }
                catch (_b) { }
            }
            else {
                var nested = (0, node_path_1.join)(nodeModulesDir, entry, 'node_modules');
                if ((0, node_fs_1.existsSync)(nested)) {
                    findAllInstances(nested, packageName, found, depth + 1);
                }
            }
        }
    }
    catch (_c) { }
    return found;
}
/**
 * Checks lockfile for multiple resolved versions of hanzogui packages.
 * Supports bun.lock, yarn.lock, and package-lock.json.
 */
function checkLockfileDuplicates(root) {
    var bunLock = (0, node_path_1.join)(root, 'bun.lock');
    var yarnLock = (0, node_path_1.join)(root, 'yarn.lock');
    var npmLock = (0, node_path_1.join)(root, 'package-lock.json');
    if ((0, node_fs_1.existsSync)(bunLock))
        return checkBunLockDuplicates(bunLock);
    if ((0, node_fs_1.existsSync)(yarnLock))
        return checkYarnLockDuplicates(yarnLock);
    if ((0, node_fs_1.existsSync)(npmLock))
        return checkNpmLockDuplicates(npmLock);
    return '';
}
function checkBunLockDuplicates(lockPath) {
    try {
        var content = (0, node_fs_1.readFileSync)(lockPath, 'utf8');
        var duplicates = new Map();
        var criticalSet = new Set(CRITICAL_PACKAGES);
        // match patterns like "@hanzogui/web@version" or "hanzogui@version" in resolved entries
        // bun.lock format: "package@version": ["resolved-url", ...]
        var packagePattern = /["'](@hanzogui\/[\w-]+|hanzogui)@([^"'\s,]+)["']/g;
        var match = void 0;
        while ((match = packagePattern.exec(content)) !== null) {
            var name_1 = match[1];
            var version = match[2];
            if (version.startsWith('workspace:'))
                continue;
            // only flag critical packages — leaf packages can safely differ
            if (!criticalSet.has(name_1))
                continue;
            if (!duplicates.has(name_1))
                duplicates.set(name_1, new Set());
            duplicates.get(name_1).add(version);
        }
        return formatLockfileDuplicates(duplicates, 'bun.lock');
    }
    catch (_a) {
        return '';
    }
}
function checkYarnLockDuplicates(lockPath) {
    try {
        var content = (0, node_fs_1.readFileSync)(lockPath, 'utf8');
        var duplicates = new Map();
        var criticalSet = new Set(CRITICAL_PACKAGES);
        // yarn.lock format:
        //   "@hanzogui/web@^1.0.0":
        //     version "1.0.1"
        var entryPattern = /^"?(@hanzogui\/[\w-]+|hanzogui)@[^":\n]+[":]?\s*$/gm;
        var versionPattern = /^\s+version\s+"([^"]+)"/gm;
        var entryMatch = void 0;
        while ((entryMatch = entryPattern.exec(content)) !== null) {
            var name_2 = entryMatch[1];
            if (!criticalSet.has(name_2))
                continue;
            versionPattern.lastIndex = entryMatch.index;
            var verMatch = versionPattern.exec(content);
            if (verMatch) {
                if (!duplicates.has(name_2))
                    duplicates.set(name_2, new Set());
                duplicates.get(name_2).add(verMatch[1]);
            }
        }
        return formatLockfileDuplicates(duplicates, 'yarn.lock');
    }
    catch (_a) {
        return '';
    }
}
function checkNpmLockDuplicates(lockPath) {
    try {
        var lock = JSON.parse((0, node_fs_1.readFileSync)(lockPath, 'utf8'));
        var duplicates = new Map();
        var criticalSet = new Set(CRITICAL_PACKAGES);
        // package-lock.json v2/v3 uses "packages" map with path keys
        var packages = lock.packages || {};
        for (var _i = 0, _a = Object.entries(packages); _i < _a.length; _i++) {
            var _b = _a[_i], path = _b[0], info = _b[1];
            if (!path)
                continue; // skip root
            var name_3 = info.name || path.split('node_modules/').pop();
            if (!name_3)
                continue;
            if (!criticalSet.has(name_3))
                continue;
            var version = info.version;
            if (version) {
                if (!duplicates.has(name_3))
                    duplicates.set(name_3, new Set());
                duplicates.get(name_3).add(version);
            }
        }
        return formatLockfileDuplicates(duplicates, 'package-lock.json');
    }
    catch (_c) {
        return '';
    }
}
function formatLockfileDuplicates(duplicates, lockfileName) {
    // filter to only packages with multiple versions
    var multiVersion = new Map();
    for (var _i = 0, duplicates_2 = duplicates; _i < duplicates_2.length; _i++) {
        var _a = duplicates_2[_i], name_4 = _a[0], versions = _a[1];
        if (versions.size > 1) {
            multiVersion.set(name_4, __spreadArray([], versions, true).sort());
        }
    }
    if (multiVersion.size === 0)
        return '';
    var lines = ["Found multiple resolved versions in ".concat(lockfileName, ":"), ''];
    for (var _b = 0, multiVersion_1 = multiVersion; _b < multiVersion_1.length; _b++) {
        var _c = multiVersion_1[_b], name_5 = _c[0], versions = _c[1];
        lines.push("  ".concat(name_5, ": ").concat(versions.join(', ')));
    }
    lines.push('');
    lines.push('Multiple versions cause duplicate runtime instances, breaking config/theme detection.');
    lines.push('Fix: ensure all hanzogui packages use the same version range, then dedupe.');
    return lines.join('\n');
}
/**
 * Checks that a hanzogui config file exists in common locations.
 */
function checkConfigExists(root) {
    var _a;
    var configNames = [
        'hanzogui.config.ts',
        'hanzogui.config.tsx',
        'hanzogui.config.js',
        'hanzogui.config.mjs',
        'hanzogui.config.cjs',
    ];
    var searchDirs = [root, (0, node_path_1.join)(root, 'src'), (0, node_path_1.join)(root, 'app'), (0, node_path_1.join)(root, 'config')];
    for (var _i = 0, searchDirs_1 = searchDirs; _i < searchDirs_1.length; _i++) {
        var dir = searchDirs_1[_i];
        for (var _b = 0, configNames_1 = configNames; _b < configNames_1.length; _b++) {
            var name_6 = configNames_1[_b];
            if ((0, node_fs_1.existsSync)((0, node_path_1.join)(dir, name_6))) {
                return '';
            }
        }
    }
    // check if hanzogui.build.ts references a config path
    var buildConfigNames = [
        'hanzogui.build.ts',
        'hanzogui.build.js',
        'hanzogui.build.mjs',
        'hanzogui.build.cjs',
    ];
    for (var _c = 0, buildConfigNames_1 = buildConfigNames; _c < buildConfigNames_1.length; _c++) {
        var name_7 = buildConfigNames_1[_c];
        var buildPath = (0, node_path_1.join)(root, name_7);
        if ((0, node_fs_1.existsSync)(buildPath)) {
            try {
                var content = (0, node_fs_1.readFileSync)(buildPath, 'utf8');
                var match = content.match(/config\s*:\s*['"`]([^'"`]+)['"`]/);
                if (match) {
                    var configPath = (0, node_path_1.join)(root, match[1]);
                    if ((0, node_fs_1.existsSync)(configPath))
                        return '';
                }
            }
            catch (_d) { }
        }
    }
    // also check if there's a hanzogui config referenced in package.json
    var pkgJsonPath = (0, node_path_1.join)(root, 'package.json');
    if ((0, node_fs_1.existsSync)(pkgJsonPath)) {
        try {
            var pkg = JSON.parse((0, node_fs_1.readFileSync)(pkgJsonPath, 'utf8'));
            if ((_a = pkg.hanzogui) === null || _a === void 0 ? void 0 : _a.config) {
                var configPath = (0, node_path_1.join)(root, pkg.hanzogui.config);
                if ((0, node_fs_1.existsSync)(configPath))
                    return '';
            }
        }
        catch (_e) { }
    }
    // check if this is a monorepo root (has workspaces) - skip config check for root
    if ((0, node_fs_1.existsSync)(pkgJsonPath)) {
        try {
            var pkg = JSON.parse((0, node_fs_1.readFileSync)(pkgJsonPath, 'utf8'));
            if (pkg.workspaces)
                return '';
        }
        catch (_f) { }
    }
    return [
        'No hanzogui.config file found.',
        '',
        'Hanzogui requires a config file (e.g. hanzogui.config.ts) that calls createHanzogui().',
        'Without it, components will throw "Can\'t find Hanzogui configuration" at runtime.',
        '',
        'See: https://hanzogui.dev/docs/core/configuration',
    ].join('\n');
}
function checkDeps(root) {
    return __awaiter(this, void 0, void 0, function () {
        var issues, workspaceMismatchSummary, lockfileSummary, duplicatesSummary, configSummary, i;
        return __generator(this, function (_a) {
            issues = [];
            workspaceMismatchSummary = new check_dep_versions_1.CDVC(root).toMismatchSummary();
            if (workspaceMismatchSummary)
                issues.push(workspaceMismatchSummary);
            lockfileSummary = checkLockfileDuplicates(root);
            if (lockfileSummary)
                issues.push(lockfileSummary);
            duplicatesSummary = checkDuplicateInstalls(root);
            if (duplicatesSummary)
                issues.push(duplicatesSummary);
            configSummary = checkConfigExists(root);
            if (configSummary)
                issues.push(configSummary);
            if (issues.length === 0) {
                console.info("Hanzogui dependencies look good \u2705");
                process.exit(0);
            }
            for (i = 0; i < issues.length; i++) {
                if (i > 0)
                    console.error('');
                console.error(issues[i]);
            }
            process.exit(1);
            return [2 /*return*/];
        });
    });
}
