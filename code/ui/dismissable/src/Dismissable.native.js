"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DismissableBranch = exports.Dismissable = void 0;
exports.dispatchDiscreteCustomEvent = dispatchDiscreteCustomEvent;
exports.getDismissableLayerCount = getDismissableLayerCount;
exports.useHasDismissableLayers = useHasDismissableLayers;
exports.useIsInsideDismissable = useIsInsideDismissable;
exports.useDismissableLayersAbove = useDismissableLayersAbove;
var react_1 = require("react");
// stubs for native - dismissable is a web-only concept
function dispatchDiscreteCustomEvent(_target, _event) { }
function getDismissableLayerCount() {
    return 0;
}
function useHasDismissableLayers() {
    return false;
}
function useIsInsideDismissable(_ref) {
    return false;
}
function useDismissableLayersAbove(_ref) {
    return 0;
}
exports.Dismissable = react_1.default.forwardRef(function (props, _ref) {
    return props.children;
});
exports.DismissableBranch = react_1.default.forwardRef(function (props, _ref) {
    return props.children;
});
