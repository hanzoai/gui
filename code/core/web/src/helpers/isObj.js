"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObj = void 0;
var isObj = function (x) { return x && !Array.isArray(x) && typeof x === 'object'; };
exports.isObj = isObj;
