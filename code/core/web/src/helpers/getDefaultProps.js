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
exports.getDefaultProps = void 0;
var config_1 = require("../config");
// merge both default props, styled context props, and default text props
var getDefaultProps = function (staticConfig, propsComponentName) {
    var _a;
    var defaultProps = staticConfig === null || staticConfig === void 0 ? void 0 : staticConfig.defaultProps;
    var conf = (0, config_1.getConfig)();
    var name = propsComponentName ||
        (staticConfig === null || staticConfig === void 0 ? void 0 : staticConfig.componentName) ||
        // important: this is how we end up getting the defaultProps we set in createHanzogui
        (staticConfig.isText ? 'Text' : 'View');
    var userDefaultProps = (_a = conf === null || conf === void 0 ? void 0 : conf.defaultProps) === null || _a === void 0 ? void 0 : _a[name];
    if (userDefaultProps) {
        // component's staticConfig.defaultProps wins over global config defaults
        defaultProps = defaultProps
            ? __assign(__assign({}, userDefaultProps), defaultProps) : userDefaultProps;
    }
    return defaultProps;
};
exports.getDefaultProps = getDefaultProps;
