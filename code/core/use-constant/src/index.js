"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConstant = useConstant;
var React = require("react");
function useConstant(fn) {
    // RSC compat
    if (typeof document === 'undefined') {
        return React.useMemo(function () { return fn(); }, []);
    }
    var ref = React.useRef(undefined);
    if (!ref.current) {
        ref.current = { v: fn() };
    }
    return ref.current.v;
}
