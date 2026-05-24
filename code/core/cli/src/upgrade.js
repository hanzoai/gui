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
exports.upgrade = upgrade;
var chalk_1 = require("chalk");
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var TAMAGUI_PACKAGES_PATTERN = /^(@hanzogui\/|hanzogui$)/;
var COMMIT_TYPE_ORDER = [
    'feat',
    'fix',
    'perf',
    'refactor',
    'docs',
    'chore',
    'test',
    'ci',
];
/**
 * Parse version specifier from a dependency version string
 */
function parseVersionSpecifier(version) {
    if (version.startsWith('>=')) {
        return { specifier: '>=', cleanVersion: version.slice(2) };
    }
    if (version.startsWith('>')) {
        return { specifier: '>', cleanVersion: version.slice(1) };
    }
    if (version.startsWith('^')) {
        return { specifier: '^', cleanVersion: version.slice(1) };
    }
    if (version.startsWith('~')) {
        return { specifier: '~', cleanVersion: version.slice(1) };
    }
    // Handle workspace:* and other special cases
    if (version.startsWith('workspace:')) {
        return { specifier: '', cleanVersion: version };
    }
    return { specifier: '', cleanVersion: version };
}
/**
 * Find all package.json files in the workspace
 */
function findPackageJsonFiles(root) {
    var files = [];
    // Check root package.json
    var rootPkgPath = (0, node_path_1.join)(root, 'package.json');
    if ((0, node_fs_1.existsSync)(rootPkgPath)) {
        files.push(rootPkgPath);
    }
    // Use find command to locate all package.json files
    try {
        var result = (0, node_child_process_1.execSync)("find \"".concat(root, "\" -name \"package.json\" -not -path \"*/node_modules/*\" -not -path \"*/.git/*\" 2>/dev/null"), { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
        var foundFiles = result.trim().split('\n').filter(Boolean);
        files.push.apply(files, foundFiles.filter(function (f) { return !files.includes(f); }));
    }
    catch (_a) {
        // Fallback: just use root
    }
    return files;
}
/**
 * Find all hanzogui packages in the workspace
 */
function findHanzoguiPackages(root) {
    var packageJsonFiles = findPackageJsonFiles(root);
    var packages = [];
    for (var _i = 0, packageJsonFiles_1 = packageJsonFiles; _i < packageJsonFiles_1.length; _i++) {
        var filePath = packageJsonFiles_1[_i];
        try {
            var content = (0, node_fs_1.readFileSync)(filePath, 'utf-8');
            var pkg = JSON.parse(content);
            var depTypes = ['dependencies', 'devDependencies', 'peerDependencies'];
            for (var _a = 0, depTypes_1 = depTypes; _a < depTypes_1.length; _a++) {
                var depType = depTypes_1[_a];
                var deps = pkg[depType];
                if (!deps)
                    continue;
                for (var _b = 0, _c = Object.entries(deps); _b < _c.length; _b++) {
                    var _d = _c[_b], name_1 = _d[0], version = _d[1];
                    if (typeof version !== 'string')
                        continue;
                    if (!TAMAGUI_PACKAGES_PATTERN.test(name_1))
                        continue;
                    // Skip workspace: dependencies
                    if (version.startsWith('workspace:'))
                        continue;
                    var _e = parseVersionSpecifier(version), specifier = _e.specifier, cleanVersion = _e.cleanVersion;
                    packages.push({
                        name: name_1,
                        version: cleanVersion,
                        versionSpecifier: specifier,
                        filePath: filePath,
                        depType: depType,
                    });
                }
            }
        }
        catch (_f) {
            // Skip invalid package.json files
        }
    }
    return packages;
}
/**
 * Get the latest hanzogui version from npm
 */
function getLatestVersion() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            try {
                result = (0, node_child_process_1.execSync)('npm view hanzogui version', { encoding: 'utf-8' });
                return [2 /*return*/, result.trim()];
            }
            catch (err) {
                throw new Error('Failed to fetch latest hanzogui version from npm');
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Get current version from found packages (most common version)
 */
function getCurrentVersion(packages) {
    var versions = packages.map(function (p) { return p.version; });
    if (versions.length === 0)
        return null;
    // Count occurrences
    var counts = new Map();
    for (var _i = 0, versions_1 = versions; _i < versions_1.length; _i++) {
        var v = versions_1[_i];
        counts.set(v, (counts.get(v) || 0) + 1);
    }
    // Return most common
    var maxCount = 0;
    var mostCommon = versions[0];
    for (var _a = 0, counts_1 = counts; _a < counts_1.length; _a++) {
        var _b = counts_1[_a], v = _b[0], count = _b[1];
        if (count > maxCount) {
            maxCount = count;
            mostCommon = v;
        }
    }
    return mostCommon;
}
/**
 * Parse conventional commit message
 */
function parseConventionalCommit(message) {
    // Match conventional commit format: type(scope)!: message or type!: message
    var match = message.match(/^(\w+)(?:\(([^)]+)\))?(!)?: (.+)$/);
    if (!match)
        return null;
    var type = match[1], scope = match[2], breaking = match[3], msg = match[4];
    // Only include valid types
    var validTypes = [
        'feat',
        'fix',
        'perf',
        'refactor',
        'docs',
        'chore',
        'test',
        'ci',
        'build',
        'style',
    ];
    if (!validTypes.includes(type))
        return null;
    return {
        type: type,
        scope: scope,
        message: msg,
        breaking: !!breaking || message.toLowerCase().includes('breaking'),
    };
}
/**
 * Fetch changelog from git commits between two versions
 */
function getChangelogFromGit(fromVersion, toVersion, debug) {
    var commits = [];
    try {
        // Try to fetch tags first
        try {
            (0, node_child_process_1.execSync)('git fetch --tags 2>/dev/null', { encoding: 'utf-8', stdio: 'pipe' });
        }
        catch (_a) {
            // Ignore fetch errors
        }
        // Format: hash|date|message
        var fromTag = "v".concat(fromVersion);
        var toTag = "v".concat(toVersion);
        if (debug) {
            console.log(chalk_1.default.gray("  Looking for commits between ".concat(fromTag, " and ").concat(toTag, "...")));
        }
        var result = void 0;
        try {
            result = (0, node_child_process_1.execSync)("git log ".concat(fromTag, "..").concat(toTag, " --pretty=format:\"%H|%ad|%s\" --date=short 2>/dev/null"), { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
        }
        catch (_b) {
            // Tags might not exist, try with HEAD
            if (debug) {
                console.log(chalk_1.default.gray("  Tags not found, trying alternative approach..."));
            }
            return commits;
        }
        var lines = result.trim().split('\n').filter(Boolean);
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var _c = line.split('|'), hash = _c[0], date = _c[1], messageParts = _c.slice(2);
            var message = messageParts.join('|');
            var parsed = parseConventionalCommit(message);
            if (!parsed)
                continue;
            // Skip docs, ci, test types for changelog display (they're less relevant for users)
            if (['docs', 'ci', 'test', 'build', 'style'].includes(parsed.type))
                continue;
            commits.push({
                hash: hash.slice(0, 7),
                type: parsed.type,
                scope: parsed.scope,
                message: parsed.message,
                breaking: parsed.breaking,
                date: date,
            });
        }
    }
    catch (err) {
        if (debug) {
            console.log(chalk_1.default.gray("  Could not fetch git history: ".concat(err)));
        }
    }
    return commits;
}
/**
 * Try to fetch changelog from GitHub releases API
 */
function getChangelogFromGitHub(fromVersion, toVersion, debug) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://api.github.com/repos/hanzogui/hanzogui/releases/tags/v".concat(toVersion), {
                            headers: {
                                Accept: 'application/vnd.github.v3+json',
                                'User-Agent': 'hanzogui-cli',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        if (debug) {
                            console.log(chalk_1.default.gray("  GitHub API returned ".concat(response.status)));
                        }
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_a.sent());
                    return [2 /*return*/, data.body || null];
                case 3:
                    err_1 = _a.sent();
                    if (debug) {
                        console.log(chalk_1.default.gray("  Could not fetch from GitHub: ".concat(err_1)));
                    }
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Format changelog for display
 */
function formatChangelog(commits) {
    if (commits.length === 0) {
        return chalk_1.default.gray('  No changes found');
    }
    // Group by type
    var grouped = new Map();
    for (var _i = 0, commits_1 = commits; _i < commits_1.length; _i++) {
        var commit = commits_1[_i];
        var existing = grouped.get(commit.type) || [];
        existing.push(commit);
        grouped.set(commit.type, existing);
    }
    // Sort by type order
    var sortedTypes = Array.from(grouped.keys()).sort(function (a, b) {
        var aIdx = COMMIT_TYPE_ORDER.indexOf(a);
        var bIdx = COMMIT_TYPE_ORDER.indexOf(b);
        return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
    });
    var lines = [];
    // Show breaking changes first
    var breakingChanges = commits.filter(function (c) { return c.breaking; });
    if (breakingChanges.length > 0) {
        lines.push('');
        lines.push(chalk_1.default.red.bold('  BREAKING CHANGES'));
        for (var _a = 0, breakingChanges_1 = breakingChanges; _a < breakingChanges_1.length; _a++) {
            var commit = breakingChanges_1[_a];
            var scope = commit.scope ? chalk_1.default.cyan("(".concat(commit.scope, ")")) : '';
            lines.push("    ".concat(chalk_1.default.red('!'), " ").concat(scope, " ").concat(commit.message, " ").concat(chalk_1.default.gray("(".concat(commit.hash, ")"))));
        }
    }
    var typeLabels = {
        feat: 'Features',
        fix: 'Bug Fixes',
        perf: 'Performance',
        refactor: 'Refactoring',
        docs: 'Documentation',
        chore: 'Maintenance',
        test: 'Tests',
        ci: 'CI',
    };
    var typeColors = {
        feat: chalk_1.default.green,
        fix: chalk_1.default.yellow,
        perf: chalk_1.default.magenta,
        refactor: chalk_1.default.blue,
        docs: chalk_1.default.gray,
        chore: chalk_1.default.gray,
        test: chalk_1.default.gray,
        ci: chalk_1.default.gray,
    };
    for (var _b = 0, sortedTypes_1 = sortedTypes; _b < sortedTypes_1.length; _b++) {
        var type = sortedTypes_1[_b];
        var typeCommits = grouped.get(type).filter(function (c) { return !c.breaking; });
        if (typeCommits.length === 0)
            continue;
        var label = typeLabels[type] || type;
        var color = typeColors[type] || chalk_1.default.white;
        lines.push('');
        lines.push(color.bold("  ".concat(label)));
        for (var _c = 0, typeCommits_1 = typeCommits; _c < typeCommits_1.length; _c++) {
            var commit = typeCommits_1[_c];
            var scope = commit.scope ? chalk_1.default.cyan("(".concat(commit.scope, ")")) : '';
            lines.push("    ".concat(chalk_1.default.gray('-'), " ").concat(scope, " ").concat(commit.message, " ").concat(chalk_1.default.gray("(".concat(commit.hash, ")"))));
        }
    }
    return lines.join('\n');
}
/**
 * Display package summary
 */
function displayPackageSummary(packages) {
    console.log('');
    console.log(chalk_1.default.bold('Found Hanzogui packages:'));
    console.log('');
    // Group by file path
    var byFile = new Map();
    for (var _i = 0, packages_1 = packages; _i < packages_1.length; _i++) {
        var pkg = packages_1[_i];
        var existing = byFile.get(pkg.filePath) || [];
        existing.push(pkg);
        byFile.set(pkg.filePath, existing);
    }
    // Track all versions for mismatch warning
    var allVersions = new Set(packages.map(function (p) { return p.version; }));
    for (var _a = 0, byFile_1 = byFile; _a < byFile_1.length; _a++) {
        var _b = byFile_1[_a], filePath = _b[0], pkgs = _b[1];
        var relativePath = filePath.replace(process.cwd(), '.').replace(/^\.\//, '');
        console.log(chalk_1.default.cyan("  ".concat(relativePath)));
        for (var _c = 0, pkgs_1 = pkgs; _c < pkgs_1.length; _c++) {
            var pkg = pkgs_1[_c];
            var versionDisplay = "".concat(pkg.versionSpecifier).concat(pkg.version);
            var depTypeLabel = pkg.depType === 'devDependencies'
                ? chalk_1.default.gray(' (dev)')
                : pkg.depType === 'peerDependencies'
                    ? chalk_1.default.gray(' (peer)')
                    : '';
            console.log("    ".concat(chalk_1.default.white(pkg.name), " ").concat(chalk_1.default.yellow(versionDisplay)).concat(depTypeLabel));
        }
        console.log('');
    }
    // Warn about version mismatches
    if (allVersions.size > 1) {
        console.log(chalk_1.default.yellow.bold('Warning: Version mismatch detected!'));
        console.log(chalk_1.default.yellow('  Found multiple versions:'));
        var _loop_1 = function (v) {
            var count = packages.filter(function (p) { return p.version === v; }).length;
            console.log(chalk_1.default.yellow("    - ".concat(v, " (").concat(count, " packages)")));
        };
        for (var _d = 0, allVersions_1 = allVersions; _d < allVersions_1.length; _d++) {
            var v = allVersions_1[_d];
            _loop_1(v);
        }
        console.log('');
    }
}
/**
 * Update package.json files with new version
 */
function updatePackages(packages, newVersion, dryRun) {
    // Group by file path
    var byFile = new Map();
    for (var _i = 0, packages_2 = packages; _i < packages_2.length; _i++) {
        var pkg = packages_2[_i];
        var existing = byFile.get(pkg.filePath) || [];
        existing.push(pkg);
        byFile.set(pkg.filePath, existing);
    }
    for (var _a = 0, byFile_2 = byFile; _a < byFile_2.length; _a++) {
        var _b = byFile_2[_a], filePath = _b[0], pkgs = _b[1];
        var content = (0, node_fs_1.readFileSync)(filePath, 'utf-8');
        var pkgJson = JSON.parse(content);
        for (var _c = 0, pkgs_2 = pkgs; _c < pkgs_2.length; _c++) {
            var pkg = pkgs_2[_c];
            var newVersionStr = "".concat(pkg.versionSpecifier).concat(newVersion);
            if (pkgJson[pkg.depType] && pkgJson[pkg.depType][pkg.name]) {
                pkgJson[pkg.depType][pkg.name] = newVersionStr;
            }
        }
        if (!dryRun) {
            (0, node_fs_1.writeFileSync)(filePath, JSON.stringify(pkgJson, null, 2) + '\n');
        }
        var relativePath = filePath.replace(process.cwd(), '.').replace(/^\.\//, '');
        console.log(chalk_1.default.green("  ".concat(dryRun ? '[dry-run] ' : '', "Updated ").concat(relativePath)));
    }
}
/**
 * Main upgrade function
 */
function upgrade() {
    return __awaiter(this, arguments, void 0, function (options) {
        var from, to, changelogOnly, dryRun, debug, root, packages, fromVersion, toVersion, commits, githubChangelog, lines, _i, lines_2, line;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    from = options.from, to = options.to, changelogOnly = options.changelogOnly, dryRun = options.dryRun, debug = options.debug;
                    root = process.cwd();
                    console.log('');
                    console.log(chalk_1.default.bold.blue('Hanzogui Upgrade'));
                    console.log('');
                    packages = findHanzoguiPackages(root);
                    if (packages.length === 0 && !changelogOnly) {
                        console.log(chalk_1.default.yellow('No Hanzogui packages found in this workspace.'));
                        return [2 /*return*/];
                    }
                    fromVersion = from;
                    toVersion = to;
                    if (!fromVersion && packages.length > 0) {
                        fromVersion = getCurrentVersion(packages) || undefined;
                    }
                    if (!!toVersion) return [3 /*break*/, 2];
                    console.log(chalk_1.default.gray('Fetching latest version from npm...'));
                    return [4 /*yield*/, getLatestVersion()];
                case 1:
                    toVersion = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!fromVersion) {
                        if (changelogOnly) {
                            console.log(chalk_1.default.red('Error: --from version is required when using --changelog-only without packages'));
                            process.exit(1);
                        }
                        fromVersion = toVersion;
                    }
                    console.log(chalk_1.default.gray("  Current version: ".concat(chalk_1.default.white(fromVersion))));
                    console.log(chalk_1.default.gray("  Target version:  ".concat(chalk_1.default.white(toVersion))));
                    console.log('');
                    // Show package summary (unless changelog only with no packages)
                    if (packages.length > 0 && !changelogOnly) {
                        displayPackageSummary(packages);
                    }
                    if (!(fromVersion !== toVersion)) return [3 /*break*/, 6];
                    console.log(chalk_1.default.bold('Changelog:'));
                    console.log(chalk_1.default.gray("  (".concat(fromVersion, " -> ").concat(toVersion, ")")));
                    commits = getChangelogFromGit(fromVersion, toVersion, debug);
                    if (!(commits.length > 0)) return [3 /*break*/, 3];
                    console.log(formatChangelog(commits));
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, getChangelogFromGitHub(fromVersion, toVersion, debug)];
                case 4:
                    githubChangelog = _a.sent();
                    if (githubChangelog) {
                        console.log('');
                        console.log(chalk_1.default.gray('  (from GitHub release notes)'));
                        lines = githubChangelog.split('\n').slice(0, 50) // Limit to 50 lines
                        ;
                        for (_i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
                            line = lines_2[_i];
                            console.log("  ".concat(line));
                        }
                        if (githubChangelog.split('\n').length > 50) {
                            console.log(chalk_1.default.gray('  ... (truncated, see full release notes on GitHub)'));
                        }
                    }
                    else {
                        console.log(chalk_1.default.gray('  No changelog available. Check https://github.com/hanzoai/gui/releases'));
                    }
                    _a.label = 5;
                case 5:
                    console.log('');
                    return [3 /*break*/, 7];
                case 6:
                    console.log(chalk_1.default.green('Already on the latest version!'));
                    return [2 /*return*/];
                case 7:
                    // Stop here if changelog only
                    if (changelogOnly) {
                        return [2 /*return*/];
                    }
                    // Perform upgrade
                    console.log(chalk_1.default.bold("Upgrading to ".concat(toVersion).concat(dryRun ? ' (dry run)' : '', ":")));
                    console.log('');
                    updatePackages(packages, toVersion, dryRun);
                    console.log('');
                    if (!dryRun) {
                        console.log(chalk_1.default.green.bold('Upgrade complete!'));
                        console.log('');
                        console.log(chalk_1.default.gray('Next steps:'));
                        console.log(chalk_1.default.gray('  1. Run your package manager install (npm install, yarn, pnpm install)'));
                        console.log(chalk_1.default.gray('  2. Review the changelog above for any breaking changes'));
                        console.log(chalk_1.default.gray('  3. Test your application'));
                    }
                    else {
                        console.log(chalk_1.default.yellow('Dry run complete. No files were modified.'));
                        console.log(chalk_1.default.gray('Remove --dry-run to perform the actual upgrade.'));
                    }
                    console.log('');
                    return [2 /*return*/];
            }
        });
    });
}
