"use strict";
// Web-only style props that need to be skipped on native
// NOTE: backgroundColor is NOT web-only - it works on React Native too!
// NOTE: RN 0.76+ added: boxShadow, filter (cross-platform, with some Android 12+ only filters)
// NOTE: RN 0.77+ added: boxSizing, mixBlendMode, isolation, outline* props
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
exports.webOnlyStylePropsText = exports.webOnlyStylePropsView = exports.nonAnimatableWebTextProps = exports.nonAnimatableWebViewProps = void 0;
// web-only discrete (non-animatable) view props
exports.nonAnimatableWebViewProps = {
    backgroundAttachment: true,
    backgroundBlendMode: true,
    backgroundClip: true,
    backgroundOrigin: true,
    backgroundRepeat: true,
    borderBottomStyle: true,
    borderLeftStyle: true,
    borderRightStyle: true,
    borderTopStyle: true,
    contain: true,
    containerType: true,
    content: true,
    float: true,
    maskBorderMode: true,
    maskBorderRepeat: true,
    maskClip: true,
    maskComposite: true,
    maskMode: true,
    maskOrigin: true,
    maskRepeat: true,
    maskType: true,
    objectFit: true,
    overflowBlock: true,
    overflowInline: true,
    overflowX: true,
    overflowY: true,
    // NOTE: pointerEvents is NOT web-only - it's a core React Native View prop (not a style)
    pointerEvents: true,
    scrollbarWidth: true,
    textWrap: true,
    touchAction: true,
    transformStyle: true,
    willChange: true,
};
// web-only discrete (non-animatable) text props
exports.nonAnimatableWebTextProps = {
    whiteSpace: true,
    wordWrap: true,
    textOverflow: true,
    WebkitBoxOrient: true,
};
exports.webOnlyStylePropsView = __assign(__assign({}, exports.nonAnimatableWebViewProps), { transition: true, backdropFilter: true, WebkitBackdropFilter: true, background: true, borderTop: true, borderRight: true, borderBottom: true, borderLeft: true, backgroundPosition: true, backgroundSize: true, borderImage: true, caretColor: true, clipPath: true, mask: true, maskBorder: true, maskBorderOutset: true, maskBorderSlice: true, maskBorderSource: true, maskBorderWidth: true, maskImage: true, maskPosition: true, maskSize: true, objectPosition: true, textEmphasis: true, userSelect: true });
exports.webOnlyStylePropsText = __assign(__assign({}, exports.nonAnimatableWebTextProps), { textDecorationDistance: true, 
    // cursor: now cross-platform - in stylePropsView
    WebkitLineClamp: true });
