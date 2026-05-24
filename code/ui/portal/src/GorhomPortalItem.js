"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GorhomPortalItem = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var constants_1 = require("@hanzogui/constants");
var web_1 = require("@hanzogui/web");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var constants_2 = require("./constants");
var GorhomPortalItem = function (props) {
    var theme = (0, web_1.useThemeName)();
    if (process.env.NODE_ENV === 'development') {
        if (!props.hostName && !props.passThrough) {
            console.warn("No hostName");
        }
    }
    var cur = constants_2.allPortalHosts.get(props.hostName || '');
    var _a = (0, react_1.useState)(cur), node = _a[0], setNode = _a[1];
    // Register listener only once per hostName
    (0, constants_1.useIsomorphicLayoutEffect)(function () {
        var _a;
        if (!props.hostName)
            return;
        var listener = function (newNode) {
            setNode(newNode);
        };
        constants_2.portalListeners[_a = props.hostName] || (constants_2.portalListeners[_a] = new Set());
        constants_2.portalListeners[props.hostName].add(listener);
        // check if host was already registered before we added our listener
        // this handles the race where PortalHost's ref callback runs before our effect
        var existingHost = constants_2.allPortalHosts.get(props.hostName);
        if (existingHost && existingHost !== node) {
            setNode(existingHost);
        }
        return function () {
            var _a;
            (_a = constants_2.portalListeners[props.hostName]) === null || _a === void 0 ? void 0 : _a.delete(listener);
        };
    }, [props.hostName]);
    // Sync with Map value in separate effect
    (0, constants_1.useIsomorphicLayoutEffect)(function () {
        if (cur && cur !== node) {
            setNode(cur);
        }
    }, [cur, node]);
    if (props.passThrough) {
        return props.children;
    }
    // Check if node is connected before using it
    var actualNode = (node === null || node === void 0 ? void 0 : node.isConnected) ? node : null;
    if (!actualNode) {
        return null;
    }
    return (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)(web_1.HanzoguiRoot, { theme: theme, children: props.children }), actualNode);
};
exports.GorhomPortalItem = GorhomPortalItem;
