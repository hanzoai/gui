#!/usr/bin/env node
"use strict";
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
exports.generateTypes = generateTypes;
exports.getTypes = getTypes;
var fs_extra_1 = require("fs-extra");
var ts_morph_1 = require("ts-morph");
var utils_1 = require("./utils");
function generateTypes(options) {
    return __awaiter(this, void 0, void 0, function () {
        var types;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTypes(options)];
                case 1:
                    types = _a.sent();
                    return [4 /*yield*/, fs_extra_1.default.writeJSON(options.paths.types, types, {
                            spaces: 2,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getTypes(options) {
    return __awaiter(this, void 0, void 0, function () {
        var hanzogui, nameToPaths, uniqueViewExportingPaths, project, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, utils_1.loadHanzogui)(options.hanzoguiOptions)];
                case 1:
                    hanzogui = _a.sent();
                    if (!hanzogui) {
                        throw new Error("No hanzogui config");
                    }
                    nameToPaths = hanzogui.nameToPaths || [];
                    uniqueViewExportingPaths = new Set(Object.keys(nameToPaths).map(function (name) {
                        return "".concat(__spreadArray([], nameToPaths[name], true)[0], ".ts*");
                    }));
                    project = new ts_morph_1.Project({
                        compilerOptions: {
                            noEmit: false,
                            declaration: true,
                            emitDeclarationOnly: true,
                        },
                        skipAddingFilesFromTsConfig: true,
                        tsConfigFilePath: options.tsconfigPath,
                    });
                    files = project.addSourceFilesAtPaths(__spreadArray([], uniqueViewExportingPaths, true));
                    return [2 /*return*/, Object.fromEntries(files.flatMap(function (x) {
                            return __spreadArray([], x.getExportedDeclarations(), true).map(function (_a) {
                                var k = _a[0], v = _a[1];
                                return [
                                    k,
                                    v[0]
                                        .getType()
                                        .getApparentType()
                                        .getProperties()
                                        .map(function (prop) {
                                        var _a;
                                        return [
                                            prop.getEscapedName(),
                                            (_a = prop.getValueDeclaration()) === null || _a === void 0 ? void 0 : _a.getType().getText(),
                                        ];
                                    }),
                                ];
                            });
                        }))
                        // console.log(
                        //   'project',
                        //   files.map((x) => x.getFilePath()),
                        //   files.map((x) => {
                        //     return x.getExportedDeclarations()
                        //   }),
                        //   Object.fromEntries(
                        //     files.flatMap((x) => {
                        //       return [...x.getExportedDeclarations()].map(([k, v]) => {
                        //         return [k, v[0].getType().getApparentType().getText()]
                        //       })
                        //     })
                        //   ),
                        //   // files.map((f) => f.getExportSymbols())
                    ];
            }
        });
    });
}
