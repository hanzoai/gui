"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHanzoguiComponent = isHanzoguiComponent;
function isHanzoguiComponent(comp, name) {
    var config = comp === null || comp === void 0 ? void 0 : comp['staticConfig'];
    return Boolean(config && (name ? name === config.componentName : true));
}
