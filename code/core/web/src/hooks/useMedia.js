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
exports.getMediaImportanceIfMoreImportant = exports.configureMedia = exports.getMediaKeyImportance = exports.getMediaKey = exports.isMediaKey = void 0;
exports.setupMediaListeners = setupMediaListeners;
exports.updateMediaListeners = updateMediaListeners;
exports.setMediaShouldUpdate = setMediaShouldUpdate;
exports.useMedia = useMedia;
exports._disableMediaTouch = _disableMediaTouch;
exports.getMediaState = getMediaState;
exports.mediaKeyToQuery = mediaKeyToQuery;
exports.mediaKeyMatch = mediaKeyMatch;
var constants_1 = require("@hanzogui/constants");
var react_1 = require("react");
var config_1 = require("../config");
var createMediaStyle_1 = require("../helpers/createMediaStyle");
var matchMedia_1 = require("../helpers/matchMedia");
var mediaObjectToString_1 = require("../helpers/mediaObjectToString");
var mediaState_1 = require("../helpers/mediaState");
var pseudoDescriptors_1 = require("../helpers/pseudoDescriptors");
var mediaKeyRegex = /\$(platform|theme|group)-/;
var isMediaKey = function (key) {
    if (key[0] !== '$')
        return false;
    if (mediaState_1.mediaKeys.has(key))
        return true;
    if (mediaKeyRegex.test(key))
        return true;
    return false;
};
exports.isMediaKey = isMediaKey;
var getMediaKey = function (key) {
    if (key[0] !== '$')
        return false;
    if (mediaState_1.mediaKeys.has(key))
        return true;
    var match = key.match(mediaKeyRegex);
    if (match)
        return match[1];
    return false;
};
exports.getMediaKey = getMediaKey;
// for SSR capture it at time of startup
var initState;
var mediaKeysOrdered;
var getMediaKeyImportance = function (key) {
    if (process.env.NODE_ENV === 'development' && key[0] === '$') {
        throw new Error('use short key');
    }
    // + 100 because we set base usedKeys=1, pseudos are 2-N (however many we have)
    // all media go above all pseudos so we need to pad it based on that
    // right now theres 5 pseudos but in the future could be a few more
    return mediaKeysOrdered.indexOf(key) + 100;
};
exports.getMediaKeyImportance = getMediaKeyImportance;
var dispose = new Set();
var mediaVersion = 0;
var configureMedia = function (config) {
    var media = config.media;
    var mediaQueryDefaultActive = (0, config_1.getSetting)('mediaQueryDefaultActive');
    if (!media)
        return;
    mediaVersion++;
    // reset cached media style prefixes/selectors so they get recalculated with new key order
    (0, createMediaStyle_1.resetMediaStyleCache)();
    for (var key in media) {
        (0, mediaState_1.getMedia)()[key] = (mediaQueryDefaultActive === null || mediaQueryDefaultActive === void 0 ? void 0 : mediaQueryDefaultActive[key]) || false;
        mediaState_1.mediaKeys.add("$".concat(key));
    }
    Object.assign(mediaState_1.mediaQueryConfig, media);
    initState = __assign({}, (0, mediaState_1.getMedia)());
    mediaKeysOrdered = Object.keys(media);
    setupMediaListeners();
};
exports.configureMedia = configureMedia;
function unlisten() {
    dispose.forEach(function (cb) { return cb(); });
    dispose.clear();
}
/**
 * Note: This should *not* set the state on the first render!
 * Because to avoid hydration issues SSR must match the server
 * *and then* re-render with the actual media query state.
 */
var setupVersion = -1;
function setupMediaListeners() {
    if (constants_1.isWeb && constants_1.isServer)
        return;
    if (process.env.IS_STATIC)
        return;
    // avoid setting up more than once per config
    if (setupVersion === mediaVersion)
        return;
    setupVersion = mediaVersion;
    // hmr, undo existing before re-binding
    unlisten();
    var _loop_1 = function (key) {
        var str = (0, mediaObjectToString_1.mediaObjectToString)(mediaState_1.mediaQueryConfig[key]);
        var getMatch = function () { return (0, matchMedia_1.matchMedia)(str); };
        var match = getMatch();
        if (!match) {
            throw new Error('⚠️ No match');
        }
        // react native needs these deprecated apis for now
        match.addListener(update);
        dispose.add(function () {
            match.removeListener(update);
        });
        function update() {
            var _a;
            var next = !!getMatch().matches;
            if (next === (0, mediaState_1.getMedia)()[key])
                return;
            (0, mediaState_1.setMediaState)(__assign(__assign({}, (0, mediaState_1.getMedia)()), (_a = {}, _a[key] = next, _a)));
            updateMediaListeners();
        }
        update();
    };
    for (var key in mediaState_1.mediaQueryConfig) {
        _loop_1(key);
    }
}
var listeners = new Set();
function updateMediaListeners() {
    listeners.forEach(function (cb) { return cb((0, mediaState_1.getMedia)()); });
}
var States = new WeakMap();
function setMediaShouldUpdate(ref, enabled, keys) {
    var cur = States.get(ref);
    if (!cur || cur.enabled !== enabled || keys) {
        States.set(ref, __assign(__assign({}, cur), { enabled: enabled, keys: keys }));
    }
}
function subscribe(subscriber) {
    listeners.add(subscriber);
    return function () {
        listeners.delete(subscriber);
    };
}
function useMedia(componentContext, debug) {
    'use no memo';
    var componentState = componentContext ? States.get(componentContext) : null;
    var internalRef = (0, react_1.useRef)(null);
    if (!internalRef.current) {
        internalRef.current = {
            keys: new Set(),
            lastState: (0, mediaState_1.getMedia)(),
        };
    }
    // reset on next render
    if (internalRef.current.pendingState) {
        internalRef.current.lastState = internalRef.current.pendingState;
        internalRef.current.pendingState = undefined;
    }
    var keys = internalRef.current.keys;
    // clear each render to track only rendered touched keys
    if (keys.size) {
        keys.clear();
    }
    var state = (0, react_1.useSyncExternalStore)(subscribe, function () {
        var curKeys = (componentState === null || componentState === void 0 ? void 0 : componentState.keys) || keys;
        var _a = internalRef.current, lastState = _a.lastState, pendingState = _a.pendingState;
        if (!curKeys.size) {
            return lastState;
        }
        var ms = (0, mediaState_1.getMedia)();
        for (var _i = 0, curKeys_1 = curKeys; _i < curKeys_1.length; _i++) {
            var key = curKeys_1[_i];
            if (ms[key] !== (pendingState || lastState)[key]) {
                if (process.env.NODE_ENV === 'development' && debug) {
                    console.warn("useMedia() \u270D\uFE0F", key, lastState[key], '=>', ms[key]);
                }
                // in emitter mode (no-rerender) avoid changing state, instead emit
                if (componentContext === null || componentContext === void 0 ? void 0 : componentContext.mediaEmit) {
                    componentContext.mediaEmit(ms);
                    internalRef.current.pendingState = ms;
                    return lastState;
                }
                internalRef.current.lastState = ms;
                return ms;
            }
        }
        return lastState;
    }, getServerSnapshot);
    return new Proxy(state, {
        get: function (_, key) {
            if (!disableMediaTouch && typeof key === 'string') {
                keys.add(key);
            }
            return Reflect.get(state, key);
        },
    });
}
var getServerSnapshot = function () { return initState; };
var disableMediaTouch = false;
function _disableMediaTouch(val) {
    disableMediaTouch = val;
}
function getMediaState(mediaGroups, layout) {
    disableMediaTouch = true;
    var res;
    try {
        res = Object.fromEntries(__spreadArray([], mediaGroups, true).map(function (mediaKey) {
            return [mediaKey, mediaKeyMatch(mediaKey, layout)];
        }));
    }
    finally {
        disableMediaTouch = false;
    }
    return res;
}
var getMediaImportanceIfMoreImportant = function (mediaKey, key, styleState, isSizeMedia) {
    var importance = isSizeMedia
        ? (0, exports.getMediaKeyImportance)(mediaKey)
        : pseudoDescriptors_1.defaultMediaImportance;
    var usedKeys = styleState.usedKeys;
    return !usedKeys[key] || importance > usedKeys[key] ? importance : null;
};
exports.getMediaImportanceIfMoreImportant = getMediaImportanceIfMoreImportant;
var cachedMediaKeyToQuery = {};
function mediaKeyToQuery(key) {
    return (cachedMediaKeyToQuery[key] ||
        (cachedMediaKeyToQuery[key] = (0, mediaObjectToString_1.mediaObjectToString)(mediaState_1.mediaQueryConfig[key])));
}
function mediaKeyMatch(key, dimensions) {
    var mediaQueries = mediaState_1.mediaQueryConfig[key];
    var result = Object.keys(mediaQueries).every(function (query) {
        var expectedVal = +mediaQueries[query];
        var isMax = query.startsWith('max');
        var isWidth = query.endsWith('Width');
        var givenVal = dimensions[isWidth ? 'width' : 'height'];
        // if not max then min
        return isMax ? givenVal < expectedVal : givenVal > expectedVal;
    });
    return result;
}
