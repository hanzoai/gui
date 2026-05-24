"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useControllableState = useControllableState;
var use_event_1 = require("@hanzogui/use-event");
var React = require("react");
var start_transition_1 = require("@hanzogui/start-transition");
var emptyCallbackFn = function (_) { return _(); };
function useControllableState(_a) {
    var prop = _a.prop, defaultProp = _a.defaultProp, onChange = _a.onChange, _b = _a.strategy, strategy = _b === void 0 ? 'prop-wins' : _b, preventUpdate = _a.preventUpdate, transition = _a.transition;
    var _c = React.useState(prop !== null && prop !== void 0 ? prop : defaultProp), state = _c[0], setState = _c[1];
    var previous = React.useRef(state);
    var propWins = strategy === 'prop-wins' && prop !== undefined;
    var value = propWins ? prop : state;
    var onChangeCb = (0, use_event_1.useEvent)(onChange || idFn);
    var transitionFn = transition ? start_transition_1.startTransition : emptyCallbackFn;
    React.useEffect(function () {
        if (prop === undefined)
            return;
        previous.current = prop;
        transitionFn(function () {
            setState(prop);
        });
    }, [prop]);
    React.useEffect(function () {
        if (propWins)
            return;
        if (state !== previous.current) {
            previous.current = state;
            onChangeCb(state);
        }
    }, [onChangeCb, state, propWins]);
    var setter = (0, use_event_1.useEvent)(function (next) {
        if (preventUpdate)
            return;
        if (propWins) {
            var nextValue = typeof next === 'function' ? next(previous.current) : next;
            onChangeCb(nextValue);
        }
        else {
            transitionFn(function () {
                setState(next);
            });
        }
    });
    return [value, setter];
}
var idFn = function () { };
