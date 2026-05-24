"use strict";
/**
 * Preserves prop ordering, so that the order most closely matches the last spread objects
 * Useful for having { ...defaultProps, ...props } that ensure props ordering is always kept
 *
 * Honestly this is somehwat backwards logically from Object.assign, reason was that we typically
 * are merging defaultProps, givenProps, but we started using it elsewhere and now its a bit confusing
 * Should look into refactoring this to match common usage
 *
 * Merges sub-objects if they start are pseudo-keys or media-key-like (start with "$")
 *
 *    Given:
 *      mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
 *    The final key order will be:
 *      b, a
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeComponentProps = exports.mergeProps = void 0;
var pseudoDescriptors_1 = require("./pseudoDescriptors");
var mergeProps = function (defaultProps, props) {
    var out = {};
    // in general objects keys are sorted by order of insertion
    // we merge "defaultProps" first as they should come first
    // (so Object.keys(finalProps) will list [...defaultPropKeys] first)
    // but we ignore any keys from props, and merge it after, that way
    // final order is [...defaultPropKeys, ...propKeys]
    // ⚠️ keep in sync with mergeComponentProps logic
    for (var key in defaultProps) {
        if (key in props)
            continue;
        out[key] = defaultProps[key];
    }
    for (var key in props) {
        mergeProp(out, defaultProps, props, key);
    }
    return out;
};
exports.mergeProps = mergeProps;
// merge props but also handles defaultProps + styledContext
var mergeComponentProps = function (
// this is "a" in mergeProps
defaultProps, contextProps, 
// this is "b" in mergeProps
props) {
    var overriddenContext = null;
    if (!defaultProps && !contextProps) {
        return [props, overriddenContext];
    }
    if (defaultProps && !contextProps) {
        return [(0, exports.mergeProps)(defaultProps, props), overriddenContext];
    }
    // the only unique case is contextProps, we need to track overrides and do something a bit tricky
    // since we respect prop order for styles, we want to preserve the object key order in overriddenContext
    var out = {};
    // ⚠️ keep in sync with mergeProps logic
    // same logic as mergeProps but tracking overrides!
    for (var key in defaultProps) {
        if (key in props)
            continue;
        out[key] = defaultProps[key];
    }
    // styled context props go after defaultProps but before props
    for (var key in contextProps) {
        if (key in props)
            continue;
        var contextValue = contextProps[key];
        // don't merge undefined context values to preserve inheritance
        if (contextValue !== undefined) {
            out[key] = contextValue;
        }
    }
    for (var key in props) {
        mergeProp(out, defaultProps, props, key);
        if (contextProps && key in contextProps) {
            overriddenContext || (overriddenContext = {});
            overriddenContext[key] = props[key];
        }
    }
    return [out, overriddenContext];
};
exports.mergeComponentProps = mergeComponentProps;
function mergeProp(out, defaultProps, props, key) {
    var val = props[key];
    // one special case - we merge hanzogui style sub-objects
    if (defaultProps &&
        key in defaultProps &&
        (key in pseudoDescriptors_1.pseudoDescriptors || key[0] === '$') &&
        val &&
        typeof val === 'object') {
        var defaultVal = defaultProps[key];
        if (defaultVal && typeof defaultVal === 'object') {
            // use merge props so we prefer the key ordering the the last merged
            val = (0, exports.mergeProps)(defaultVal, val);
        }
    }
    out[key] = val;
}
