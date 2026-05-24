"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getButtonSized = void 0;
var get_token_1 = require("@hanzogui/get-token");
var getButtonSized = function (val, _a) {
    var _b;
    var tokens = _a.tokens, props = _a.props;
    if (!val || props.circular) {
        return;
    }
    if (typeof val === 'number') {
        return {
            paddingHorizontal: val * 0.25,
            height: val,
            borderRadius: props.circular ? 100000 : val * 0.2,
        };
    }
    var xSize = (0, get_token_1.getSpace)(val);
    var radiusToken = (_b = tokens.radius[val]) !== null && _b !== void 0 ? _b : tokens.radius['$true'];
    return {
        paddingHorizontal: xSize,
        height: val,
        borderRadius: props.circular ? 100000 : radiusToken,
    };
};
exports.getButtonSized = getButtonSized;
