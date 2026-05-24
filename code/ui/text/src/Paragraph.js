"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paragraph = void 0;
var web_1 = require("@hanzogui/web");
var SizableText_1 = require("./SizableText");
exports.Paragraph = (0, web_1.styled)(SizableText_1.SizableText, {
    name: 'Paragraph',
    render: 'p',
    userSelect: 'auto',
    color: '$color',
    size: '$true',
    whiteSpace: 'normal',
});
