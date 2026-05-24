"use strict";
// *0 order matches to *1
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMediaImportance = exports.pseudoDescriptors = exports.pseudoPriorities = exports.pseudoDescriptorsBase = void 0;
exports.pseudoDescriptorsBase = {
    // order of keys here important! in priority order
    hoverStyle: {
        name: 'hover',
        priority: 2,
    },
    pressStyle: {
        name: 'active',
        stateKey: 'press',
        priority: 3,
    },
    focusVisibleStyle: {
        name: 'focus-visible',
        priority: 4,
        stateKey: 'focusVisible',
    },
    focusStyle: {
        name: 'focus',
        priority: 4,
    },
    focusWithinStyle: {
        name: 'focus-within',
        priority: 4,
        stateKey: 'focusWithin',
    },
    disabledStyle: {
        name: 'disabled',
        priority: 5,
        stateKey: 'disabled',
    },
};
exports.pseudoPriorities = {
    hover: exports.pseudoDescriptorsBase.hoverStyle.priority,
    press: exports.pseudoDescriptorsBase.pressStyle.priority,
    focus: exports.pseudoDescriptorsBase.focusStyle.priority,
    focusVisible: exports.pseudoDescriptorsBase.focusVisibleStyle.priority,
    focusWithin: exports.pseudoDescriptorsBase.focusWithinStyle.priority,
    disabled: exports.pseudoDescriptorsBase.disabledStyle.priority,
};
exports.pseudoDescriptors = __assign(__assign({}, exports.pseudoDescriptorsBase), { enterStyle: {
        name: 'enter',
        selector: '.t_unmounted',
        priority: 4,
    }, exitStyle: {
        name: 'exit',
        priority: 5,
    } });
// media always above pseudos
exports.defaultMediaImportance = Object.keys(exports.pseudoDescriptors).length;
