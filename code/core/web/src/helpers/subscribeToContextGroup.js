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
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToContextGroup = void 0;
var is_equal_shallow_1 = require("@hanzogui/is-equal-shallow");
var useMedia_1 = require("../hooks/useMedia");
var subscribeToContextGroup = function (props) {
    var pseudoGroups = props.pseudoGroups, mediaGroups = props.mediaGroups, groupContext = props.groupContext;
    if (pseudoGroups || mediaGroups) {
        if (process.env.NODE_ENV === 'development' && !groupContext) {
            console.debug("No context group found");
        }
        var disposables_1 = new Set();
        if (pseudoGroups) {
            for (var _i = 0, pseudoGroups_1 = pseudoGroups; _i < pseudoGroups_1.length; _i++) {
                var name_1 = pseudoGroups_1[_i];
                disposables_1.add(createGroupListener(name_1, props));
            }
        }
        if (mediaGroups) {
            for (var _a = 0, mediaGroups_1 = mediaGroups; _a < mediaGroups_1.length; _a++) {
                var name_2 = mediaGroups_1[_a];
                disposables_1.add(createGroupListener(name_2, props));
            }
        }
        return function () {
            disposables_1.forEach(function (d) { return d(); });
        };
    }
};
exports.subscribeToContextGroup = subscribeToContextGroup;
var createGroupListener = function (name, _a) {
    var setStateShallow = _a.setStateShallow, pseudoGroups = _a.pseudoGroups, mediaGroups = _a.mediaGroups, groupContext = _a.groupContext;
    var parent = groupContext === null || groupContext === void 0 ? void 0 : groupContext[name];
    if (!parent) {
        return function () { };
    }
    var dispose = parent.subscribe(function (_a) {
        var layout = _a.layout, pseudo = _a.pseudo;
        setStateShallow(function (prev) {
            var _a;
            var _b;
            var didChange = false;
            var group = ((_b = prev.group) === null || _b === void 0 ? void 0 : _b[name]) || {
                pseudo: {},
                media: {},
            };
            if (pseudo && (pseudoGroups === null || pseudoGroups === void 0 ? void 0 : pseudoGroups.has(name))) {
                group.pseudo || (group.pseudo = {});
                var next = (0, is_equal_shallow_1.mergeIfNotShallowEqual)(group.pseudo, pseudo);
                if (next !== group.pseudo) {
                    Object.assign(group.pseudo, pseudo);
                    didChange = true;
                }
            }
            else if (layout && mediaGroups) {
                group.media || (group.media = {});
                var mediaState = (0, useMedia_1.getMediaState)(mediaGroups, layout);
                var next = (0, is_equal_shallow_1.mergeIfNotShallowEqual)(group.media, mediaState);
                if (next !== group.media) {
                    Object.assign(group.media, next);
                    didChange = true;
                }
            }
            if (didChange) {
                return {
                    group: __assign(__assign({}, prev.group), (_a = {}, _a[name] = group, _a)),
                };
            }
            return prev;
        });
    });
    return function () {
        dispose();
        // we no longer have any active group, need to remove state so the style updates
        setStateShallow({
            group: {},
        });
    };
};
