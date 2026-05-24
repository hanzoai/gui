"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GorhomPortalItem = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// from https://github.com/gorhom/react-native-portal
// MIT License Copyright (c) 2020 Mo Gorhom
var constants_1 = require("@hanzogui/constants");
var core_1 = require("@hanzogui/core");
var native_1 = require("@hanzogui/native");
var react_1 = require("react");
var GorhomPortal_1 = require("./GorhomPortal");
var GorhomPortalItem = function (props) {
    var _providedName = props.name, _a = props.hostName, hostName = _a === void 0 ? 'root' : _a, _providedHandleOnMount = props.handleOnMount, _providedHandleOnUnmount = props.handleOnUnmount, _providedHandleOnUpdate = props.handleOnUpdate, children = props.children, passThrough = props.passThrough;
    var portalState = (0, native_1.getPortal)().state;
    // use teleport if available - it preserves context so we can skip the Gorhom system
    if (portalState.type === 'teleport') {
        if (passThrough) {
            return children;
        }
        return (0, jsx_runtime_1.jsx)(native_1.NativePortal, { hostName: hostName, children: children });
    }
    // fall back to Gorhom portal system
    return ((0, jsx_runtime_1.jsx)(GorhomPortalItemFallback, { name: _providedName, hostName: hostName, handleOnMount: _providedHandleOnMount, handleOnUnmount: _providedHandleOnUnmount, handleOnUpdate: _providedHandleOnUpdate, passThrough: passThrough, children: children }));
};
exports.GorhomPortalItem = GorhomPortalItem;
// original Gorhom implementation as fallback
var GorhomPortalItemFallback = function (props) {
    var _providedName = props.name, hostName = props.hostName, _providedHandleOnMount = props.handleOnMount, _providedHandleOnUnmount = props.handleOnUnmount, _providedHandleOnUpdate = props.handleOnUpdate, children = props.children, passThrough = props.passThrough;
    var _a = (0, GorhomPortal_1.usePortal)(hostName), addUpdatePortal = _a.addPortal, removePortal = _a.removePortal;
    var id = (0, react_1.useId)();
    var name = _providedName || id;
    var handleOnMount = (0, core_1.useEvent)(function () {
        if (_providedHandleOnMount) {
            _providedHandleOnMount(function () { return addUpdatePortal(name, children); });
        }
        else {
            addUpdatePortal(name, children);
        }
    });
    var handleOnUnmount = (0, core_1.useEvent)(function () {
        if (_providedHandleOnUnmount) {
            _providedHandleOnUnmount(function () { return removePortal(name); });
        }
        else {
            removePortal(name);
        }
    });
    var handleOnUpdate = (0, core_1.useEvent)(function () {
        if (_providedHandleOnUpdate) {
            _providedHandleOnUpdate(function () { return addUpdatePortal(name, children); });
        }
        else {
            addUpdatePortal(name, children);
        }
    });
    (0, constants_1.useIsomorphicLayoutEffect)(function () {
        if (passThrough)
            return;
        handleOnMount();
        return function () {
            handleOnUnmount();
        };
    }, []);
    (0, react_1.useEffect)(function () {
        if (passThrough)
            return;
        handleOnUpdate();
    }, [children]);
    return passThrough ? children : null;
};
