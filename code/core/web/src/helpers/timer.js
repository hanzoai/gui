"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.time = void 0;
var timer = require('@hanzogui/timer').timer();
setTimeout(function () {
    timer.print();
}, 2000);
exports.time = timer.start({
    quiet: true,
});
