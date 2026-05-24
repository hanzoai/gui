"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEscapeKeydown = useEscapeKeydown;
// via radix-ui
var use_callback_ref_1 = require("@hanzogui/use-callback-ref");
var react_1 = require("react");
/**
 * Listens for when the escape key is down
 */
function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument) {
    if (ownerDocument === void 0) { ownerDocument = globalThis === null || globalThis === void 0 ? void 0 : globalThis.document; }
    var onEscapeKeyDown = (0, use_callback_ref_1.useCallbackRef)(onEscapeKeyDownProp);
    react_1.default.useEffect(function () {
        var handleKeyDown = function (event) {
            if (event.key === 'Escape') {
                onEscapeKeyDown(event);
            }
        };
        ownerDocument.addEventListener('keydown', 
        // @ts-expect-error
        handleKeyDown);
        return function () {
            ownerDocument.removeEventListener('keydown', 
            // @ts-expect-error
            handleKeyDown);
        };
    }, [onEscapeKeyDown, ownerDocument]);
}
