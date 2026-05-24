"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchMedia = void 0;
var mediaQueryList_1 = require("./mediaQueryList");
var matchMedia = function (query) {
    return new mediaQueryList_1.NativeMediaQueryList(query);
};
exports.matchMedia = matchMedia;
