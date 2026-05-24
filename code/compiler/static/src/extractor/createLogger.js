"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = createLogger;
var node_path_1 = require("node:path");
var getPrefixLogs_1 = require("./getPrefixLogs");
function createLogger(sourcePath, options) {
    var _a;
    var shouldLogTiming = (_a = options.logTimings) !== null && _a !== void 0 ? _a : true;
    var start = Date.now();
    var mem = process.env.TAMAGUI_SHOW_MEMORY_USAGE && shouldLogTiming
        ? process.memoryUsage()
        : null;
    return function (res) {
        if (!shouldLogTiming) {
            return;
        }
        var memUsed = mem
            ? Math.round(((process.memoryUsage().heapUsed - mem.heapUsed) / 1024 / 1204) * 10) /
                10
            : 0;
        var path = (0, node_path_1.basename)(sourcePath || '')
            .replace(/\.[jt]sx?$/, '')
            .slice(0, 22)
            .trim()
            .padEnd(24);
        var numOptimized = "".concat(res.optimized + res.styled).padStart(3);
        var numFound = "".concat(res.found + res.styled).padStart(3);
        var numFlattened = "".concat(res.flattened).padStart(3);
        var memory = memUsed ? " ".concat(memUsed, "MB") : '';
        var timing = Date.now() - start;
        var timingStr = "".concat(timing, "ms").padStart(6);
        var pre = (0, getPrefixLogs_1.getPrefixLogs)(options);
        var memStr = memory ? "(".concat(memory, ")") : '';
        console.info("".concat(pre, " ").concat(path, "   \u00B7  ").concat(numFound, " found   \u00B7  ").concat(numOptimized, " opt   \u00B7  ").concat(numFlattened, " flat  ").concat(timingStr, " ").concat(memStr));
    };
}
