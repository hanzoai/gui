"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePresence = usePresence;
exports.useIsPresent = useIsPresent;
exports.isPresent = isPresent;
var React = require("react");
var PresenceContext_1 = require("./PresenceContext");
function usePresence() {
    var context = React.useContext(PresenceContext_1.PresenceContext);
    if (!context) {
        return [true, null, context];
    }
    var id = context.id, isPresent = context.isPresent, onExitComplete = context.onExitComplete, register = context.register;
    React.useEffect(function () { return register(id); }, []);
    var safeToRemove = function () { return onExitComplete === null || onExitComplete === void 0 ? void 0 : onExitComplete(id); };
    return !isPresent && onExitComplete
        ? [false, safeToRemove, context]
        : [true, undefined, context];
}
/**
 * Similar to `usePresence`, except `useIsPresent` simply returns whether or not the component is present.
 * There is no `safeToRemove` function.
 */
function useIsPresent() {
    return isPresent(React.useContext(PresenceContext_1.PresenceContext));
}
function isPresent(context) {
    return context === null ? true : context.isPresent;
}
