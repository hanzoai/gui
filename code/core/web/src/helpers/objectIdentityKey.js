"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectIdentityKey = objectIdentityKey;
function objectIdentityKey(obj) {
    var k = '';
    for (var key in obj) {
        k += key;
        var arg = obj[key];
        var type = typeof arg;
        if (!arg || (type !== 'object' && type !== 'function')) {
            k += type + arg;
        }
        else if (cache.has(arg)) {
            k += cache.get(arg);
        }
        else {
            var v = Math.random();
            cache.set(arg, v);
            k += v;
        }
    }
    return k;
}
var cache = new WeakMap();
