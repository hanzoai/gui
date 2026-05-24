"use strict";
/**
 * "license": "MIT",
  "author": "Bryan Mishkin",
 */
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
exports.CDVC = void 0;
var fast_glob_1 = require("fast-glob");
var js_yaml_1 = require("js-yaml");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
/**
 * Creates a map of each dependency in the workspace to an array of the packages it is used in.
 *
 * Example of such a map represented as an object:
 *
 * {
 *  'ember-cli': [
 *     { package: Package...'@scope/package1', version: '~3.18.0' },
 *     { package: Package...'@scope/package2', version: '~3.18.0' }
 *  ]
 *  'eslint': [
 *     { package: Package...'@scope/package1', version: '^7.0.0' },
 *     { package: Package...'@scope/package2', version: '^7.0.0' }
 *  ]
 * }
 */
function calculateVersionsForEachDependency(packages, depType) {
    if (depType === void 0) { depType = DEFAULT_DEP_TYPES; }
    var dependenciesToVersionsSeen = new Map();
    for (var _i = 0, packages_1 = packages; _i < packages_1.length; _i++) {
        var package_ = packages_1[_i];
        recordDependencyVersionsForPackageJson(dependenciesToVersionsSeen, package_, depType);
    }
    return dependenciesToVersionsSeen;
}
// eslint-disable-next-line complexity
function recordDependencyVersionsForPackageJson(dependenciesToVersionsSeen, package_, depType) {
    if (package_.packageJson.name && package_.packageJson.version) {
        recordDependencyVersion(dependenciesToVersionsSeen, package_.packageJson.name, package_.packageJson.version, package_, true);
    }
    if (depType.includes(DEPENDENCY_TYPE.dependencies) &&
        package_.packageJson.dependencies) {
        for (var _i = 0, _a = Object.entries(package_.packageJson.dependencies); _i < _a.length; _i++) {
            var _b = _a[_i], dependency = _b[0], dependencyVersion = _b[1];
            if (dependencyVersion) {
                recordDependencyVersion(dependenciesToVersionsSeen, dependency, dependencyVersion, package_);
            }
        }
    }
    if (depType.includes(DEPENDENCY_TYPE.devDependencies) &&
        package_.packageJson.devDependencies) {
        for (var _c = 0, _d = Object.entries(package_.packageJson.devDependencies); _c < _d.length; _c++) {
            var _e = _d[_c], dependency = _e[0], dependencyVersion = _e[1];
            if (dependencyVersion) {
                recordDependencyVersion(dependenciesToVersionsSeen, dependency, dependencyVersion, package_);
            }
        }
    }
    if (depType.includes(DEPENDENCY_TYPE.optionalDependencies) &&
        package_.packageJson.optionalDependencies) {
        for (var _f = 0, _g = Object.entries(package_.packageJson.optionalDependencies); _f < _g.length; _f++) {
            var _h = _g[_f], dependency = _h[0], dependencyVersion = _h[1];
            if (dependencyVersion) {
                recordDependencyVersion(dependenciesToVersionsSeen, dependency, dependencyVersion, package_);
            }
        }
    }
    if (depType.includes(DEPENDENCY_TYPE.peerDependencies) &&
        package_.packageJson.peerDependencies) {
        for (var _j = 0, _k = Object.entries(package_.packageJson.peerDependencies); _j < _k.length; _j++) {
            var _l = _k[_j], dependency = _l[0], dependencyVersion = _l[1];
            if (dependencyVersion) {
                recordDependencyVersion(dependenciesToVersionsSeen, dependency, dependencyVersion, package_);
            }
        }
    }
    if (depType.includes(DEPENDENCY_TYPE.resolutions) && package_.packageJson.resolutions) {
        for (var _m = 0, _o = Object.entries(package_.packageJson.resolutions); _m < _o.length; _m++) {
            var _p = _o[_m], dependency = _p[0], dependencyVersion = _p[1];
            if (dependencyVersion) {
                recordDependencyVersion(dependenciesToVersionsSeen, dependency, dependencyVersion, package_);
            }
        }
    }
}
function recordDependencyVersion(dependenciesToVersionsSeen, dependency, version, package_, isLocalPackageVersion) {
    if (isLocalPackageVersion === void 0) { isLocalPackageVersion = false; }
    if (!dependenciesToVersionsSeen.has(dependency)) {
        dependenciesToVersionsSeen.set(dependency, []);
    }
    var list = dependenciesToVersionsSeen.get(dependency);
    /* istanbul ignore if */
    if (list) {
        // `list` should always exist at this point, this if statement is just to please TypeScript.
        list.push({ package: package_, version: version, isLocalPackageVersion: isLocalPackageVersion });
    }
}
function calculateDependenciesAndVersions(dependencyVersions) {
    // Loop through all dependencies seen.
    return __spreadArray([], dependencyVersions.entries(), true).sort(function (a, b) { return a[0].localeCompare(b[0]); })
        .flatMap(function (_a) {
        var dependency = _a[0], versionObjectsForDep = _a[1];
        /* istanbul ignore if */
        if (!versionObjectsForDep) {
            // Should always exist at this point, this if statement is just to please TypeScript.
            return [];
        }
        // Check what versions we have seen for this dependency.
        var versions = versionObjectsForDep
            .filter(function (versionObject) { return !versionObject.isLocalPackageVersion; })
            .map(function (versionObject) { return versionObject.version; });
        // Check if this dependency is a local package.
        var localPackageVersions = versionObjectsForDep
            .filter(function (versionObject) { return versionObject.isLocalPackageVersion; })
            .map(function (versionObject) { return versionObject.version; });
        var allVersionsHaveWorkspacePrefix = versions.every(function (version) {
            return version.startsWith('workspace:');
        });
        var hasIncompatibilityWithLocalPackageVersion = versions.some(function (version) { return localPackageVersions[0] !== version; });
        if (localPackageVersions.length === 1 &&
            !allVersionsHaveWorkspacePrefix &&
            hasIncompatibilityWithLocalPackageVersion) {
            // If we saw a version for this dependency that isn't compatible with its actual local package version, add the local package version to the list of versions seen.
            // Note that using the `workspace:` prefix to refer to the local package version is allowed.
            versions = __spreadArray(__spreadArray([], versions, true), localPackageVersions, true);
        }
        // Calculate unique versions seen for this dependency.
        var uniqueVersions = __spreadArray([], new Set(versions), true);
        var uniqueVersionsWithInfo = versionsObjectsWithSortedPackages(uniqueVersions, versionObjectsForDep);
        return {
            dependency: dependency,
            versions: uniqueVersionsWithInfo,
        };
    });
}
function versionsObjectsWithSortedPackages(versions, versionObjects) {
    return versions.map(function (version) {
        var matchingVersionObjects = versionObjects.filter(function (versionObject) { return versionObject.version === version; });
        return {
            version: version,
            packages: matchingVersionObjects
                .map(function (object) { return object.package; })
                .sort(function (a, b) { return Package.comparator(a, b); }),
        };
    });
}
var HARDCODED_IGNORED_DEPENDENCIES = new Set([
    '//', // May be used to add comments to package.json files.
]);
function filterOutIgnoredDependencies(mismatchingVersions, ignoredDependencies, includedDependencyPatterns) {
    var _loop_1 = function (ignoreDependency) {
        if (!mismatchingVersions.some(function (mismatchingVersion) { return mismatchingVersion.dependency === ignoreDependency; })) {
            throw new Error("Specified option '--ignore-dep ".concat(ignoreDependency, "', but no version mismatches detected for this dependency."));
        }
    };
    for (var _i = 0, ignoredDependencies_1 = ignoredDependencies; _i < ignoredDependencies_1.length; _i++) {
        var ignoreDependency = ignoredDependencies_1[_i];
        _loop_1(ignoreDependency);
    }
    if (ignoredDependencies.length > 0 ||
        includedDependencyPatterns.length > 0 ||
        mismatchingVersions.some(function (mismatchingVersion) {
            return HARDCODED_IGNORED_DEPENDENCIES.has(mismatchingVersion.dependency);
        })) {
        return mismatchingVersions.filter(function (mismatchingVersion) {
            return !ignoredDependencies.includes(mismatchingVersion.dependency) &&
                includedDependencyPatterns.some(function (ignoreDependencyPattern) {
                    return mismatchingVersion.dependency.match(ignoreDependencyPattern);
                }) &&
                !HARDCODED_IGNORED_DEPENDENCIES.has(mismatchingVersion.dependency);
        });
    }
    return mismatchingVersions;
}
function getPackages(root, ignorePackages, ignorePackagePatterns, ignorePaths, ignorePathPatterns) {
    // Check for some error cases first.
    if (!Package.exists(root)) {
        throw new Error('No package.json found at provided path.');
    }
    var packages = accumulatePackages(root, ['.']);
    var _loop_2 = function (ignoredPackage) {
        if (!Package.some(packages, function (package_) { return package_.name === ignoredPackage; }) // eslint-disable-line unicorn/no-array-method-this-argument,unicorn/no-array-callback-reference -- false positive
        ) {
            throw new Error("Specified option '--ignore-package ".concat(ignoredPackage, "', but no such package detected in workspace."));
        }
    };
    for (var _i = 0, ignorePackages_1 = ignorePackages; _i < ignorePackages_1.length; _i++) {
        var ignoredPackage = ignorePackages_1[_i];
        _loop_2(ignoredPackage);
    }
    var _loop_3 = function (ignoredPackagePattern) {
        if (
        // eslint-disable-next-line unicorn/no-array-method-this-argument,unicorn/no-array-callback-reference -- false positive
        !Package.some(packages, function (package_) { return ignoredPackagePattern.test(package_.name); })) {
            throw new Error("Specified option '--ignore-package-pattern ".concat(String(ignoredPackagePattern), "', but no matching packages detected in workspace."));
        }
    };
    for (var _a = 0, ignorePackagePatterns_1 = ignorePackagePatterns; _a < ignorePackagePatterns_1.length; _a++) {
        var ignoredPackagePattern = ignorePackagePatterns_1[_a];
        _loop_3(ignoredPackagePattern);
    }
    var _loop_4 = function (ignoredPath) {
        if (
        // eslint-disable-next-line unicorn/no-array-method-this-argument,unicorn/no-array-callback-reference -- false positive
        !Package.some(packages, function (package_) { return package_.pathRelative.includes(ignoredPath); })) {
            throw new Error("Specified option '--ignore-path ".concat(ignoredPath, "', but no matching paths detected in workspace."));
        }
    };
    for (var _b = 0, ignorePaths_1 = ignorePaths; _b < ignorePaths_1.length; _b++) {
        var ignoredPath = ignorePaths_1[_b];
        _loop_4(ignoredPath);
    }
    var _loop_5 = function (ignoredPathPattern) {
        if (
        // eslint-disable-next-line unicorn/no-array-method-this-argument,unicorn/no-array-callback-reference -- false positive
        !Package.some(packages, function (package_) {
            return ignoredPathPattern.test(package_.pathRelative);
        })) {
            throw new Error("Specified option '--ignore-path-pattern ".concat(String(ignoredPathPattern), "', but no matching paths detected in workspace."));
        }
    };
    for (var _c = 0, ignorePathPatterns_1 = ignorePathPatterns; _c < ignorePathPatterns_1.length; _c++) {
        var ignoredPathPattern = ignorePathPatterns_1[_c];
        _loop_5(ignoredPathPattern);
    }
    if (ignorePackages.length > 0 ||
        ignorePackagePatterns.length > 0 ||
        ignorePaths.length > 0 ||
        ignorePathPatterns.length > 0) {
        return packages.filter(function (package_) {
            return !ignorePackages.includes(package_.name) &&
                !ignorePackagePatterns.some(function (ignorePackagePattern) {
                    return package_.name.match(ignorePackagePattern);
                }) &&
                !ignorePaths.some(function (ignorePath) { return package_.pathRelative.includes(ignorePath); }) &&
                !ignorePathPatterns.some(function (ignorePathPattern) {
                    return package_.pathRelative.match(ignorePathPattern);
                });
        });
    }
    return packages;
}
// Expand workspace globs into concrete paths.
function expandWorkspaces(root, workspacePatterns) {
    return workspacePatterns.flatMap(function (workspace) {
        if (!workspace.includes('*')) {
            return [workspace];
        }
        // Use cwd instead of passing join()'d paths to globby for Windows support: https://github.com/micromatch/micromatch/blob/34f44b4f57eacbdbcc74f64252e0845cf44bbdbd/README.md?plain=1#L822
        // Ignore any node_modules that may be present due to the use of nohoist.
        return (0, fast_glob_1.globSync)(workspace, {
            onlyDirectories: true,
            cwd: root,
            ignore: ['**/node_modules'],
        });
    });
}
// Recursively collect packages from a workspace.
function accumulatePackages(root, paths) {
    var results = [];
    for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
        var relativePath = paths_1[_i];
        var path = (0, node_path_1.join)(root, relativePath);
        if (Package.exists(path)) {
            var package_ = new Package(path, root);
            results.push.apply(results, __spreadArray([
                // Add the current package.
                package_], accumulatePackages(path, expandWorkspaces(path, package_.workspacePatterns)), false));
        }
    }
    return results;
}
/*
 * Class to represent all of the information we need to know about a package in a workspace.
 */
var Package = /** @class */ (function () {
    function Package(path, pathWorkspace) {
        this.path = path;
        this.pathWorkspace = pathWorkspace;
        // package.json
        this.pathPackageJson = (0, node_path_1.join)(path, 'package.json');
        var packageJsonContents = (0, node_fs_1.readFileSync)(this.pathPackageJson, 'utf8');
        this.packageJsonEndsInNewline = packageJsonContents.endsWith('\n');
        this.packageJson = JSON.parse(packageJsonContents);
        // pnpm-workspace.yaml
        var pnpmWorkspacePath = (0, node_path_1.join)(path, 'pnpm-workspace.yaml');
        if ((0, node_fs_1.existsSync)(pnpmWorkspacePath)) {
            var pnpmWorkspaceContents = (0, node_fs_1.readFileSync)(pnpmWorkspacePath, 'utf8');
            var pnpmWorkspaceYaml = (0, js_yaml_1.load)(pnpmWorkspaceContents);
            this.pnpmWorkspacePackages = pnpmWorkspaceYaml.packages;
        }
    }
    Object.defineProperty(Package.prototype, "name", {
        get: function () {
            if (this.workspacePatterns.length > 0 && !this.packageJson.name) {
                return '(Root)';
            }
            if (!this.packageJson.name) {
                throw new Error("".concat(this.pathPackageJson, " missing `name`"));
            }
            return this.packageJson.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "pathRelative", {
        /** Relative to workspace root. */
        get: function () {
            return (0, node_path_1.relative)(this.pathWorkspace, this.path);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "workspacePatterns", {
        get: function () {
            if (this.packageJson.workspaces) {
                if (Array.isArray(this.packageJson.workspaces)) {
                    return this.packageJson.workspaces;
                }
                else if (this.packageJson.workspaces.packages) {
                    if (!Array.isArray(this.packageJson.workspaces.packages)) {
                        throw new TypeError('package.json `workspaces.packages` is not a string array.');
                    }
                    return this.packageJson.workspaces.packages;
                }
                else {
                    throw new TypeError('package.json `workspaces` is not a string array.');
                }
            }
            if (this.pnpmWorkspacePackages) {
                if (!Array.isArray(this.pnpmWorkspacePackages)) {
                    throw new TypeError('pnpm-workspace.yaml `packages` is not a string array.');
                }
                return this.pnpmWorkspacePackages;
            }
            return [];
        },
        enumerable: false,
        configurable: true
    });
    Package.exists = function (path) {
        var packageJsonPath = (0, node_path_1.join)(path, 'package.json');
        return (0, node_fs_1.existsSync)(packageJsonPath);
    };
    Package.some = function (packages, callback) {
        return packages.some(function (package_) { return callback(package_); });
    };
    Package.comparator = function (package1, package2) {
        return package1.name.localeCompare(package2.name);
    };
    return Package;
}());
var DEPENDENCY_TYPE;
(function (DEPENDENCY_TYPE) {
    DEPENDENCY_TYPE["dependencies"] = "dependencies";
    DEPENDENCY_TYPE["devDependencies"] = "devDependencies";
    DEPENDENCY_TYPE["optionalDependencies"] = "optionalDependencies";
    DEPENDENCY_TYPE["peerDependencies"] = "peerDependencies";
    DEPENDENCY_TYPE["resolutions"] = "resolutions";
})(DEPENDENCY_TYPE || (DEPENDENCY_TYPE = {}));
var DEFAULT_DEP_TYPES = [
    DEPENDENCY_TYPE.dependencies,
    DEPENDENCY_TYPE.devDependencies,
    DEPENDENCY_TYPE.optionalDependencies,
    DEPENDENCY_TYPE.resolutions,
    // peerDependencies is not included by default, see discussion in: https://github.com/bmish/check-dependency-version-consistency/issues/402
];
/**
 * Checks for inconsistencies across a workspace. Optionally fixes them.
 * @param path - path to the workspace root
 * @param options
 * @param options.depType - Dependency type(s) to check
 * @param options.fix - Whether to autofix inconsistencies (using latest version present)
 * @param options.ignoreDep - Dependency(s) to ignore mismatches for
 * @param options.includeDepPattern - RegExp(s) of dependency names to ignore mismatches for
 * @param options.ignorePackage - Workspace package(s) to ignore mismatches for
 * @param options.ignorePackagePattern - RegExp(s) of package names to ignore mismatches for
 * @param options.ignorePath - Workspace-relative path(s) of packages to ignore mismatches for
 * @param options.ignorePathPattern - RegExp(s) of workspace-relative path of packages to ignore mismatches for
 * @returns an object with the following properties:
 * - `dependencies`: An object mapping each dependency in the workspace to information about it including the versions found of it.
 */
function check(path) {
    var options = {
        includeDepPattern: ['hanzogui', 'react-native-web-lite', 'react-native-web-internals'],
    };
    if (options &&
        options.depType &&
        options.depType.some(function (dt) { return !Object.keys(DEPENDENCY_TYPE).includes(dt); })) {
        throw new Error("Invalid depType provided. Choices are: ".concat(Object.keys(DEPENDENCY_TYPE).join(', '), "."));
    }
    var optionsWithDefaults = __assign(__assign({ fix: false, ignoreDep: [], includeDepPattern: [], ignorePackage: [], ignorePackagePattern: [], ignorePath: [], ignorePathPattern: [] }, options), { 
        // Fallback to default if no depType(s) provided.
        depType: options && options.depType && options.depType.length > 0
            ? options.depType
            : DEFAULT_DEP_TYPES });
    // Calculate.
    var packages = getPackages(path, optionsWithDefaults.ignorePackage, optionsWithDefaults.ignorePackagePattern.map(function (s) { return new RegExp(s); }), optionsWithDefaults.ignorePath, optionsWithDefaults.ignorePathPattern.map(function (s) { return new RegExp(s); }));
    var dependencies = calculateVersionsForEachDependency(packages, optionsWithDefaults.depType.map(function (dt) { return DEPENDENCY_TYPE[dt]; }) // Convert string to enum.
    );
    var dependenciesAndVersions = calculateDependenciesAndVersions(dependencies);
    var dependenciesAndVersionsWithMismatches = dependenciesAndVersions.filter(function (_a) {
        var versions = _a.versions;
        return versions.length > 1;
    });
    // Information about all dependencies.
    var dependenciesAndVersionsWithoutIgnored = filterOutIgnoredDependencies(dependenciesAndVersions, optionsWithDefaults.ignoreDep, optionsWithDefaults.includeDepPattern.map(function (s) { return new RegExp(s); }));
    // Information about mismatches.
    var dependenciesAndVersionsMismatchesWithoutIgnored = filterOutIgnoredDependencies(dependenciesAndVersionsWithMismatches, optionsWithDefaults.ignoreDep, optionsWithDefaults.includeDepPattern.map(function (s) { return new RegExp(s); }));
    return {
        // Information about all dependencies.
        dependencies: Object.fromEntries(dependenciesAndVersionsWithoutIgnored.map(function (_a) {
            var dependency = _a.dependency, versions = _a.versions;
            return [
                dependency,
                {
                    isMismatching: dependenciesAndVersionsMismatchesWithoutIgnored.some(function (dep) { return dep.dependency === dependency; }),
                    versions: versions,
                },
            ];
        })),
    };
}
var CDVC = /** @class */ (function () {
    /**
     * @param path - path to the workspace root
     * @param options
     * @param options.fix - Whether to autofix inconsistencies (using latest version present)
     * @param options.ignoreDep - Dependency(s) to ignore mismatches for
     * @param options.includeDepPattern - RegExp(s) of dependency names to ignore mismatches for
     * @param options.ignorePackage - Workspace package(s) to ignore mismatches for
     * @param options.ignorePackagePattern - RegExp(s) of package names to ignore mismatches for
     * @param options.ignorePath - Workspace-relative path(s) of packages to ignore mismatches for
     * @param options.ignorePathPattern - RegExp(s) of workspace-relative path of packages to ignore mismatches for
     */
    function CDVC(path) {
        var dependencies = check(path).dependencies;
        this.dependencies = dependencies;
    }
    CDVC.prototype.toMismatchSummary = function () {
        return dependenciesToMismatchSummary(this.dependencies);
    };
    CDVC.prototype.getDependencies = function () {
        var _this = this;
        return Object.keys(this.dependencies).map(function (dependency) {
            return _this.getDependency(dependency);
        });
    };
    CDVC.prototype.getDependency = function (name) {
        // Convert underlying dependency data object with relevant public data.
        return {
            name: name,
            isMismatching: this.dependencies[name].isMismatching,
            versions: this.dependencies[name].versions.map(function (version) { return ({
                version: version.version,
                packages: version.packages.map(function (package_) { return ({
                    pathRelative: package_.pathRelative,
                }); }),
            }); }),
        };
    };
    Object.defineProperty(CDVC.prototype, "hasMismatchingDependencies", {
        get: function () {
            return Object.values(this.dependencies).some(function (dep) { return dep.isMismatching; });
        },
        enumerable: false,
        configurable: true
    });
    return CDVC;
}());
exports.CDVC = CDVC;
function dependenciesToMismatchSummary(dependencies) {
    var mismatchingDependencyVersions = Object.entries(dependencies)
        .filter(function (_a) {
        var value = _a[1];
        return value.isMismatching;
    })
        .map(function (_a) {
        var dependency = _a[0], value = _a[1];
        return ({ dependency: dependency, versions: value.versions });
    });
    if (mismatchingDependencyVersions.length === 0) {
        return '';
    }
    var tables = mismatchingDependencyVersions
        .map(function (object) {
        return "".concat(object.dependency, " - ").concat(object.versions.map(function (v) { return "".concat(v.version); }).join(', '));
    })
        .join('');
    return [
        "Found ".concat(mismatchingDependencyVersions.length, " ").concat(mismatchingDependencyVersions.length === 1 ? 'dependency' : 'dependencies', " with mismatching versions across the workspace."),
        tables,
    ].join('\n');
}
