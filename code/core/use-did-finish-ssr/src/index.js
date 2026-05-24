"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsClientOnly = exports.ClientOnlyContext = exports.ClientOnly = void 0;
exports.useDidFinishSSR = useDidFinishSSR;
exports.useClientValue = useClientValue;
var React = require("react");
var ClientOnly_1 = require("./ClientOnly");
var ClientOnly_2 = require("./ClientOnly");
Object.defineProperty(exports, "ClientOnly", { enumerable: true, get: function () { return ClientOnly_2.ClientOnly; } });
Object.defineProperty(exports, "ClientOnlyContext", { enumerable: true, get: function () { return ClientOnly_2.ClientOnlyContext; } });
var useIsClientOnly = function () {
    return React.useContext(ClientOnly_1.ClientOnlyContext);
};
exports.useIsClientOnly = useIsClientOnly;
function useDidFinishSSR() {
    var clientOnly = React.useContext(ClientOnly_1.ClientOnlyContext);
    if (clientOnly || process.env.TAMAGUI_TARGET === 'native') {
        return true;
    }
    return React.useSyncExternalStore(subscribe, function () { return true; }, function () { return false; });
}
var subscribe = function () { return function () { }; };
function useClientValue(value) {
    var done = useDidFinishSSR();
    // @ts-expect-error this is fine but started to error in ts latest
    return !done ? undefined : typeof value === 'function' ? value() : value;
}
