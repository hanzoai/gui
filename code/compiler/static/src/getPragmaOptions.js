"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPragmaOptions = getPragmaOptions;
function getPragmaOptions(_a) {
    var _b, _c, _d;
    var source = _a.source, path = _a.path;
    var shouldPrintDebug = false;
    var shouldDisable = false;
    // try and avoid too much parsing but sometimes esbuild adds helpers above..
    var firstLines = source.slice(0, 800);
    var pragma = '';
    for (var _i = 0, _e = firstLines.split('\n'); _i < _e.length; _i++) {
        var line = _e[_i];
        var trimmed = line.trim();
        // only look at leading comments/empty lines, stop at first real code
        if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
            break;
        }
        pragma =
            ((_b = trimmed
                .match(/(\/\/|\/\*)\s?!?\s?(hanzogui-ignore|debug|debug-verbose)(\n|\s|$).*/)) === null || _b === void 0 ? void 0 : _b[2].trim()) || '';
        if (pragma) {
            pragma = pragma.replace('!', '').trim();
            break;
        }
    }
    switch (pragma) {
        case 'hanzogui-ignore':
            shouldDisable = true;
            break;
        case 'debug':
            shouldPrintDebug = true;
            break;
        case 'debug-verbose':
            shouldPrintDebug = 'verbose';
            break;
    }
    if (process.env.TAMAGUI_DEBUG_FILE) {
        if (path.includes(process.env.TAMAGUI_DEBUG_FILE)) {
            shouldPrintDebug = 'verbose';
        }
    }
    if ((_c = process.env.DEBUG) === null || _c === void 0 ? void 0 : _c.includes('hanzogui')) {
        shouldPrintDebug || (shouldPrintDebug = true);
    }
    if ((_d = process.env.DEBUG) === null || _d === void 0 ? void 0 : _d.includes('hanzogui-verbose')) {
        shouldPrintDebug = 'verbose';
    }
    return {
        shouldPrintDebug: shouldPrintDebug,
        shouldDisable: shouldDisable,
    };
}
