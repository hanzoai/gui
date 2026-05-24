"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMediaStyle = exports.MEDIA_SEP = void 0;
exports.resetMediaStyleCache = resetMediaStyleCache;
var config_1 = require("../config");
var mediaObjectToString_1 = require("./mediaObjectToString");
var getGroupPropParts_1 = require("./getGroupPropParts");
// TODO have this be used by extractMediaStyle in hanzogui static
// not synced to static/constants for now
exports.MEDIA_SEP = '_';
var prefixes = null;
var selectors = null;
// call this when media config changes to reset cached prefixes/selectors
function resetMediaStyleCache() {
    prefixes = null;
    selectors = null;
}
var groupPseudoToPseudoCSSMap = {
    press: 'active',
    focusVisible: 'focus-visible',
    focusWithin: 'focus-within',
};
var specificities = new Array(12)
    .fill(0)
    .map(function (_, i) { return new Array(i).fill(':root').join(''); });
function getThemeOrGroupSelector(name, styleInner, isGroup, groupParts, isTheme, precedenceImportancePrefix) {
    if (isTheme === void 0) { isTheme = false; }
    if (precedenceImportancePrefix === void 0) { precedenceImportancePrefix = ''; }
    var selectorStart = styleInner.lastIndexOf(':root') + 5;
    var selectorEnd = styleInner.lastIndexOf('{');
    var selector = styleInner.slice(selectorStart, selectorEnd);
    var precedenceSpace = (0, config_1.getSetting)('addThemeClassName') !== false && isTheme ? '' : ' ';
    var pseudoSelectorName = groupParts.pseudo
        ? groupPseudoToPseudoCSSMap[groupParts.pseudo] || groupParts.pseudo
        : undefined;
    var pseudoSelector = pseudoSelectorName ? ":".concat(pseudoSelectorName) : '';
    var presedencePrefix = ":root".concat(precedenceImportancePrefix).concat(precedenceSpace);
    var mediaSelector = ".t_".concat(isGroup ? 'group_' : '').concat(name).concat(pseudoSelector);
    return [
        selector,
        "".concat(presedencePrefix).concat(mediaSelector, " ").concat(selector.replaceAll(':root', '')),
    ];
}
var createMediaStyle = function (styleObject, mediaKeyIn, mediaQueries, type, negate, priority) {
    var property = styleObject[0], identifier = styleObject[2], pseudoIn = styleObject[3], rules = styleObject[4];
    var isTheme = type === 'theme';
    var isPlatform = type === 'platform';
    var isGroup = type === 'group';
    var isNonWindowMedia = isTheme || isPlatform || isGroup;
    var negKey = negate ? '0' : '';
    var ogPrefix = identifier.slice(0, identifier.indexOf('-') + 1);
    var id = "".concat(ogPrefix).concat(exports.MEDIA_SEP).concat(mediaKeyIn.replace('-', '')).concat(negKey).concat(exports.MEDIA_SEP);
    var styleRule = '';
    var groupPriority = '';
    var groupMediaKey;
    var containerName;
    var nextIdentifier = identifier.replace(ogPrefix, id);
    var styleInner = rules
        .map(function (rule) { return rule.replaceAll(identifier, nextIdentifier); })
        .join(';');
    var isHover = false;
    if (isNonWindowMedia) {
        var specificity = (priority || 0) + (isGroup || isPlatform ? 1 : 0);
        if (isTheme || isGroup) {
            var groupParts = (0, getGroupPropParts_1.getGroupPropParts)(isTheme ? 'theme-' + mediaKeyIn : mediaKeyIn);
            var name_1 = groupParts.name, media = groupParts.media, pseudo = groupParts.pseudo;
            groupMediaKey = media;
            if (isGroup) {
                containerName = name_1;
            }
            if (pseudo === 'press' || pseudoIn === 'active') {
                specificity += 2;
            }
            if (pseudo === 'hover') {
                isHover = true;
            }
            var _a = getThemeOrGroupSelector(name_1, styleInner, isGroup, groupParts, isTheme, specificities[specificity]), selector = _a[0], nextSelector = _a[1];
            // const selectors = `${nextSelector}, :root${nextSelector}`
            // add back in the { we used to split
            styleRule = styleInner.replace(selector, nextSelector);
        }
        else {
            var prefix = specificities[specificity];
            // when styleInner is wrapped in @media (eg hover), inject specificity
            // inside the block — `:root@media ...` is invalid CSS
            styleRule =
                prefix && styleInner[0] === '@'
                    ? styleInner.replace('{', "{".concat(prefix))
                    : "".concat(prefix).concat(styleInner);
        }
    }
    if (!isNonWindowMedia || groupMediaKey) {
        // one time cost:
        // TODO MOVE THIS INTO SETUP AREA AND EXPORT IT
        if (!selectors) {
            var mediaKeys = Object.keys(mediaQueries);
            selectors = Object.fromEntries(mediaKeys.map(function (key) { return [key, (0, mediaObjectToString_1.mediaObjectToString)(mediaQueries[key])]; }));
            prefixes = Object.fromEntries(mediaKeys.map(function (k, index) { return [k, new Array(index + 1).fill(':root').join('')]; }));
        }
        var mediaKey = groupMediaKey || mediaKeyIn;
        var mediaSelector = selectors[mediaKey];
        var screenStr = negate ? 'not all and ' : '';
        var mediaQuery = "".concat(screenStr).concat(mediaSelector);
        var precedenceImportancePrefix = groupMediaKey ? groupPriority : prefixes[mediaKey];
        var prefix = groupMediaKey ? "@container ".concat(containerName) : '@media';
        if (groupMediaKey) {
            styleInner = styleRule;
        }
        // combines media queries if they already exist
        if (styleInner.includes(prefix)) {
            // combine
            styleRule = styleInner
                .replace('{', " and ".concat(mediaQuery, " {"))
                // temp bugfix can be better done
                .replace("and screen and", "and");
        }
        else {
            styleRule = "".concat(prefix, " ").concat(mediaQuery, "{").concat(precedenceImportancePrefix).concat(styleInner, "}");
        }
        // add @supports for legacy browser support to not break container queries
        if (groupMediaKey) {
            styleRule = "@supports (contain: ".concat((0, config_1.getSetting)('webContainerType') || 'inline-size', ") {").concat(styleRule, "}");
        }
    }
    if (isHover) {
        styleRule = "@media (hover:hover){".concat(styleRule, "}");
    }
    return [property, undefined, nextIdentifier, undefined, [styleRule]];
};
exports.createMediaStyle = createMediaStyle;
