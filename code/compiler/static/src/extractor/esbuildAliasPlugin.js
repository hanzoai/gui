"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esbuildAliasPlugin = void 0;
/**
 * alias plugin
 * @description
 * config example:
 * ```
 * {
 *   '@lib': '/some/absolute/path'
 * }
 * ```
 * then `import { something } from '@hanzogui/core'` will be transformed to
 * `import { something } from '/some/absolute/path/xxx'`
 * @param {object} config
 */
var esbuildAliasPlugin = function (config) {
    var alias = config && Object.keys(config);
    return {
        name: 'path-alias',
        setup: function (build) {
            if (!alias || !alias.length) {
                return;
            }
            var main = function (k, args) {
                var targetPath = config[k].replace(/\/$/, '');
                return {
                    path: targetPath,
                };
            };
            alias.forEach(function (k) {
                build.onResolve({ filter: new RegExp("^.*".concat(k, "$")) }, function (args) {
                    return main(k, args);
                });
                build.onResolve({ filter: new RegExp("^.*\\/".concat(k, "\\/.*$")) }, function (args) {
                    return main(k, args);
                });
            });
        },
    };
};
exports.esbuildAliasPlugin = esbuildAliasPlugin;
