"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
var useMedia_1 = require("../hooks/useMedia");
function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (process.env.NODE_ENV === 'production')
        return;
    (0, useMedia_1._disableMediaTouch)(true);
    try {
        if (process.env.TAMAGUI_TARGET === 'web') {
            return console.info.apply(console, args);
        }
        // react native doesn't log in the cli unless it's log
        return console.log.apply(console, args);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        (0, useMedia_1._disableMediaTouch)(false);
    }
}
