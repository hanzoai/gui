"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHanzoguiConfigPathFromOptionsConfig = getHanzoguiConfigPathFromOptionsConfig;
var node_path_1 = require("node:path");
var node_fs_1 = require("node:fs");
function getHanzoguiConfigPathFromOptionsConfig(config) {
    if ((0, node_path_1.isAbsolute)(config)) {
        return config;
    }
    var fullPath = (0, node_path_1.join)(process.cwd(), config);
    try {
        if ((0, node_fs_1.statSync)(fullPath).isFile()) {
            return fullPath;
        }
    }
    catch (_a) {
        //
    }
    return config;
}
