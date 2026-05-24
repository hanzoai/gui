"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Em = exports.Span = exports.Strong = void 0;
var web_1 = require("@hanzogui/web");
exports.Strong = (0, web_1.styled)(web_1.Text, {
    render: 'strong',
    fontWeight: 'bold',
});
exports.Span = (0, web_1.styled)(web_1.Text, {
    render: 'span',
});
exports.Em = (0, web_1.styled)(web_1.Text, {
    render: 'em',
    fontStyle: 'italic',
});
