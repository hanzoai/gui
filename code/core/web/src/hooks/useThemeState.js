"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.hasThemeUpdatingProps = exports.useThemeState = exports.getRootThemeState = exports.getThemeState = exports.forceUpdateThemes = exports.ThemeStateContext = void 0;
var constants_1 = require("@hanzogui/constants");
var constants_2 = require("@hanzogui/constants");
var react_1 = require("react");
var config_1 = require("../config");
var constants_3 = require("../constants/constants");
exports.ThemeStateContext = (0, react_1.createContext)('');
var allListeners = new Map();
var listenersByParent = {};
var HasRenderedOnce = new WeakMap();
var HadTheme = new WeakMap();
var PendingUpdate = new Map();
// TODO this will gain memory over time but its not going to be a ton
var states = new Map();
var localStates = new Map();
var shouldForce = false;
var forceUpdateThemes = function () {
    cacheVersion++;
    shouldForce = true;
    allListeners.forEach(function (cb) { return cb(); });
    shouldForce = false;
};
exports.forceUpdateThemes = forceUpdateThemes;
var getThemeState = function (id) { return states.get(id); };
exports.getThemeState = getThemeState;
var cacheVersion = 0;
// cache for getNewThemeName - invalidated on cacheVersion change
var themeNameCache = new Map();
var themeNameCacheVer = -1;
var themes = null;
var rootThemeState = null;
var getRootThemeState = function () { return rootThemeState; };
exports.getRootThemeState = getRootThemeState;
// extracts base name without scheme: "light_red_surface1" -> "red_surface1"
var getThemeBaseName = function (name) { return name.replace(/^(light|dark)_/, ''); };
var useThemeState = function (props, isRoot, keys, schemeKeys) {
    'use no memo';
    if (isRoot === void 0) { isRoot = false; }
    var disable = props.disable;
    var parentId = (0, react_1.useContext)(exports.ThemeStateContext);
    if (!parentId && !isRoot) {
        throw new Error(process.env.NODE_ENV === 'development'
            ? "".concat(constants_3.MISSING_THEME_MESSAGE, "\n\nLooked for theme").concat(props.name ? " \"".concat(props.name, "\"") : '').concat(props.componentName ? " (component: ".concat(props.componentName, ")") : '', ", but no parent theme context was found (parentId: ").concat(parentId, ").")
            : constants_3.MISSING_THEME_MESSAGE);
    }
    if (disable) {
        return (states.get(parentId) || {
            id: '',
            name: 'light',
            theme: (0, config_1.getConfig)().themes.light,
            // inverses: 0,
        });
    }
    var id = (0, react_1.useId)();
    var subscribe = (0, react_1.useCallback)(function (cb) {
        listenersByParent[parentId] = listenersByParent[parentId] || new Set();
        listenersByParent[parentId].add(id);
        allListeners.set(id, function () {
            PendingUpdate.set(id, shouldForce ? 'force' : true);
            cb();
        });
        return function () {
            allListeners.delete(id);
            listenersByParent[parentId].delete(id);
            localStates.delete(id);
            states.delete(id);
            PendingUpdate.delete(id);
        };
    }, [id, parentId]);
    var propsKey = getPropsKey(props);
    var getSnapshot = function () {
        var _a, _b, _c, _d, _e, _f;
        var local = localStates.get(id);
        var parentState = states.get(parentId);
        // fast path: nothing changed since last snapshot
        if (local && !PendingUpdate.has(id)) {
            if (parentState &&
                local._parentName === parentState.name &&
                local._propsKey === propsKey) {
                return local;
            }
        }
        // check if this is a scheme-only change (light↔dark) where DynamicColorIOS handles it
        var isSchemeOnlyChange = process.env.TAMAGUI_TARGET === 'native' &&
            constants_1.isIos &&
            (0, config_1.getSetting)('fastSchemeChange') &&
            local &&
            parentState &&
            local.scheme !== parentState.scheme &&
            getThemeBaseName(local.name) === getThemeBaseName(parentState.name);
        // all tracked keys are scheme-optimized = can skip re-render for scheme changes
        var keysSize = (_b = (_a = keys === null || keys === void 0 ? void 0 : keys.current) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 0;
        var schemeKeysSize = (_d = (_c = schemeKeys === null || schemeKeys === void 0 ? void 0 : schemeKeys.current) === null || _c === void 0 ? void 0 : _c.size) !== null && _d !== void 0 ? _d : 0;
        var allKeysSchemeOptimized = schemeKeysSize === keysSize && keysSize > 0;
        var canSkipForSchemeChange = isSchemeOnlyChange && allKeysSchemeOptimized;
        var needsUpdate = props.passThrough
            ? false
            : isRoot || props.name === 'light' || props.name === 'dark' || props.name === null
                ? true
                : !HasRenderedOnce.get(keys)
                    ? true
                    : canSkipForSchemeChange
                        ? false // skip re-render for scheme-only changes with DynamicColorIOS
                        : ((_e = keys === null || keys === void 0 ? void 0 : keys.current) === null || _e === void 0 ? void 0 : _e.size)
                            ? true
                            : (_f = props.needsUpdate) === null || _f === void 0 ? void 0 : _f.call(props);
        var _g = getNextState(local, props, propsKey, isRoot, id, parentId, needsUpdate, PendingUpdate.get(id)), rerender = _g[0], next = _g[1];
        PendingUpdate.delete(id);
        // we always create a new localState for every component
        // that way we can use it to de-opt and avoid renders granularly
        // we always return the localState object in each component
        // the global state (states) should always be up to date with the latest
        if (!local || rerender) {
            local = __assign({}, next);
            localStates.set(id, local);
        }
        if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
            console.groupCollapsed(" ".concat(id, " getSnapshot ").concat(rerender), local.name, '>', next.name);
            console.info({
                props: props,
                propsKey: propsKey,
                isRoot: isRoot,
                parentId: parentId,
                local: local,
                next: next,
                needsUpdate: needsUpdate,
                isSchemeOnlyChange: isSchemeOnlyChange,
                allKeysSchemeOptimized: allKeysSchemeOptimized,
                canSkipForSchemeChange: canSkipForSchemeChange,
            });
            console.groupEnd();
        }
        if (next !== local) {
            Object.assign(local, next);
            local.id = id;
        }
        ;
        local._parentName = parentState === null || parentState === void 0 ? void 0 : parentState.name;
        local._propsKey = propsKey;
        states.set(id, next);
        return local;
    };
    if (process.env.NODE_ENV === 'development' && globalThis.time)
        globalThis.time(templateObject_1 || (templateObject_1 = __makeTemplateObject(["theme-prep-uses"], ["theme-prep-uses"])));
    var state = (0, react_1.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
    (0, constants_2.useIsomorphicLayoutEffect)(function () {
        var _a;
        if (!HasRenderedOnce.get(keys)) {
            HasRenderedOnce.set(keys, true);
            return;
        }
        if (!propsKey) {
            if (HadTheme.get(keys)) {
                // we're removing the last theme, make sure to notify
                scheduleUpdate(id);
            }
            HadTheme.set(keys, false);
            return;
        }
        if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
            console.warn(" \u00B7 useTheme(".concat(id, ") scheduleUpdate"), propsKey, (_a = states.get(id)) === null || _a === void 0 ? void 0 : _a.name);
        }
        scheduleUpdate(id);
        HadTheme.set(keys, true);
    }, [keys, propsKey]);
    return state;
};
exports.useThemeState = useThemeState;
var getNextState = function (lastState, props, propsKey, isRoot, id, parentId, needsUpdate, pendingUpdate) {
    if (isRoot === void 0) { isRoot = false; }
    var debug = props.debug;
    var parentState = states.get(parentId);
    if (props.passThrough) {
        return [false, lastState || parentState || { name: '' }];
    }
    if (!themes) {
        themes = (0, config_1.getConfig)().themes;
    }
    var name = !propsKey && (!lastState || !(lastState === null || lastState === void 0 ? void 0 : lastState.isNew))
        ? null
        : getNewThemeName(parentState === null || parentState === void 0 ? void 0 : parentState.name, props, pendingUpdate === 'force' ? true : !!needsUpdate);
    var isSameAsParent = parentState && (!name || name === parentState.name);
    var shouldRerender = Boolean(pendingUpdate === 'force' ||
        (needsUpdate && (pendingUpdate || (lastState === null || lastState === void 0 ? void 0 : lastState.name) !== (parentState === null || parentState === void 0 ? void 0 : parentState.name))));
    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        var message = " \u00B7 useTheme(".concat(id, ") getNextState => ").concat(name, " needsUpdate ").concat(needsUpdate, " shouldRerender ").concat(shouldRerender);
        if (process.env.TAMAGUI_TARGET === 'native') {
            console.info(message);
        }
        else {
            console.groupCollapsed(message);
            console.trace({ name: name, lastState: lastState, parentState: parentState, props: props, propsKey: propsKey, id: id, isSameAsParent: isSameAsParent });
            console.groupEnd();
        }
    }
    if (isSameAsParent) {
        if (!shouldRerender && lastState && lastState.name === parentState.name) {
            return [false, lastState];
        }
        return [shouldRerender, __assign(__assign({}, parentState), { isNew: false })];
    }
    if (!name) {
        var next = lastState !== null && lastState !== void 0 ? lastState : parentState;
        if (!next) {
            throw new Error(process.env.NODE_ENV === 'development'
                ? "".concat(constants_3.MISSING_THEME_MESSAGE, "\n\nLooked for theme").concat(props.name ? " \"".concat(props.name, "\"") : '').concat(props.componentName ? " (component: ".concat(props.componentName, ")") : '', ", but no theme state was resolved (parentId: ").concat(parentId, ", id: ").concat(id, ").")
                : constants_3.MISSING_THEME_MESSAGE);
        }
        if (shouldRerender) {
            var updated = __assign({}, (parentState || lastState));
            return [true, updated];
        }
        return [false, next];
    }
    var scheme = getScheme(name);
    // const parentInverses = parentState?.inverses ?? 0
    var isInverse = parentState && scheme !== parentState.scheme;
    // const inverses = parentInverses + (isInverse ? 1 : 0)
    var nextState = {
        id: id,
        name: name,
        theme: themes[name],
        scheme: scheme,
        parentId: parentId,
        parentName: parentState === null || parentState === void 0 ? void 0 : parentState.name,
        // inverses,
        isInverse: isInverse,
        isNew: true,
    };
    if (isRoot) {
        rootThemeState = nextState;
    }
    if (pendingUpdate !== 'force' && lastState && lastState.name === name) {
        return [false, nextState];
    }
    var shouldAvoidRerender = pendingUpdate !== 'force' &&
        lastState &&
        !needsUpdate &&
        nextState.name === lastState.name;
    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.groupCollapsed(" \u00B7 useTheme(".concat(id, ") \u23ED\uFE0F ").concat(name, " shouldAvoidRerender: ").concat(shouldAvoidRerender));
        console.info({ lastState: lastState, needsUpdate: needsUpdate, nextState: nextState, pendingUpdate: pendingUpdate });
        console.groupEnd();
    }
    // we still update the state (not changing identity), that way children can properly resolve the right state
    // but this one wont trigger an update
    if (shouldAvoidRerender) {
        return [false, nextState];
    }
    return [true, nextState];
};
function scheduleUpdate(id) {
    var queue = [id];
    var visited = new Set();
    while (queue.length) {
        var parent_1 = queue.shift();
        var children = listenersByParent[parent_1];
        if (children) {
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var childId = children_1[_i];
                if (!visited.has(childId)) {
                    visited.add(childId);
                    queue.push(childId);
                }
            }
        }
    }
    visited.forEach(function (childId) {
        var cb = allListeners.get(childId);
        cb === null || cb === void 0 ? void 0 : cb();
    });
}
var validSchemes = {
    light: 'light',
    dark: 'dark',
};
function getScheme(name) {
    return validSchemes[name.split('_')[0]];
}
function getNewThemeName(parentName, props, forceUpdate) {
    if (parentName === void 0) { parentName = ''; }
    if (forceUpdate === void 0) { forceUpdate = false; }
    var name = props.name, reset = props.reset;
    var componentName = props.unstyled ? undefined : props.componentName;
    if (name && reset) {
        throw new Error(process.env.NODE_ENV === 'production'
            ? "\u274C004"
            : 'Cannot reset and set a new name at the same time.');
    }
    // check cache
    var cacheKey = "".concat(parentName, "|").concat(name || '', "|").concat(componentName || '', "|").concat(reset ? 1 : 0, "|").concat(forceUpdate ? 1 : 0);
    if (themeNameCacheVer !== cacheVersion) {
        themeNameCache.clear();
        themeNameCacheVer = cacheVersion;
    }
    else {
        var cached = themeNameCache.get(cacheKey);
        if (cached !== undefined)
            return cached;
    }
    var themes = (0, config_1.getConfig)().themes;
    if (reset) {
        // For reset, we need to go back to the grandparent theme
        // If parentName is just a scheme (like "dark" or "light"),
        // we should return the opposite scheme or a default
        var isSchemeOnly = parentName === 'light' || parentName === 'dark';
        if (isSchemeOnly) {
            // If parent is just a scheme, go to the opposite scheme
            var result_1 = parentName === 'light' ? 'dark' : 'light';
            themeNameCache.set(cacheKey, result_1);
            return result_1;
        }
        // For compound themes like "dark_blue", extract the scheme
        var lastPartIndex = parentName.lastIndexOf('_');
        // parentName will have format light_{name} or dark_{name}
        var name_1 = lastPartIndex <= 0 ? parentName : parentName.slice(lastPartIndex);
        var scheme = parentName.slice(0, lastPartIndex);
        var result = themes[name_1] ? name_1 : scheme;
        themeNameCache.set(cacheKey, result);
        return result;
    }
    var parentParts = parentName.split('_');
    // always remove component theme if it exists, we never sub a component theme
    var lastName = parentParts[parentParts.length - 1];
    if (lastName && lastName[0].toLowerCase() !== lastName[0]) {
        parentParts.pop();
    }
    var subNames = [
        name && componentName ? "".concat(name, "_").concat(componentName) : undefined,
        name,
        componentName,
    ].filter(Boolean);
    var found = null;
    // If name is provided, try it as a standalone theme first (both with and without scheme)
    // This allows explicit theme overrides like:
    // - <Theme name="blue"><Button theme="dark_green"> → finds "dark_green_Button"
    // - <Theme name="blue"><Button theme="green"> → finds "light_green_Button"
    // - <Theme name="blue"><Button theme="green_active"> → finds "light_green_active_Button"
    if (name) {
        // First try the exact name as-is, but only if it already has a scheme prefix
        // This prevents "green" from matching before we try "light_green_Button"
        var nameHasScheme = getScheme(name);
        if (nameHasScheme) {
            // Name has scheme (like "dark_green"), try as-is with priority to component theme
            for (var _i = 0, subNames_1 = subNames; _i < subNames_1.length; _i++) {
                var subName = subNames_1[_i];
                if (subName in themes) {
                    found = subName;
                    break;
                }
            }
        }
        // If not found and name doesn't have a scheme, try adding parent's scheme
        if (!found && !nameHasScheme) {
            var parentScheme = getScheme(parentName);
            if (parentScheme) {
                // Try progressively shorter parent bases to preserve color context
                // For parent "light_blue_surface1" + name "surface3":
                //   Try: light_blue_surface1_surface3, light_blue_surface3, light_surface3
                // This ensures color context (blue) is preserved before falling back to scheme-only
                // Build list of potential bases from most specific to least specific
                var potentialBases = [];
                for (var i = parentParts.length; i >= 1; i--) {
                    potentialBases.push(parentParts.slice(0, i).join('_'));
                }
                outer: for (var _a = 0, potentialBases_1 = potentialBases; _a < potentialBases_1.length; _a++) {
                    var base = potentialBases_1[_a];
                    // Try with componentName first, then without
                    var candidates = [
                        componentName ? "".concat(base, "_").concat(name, "_").concat(componentName) : undefined,
                        "".concat(base, "_").concat(name),
                    ].filter(Boolean);
                    for (var _b = 0, candidates_1 = candidates; _b < candidates_1.length; _b++) {
                        var potential = candidates_1[_b];
                        if (potential in themes) {
                            found = potential;
                            break outer;
                        }
                    }
                }
            }
        }
    }
    // If not found, fall back to the original search algorithm combining with parent
    if (!found) {
        // If we're only adding componentName (no explicit name prop), don't backtrack through parent parts
        // This preserves sub-themes like "light_red_surface1" when adding Button component
        if (!name && componentName) {
            // Just try adding component to full parent
            var potential = "".concat(parentParts.join('_'), "_").concat(componentName);
            if (potential in themes) {
                found = potential;
            }
            // If not found, don't add component theme - return null to keep parent theme
        }
        else {
            // Original backtracking search for when explicit name is provided
            var max = parentParts.length;
            for (var i = 0; i <= max; i++) {
                var base = (i === 0 ? parentParts : parentParts.slice(0, -i)).join('_');
                for (var _c = 0, subNames_2 = subNames; _c < subNames_2.length; _c++) {
                    var subName = subNames_2[_c];
                    var potential = base ? "".concat(base, "_").concat(subName) : subName;
                    if (potential in themes) {
                        found = potential;
                        break;
                    }
                }
                if (found)
                    break;
            }
        }
    }
    if (!forceUpdate &&
        found === parentName &&
        // if its a scheme only sub-theme, we always consider it "new" because it likely inverses
        // and we want to avoid reparenting
        !validSchemes[found]) {
        themeNameCache.set(cacheKey, null);
        return null;
    }
    themeNameCache.set(cacheKey, found);
    return found;
}
var getPropsKey = function (_a) {
    var name = _a.name, reset = _a.reset, forceClassName = _a.forceClassName, componentName = _a.componentName;
    return "".concat(name || '').concat(reset || '').concat(forceClassName || '').concat(componentName || '');
};
var hasThemeUpdatingProps = function (props) {
    return 'name' in props || 'reset' in props || 'forceClassName' in props;
};
exports.hasThemeUpdatingProps = hasThemeUpdatingProps;
var templateObject_1;
