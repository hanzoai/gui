"use strict";
// @ts-nocheck
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
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
exports.AppRegistry = void 0;
var react_dom_1 = require("react-dom");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var renderApplication_1 = require("./renderApplication");
var emptyObject = {};
var runnables = {};
var componentProviderInstrumentationHook = function (component) { return component(); };
var wrapperComponentProvider;
/**
 * `AppRegistry` is the JS entry point to running all React Native apps.
 */
var AppRegistry = /** @class */ (function () {
    function AppRegistry() {
    }
    AppRegistry.getAppKeys = function () {
        return Object.keys(runnables);
    };
    AppRegistry.getApplication = function (appKey, appParameters) {
        var _a, _b;
        (0, react_native_web_internals_1.invariant)(runnables[appKey] && runnables[appKey].getApplication, "Application ".concat(appKey, " has not been registered. ") +
            'This is either due to an import error during initialization or failure to call AppRegistry.registerComponent.');
        // @ts-ignore
        return (_b = (_a = runnables[appKey]) === null || _a === void 0 ? void 0 : _a.getApplication) === null || _b === void 0 ? void 0 : _b.call(_a, appParameters);
    };
    AppRegistry.registerComponent = function (appKey, componentProvider) {
        runnables[appKey] = {
            getApplication: function (appParameters) {
                return (0, renderApplication_1.getApplication)(componentProviderInstrumentationHook(componentProvider), appParameters ? appParameters.initialProps : emptyObject, wrapperComponentProvider && wrapperComponentProvider(appParameters));
            },
            run: function (appParameters) {
                return (0, renderApplication_1.renderApplication)(componentProviderInstrumentationHook(componentProvider), wrapperComponentProvider && wrapperComponentProvider(appParameters), appParameters.callback, {
                    hydrate: appParameters.hydrate || false,
                    initialProps: appParameters.initialProps || emptyObject,
                    mode: appParameters.mode || 'legacy',
                    rootTag: appParameters.rootTag,
                });
            },
        };
        return appKey;
    };
    AppRegistry.registerConfig = function (config) {
        config.forEach(function (_a) {
            var appKey = _a.appKey, component = _a.component, run = _a.run;
            if (run) {
                AppRegistry.registerRunnable(appKey, run);
            }
            else {
                (0, react_native_web_internals_1.invariant)(component, 'No component provider passed in');
                // @ts-ignore
                AppRegistry.registerComponent(appKey, component);
            }
        });
    };
    // TODO: fix style sheet creation when using this method
    AppRegistry.registerRunnable = function (appKey, run) {
        // @ts-ignore
        runnables[appKey] = { run: run };
        return appKey;
    };
    AppRegistry.runApplication = function (appKey, appParameters) {
        var isDevelopment = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';
        if (isDevelopment) {
            var params = __assign({}, appParameters);
            params.rootTag = "#".concat(params.rootTag.id);
            console.log("Running application \"".concat(appKey, "\" with appParams:\n"), params, "\nDevelopment-level warnings: ".concat(isDevelopment ? 'ON' : 'OFF', ".") +
                "\nPerformance optimizations: ".concat(isDevelopment ? 'OFF' : 'ON', "."));
        }
        (0, react_native_web_internals_1.invariant)(runnables[appKey] && runnables[appKey].run, "Application \"".concat(appKey, "\" has not been registered. ") +
            'This is either due to an import error during initialization or failure to call AppRegistry.registerComponent.');
        return runnables[appKey].run(appParameters);
    };
    AppRegistry.setComponentProviderInstrumentationHook = function (hook) {
        componentProviderInstrumentationHook = hook;
    };
    AppRegistry.setWrapperComponentProvider = function (provider) {
        wrapperComponentProvider = provider;
    };
    AppRegistry.unmountApplicationComponentAtRootTag = function (rootTag) {
        (0, react_dom_1.unmountComponentAtNode)(rootTag);
    };
    return AppRegistry;
}());
exports.AppRegistry = AppRegistry;
