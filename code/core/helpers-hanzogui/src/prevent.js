"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prevent = void 0;
var prevent = function (e) { return [e.preventDefault(), e.stopPropagation()]; };
exports.prevent = prevent;
