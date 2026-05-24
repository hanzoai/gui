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
exports.setIdentifierValue = exports.getValueFromIdentifier = exports.Hanzogui = void 0;
var Helpers = require("@hanzogui/helpers");
var config_1 = require("./config");
var insertStyleRule_1 = require("./helpers/insertStyleRule");
var mediaState_1 = require("./helpers/mediaState");
// easy introspection
// only included in dev mode
exports.Hanzogui = (function () {
    if (process.env.NODE_ENV === 'development') {
        var HanzoguiManager = /** @class */ (function () {
            function HanzoguiManager() {
                this.Helpers = Helpers;
            }
            Object.defineProperty(HanzoguiManager.prototype, "mediaState", {
                get: function () {
                    return __assign({}, mediaState_1.mediaState);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(HanzoguiManager.prototype, "config", {
                get: function () {
                    return (0, config_1.getConfig)();
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(HanzoguiManager.prototype, "insertedRules", {
                get: function () {
                    return (0, insertStyleRule_1.getAllRules)();
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(HanzoguiManager.prototype, "allSelectors", {
                get: function () {
                    return (0, insertStyleRule_1.getAllSelectors)();
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(HanzoguiManager.prototype, "identifierToValue", {
                get: function () {
                    return identifierToValue;
                },
                enumerable: false,
                configurable: true
            });
            return HanzoguiManager;
        }());
        return new HanzoguiManager();
    }
})();
var identifierToValue = new Map();
var getValueFromIdentifier = function (identifier) {
    return identifierToValue.get(identifier);
};
exports.getValueFromIdentifier = getValueFromIdentifier;
var setIdentifierValue = function (identifier, value) {
    identifierToValue.set(identifier, value);
};
exports.setIdentifierValue = setIdentifierValue;
