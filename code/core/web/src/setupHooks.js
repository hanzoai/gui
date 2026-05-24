"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hooks = void 0;
exports.setupHooks = setupHooks;
exports.hooks = {};
// internal hooks setup
function setupHooks(next) {
    Object.assign(exports.hooks, next);
}
