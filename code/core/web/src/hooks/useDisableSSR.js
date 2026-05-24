"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDisableSSR = getDisableSSR;
var config_1 = require("../config");
function getDisableSSR(componentContext) {
    var _a;
    return (_a = componentContext === null || componentContext === void 0 ? void 0 : componentContext.disableSSR) !== null && _a !== void 0 ? _a : (0, config_1.getSetting)('disableSSR');
}
