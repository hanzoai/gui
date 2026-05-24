"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHanzoguiElement = void 0;
var react_1 = require("react");
var isHanzoguiComponent_1 = require("./isHanzoguiComponent");
var isHanzoguiElement = function (child, name) {
    return react_1.default.isValidElement(child) && (0, isHanzoguiComponent_1.isHanzoguiComponent)(child.type, name);
};
exports.isHanzoguiElement = isHanzoguiElement;
