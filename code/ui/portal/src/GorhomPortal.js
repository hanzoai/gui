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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalHost = exports.PortalProvider = exports.usePortal = exports.INITIAL_STATE = exports.ACTIONS = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// from https://github.com/gorhom/react-native-portal
// MIT License Copyright (c) 2020 Mo Gorhom
// fixing SSR issue
var constants_1 = require("@hanzogui/constants");
var native_1 = require("@hanzogui/native");
var start_transition_1 = require("@hanzogui/start-transition");
var react_1 = require("react");
var constants_2 = require("./constants");
var ACTIONS;
(function (ACTIONS) {
    ACTIONS[ACTIONS["REGISTER_HOST"] = 0] = "REGISTER_HOST";
    ACTIONS[ACTIONS["DEREGISTER_HOST"] = 1] = "DEREGISTER_HOST";
    ACTIONS[ACTIONS["ADD_UPDATE_PORTAL"] = 2] = "ADD_UPDATE_PORTAL";
    ACTIONS[ACTIONS["REMOVE_PORTAL"] = 3] = "REMOVE_PORTAL";
})(ACTIONS || (exports.ACTIONS = ACTIONS = {}));
var INITIAL_STATE = {};
exports.INITIAL_STATE = INITIAL_STATE;
var registerHost = function (state, hostName) {
    if (!(hostName in state)) {
        state[hostName] = [];
    }
    return state;
};
var deregisterHost = function (state, hostName) {
    delete state[hostName];
    return state;
};
var addUpdatePortal = function (state, hostName, portalName, node) {
    if (!(hostName in state)) {
        state = registerHost(state, hostName);
    }
    /**
     * updated portal, if it was already added.
     */
    var index = state[hostName].findIndex(function (item) { return item.name === portalName; });
    if (index !== -1) {
        state[hostName][index].node = node;
    }
    else {
        state[hostName].push({
            name: portalName,
            node: node,
        });
    }
    return state;
};
var removePortal = function (state, hostName, portalName) {
    if (!(hostName in state)) {
        if (process.env.NODE_ENV === 'development') {
            console.info("Failed to remove portal '".concat(portalName, "', '").concat(hostName, "' was not registered!"));
        }
        return state;
    }
    var index = state[hostName].findIndex(function (item) { return item.name === portalName; });
    if (index !== -1)
        state[hostName].splice(index, 1);
    return state;
};
var reducer = function (state, action) {
    var type = action.type;
    switch (type) {
        case ACTIONS.REGISTER_HOST:
            return registerHost(__assign({}, state), action.hostName);
        case ACTIONS.DEREGISTER_HOST:
            return deregisterHost(__assign({}, state), action.hostName);
        case ACTIONS.ADD_UPDATE_PORTAL:
            return addUpdatePortal(__assign({}, state), action.hostName, action.portalName, action.node);
        case ACTIONS.REMOVE_PORTAL:
            return removePortal(__assign({}, state), action.hostName, action.portalName);
        default:
            return state;
    }
};
var PortalStateContext = (0, react_1.createContext)(null);
var PortalDispatchContext = (0, react_1.createContext)(null);
var PortalProviderActiveContext = (0, react_1.createContext)(false);
var usePortalState = function (hostName) {
    var state = (0, react_1.useContext)(PortalStateContext);
    if (state === null) {
        throw new Error("'PortalStateContext' cannot be null, please add 'PortalProvider' to the root component.");
    }
    return state[hostName] || [];
};
var usePortal = function (hostName) {
    if (hostName === void 0) { hostName = 'root'; }
    var dispatch = (0, react_1.useContext)(PortalDispatchContext);
    if (dispatch === null) {
        throw new Error("'PortalDispatchContext' cannot be null, please add 'PortalProvider' to the root component.");
    }
    //#region methods
    var registerHost = (0, react_1.useCallback)(function () {
        dispatch({
            type: ACTIONS.REGISTER_HOST,
            hostName: hostName,
        });
    }, []);
    var deregisterHost = (0, react_1.useCallback)(function () {
        dispatch({
            type: ACTIONS.DEREGISTER_HOST,
            hostName: hostName,
        });
    }, []);
    var addUpdatePortal = (0, react_1.useCallback)(function (name, node) {
        dispatch({
            type: ACTIONS.ADD_UPDATE_PORTAL,
            hostName: hostName,
            portalName: name,
            node: node,
        });
    }, []);
    var removePortal = (0, react_1.useCallback)(function (name) {
        dispatch({
            type: ACTIONS.REMOVE_PORTAL,
            hostName: hostName,
            portalName: name,
        });
    }, []);
    //#endregion
    return {
        registerHost: registerHost,
        deregisterHost: deregisterHost,
        addPortal: addUpdatePortal,
        updatePortal: addUpdatePortal,
        removePortal: removePortal,
    };
};
exports.usePortal = usePortal;
var PortalProviderComponent = function (_a) {
    var _b = _a.rootHostName, rootHostName = _b === void 0 ? 'root' : _b, _c = _a.shouldAddRootHost, shouldAddRootHost = _c === void 0 ? true : _c, children = _a.children;
    var isAlreadyInProvider = (0, react_1.useContext)(PortalProviderActiveContext);
    if (process.env.NODE_ENV === 'development') {
        if (isAlreadyInProvider && shouldAddRootHost) {
            console.warn("[hanzogui] Nested PortalProvider with shouldAddRootHost detected. " +
                "This causes hydration mismatches. HanzoguiProvider from 'hanzogui' already includes PortalProvider - " +
                "remove the explicit PortalProvider wrapper or set shouldAddRootHost={false}.");
        }
    }
    var _d = (0, react_1.useReducer)(reducer, INITIAL_STATE), state = _d[0], dispatch = _d[1];
    var transitionDispatch = (0, react_1.useMemo)(function () {
        var next = function (value) {
            (0, start_transition_1.startTransition)(function () {
                dispatch(value);
            });
        };
        return next;
    }, [dispatch]);
    var portalState = (0, native_1.getPortal)().state;
    // when teleport is enabled, use NativePortalProvider as the wrapper
    // the Gorhom context is still needed for fallback cases
    var content = ((0, jsx_runtime_1.jsx)(PortalProviderActiveContext.Provider, { value: true, children: (0, jsx_runtime_1.jsx)(PortalDispatchContext.Provider, { value: transitionDispatch, children: (0, jsx_runtime_1.jsxs)(PortalStateContext.Provider, { value: state, children: [children, shouldAddRootHost && (0, jsx_runtime_1.jsx)(exports.PortalHost, { name: rootHostName })] }) }) }));
    // wrap with NativePortalProvider if teleport is available
    if (portalState.type === 'teleport') {
        return (0, jsx_runtime_1.jsx)(native_1.NativePortalProvider, { children: content });
    }
    return content;
};
exports.PortalProvider = (0, react_1.memo)(PortalProviderComponent);
exports.PortalProvider.displayName = 'PortalProvider';
var defaultRenderer = function (children) { return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children }); };
exports.PortalHost = (0, react_1.memo)(function PortalHost(props) {
    if (process.env.TAMAGUI_TARGET === 'web') {
        return (0, jsx_runtime_1.jsx)(PortalHostWeb, __assign({}, props));
    }
    else {
        var portalState = (0, native_1.getPortal)().state;
        // use teleport's PortalHost when available
        if (portalState.type === 'teleport') {
            return (0, jsx_runtime_1.jsx)(native_1.NativePortalHost, { name: props.name });
        }
        return (0, jsx_runtime_1.jsx)(PortalHostNonNative, __assign({}, props));
    }
});
function PortalHostWeb(props) {
    // if not layout effect race issues
    (0, constants_1.useIsomorphicLayoutEffect)(function () {
        return function () {
            constants_2.allPortalHosts.delete(props.name);
        };
    }, [props.name]);
    return ((0, jsx_runtime_1.jsx)("div", { style: { display: 'contents' }, ref: function (node) {
            var _a;
            if (node) {
                constants_2.allPortalHosts.set(props.name, node);
                (_a = constants_2.portalListeners[props.name]) === null || _a === void 0 ? void 0 : _a.forEach(function (x) { return x(node); });
            }
        } }));
}
function PortalHostNonNative(props) {
    var name = props.name, forwardProps = props.forwardProps, _a = props.render, render = _a === void 0 ? defaultRenderer : _a;
    var state = usePortalState(name);
    var _b = (0, exports.usePortal)(props.name), registerHost = _b.registerHost, deregisterHost = _b.deregisterHost;
    (0, constants_1.useIsomorphicLayoutEffect)(function () {
        registerHost();
        return function () {
            deregisterHost();
        };
    }, []);
    if (forwardProps) {
        return render(state.map(function (item) {
            var next = item.node;
            // REMOVE children, can cause gnarly bugs (ask me how i know)
            var children = forwardProps.children, restForwardProps = __rest(forwardProps, ["children"]);
            if (forwardProps) {
                return react_1.default.Children.map(next, function (child) {
                    return react_1.default.isValidElement(child)
                        ? react_1.default.cloneElement(child, __assign({ key: child.key }, restForwardProps))
                        : child;
                });
            }
            return next;
        }));
    }
    return render(state.map(function (item) { return item.node; }));
}
