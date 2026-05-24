"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timer = void 0;
var timer = function () {
    var start = Date.now();
    var last = start;
    return {
        mark: function (name, print) {
            if (print === void 0) { print = false; }
            if (print) {
                var took = Date.now() - last;
                last = Date.now();
                console.info("Time ".concat(name, ": ").concat(took, "ms"));
                if (took > 10) {
                    console.info('  long timer');
                }
            }
        },
        done: function (print) {
            if (print === void 0) { print = false; }
            if (print) {
                var total = Date.now() - start;
                console.info("Total time: ".concat(total, "ms"));
                if (total > 50) {
                    console.info('  long timer');
                }
            }
        },
    };
};
exports.timer = timer;
