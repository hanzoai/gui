"use strict";
// for vite dev mode
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectStyles = void 0;
var stylesheets = {};
var injectStyles = function (_a) {
    var filePath = _a.filePath, css = _a.css;
    var stylesheet = stylesheets[filePath];
    if (!stylesheet) {
        var styleEl = document.createElement('style');
        styleEl.setAttribute('data-file', filePath);
        styleEl.setAttribute('type', 'text/css');
        stylesheet = stylesheets[filePath] = styleEl;
        document.head.appendChild(styleEl);
    }
    stylesheet.innerHTML = css;
};
exports.injectStyles = injectStyles;
