"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectModuleFormat = detectModuleFormat;
exports.clearFormatCache = clearFormatCache;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
// cache per directory to avoid repeated fs reads
var formatCache = new Map();
function detectModuleFormat(filePath) {
    var ext = (0, node_path_1.extname)(filePath);
    // definitive by extension
    if (ext === '.mjs')
        return 'esm';
    if (ext === '.cjs')
        return 'cjs';
    // walk up to find nearest package.json with "type" field
    var dir = (0, node_path_1.dirname)(filePath);
    while (true) {
        if (formatCache.has(dir)) {
            return formatCache.get(dir);
        }
        try {
            var pkg = JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(dir, 'package.json'), 'utf-8'));
            var format = pkg.type === 'module' ? 'esm' : 'cjs';
            formatCache.set(dir, format);
            return format;
        }
        catch (_a) {
            // no package.json or malformed, keep walking
        }
        var parent_1 = (0, node_path_1.dirname)(dir);
        if (parent_1 === dir)
            break;
        dir = parent_1;
    }
    return 'cjs';
}
function clearFormatCache() {
    formatCache.clear();
}
