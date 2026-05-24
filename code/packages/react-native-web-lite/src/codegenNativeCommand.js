"use strict";
// compat with bad imports in native
Object.defineProperty(exports, "__esModule", { value: true });
exports.codegenNativeCommand = codegenNativeCommand;
function codegenNativeCommand() {
    console.warn("codegenNativeCommand on web is a no-op");
    return {};
}
