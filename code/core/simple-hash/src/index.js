"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleHash = void 0;
var cache = new Map();
var cacheSize = 0;
var simpleHash = function (strIn, hashMin) {
    if (hashMin === void 0) { hashMin = 10; }
    if (cache.has(strIn)) {
        return cache.get(strIn);
    }
    var str = strIn;
    // remove var()
    if (str[0] === 'v' && str.startsWith('var(')) {
        str = str.slice(6, str.length - 1);
    }
    var hash = 0;
    var valids = '';
    var added = 0;
    var len = str.length;
    for (var i = 0; i < len; i++) {
        if (hashMin !== 'strict' && added <= hashMin) {
            var char = str.charCodeAt(i);
            if (char === 46) {
                valids += '--';
                continue;
            }
            if (isValidCSSCharCode(char)) {
                added++;
                valids += str[i];
                continue;
            }
        }
        hash = hashChar(hash, str[i]);
    }
    var res = valids + (hash ? Math.abs(hash) : '');
    if (cacheSize > 10000) {
        cache.clear();
        cacheSize = 0;
    }
    cache.set(strIn, res);
    cacheSize++;
    return res;
};
exports.simpleHash = simpleHash;
var hashChar = function (hash, c) { return (Math.imul(31, hash) + c.charCodeAt(0)) | 0; };
function isValidCSSCharCode(code) {
    return (
    // A-Z
    (code >= 65 && code <= 90) ||
        // a-z
        (code >= 97 && code <= 122) ||
        // _
        code === 95 ||
        // -
        code === 45 ||
        // 0-9
        (code >= 48 && code <= 57));
}
