"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceChild = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var use_constant_1 = require("@hanzogui/use-constant");
var use_presence_1 = require("@hanzogui/use-presence");
var React = require("react");
var react_1 = require("react");
// this memo seems to help PopoverContent from continuously re-rendering when open
exports.PresenceChild = React.memo(function (_a) {
    var children = _a.children, initial = _a.initial, isPresent = _a.isPresent, onExitComplete = _a.onExitComplete, exitVariant = _a.exitVariant, enterVariant = _a.enterVariant, enterExitVariant = _a.enterExitVariant, presenceAffectsLayout = _a.presenceAffectsLayout, custom = _a.custom;
    var presenceChildren = (0, use_constant_1.useConstant)(newChildrenMap);
    var id = (0, react_1.useId)() || '';
    var context = React.useMemo(function () {
        return {
            id: id,
            initial: initial,
            isPresent: isPresent,
            custom: custom,
            exitVariant: exitVariant,
            enterVariant: enterVariant,
            enterExitVariant: enterExitVariant,
            onExitComplete: function () {
                presenceChildren.set(id, true);
                for (var _i = 0, _a = presenceChildren.values(); _i < _a.length; _i++) {
                    var isComplete = _a[_i];
                    if (!isComplete) {
                        return; // can stop searching when any is incomplete
                    }
                }
                onExitComplete === null || onExitComplete === void 0 ? void 0 : onExitComplete();
            },
            register: function () {
                presenceChildren.set(id, false);
                return function () { return presenceChildren.delete(id); };
            },
        };
    }, 
    /**
     * If the presence of a child affects the layout of the components around it,
     * we want to make a new context value to ensure they get re-rendered
     * so they can detect that layout change.
     */
    // @ts-expect-error its ok
    presenceAffectsLayout ? undefined : [isPresent, exitVariant, enterVariant]);
    React.useMemo(function () {
        presenceChildren.forEach(function (_, key) { return presenceChildren.set(key, false); });
    }, [isPresent]);
    /**
     * If there's no animated components to fire exit animations, we want to remove this
     * component immediately.
     */
    React.useEffect(function () {
        !isPresent && !presenceChildren.size && (onExitComplete === null || onExitComplete === void 0 ? void 0 : onExitComplete());
    }, [isPresent]);
    return (0, jsx_runtime_1.jsx)(use_presence_1.PresenceContext.Provider, { value: context, children: children });
});
function newChildrenMap() {
    return new Map();
}
