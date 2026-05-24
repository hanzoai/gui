"use strict";
// let it be called as a template string tag function
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timer = timer;
function timer() {
    var runs = 0;
    var typesOfRuns = new Set();
    var timings = {};
    function print() {
        var typeRuns = runs / typesOfRuns.size;
        var totalTime = 0;
        var out = __spreadArray(__spreadArray([
            "Ran ".concat(typeRuns, " per-type, ").concat(runs, " total")
        ], __spreadArray([], typesOfRuns, true).map(function (name) {
            if (name.endsWith('(ignore)')) {
                // avoid counting (ignore) timings towards total
                return;
            }
            var avg = "avg ".concat("".concat(timings[name] / typeRuns).slice(0, 9).padEnd(9), "ms");
            var total = timings[name];
            totalTime += total;
            return "".concat(name.slice(0, 30).padStart(31), " | ").concat(avg, " | total ").concat(total, "ms");
        }), true), [
            "                                    total ".concat(totalTime, "ms"),
        ], false).join('\n');
        console.info(out);
        return out;
    }
    return {
        start: function (opts) {
            var _a;
            var quiet = (_a = opts === null || opts === void 0 ? void 0 : opts.quiet) !== null && _a !== void 0 ? _a : true;
            function time(strings) {
                var _a;
                var vars = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    vars[_i - 1] = arguments[_i];
                }
                var elapsed = performance.now() - start;
                var tag = templateToString.apply(void 0, __spreadArray([strings], vars, false));
                typesOfRuns.add(tag);
                runs++;
                (_a = timings[tag]) !== null && _a !== void 0 ? _a : (timings[tag] = 0);
                timings[tag] += elapsed;
                if (!quiet) {
                    var result_1 = '';
                    strings.forEach(function (str, i) {
                        result_1 += "".concat(str).concat(i === strings.length - 1 ? '' : vars[i]);
                    });
                    console.info("".concat("".concat(elapsed, "ms").slice(0, 6).padStart(7), " |"), result_1);
                }
                start = performance.now();
            }
            var start = performance.now();
            time['print'] = print;
            return time;
        },
        profile: function () {
            return {
                timings: timings,
                runs: runs,
            };
        },
        print: print,
    };
}
function templateToString(strings) {
    var vars = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        vars[_i - 1] = arguments[_i];
    }
    return strings.reduce(function (result, str, i) { return result + str + (vars[i] !== undefined ? vars[i] : ''); }, '');
}
