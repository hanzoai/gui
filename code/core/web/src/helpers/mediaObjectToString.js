"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaObjectToString = mediaObjectToString;
function camelToHyphen(str) {
    return str.replace(/[A-Z]/g, function (m) { return "-".concat(m.toLowerCase()); }).toLowerCase();
}
var cache = new WeakMap();
function mediaObjectToString(query) {
    if (typeof query === 'string') {
        return query;
    }
    if (cache.has(query)) {
        return cache.get(query);
    }
    var res = Object.entries(query)
        .map(function (_a) {
        var feature = _a[0], value = _a[1];
        feature = camelToHyphen(feature);
        if (typeof value === 'string') {
            return "(".concat(feature, ": ").concat(value, ")");
        }
        if (typeof value === 'number' && /[height|width]$/.test(feature)) {
            value = "".concat(value, "px");
        }
        return "(".concat(feature, ": ").concat(value, ")");
    })
        .join(' and ');
    cache.set(query, res);
    return res;
}
