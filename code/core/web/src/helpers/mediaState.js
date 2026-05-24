"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaKeys = exports.getMedia = exports.mediaQueryConfig = exports.setMediaState = exports.mediaState = void 0;
exports.mediaState = 
// development only safeguard
process.env.NODE_ENV === 'development'
    ? new Proxy({}, {
        get: function (target, key) {
            if (typeof key === 'string' &&
                key[0] === '$' &&
                // dont error on $$typeof
                key[1] !== '$') {
                throw new Error("Access mediaState should not use \"$\": ".concat(key));
            }
            return Reflect.get(target, key);
        },
    })
    : {};
var setMediaState = function (next) {
    exports.mediaState = next;
};
exports.setMediaState = setMediaState;
exports.mediaQueryConfig = {};
var getMedia = function () { return exports.mediaState; };
exports.getMedia = getMedia;
exports.mediaKeys = new Set(); // with $ prefix
