"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisuallyHidden = void 0;
var web_1 = require("@hanzogui/web");
exports.VisuallyHidden = (0, web_1.styled)(web_1.Text, {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    zIndex: -10000,
    overflow: 'hidden',
    opacity: 0.00000001,
    pointerEvents: 'none',
    variants: {
        preserveDimensions: {
            true: {
                position: 'relative',
                width: 'auto',
                height: 'auto',
            },
        },
        visible: {
            true: {
                position: 'relative',
                width: 'auto',
                height: 'auto',
                margin: 0,
                zIndex: 1,
                overflow: 'visible',
                opacity: 1,
                pointerEvents: 'auto',
            },
        },
    },
});
// @tamgui/core checks for this in spacing
exports.VisuallyHidden['isVisuallyHidden'] = true;
