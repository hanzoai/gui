"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setElementProps = setElementProps;
function setElementProps(element) {
    if (element && !element.getBoundingClientRect) {
        element.getBoundingClientRect = function () {
            if (element.unstable_getBoundingClientRect != null) {
                return element.unstable_getBoundingClientRect();
            }
        };
    }
}
