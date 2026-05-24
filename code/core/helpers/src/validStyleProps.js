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
exports.validStyles = exports.validPseudoKeys = exports.stylePropsAll = exports.stylePropsText = exports.stylePropsTextOnly = exports.stylePropsView = exports.stylePropsTransform = exports.stylePropsUnitless = exports.nonAnimatableStyleProps = exports.tokenCategories = exports.cssShorthandLonghands = void 0;
var constants_1 = require("@hanzogui/constants");
var webOnlyStyleProps_1 = require("./webOnlyStyleProps");
// generally organizing this so we don't duplicate things so its a bit weird
// longhands of CSS shorthands - used for specificity boosting on web
// so that e.g. borderWidth always beats border in the cascade
exports.cssShorthandLonghands = {
    // border longhands
    borderWidth: true,
    borderStyle: true,
    borderColor: true,
    borderTopWidth: true,
    borderTopStyle: true,
    borderTopColor: true,
    borderRightWidth: true,
    borderRightStyle: true,
    borderRightColor: true,
    borderBottomWidth: true,
    borderBottomStyle: true,
    borderBottomColor: true,
    borderLeftWidth: true,
    borderLeftStyle: true,
    borderLeftColor: true,
    // outline longhands
    outlineWidth: true,
    outlineStyle: true,
    outlineColor: true,
    outlineOffset: true,
};
var textColors = {
    color: true,
    textDecorationColor: true,
    textShadowColor: true,
};
// used for propMapping to find the right token category
// just specificy the least costly, all else go to `space` (most keys - we can exclude)
exports.tokenCategories = {
    radius: {
        borderRadius: true,
        borderTopLeftRadius: true,
        borderTopRightRadius: true,
        borderBottomLeftRadius: true,
        borderBottomRightRadius: true,
        // logical
        borderStartStartRadius: true,
        borderStartEndRadius: true,
        borderEndStartRadius: true,
        borderEndEndRadius: true,
    },
    size: {
        width: true,
        height: true,
        minWidth: true,
        minHeight: true,
        maxWidth: true,
        maxHeight: true,
        blockSize: true,
        minBlockSize: true,
        maxBlockSize: true,
        inlineSize: true,
        minInlineSize: true,
        maxInlineSize: true,
    },
    zIndex: {
        zIndex: true,
    },
    color: __assign(__assign(__assign({ backgroundColor: true, borderColor: true, borderBlockStartColor: true, borderBlockEndColor: true, borderBlockColor: true, borderBottomColor: true, borderInlineColor: true, borderInlineStartColor: true, borderInlineEndColor: true, borderTopColor: true, borderLeftColor: true, borderRightColor: true, borderEndColor: true, borderStartColor: true, shadowColor: true }, textColors), { 
        // outlineColor is supported on RN 0.77+ (New Architecture)
        outlineColor: true }), (process.env.TAMAGUI_TARGET === 'web' && {
        caretColor: true,
    })),
};
// discrete (non-animatable) view style properties - keyword-based, no interpolation
// defined above stylePropsView so it can be spread in without duplication
var nonAnimatableViewProps = {
    alignContent: true,
    alignItems: true,
    alignSelf: true,
    backfaceVisibility: true,
    borderCurve: true,
    borderStyle: true,
    borderBlockStyle: true,
    borderBlockEndStyle: true,
    borderBlockStartStyle: true,
    borderInlineStyle: true,
    borderInlineEndStyle: true,
    borderInlineStartStyle: true,
    boxSizing: true,
    cursor: true,
    direction: true,
    display: true,
    flexDirection: true,
    flexWrap: true,
    isolation: true,
    justifyContent: true,
    mixBlendMode: true,
    outlineStyle: true,
    overflow: true,
    position: true,
};
// discrete (non-animatable) font properties
var nonAnimatableFontProps = {
    fontFamily: true,
    fontStyle: true,
    fontVariant: true,
    textTransform: true,
};
// discrete (non-animatable) text-only properties
var nonAnimatableTextOnlyProps = {
    textAlign: true,
    textDecorationLine: true,
    textDecorationStyle: true,
    userSelect: true,
};
// discrete (non-animatable) unitless properties
var nonAnimatableUnitlessProps = {
    WebkitLineClamp: true,
    lineClamp: true,
    gridTemplateColumns: true,
    gridTemplateAreas: true,
};
// all non-animatable style props combined, used by getSplitStyles to keep
// these as atomic CSS classNames even for components with animation drivers
exports.nonAnimatableStyleProps = __assign(__assign(__assign(__assign(__assign({}, nonAnimatableViewProps), nonAnimatableFontProps), nonAnimatableTextOnlyProps), nonAnimatableUnitlessProps), (process.env.TAMAGUI_TARGET === 'web' && __assign(__assign({}, webOnlyStyleProps_1.nonAnimatableWebViewProps), webOnlyStyleProps_1.nonAnimatableWebTextProps)));
exports.stylePropsUnitless = __assign(__assign({}, nonAnimatableUnitlessProps), { animationIterationCount: true, aspectRatio: true, borderImageOutset: true, borderImageSlice: true, borderImageWidth: true, columnCount: true, flex: true, flexGrow: true, flexOrder: true, flexPositive: true, flexShrink: true, flexNegative: true, fontWeight: true, gridRow: true, gridRowEnd: true, gridRowGap: true, gridRowStart: true, gridColumn: true, gridColumnEnd: true, gridColumnGap: true, gridColumnStart: true, opacity: true, order: true, orphans: true, tabSize: true, widows: true, zIndex: true, zoom: true, scale: true, scaleX: true, scaleY: true, scaleZ: true, shadowOpacity: true });
exports.stylePropsTransform = {
    x: true,
    y: true,
    scale: true,
    perspective: true,
    scaleX: true,
    scaleY: true,
    skewX: true,
    skewY: true,
    matrix: true,
    rotate: true,
    rotateY: true,
    rotateX: true,
    rotateZ: true,
};
exports.stylePropsView = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, nonAnimatableViewProps), { borderBottomEndRadius: true, borderBottomStartRadius: true, borderBottomWidth: true, borderLeftWidth: true, borderRightWidth: true, borderBlockWidth: true, borderBlockEndWidth: true, borderBlockStartWidth: true, borderInlineWidth: true, borderInlineEndWidth: true, borderInlineStartWidth: true, borderTopEndRadius: true, borderTopStartRadius: true, borderTopWidth: true, borderWidth: true, transform: true, transformOrigin: true, borderEndWidth: true, borderStartWidth: true, bottom: true, end: true, flexBasis: true, gap: true, columnGap: true, rowGap: true, left: true, margin: true, marginBlock: true, marginBlockEnd: true, marginBlockStart: true, marginInline: true, marginInlineStart: true, marginInlineEnd: true, marginBottom: true, marginEnd: true, marginHorizontal: true, marginLeft: true, marginRight: true, marginStart: true, marginTop: true, marginVertical: true, padding: true, paddingBottom: true, paddingInline: true, paddingBlock: true, paddingBlockStart: true, paddingInlineEnd: true, paddingInlineStart: true, paddingEnd: true, paddingHorizontal: true, paddingLeft: true, paddingRight: true, paddingStart: true, paddingTop: true, paddingVertical: true, right: true, start: true, top: true, inset: true, insetBlock: true, insetBlockEnd: true, insetBlockStart: true, insetInline: true, insetInlineEnd: true, insetInlineStart: true, shadowOffset: true, shadowRadius: true }), exports.tokenCategories.color), exports.tokenCategories.radius), exports.tokenCategories.size), exports.stylePropsTransform), exports.stylePropsUnitless), (constants_1.isAndroid ? { elevationAndroid: true } : {})), { boxShadow: true, border: true, filter: true, 
    // RN 0.76+ supports linear-gradient via backgroundImage
    backgroundImage: true, 
    // the actual RN 0.76+ prop name (backgroundImage expands to this on native)
    experimental_backgroundImage: true, 
    // RN 0.76/0.77+ style props (New Architecture)
    outline: true, outlineColor: true, outlineOffset: true, outlineWidth: true }), (process.env.TAMAGUI_TARGET === 'web' ? webOnlyStyleProps_1.webOnlyStylePropsView : {}));
var stylePropsFont = __assign(__assign({}, nonAnimatableFontProps), { fontSize: true, fontWeight: true, letterSpacing: true, lineHeight: true });
exports.stylePropsTextOnly = __assign(__assign(__assign(__assign(__assign({}, stylePropsFont), nonAnimatableTextOnlyProps), textColors), { textShadow: true, textShadowOffset: true, textShadowRadius: true, verticalAlign: true }), (process.env.TAMAGUI_TARGET === 'web' ? webOnlyStyleProps_1.webOnlyStylePropsText : {}));
exports.stylePropsText = __assign(__assign({}, exports.stylePropsView), exports.stylePropsTextOnly);
exports.stylePropsAll = exports.stylePropsText;
exports.validPseudoKeys = __assign({ enterStyle: true, exitStyle: true, hoverStyle: true, pressStyle: true, focusStyle: true, disabledStyle: true, focusWithinStyle: true }, (process.env.TAMAGUI_TARGET === 'web' && {
    focusVisibleStyle: true,
}));
exports.validStyles = exports.stylePropsView;
