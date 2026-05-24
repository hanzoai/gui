"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEvent = useEvent;
var useGet_1 = require("./useGet");
function useEvent(callback) {
    return (0, useGet_1.useGet)(callback, defaultValue, true);
}
var defaultValue = function () {
    throw new Error('Cannot call an event handler while rendering.');
};
