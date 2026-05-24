"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokens = createTokens;
var createVariables_1 = require("./createVariables");
function createTokens(tokens) {
    var _a;
    return (0, createVariables_1.createVariables)(tokens, (_a = process.env.TAMAGUI_TOKEN_PREFIX) !== null && _a !== void 0 ? _a : 't');
}
