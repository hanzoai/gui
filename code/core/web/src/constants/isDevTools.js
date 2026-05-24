"use strict";
// for verbose logging outside node/cli
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevTools = void 0;
exports.isDevTools = (function () {
    if (process.env.NODE_ENV === 'development') {
        try {
            return new Function('try {return this===window;}catch(e){ return false;}')();
        }
        catch (_a) {
            //
        }
    }
    return false;
})();
