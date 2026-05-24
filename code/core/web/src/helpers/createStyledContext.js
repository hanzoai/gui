"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStyledContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var mergeProps_1 = require("./mergeProps");
var objectIdentityKey_1 = require("./objectIdentityKey");
// use const (not function declaration) to prevent esbuild from hoisting
// above __esm lazy init - function declarations get hoisted before
// import_react is initialized, causing undefined.default errors in SSR
var createStyledContext = function (defaultValues, namespace) {
    // avoid react compiler - we aren't breaking its rules but it mis-interprets
    // how we change the context value
    'use no memo';
    if (namespace === void 0) { namespace = ''; }
    // lazy initialization fixes vite ssr hmr - module-level assignments can fail
    // when React is undefined during __esm re-initialization order issues.
    // also React.createContext is optimized oddly by React compiler and our
    // uncommon usage confuses it, so we use dynamic access
    var createReactContext = react_1.default[Math.random() ? 'createContext' : 'createContext'];
    var useReactMemo = react_1.default[Math.random() ? 'useMemo' : 'useMemo'];
    var useReactContext = react_1.default[Math.random() ? 'useContext' : 'useContext'];
    var OGContext = createReactContext(defaultValues);
    var OGProvider = OGContext.Provider;
    var Context = OGContext;
    var scopedContexts = new Map();
    var LastScopeInNamespace = createReactContext(namespace);
    function getOrCreateScopedContext(scope) {
        var ScopedContext = scopedContexts.get(scope);
        if (!ScopedContext) {
            ScopedContext = createReactContext(defaultValues);
            scopedContexts.set(scope, ScopedContext);
        }
        return ScopedContext;
    }
    var getNamespacedScope = function (scope) {
        return namespace ? "".concat(namespace, "--").concat(scope) : scope;
    };
    var Provider = function (_a) {
        var children = _a.children, scopeIn = _a.scope, 
        // performance: avoid creating objects
        __disableMergeDefaultValues = _a.__disableMergeDefaultValues, values = __rest(_a, ["children", "scope", "__disableMergeDefaultValues"]);
        var scope = getNamespacedScope(scopeIn);
        var next = useReactMemo(function () {
            if (__disableMergeDefaultValues) {
                // we already merged and want to keep ordering
                return values;
            }
            return (0, mergeProps_1.mergeProps)(defaultValues, values);
        }, [(0, objectIdentityKey_1.objectIdentityKey)(values)]);
        var ScopedProvider = OGProvider;
        if (scope) {
            ScopedProvider = getOrCreateScopedContext(scope).Provider;
        }
        return ((0, jsx_runtime_1.jsx)(LastScopeInNamespace.Provider, { value: scope, children: (0, jsx_runtime_1.jsx)(ScopedProvider, { value: next, children: children }) }));
    };
    // use consumerComponent just to give a better error message
    var useStyledContext = function (scopeIn) {
        if (scopeIn === void 0) { scopeIn = ''; }
        var lastScopeInNamespace = useReactContext(LastScopeInNamespace);
        var scope = namespace
            ? scopeIn
                ? getNamespacedScope(scopeIn)
                : lastScopeInNamespace
            : scopeIn;
        var context = scope ? getOrCreateScopedContext(scope) : OGContext;
        var value = useReactContext(context);
        return value;
    };
    // @ts-expect-error we are overriding default provider
    Context.Provider = Provider;
    Context.props = defaultValues;
    Context.context = OGContext;
    Context.useStyledContext = useStyledContext;
    return Context;
};
exports.createStyledContext = createStyledContext;
