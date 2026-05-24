"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readHanzoguiOptions = readHanzoguiOptions;
var node_path_1 = require("node:path");
var fs_extra_1 = require("fs-extra");
var getDefaultHanzoguiOptions_1 = require("./getDefaultHanzoguiOptions");
function readHanzoguiOptions(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var filePath, options, _c, _d, err_1;
        var _e, _f, _g;
        var _h = _b.cwd, cwd = _h === void 0 ? '.' : _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    filePath = (0, node_path_1.join)(cwd, 'hanzogui.json');
                    return [4 /*yield*/, (0, fs_extra_1.pathExists)(filePath)];
                case 1:
                    if (!!(_j.sent())) return [3 /*break*/, 3];
                    _e = {
                        exists: false
                    };
                    return [4 /*yield*/, (0, getDefaultHanzoguiOptions_1.getDefaultHanzoguiOptions)({ cwd: cwd })];
                case 2: return [2 /*return*/, (_e.options = _j.sent(),
                        _e)];
                case 3:
                    _j.trys.push([3, 7, , 9]);
                    return [4 /*yield*/, (0, fs_extra_1.readJSON)(filePath)];
                case 4:
                    options = (_j.sent());
                    if (!Array.isArray(options.components)) {
                        throw new Error("Invalid components: not string[]");
                    }
                    _f = {
                        exists: true
                    };
                    _c = [{}];
                    _d = !options.config;
                    if (!_d) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, getDefaultHanzoguiOptions_1.getDefaultHanzoguiOptions)({ cwd: cwd })];
                case 5:
                    _d = (_j.sent());
                    _j.label = 6;
                case 6: return [2 /*return*/, (_f.options = __assign.apply(void 0, [__assign.apply(void 0, _c.concat([(_d)])), options]),
                        _f)];
                case 7:
                    err_1 = _j.sent();
                    console.error("Error reading hanzogui.json: ".concat(err_1.message, " ").concat(err_1.stack));
                    _g = {
                        exists: false
                    };
                    return [4 /*yield*/, (0, getDefaultHanzoguiOptions_1.getDefaultHanzoguiOptions)({ cwd: cwd })];
                case 8: return [2 /*return*/, (_g.options = _j.sent(),
                        _g)];
                case 9: return [2 /*return*/];
            }
        });
    });
}
