"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyThemeVariables = proxyThemeVariables;
function proxyThemeVariables(obj) {
    return new Proxy(obj || {}, {
        has: function (target, key) {
            return Reflect.has(target, removeStarting$(key));
        },
        get: function (target, key) {
            return Reflect.get(target, removeStarting$(key));
        },
    });
}
var removeStarting$ = function (str) {
    return typeof str === 'string' && str[0] === '$' ? str.slice(1) : str;
};
