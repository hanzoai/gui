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
exports.Image = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
var React = require("react");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var react_native_web_internals_2 = require("@hanzogui/react-native-web-internals");
var index_1 = require("../createElement/index");
var index_2 = require("../PixelRatio/index");
var index_3 = require("../View/index");
var ERRORED = 'ERRORED';
var LOADED = 'LOADED';
var LOADING = 'LOADING';
var IDLE = 'IDLE';
var _filterId = 0;
var svgDataUriPattern = /^(data:image\/svg\+xml;utf8,)(.*)/;
function createTintColorSVG(tintColor, id) {
    return tintColor && id != null ? ((0, jsx_runtime_1.jsx)("svg", { style: {
            position: 'absolute',
            height: 0,
            visibility: 'hidden',
            width: 0,
        }, children: (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("filter", { id: "tint-".concat(id), suppressHydrationWarning: true, children: [(0, jsx_runtime_1.jsx)("feFlood", { floodColor: "".concat(tintColor) }, tintColor), (0, jsx_runtime_1.jsx)("feComposite", { in2: "SourceAlpha", operator: "atop" })] }) }) })) : null;
}
function getFlatStyle(style, blurRadius, filterId) {
    var flatStyle = react_native_web_internals_1.StyleSheet.flatten(style);
    var filter = flatStyle.filter, resizeMode = flatStyle.resizeMode, shadowOffset = flatStyle.shadowOffset, tintColor = flatStyle.tintColor;
    // Add CSS filters
    // React Native exposes these features as props and proprietary styles
    var filters = [];
    var _filter = null;
    if (filter) {
        filters.push(filter);
    }
    if (blurRadius) {
        filters.push("blur(".concat(blurRadius, "px)"));
    }
    if (shadowOffset) {
        var shadowString = (0, react_native_web_internals_1.createBoxShadowValue)(flatStyle);
        if (shadowString) {
            filters.push("drop-shadow(".concat(shadowString, ")"));
        }
    }
    if (tintColor && filterId != null) {
        filters.push("url(#tint-".concat(filterId, ")"));
    }
    if (filters.length > 0) {
        _filter = filters.join(' ');
    }
    // These styles are converted to CSS filters applied to the
    // element displaying the background image.
    delete flatStyle.blurRadius;
    delete flatStyle.shadowColor;
    delete flatStyle.shadowOpacity;
    delete flatStyle.shadowOffset;
    delete flatStyle.shadowRadius;
    delete flatStyle.tintColor;
    // These styles are not supported on View
    delete flatStyle.overlayColor;
    delete flatStyle.resizeMode;
    return [flatStyle, resizeMode, _filter, tintColor];
}
function resolveAssetDimensions(source) {
    if (typeof source === 'number') {
        var _a = (0, react_native_web_internals_2.getAssetByID)(source), height = _a.height, width = _a.width;
        return { height: height, width: width };
    }
    else if (source != null && !Array.isArray(source) && typeof source === 'object') {
        var height = source.height, width = source.width;
        return { height: height, width: width };
    }
}
function resolveAssetUri(source) {
    var uri = null;
    if (typeof source === 'number') {
        // get the URI from the packager
        var asset = (0, react_native_web_internals_2.getAssetByID)(source);
        var scale = asset.scales[0];
        if (asset.scales.length > 1) {
            var preferredScale_1 = index_2.PixelRatio.get();
            // Get the scale which is closest to the preferred scale
            scale = asset.scales.reduce(function (prev, curr) {
                return Math.abs(curr - preferredScale_1) < Math.abs(prev - preferredScale_1) ? curr : prev;
            });
        }
        var scaleSuffix = scale !== 1 ? "@".concat(scale, "x") : '';
        uri = asset
            ? "".concat(asset.httpServerLocation, "/").concat(asset.name).concat(scaleSuffix, ".").concat(asset.type)
            : '';
    }
    else if (typeof source === 'string') {
        uri = source;
    }
    else if (source && typeof source.uri === 'string') {
        uri = source.uri;
    }
    if (uri) {
        var match = uri.match(svgDataUriPattern);
        // inline SVG markup may contain characters (e.g., #, ") that need to be escaped
        if (match) {
            var prefix = match[1], svg = match[2];
            var encodedSvg = encodeURIComponent(svg);
            return "".concat(prefix).concat(encodedSvg);
        }
    }
    return uri;
}
var Image = React.forwardRef(function (props, ref) {
    var accessibilityLabel = props.accessibilityLabel, blurRadius = props.blurRadius, defaultSource = props.defaultSource, draggable = props.draggable, onError = props.onError, onLayout = props.onLayout, onLoad = props.onLoad, onLoadEnd = props.onLoadEnd, onLoadStart = props.onLoadStart, pointerEvents = props.pointerEvents, source = props.source, style = props.style, rest = __rest(props, ["accessibilityLabel", "blurRadius", "defaultSource", "draggable", "onError", "onLayout", "onLoad", "onLoadEnd", "onLoadStart", "pointerEvents", "source", "style"]);
    if (process.env.NODE_ENV !== 'production') {
        if (props.children) {
            throw new Error('The <Image> component cannot contain children. If you want to render content on top of the image, consider using the <ImageBackground> component or absolute positioning.');
        }
    }
    var _a = React.useState(function () {
        var uri = resolveAssetUri(source);
        if (uri != null) {
            var isLoaded = react_native_web_internals_2.ImageLoader.has(uri);
            if (isLoaded) {
                return LOADED;
            }
        }
        return IDLE;
    }), state = _a[0], updateState = _a[1];
    var _b = React.useState({}), layout = _b[0], updateLayout = _b[1];
    var hasTextAncestor = React.useContext(react_native_web_internals_1.TextAncestorContext);
    var hiddenImageRef = React.useRef(null);
    var filterRef = React.useRef(_filterId++);
    var requestRef = React.useRef(null);
    var shouldDisplaySource = state === LOADED || (state === LOADING && defaultSource == null);
    var _c = getFlatStyle({}, blurRadius, filterRef.current), flatStyle = _c[0], _resizeMode = _c[1], filter = _c[2], tintColor = _c[3];
    var resizeMode = props.resizeMode || _resizeMode || 'cover';
    var selectedSource = shouldDisplaySource ? source : defaultSource;
    var displayImageUri = resolveAssetUri(selectedSource);
    var imageSizeStyle = resolveAssetDimensions(selectedSource);
    var backgroundImage = displayImageUri ? "url(\"".concat(displayImageUri, "\")") : null;
    var backgroundSize = getBackgroundSize();
    // Accessibility image allows users to trigger the browser's image context menu
    var hiddenImage = displayImageUri
        ? (0, index_1.createElement)('img', {
            alt: accessibilityLabel || '',
            style: styles.accessibilityImage$raw,
            draggable: draggable || false,
            ref: hiddenImageRef,
            src: displayImageUri,
        })
        : null;
    function getBackgroundSize() {
        if (hiddenImageRef.current != null &&
            (resizeMode === 'center' || resizeMode === 'repeat')) {
            var _a = hiddenImageRef.current, naturalHeight = _a.naturalHeight, naturalWidth = _a.naturalWidth;
            var _b = layout, height = _b.height, width = _b.width;
            if (naturalHeight && naturalWidth && height && width) {
                var scaleFactor = Math.min(1, width / naturalWidth, height / naturalHeight);
                var x = Math.ceil(scaleFactor * naturalWidth);
                var y = Math.ceil(scaleFactor * naturalHeight);
                return "".concat(x, "px ").concat(y, "px");
            }
        }
    }
    function handleLayout(e) {
        if (resizeMode === 'center' || resizeMode === 'repeat' || onLayout) {
            var layout_1 = e.nativeEvent.layout;
            onLayout && onLayout(e);
            updateLayout(layout_1);
        }
    }
    // Image loading
    var uri = resolveAssetUri(source);
    React.useEffect(function () {
        abortPendingRequest();
        if (uri != null) {
            updateState(LOADING);
            if (onLoadStart) {
                // @ts-ignore
                onLoadStart();
            }
            // @ts-ignore
            requestRef.current = react_native_web_internals_2.ImageLoader.load(uri, function load(e) {
                updateState(LOADED);
                if (onLoad) {
                    onLoad(e);
                }
                if (onLoadEnd) {
                    // @ts-ignore
                    onLoadEnd();
                }
            }, function error() {
                updateState(ERRORED);
                if (onError) {
                    onError({
                        nativeEvent: {
                            error: "Failed to load resource ".concat(uri, " (404)"),
                        },
                    });
                }
                if (onLoadEnd) {
                    // @ts-ignore
                    onLoadEnd();
                }
            });
        }
        function abortPendingRequest() {
            if (requestRef.current != null) {
                react_native_web_internals_2.ImageLoader.abort(requestRef.current);
                requestRef.current = null;
            }
        }
        return abortPendingRequest;
    }, [uri, requestRef, updateState, onError, onLoad, onLoadEnd, onLoadStart]);
    return ((0, jsx_runtime_1.jsxs)(index_3.View, __assign({}, rest, { "aria-label": accessibilityLabel, onLayout: handleLayout, pointerEvents: pointerEvents, ref: ref, style: [
            style,
            styles.root,
            hasTextAncestor && styles.inline,
            imageSizeStyle,
            flatStyle,
        ], children: [(0, jsx_runtime_1.jsx)(index_3.View, { style: __spreadArray(__spreadArray([], [].concat(styles.image), true), [
                    resizeModeStyles[resizeMode],
                    { backgroundImage: backgroundImage, filter: filter },
                    backgroundSize != null && { backgroundSize: backgroundSize },
                ], false), 
                // @ts-ignore
                suppressHydrationWarning: true }), hiddenImage, createTintColorSVG(tintColor, filterRef.current)] })));
});
Image.displayName = 'Image';
var ImageWithStatics = Image;
exports.Image = ImageWithStatics;
// @ts-ignore
ImageWithStatics.getSize = function (uri, success, failure) {
    react_native_web_internals_2.ImageLoader.getSize(uri, success, failure);
};
// @ts-ignore
ImageWithStatics.prefetch = function (uri) {
    return react_native_web_internals_2.ImageLoader.prefetch(uri);
};
// @ts-ignore
ImageWithStatics.queryCache = function (uris) {
    return react_native_web_internals_2.ImageLoader.queryCache(uris);
};
var styles = react_native_web_internals_1.StyleSheet.create({
    root: {
        flexBasis: 'auto',
        overflow: 'hidden',
        zIndex: 0,
    },
    inline: {
        display: 'inline-flex',
    },
    image: __assign(__assign({}, react_native_web_internals_1.StyleSheet.absoluteFillObject), { backgroundColor: 'transparent', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '100%', width: '100%', zIndex: -1 }),
    accessibilityImage$raw: __assign(__assign({}, react_native_web_internals_1.StyleSheet.absoluteFillObject), { height: '100%', opacity: 0, width: '100%', zIndex: -1 }),
});
var resizeModeStyles = react_native_web_internals_1.StyleSheet.create({
    center: {
        backgroundSize: 'auto',
    },
    contain: {
        backgroundSize: 'contain',
    },
    cover: {
        backgroundSize: 'cover',
    },
    none: {
        backgroundPosition: '0',
        backgroundSize: 'auto',
    },
    repeat: {
        backgroundPosition: '0',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
    },
    stretch: {
        backgroundSize: '100% 100%',
    },
});
exports.default = ImageWithStatics;
