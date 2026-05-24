"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postfixObjKeys = postfixObjKeys;
exports.sizeToSpace = sizeToSpace;
exports.objectFromEntries = objectFromEntries;
exports.objectKeys = objectKeys;
function postfixObjKeys(obj, postfix) {
    return Object.fromEntries(Object.entries(obj).map(function (_a) {
        var k = _a[0], v = _a[1];
        return ["".concat(k).concat(postfix), v];
    }));
}
// a bit odd but keeping backward compat for values >8 while fixing below
function sizeToSpace(v) {
    if (v === 0)
        return 0;
    if (v === 2)
        return 0.5;
    if (v === 4)
        return 1;
    if (v === 8)
        return 1.5;
    if (v <= 16)
        return Math.round(v * 0.333);
    return Math.floor(v * 0.7 - 12);
}
function objectFromEntries(arr) {
    return Object.fromEntries(arr);
}
function objectKeys(obj) {
    return Object.keys(obj);
}
