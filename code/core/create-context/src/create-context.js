"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = createContext;
exports.createContextScope = createContextScope;
var jsx_runtime_1 = require("react/jsx-runtime");
// from radix
// https://github.com/radix-ui/primitives/blob/main/packages/react/context/src/createContext.tsx
var React = require("react");
function createContext(rootComponentName, defaultContext) {
    var Context = React.createContext(defaultContext);
    function Provider(props) {
        var children = props.children, context = __rest(props
        // Only re-memoize when prop values change
        , ["children"]);
        // Only re-memoize when prop values change
        var value = React.useMemo(function () { return context; }, Object.values(context));
        return (0, jsx_runtime_1.jsx)(Context.Provider, { value: value, children: children });
    }
    function useContext(consumerName) {
        var context = React.useContext(Context);
        if (context)
            return context;
        if (defaultContext !== undefined)
            return defaultContext;
        // if a defaultContext wasn't specified, it's a required context.
        throw new Error("`".concat(consumerName, "` must be used within `").concat(rootComponentName, "`"));
    }
    return [Provider, useContext];
}
function createContextScope(scopeName, createContextScopeDeps) {
    if (createContextScopeDeps === void 0) { createContextScopeDeps = []; }
    var defaultContexts = [];
    /* -----------------------------------------------------------------------------------------------
     * createContext
     * ---------------------------------------------------------------------------------------------*/
    function createContext(rootComponentName, defaultContext) {
        var BaseContext = React.createContext(defaultContext);
        var index = defaultContexts.length;
        defaultContexts = __spreadArray(__spreadArray([], defaultContexts, true), [defaultContext], false);
        function Provider(props) {
            var _a;
            var scope = props.scope, children = props.children, context = __rest(props, ["scope", "children"]);
            var Context = ((_a = scope === null || scope === void 0 ? void 0 : scope[scopeName]) === null || _a === void 0 ? void 0 : _a[index]) || BaseContext;
            // Only re-memoize when prop values change
            var value = React.useMemo(function () { return context; }, Object.values(context));
            return (0, jsx_runtime_1.jsx)(Context.Provider, { value: value, children: children });
        }
        function useContext(consumerName, scope, options) {
            var _a;
            var Context = ((_a = scope === null || scope === void 0 ? void 0 : scope[scopeName]) === null || _a === void 0 ? void 0 : _a[index]) || BaseContext;
            var context = React.useContext(Context);
            if (context)
                return context;
            // if a defaultContext wasn't specified, it's a required context.
            if (defaultContext !== undefined)
                return defaultContext;
            var missingContextMessage = "`".concat(consumerName, "` must be used within `").concat(rootComponentName, "`");
            // fallback can be given per-hook as well
            if (options === null || options === void 0 ? void 0 : options.fallback) {
                if ((options === null || options === void 0 ? void 0 : options.warn) !== false) {
                    console.warn(missingContextMessage);
                }
                return options.fallback;
            }
            throw new Error(missingContextMessage);
        }
        return [Provider, useContext];
    }
    /* -----------------------------------------------------------------------------------------------
     * createScope
     * ---------------------------------------------------------------------------------------------*/
    var createScope = function () {
        var scopeContexts = defaultContexts.map(function (defaultContext) {
            return React.createContext(defaultContext);
        });
        return function useScope(scope) {
            var contexts = (scope === null || scope === void 0 ? void 0 : scope[scopeName]) || scopeContexts;
            return React.useMemo(function () {
                var _a, _b;
                return (_a = {}, _a["__scope".concat(scopeName)] = __assign(__assign({}, scope), (_b = {}, _b[scopeName] = contexts, _b)), _a);
            }, [scope, contexts]);
        };
    };
    createScope.scopeName = scopeName;
    return [
        createContext,
        composeContextScopes.apply(void 0, __spreadArray([createScope], createContextScopeDeps, false)),
    ];
}
/* -------------------------------------------------------------------------------------------------
 * composeContextScopes
 * -----------------------------------------------------------------------------------------------*/
function composeContextScopes() {
    var scopes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        scopes[_i] = arguments[_i];
    }
    var baseScope = scopes[0];
    if (scopes.length === 1)
        return baseScope;
    var createScope = function () {
        var scopeHooks = scopes.map(function (createScope) { return ({
            useScope: createScope(),
            scopeName: createScope.scopeName,
        }); });
        return function useComposedScopes(overrideScopes) {
            var nextScopes = scopeHooks.reduce(function (nextScopes, _a) {
                // We are calling a hook inside a callback which React warns against to avoid inconsistent
                // renders, however, scoping doesn't have render side effects so we ignore the rule.
                var useScope = _a.useScope, scopeName = _a.scopeName;
                var scopeProps = useScope(overrideScopes);
                var currentScope = scopeProps["__scope".concat(scopeName)];
                return __assign(__assign({}, nextScopes), currentScope);
            }, {});
            return React.useMemo(function () {
                var _a;
                return (_a = {}, _a["__scope".concat(baseScope.scopeName)] = nextScopes, _a);
            }, [nextScopes]);
        };
    };
    createScope.scopeName = baseScope.scopeName;
    return createScope;
}
