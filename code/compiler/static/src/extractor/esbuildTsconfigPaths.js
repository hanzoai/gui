"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsconfigPathsPlugin = TsconfigPathsPlugin;
exports.loadCompilerOptionsFromTsconfig = loadCompilerOptionsFromTsconfig;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var typescript_1 = require("typescript");
var name = 'tsconfig-paths';
function TsconfigPathsPlugin() {
    var compilerOptions = loadCompilerOptionsFromTsconfig();
    return {
        name: name,
        setup: function (_a) {
            var onResolve = _a.onResolve;
            onResolve({ filter: /.*/ }, function (args) {
                // skip @hanzogui packages - they should be externalized, not resolved via tsconfig
                if (args.path.startsWith('@hanzogui/')) {
                    return null;
                }
                var paths = compilerOptions.paths || {};
                var hasMatchingPath = Object.keys(paths).some(function (p) {
                    return new RegExp(p.replace('*', '\\w*')).test(args.path);
                });
                if (!hasMatchingPath) {
                    return null;
                }
                var resolvedModule = (0, typescript_1.nodeModuleNameResolver)(args.path, args.importer, compilerOptions, typescript_1.sys).resolvedModule;
                if (!resolvedModule) {
                    return null;
                }
                var resolvedFileName = resolvedModule.resolvedFileName;
                if (!resolvedFileName || resolvedFileName.endsWith('.d.ts')) {
                    return null;
                }
                return {
                    path: resolvedFileName,
                };
            });
        },
    };
}
function loadCompilerOptionsFromTsconfig(tsconfig) {
    if (!tsconfig) {
        var configPath = (0, typescript_1.findConfigFile)(process.cwd(), typescript_1.sys.fileExists, 'tsconfig.json') ||
            (0, typescript_1.findConfigFile)(process.cwd(), typescript_1.sys.fileExists, 'jsconfig.json');
        if (configPath) {
            return parseTsconfig(configPath);
        }
        return {};
    }
    if (typeof tsconfig === 'string') {
        if (node_fs_1.default.existsSync(tsconfig)) {
            return parseTsconfig(tsconfig);
        }
        else {
            throw new Error("Specified tsconfig file not found: ".concat(tsconfig));
        }
    }
    var baseDir = process.cwd();
    var parsed = (0, typescript_1.parseJsonConfigFileContent)(tsconfig, typescript_1.sys, baseDir);
    return parsed.options;
}
function parseTsconfig(configFilePath) {
    var configFile = (0, typescript_1.readConfigFile)(configFilePath, typescript_1.sys.readFile);
    if (configFile.error) {
        throw new Error("Error reading tsconfig file '".concat(configFilePath, "': ").concat(configFile.error.messageText));
    }
    var baseDir = node_path_1.default.dirname(configFilePath);
    var parsed = (0, typescript_1.parseJsonConfigFileContent)(configFile.config, typescript_1.sys, baseDir);
    return parsed.options;
}
