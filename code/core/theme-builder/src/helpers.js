"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectKeys = void 0;
exports.objectEntries = objectEntries;
exports.objectFromEntries = objectFromEntries;
var objectKeys = function (obj) { return Object.keys(obj); };
exports.objectKeys = objectKeys;
function objectEntries(obj) {
    return Object.entries(obj);
}
function objectFromEntries(arr) {
    return Object.fromEntries(arr);
}
