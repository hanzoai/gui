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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.styled = void 0;
exports.styledHtml = styledHtml;
var createComponent_1 = require("./createComponent");
var mergeVariants_1 = require("./helpers/mergeVariants");
var setupReactNative_1 = require("./setupReactNative");
// runtime check for text-like elements
var textLikeElements = new Set([
    'a',
    'abbr',
    'b',
    'bdi',
    'bdo',
    'cite',
    'code',
    'data',
    'del',
    'dfn',
    'em',
    'i',
    'ins',
    'kbd',
    'label',
    'mark',
    'q',
    's',
    'samp',
    'small',
    'span',
    'strong',
    'sub',
    'sup',
    'time',
    'u',
    'var',
]);
/**
 * styledHtml() for HTML element tags like 'a', 'button', 'div', etc.
 * Automatically provides element-specific props (href for anchors, type for buttons, etc.)
 *
 * @example
 * const StyledAnchor = styledHtml('a', {
 *   color: '$blue10',
 *   textDecorationLine: 'underline',
 * })
 * // StyledAnchor now accepts `href` prop with proper typing
 * <StyledAnchor href="/path">Link</StyledAnchor>
 */
function styledHtml(tag, options) {
    var isText = textLikeElements.has(tag);
    var _a = options || {}, variants = _a.variants, name = _a.name, defaultVariants = _a.defaultVariants, context = _a.context, defaultProps = __rest(_a, ["variants", "name", "defaultVariants", "context"]);
    var conf = {
        Component: tag,
        variants: variants,
        defaultProps: defaultProps,
        defaultVariants: defaultVariants,
        componentName: name,
        isReactNative: false,
        isText: isText,
        acceptsClassName: true,
        context: context,
    };
    if (defaultProps['children'] || context) {
        conf.neverFlatten = true;
    }
    var component = (0, createComponent_1.createComponent)(conf);
    return component;
}
/**
 * styled() for creating Hanzogui components from other components.
 */
function styled(ComponentIn, 
// this should be Partial<GetProps<ParentComponent>> but causes excessively deep type issues
options, config) {
    // do type stuff at top for easier readability
    // validate not using a variant over an existing valid style
    if (process.env.NODE_ENV !== 'production') {
        if (!ComponentIn) {
            throw new Error("No component given to styled()");
        }
    }
    var parentStaticConfig = ComponentIn['staticConfig'];
    var isPlainStyledComponent = !!parentStaticConfig &&
        !(parentStaticConfig.isReactNative || parentStaticConfig.isHOC);
    var isNonStyledHOC = (parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.isHOC) && !(parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.isStyledHOC);
    var Component = isNonStyledHOC || isPlainStyledComponent
        ? ComponentIn
        : (parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.Component) || ComponentIn;
    var reactNativeConfig = !parentStaticConfig
        ? (0, setupReactNative_1.getReactNativeConfig)(Component)
        : undefined;
    var isReactNative = Boolean(reactNativeConfig || (config === null || config === void 0 ? void 0 : config.isReactNative) || (parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.isReactNative));
    var staticConfigProps = (function () {
        var _a;
        var _b = options || {}, variants = _b.variants, name = _b.name, defaultVariants = _b.defaultVariants, context = _b.context, defaultProps = __rest(_b, ["variants", "name", "defaultVariants", "context"]);
        var parentDefaultVariants;
        var parentDefaultProps;
        if (parentStaticConfig) {
            var avoid = parentStaticConfig.isHOC && !parentStaticConfig.isStyledHOC;
            if (!avoid) {
                var pdp = parentStaticConfig.defaultProps;
                // apply parent props only if not already defined, they are lesser specificity
                for (var key in pdp) {
                    var val = pdp[key];
                    if (parentStaticConfig.defaultVariants) {
                        if (key in parentStaticConfig.defaultVariants) {
                            // ensure we don't add it if its also in our default variants so we keep the order!
                            if (!defaultVariants || !(key in defaultVariants)) {
                                parentDefaultVariants || (parentDefaultVariants = {});
                                parentDefaultVariants[key] = val;
                            }
                        }
                    }
                    if (!(key in defaultProps) && (!defaultVariants || !(key in defaultVariants))) {
                        parentDefaultProps || (parentDefaultProps = {});
                        parentDefaultProps[key] = pdp[key];
                    }
                }
                if (parentStaticConfig.variants) {
                    // @ts-expect-error
                    variants = (0, mergeVariants_1.mergeVariants)(parentStaticConfig.variants, variants);
                }
            }
        }
        // applies everything in the right order! order is important
        if (parentDefaultProps || defaultVariants || parentDefaultVariants) {
            defaultProps = __assign(__assign(__assign(__assign({}, parentDefaultProps), parentDefaultVariants), defaultProps), defaultVariants);
        }
        if (parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.isHOC) {
            // if HOC we map name => componentName as we have a difference in how we name prop vs styled() there
            if (name) {
                // @ts-ignore
                defaultProps.componentName = name;
            }
        }
        var isText = Boolean((config === null || config === void 0 ? void 0 : config.isText) || (parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.isText));
        var acceptsClassName = (_a = config === null || config === void 0 ? void 0 : config.acceptsClassName) !== null && _a !== void 0 ? _a : (isPlainStyledComponent ||
            isReactNative ||
            ((parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.isHOC) && (parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.acceptsClassName)));
        var conf = __assign(__assign(__assign(__assign(__assign(__assign({}, parentStaticConfig), config), (!isPlainStyledComponent && {
            Component: Component,
        })), { 
            // @ts-expect-error
            variants: variants, defaultProps: defaultProps, defaultVariants: defaultVariants, componentName: name || (parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.componentName), isReactNative: isReactNative, isText: isText, acceptsClassName: acceptsClassName, context: context }), reactNativeConfig), { isStyledHOC: Boolean(parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.isHOC), parentStaticConfig: parentStaticConfig });
        // bail on non className views as well
        if (defaultProps['children'] || !acceptsClassName || context) {
            conf.neverFlatten = true;
        }
        return conf;
    })();
    var component = (0, createComponent_1.createComponent)(staticConfigProps || {});
    for (var key in ComponentIn) {
        // dont inherit propTypes
        if (key === 'propTypes')
            continue;
        if (key in component)
            continue;
        // @ts-expect-error assigning static properties over
        component[key] = ComponentIn[key];
    }
    return component;
}
// use a proxy to make styled.a(), styled.div() etc work
var styledExport = new Proxy(styled, {
    get: function (target, prop) {
        if (prop in target) {
            return target[prop];
        }
        // return factory for HTML elements
        return function (options) { return styledHtml(prop, options); };
    },
});
exports.styled = styledExport;
