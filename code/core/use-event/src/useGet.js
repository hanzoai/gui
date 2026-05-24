"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGet = useGet;
var React = require("react");
// useInsertionEffect ensures the ref is updated before any useLayoutEffect
// reads the returned callback — fixes a React 19 timing issue where a
// consumer's useLayoutEffect could fire before this ref update, causing stale
// values. Falls back to useLayoutEffect for React < 18.3. No SSR branch: SSR
// doesn't run layout effects, so the non-SSR path is correct everywhere.
var useIsomorphicInsertionEffect = React.useInsertionEffect || React.useLayoutEffect;
// keeps a reference to the current value easily
function useGet(currentValue, initialValue, forwardToFunction) {
    var curRef = React.useRef(initialValue !== null && initialValue !== void 0 ? initialValue : currentValue);
    useIsomorphicInsertionEffect(function () {
        curRef.current = currentValue;
    });
    return React.useCallback(forwardToFunction
        ? function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = curRef.current) === null || _a === void 0 ? void 0 : _a.apply(null, args);
        }
        : function () { return curRef.current; }, []);
}
