"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withStaticProperties = void 0;
var Decorated = Symbol();
var withStaticProperties = function (component, staticProps) {
    // add static properties
    Object.assign(component, staticProps);
    component[Decorated] = true;
    return component;
};
exports.withStaticProperties = withStaticProperties;
