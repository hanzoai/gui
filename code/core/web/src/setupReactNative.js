"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReactNativeConfig = getReactNativeConfig;
var ReactNativeStaticConfigs = new WeakMap();
function getReactNativeConfig(Component) {
    var _a, _b, _c, _d;
    if (!Component)
        return;
    if (process.env.TAMAGUI_TARGET === 'native') {
        if (((_a = Component.propTypes) === null || _a === void 0 ? void 0 : _a.onTextInput) || ((_b = Component.propTypes) === null || _b === void 0 ? void 0 : _b.onChangeText)) {
            return RNConfigs.TextInput;
        }
        if (Component.getSizeWithHeaders) {
            return RNConfigs.Image;
        }
        if ((_c = Component.propTypes) === null || _c === void 0 ? void 0 : _c.textBreakStrategy) {
            return RNConfigs.Text;
        }
        // can optimize plain View or Text to not be react native specific
        // can assume everything else is react native on native
        return RNConfigs.default;
    }
    if (Component.getSize && Component.prefetch) {
        return RNConfigs.Image;
    }
    if (Component.displayName === 'Text' && Component.render) {
        return RNConfigs.Text;
    }
    if (Component.render &&
        (Component.displayName === 'ScrollView' || Component.displayName === 'View')) {
        return RNConfigs.default;
    }
    if ((_d = Component.State) === null || _d === void 0 ? void 0 : _d.blurTextInput) {
        return RNConfigs.TextInput;
    }
    return ReactNativeStaticConfigs.get(Component);
}
var RNConfigs = {
    Image: {
        isReactNative: true,
        inlineProps: new Set(['src', 'width', 'height']),
    },
    Text: {
        isReactNative: true,
        isText: true,
    },
    TextInput: {
        isReactNative: true,
        isInput: true,
        isText: true,
    },
    default: {
        isReactNative: true,
    },
};
