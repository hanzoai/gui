process.on('message', function (path) {
    var _a, _b, _c;
    if (typeof path !== 'string') {
        throw new Error("Not a string: ".concat(path));
    }
    try {
        var out = require(path);
        (_a = process.send) === null || _a === void 0 ? void 0 : _a.call(process, JSON.stringify(out));
    }
    catch (err) {
        if (err instanceof Error) {
            (_b = process.send) === null || _b === void 0 ? void 0 : _b.call(process, "-".concat(err.message, "\n").concat(err.stack));
        }
        else {
            (_c = process.send) === null || _c === void 0 ? void 0 : _c.call(process, "-".concat(err));
        }
    }
});
setInterval(function () { }, 1000);
