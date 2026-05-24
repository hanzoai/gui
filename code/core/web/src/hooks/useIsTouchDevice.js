"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsTouchDevice = void 0;
var constants_1 = require("@hanzogui/constants");
var use_did_finish_ssr_1 = require("@hanzogui/use-did-finish-ssr");
var useIsTouchDevice = function () {
    return !constants_1.isWeb ? true : (0, use_did_finish_ssr_1.useDidFinishSSR)() ? constants_1.isTouchable : false;
};
exports.useIsTouchDevice = useIsTouchDevice;
