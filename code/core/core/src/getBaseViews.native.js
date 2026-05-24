"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseViews = getBaseViews;
function getBaseViews() {
    var _a, _b, _c, _d;
    var native = require('react-native');
    return {
        View: native.View || ((_a = native.default) === null || _a === void 0 ? void 0 : _a.View),
        Text: native.Text || ((_b = native.default) === null || _b === void 0 ? void 0 : _b.Text),
        TextAncestor: native.unstable_TextAncestorContext,
        StyleSheet: native.StyleSheet || ((_c = native.default) === null || _c === void 0 ? void 0 : _c.StyleSheet),
        Pressable: native.Pressable || ((_d = native.default) === null || _d === void 0 ? void 0 : _d.Pressable),
    };
}
