"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEffectivePseudoTransition = resolveEffectivePseudoTransition;
exports.extractPseudoState = extractPseudoState;
/**
 * Resolves the effective transition based on pseudo state changes.
 * When entering a pseudo state (e.g., hover), use that pseudo's transition.
 * When exiting (returning to base), use the base transition.
 *
 * CSS-like semantics:
 * - Enter hover: Uses hover's transition (fast snap)
 * - Exit hover: Uses base transition (slow fade)
 */
function resolveEffectivePseudoTransition(prev, next, pseudoTransitions, baseTransition) {
    var _a, _b, _c;
    if (!pseudoTransitions) {
        return baseTransition;
    }
    // treat undefined prev as all-false so first interaction detects entering
    var prevState = prev || { hover: false, press: false, focus: false, groups: {} };
    // check which pseudo states are being entered (priority: press > hover > focus)
    if (next.press && !prevState.press && pseudoTransitions.pressStyle) {
        return pseudoTransitions.pressStyle;
    }
    if (next.hover && !prevState.hover && pseudoTransitions.hoverStyle) {
        return pseudoTransitions.hoverStyle;
    }
    if (next.focus && !prevState.focus && pseudoTransitions.focusStyle) {
        return pseudoTransitions.focusStyle;
    }
    // check group pseudo transitions (e.g., $group-scenario4-hover)
    for (var key in pseudoTransitions) {
        if (key.startsWith('$group-')) {
            // parse $group-{name}-{pseudo} format
            var match = key.match(/^\$group-(.+)-(hover|press|focus)$/);
            if (!match)
                continue;
            var groupName = match[1];
            var pseudoType = match[2];
            // get current and previous group pseudo state
            var nextGroupPseudo = (_b = (_a = next.group) === null || _a === void 0 ? void 0 : _a[groupName]) === null || _b === void 0 ? void 0 : _b.pseudo;
            var prevGroupPseudo = (_c = prevState.groups) === null || _c === void 0 ? void 0 : _c[groupName];
            // check if entering this group pseudo state
            if ((nextGroupPseudo === null || nextGroupPseudo === void 0 ? void 0 : nextGroupPseudo[pseudoType]) && !(prevGroupPseudo === null || prevGroupPseudo === void 0 ? void 0 : prevGroupPseudo[pseudoType])) {
                return pseudoTransitions[key];
            }
        }
    }
    // exiting uses base transition
    return baseTransition;
}
/**
 * Extracts pseudo state from HanzoguiComponentState for storage in prevPseudoState
 */
function extractPseudoState(state) {
    var _a;
    var groups = {};
    if (state.group) {
        for (var groupName in state.group) {
            var pseudo = (_a = state.group[groupName]) === null || _a === void 0 ? void 0 : _a.pseudo;
            if (pseudo) {
                groups[groupName] = {
                    hover: pseudo.hover,
                    press: pseudo.press,
                    focus: pseudo.focus,
                };
            }
        }
    }
    return {
        hover: state.hover,
        press: state.press,
        focus: state.focus,
        groups: groups,
    };
}
