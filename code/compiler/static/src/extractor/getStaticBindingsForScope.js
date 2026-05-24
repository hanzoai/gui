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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupBeforeExit = cleanupBeforeExit;
exports.getStaticBindingsForScope = getStaticBindingsForScope;
var node_child_process_1 = require("node:child_process");
var node_path_1 = require("node:path");
var t = require("@babel/types");
var evaluateAstNode_1 = require("./evaluateAstNode");
var getSourceModule_1 = require("./getSourceModule");
// import { fileURLToPath } from 'node:url'
// // @ts-ignore
// const __dirname = dirname(fileURLToPath(import.meta.url))
var isLocalImport = function (path) { return path.startsWith('.') || path.startsWith('/'); };
function resolveImportPath(sourcePath, path) {
    var sourceDir = (0, node_path_1.dirname)(sourcePath);
    if (isLocalImport(path)) {
        if ((0, node_path_1.extname)(path) === '') {
            path += '';
        }
        return (0, node_path_1.resolve)(sourceDir, path);
    }
    return path;
}
var cache = new Map();
var pending = new Map();
var loadCmd = "".concat((0, node_path_1.join)(__dirname, 'loadFile.js'));
var exited = false;
var child = null;
function forkChild() {
    child = (0, node_child_process_1.fork)(loadCmd, [], {
        execArgv: ['-r', 'esbuild-register'],
        detached: false,
        stdio: 'ignore',
    });
}
function cleanupBeforeExit() {
    if (exited)
        return;
    if (!child)
        return;
    child.removeAllListeners();
    child.unref();
    child.disconnect();
    child.kill();
    exited = true;
}
process.once('SIGTERM', cleanupBeforeExit);
process.once('SIGINT', cleanupBeforeExit);
process.once('beforeExit', cleanupBeforeExit);
function importModule(path) {
    if (!child) {
        forkChild();
    }
    if (pending.has(path)) {
        return pending.get(path);
    }
    var promise = new Promise(function (res, rej) {
        if (!child)
            return;
        if (cache.size > 2000) {
            cache.clear();
        }
        if (cache.has(path)) {
            return cache.get(path);
        }
        var listener = function (msg) {
            if (!child)
                return;
            if (!msg)
                return;
            if (typeof msg !== 'string')
                return;
            if (msg[0] === '-') {
                rej(new Error(msg.slice(1)));
                return;
            }
            child.removeListener('message', listener);
            var val = JSON.parse(msg);
            cache.set(path, val);
            res(val);
        };
        child.once('message', listener);
        child.send("".concat(path.replace('.js', '')));
    }).finally(function () {
        // clean up pending map to prevent memory leak
        pending.delete(path);
    });
    pending.set(path, promise);
    return promise;
}
function getStaticBindingsForScope(scope_1) {
    return __awaiter(this, arguments, void 0, function (scope, whitelist, sourcePath, bindingCache, shouldPrintDebug) {
        var bindings, ret, program, _loop_1, _i, _a, node, _loop_2, k, state_1;
        var _b;
        if (whitelist === void 0) { whitelist = []; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    bindings = scope.getAllBindings();
                    ret = {};
                    if (shouldPrintDebug) {
                        // prettier-ignore
                        // console.info('  ', Object.keys(bindings).length, 'variables in scope')
                        // .map(x => bindings[x].identifier?.name).join(', ')
                    }
                    program = scope.getProgramParent().block;
                    _loop_1 = function (node) {
                        var importPath, moduleName_1, isOnWhitelist, src, _d, _e, specifier, val, err_1;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    if (!t.isImportDeclaration(node)) return [3 /*break*/, 4];
                                    importPath = node.source.value;
                                    if (!node.specifiers.length)
                                        return [2 /*return*/, "continue"];
                                    if (!isLocalImport(importPath)) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    moduleName_1 = resolveImportPath(sourcePath, importPath);
                                    isOnWhitelist = whitelist.some(function (test) { return moduleName_1.endsWith(test); });
                                    if (!isOnWhitelist)
                                        return [2 /*return*/, "continue"];
                                    _f.label = 1;
                                case 1:
                                    _f.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, importModule(moduleName_1)];
                                case 2:
                                    src = _f.sent();
                                    if (!src)
                                        return [2 /*return*/, "continue"];
                                    for (_d = 0, _e = node.specifiers; _d < _e.length; _d++) {
                                        specifier = _e[_d];
                                        if (t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported)) {
                                            if (typeof src[specifier.imported.name] !== 'undefined') {
                                                val = src[specifier.local.name];
                                                ret[specifier.local.name] = val;
                                            }
                                        }
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _f.sent();
                                    if (shouldPrintDebug) {
                                        console.warn("    | Skipping partial evaluation of constant file: ".concat(moduleName_1, " (DEBUG=hanzogui for more)"));
                                    }
                                    else if ((_b = process.env.DEBUG) === null || _b === void 0 ? void 0 : _b.startsWith('hanzogui')) {
                                        console.info("Error in partial evaluation", err_1.message, err_1.stack);
                                    }
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = program.body;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    node = _a[_i];
                    return [5 /*yield**/, _loop_1(node)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!bindingCache) {
                        throw new Error('BindingCache is a required param');
                    }
                    _loop_2 = function (k) {
                        var binding = bindings[k];
                        // check to see if the item is a module
                        var sourceModule = (0, getSourceModule_1.getSourceModule)(k, binding);
                        if (sourceModule) {
                            if (!sourceModule.sourceModule) {
                                return "continue";
                            }
                            var moduleName_2 = resolveImportPath(sourcePath, sourceModule.sourceModule);
                            var isOnWhitelist = whitelist.some(function (test) { return moduleName_2.endsWith(test); });
                            // TODO we could cache this at the file level.. and check if its been touched since
                            if (isOnWhitelist) {
                                var src = importModule(moduleName_2);
                                if (!src) {
                                    console.info("    | \u26A0\uFE0F Missing file ".concat(moduleName_2, " via ").concat(sourcePath, " import ").concat(sourceModule.sourceModule, "?"));
                                    return { value: {} };
                                }
                                if (sourceModule.destructured) {
                                    if (sourceModule.imported) {
                                        ret[k] = src[sourceModule.imported];
                                    }
                                }
                                else {
                                    ret[k] = src;
                                }
                            }
                            return "continue";
                        }
                        var parent_1 = binding.path.parent;
                        if (!t.isVariableDeclaration(parent_1) || parent_1.kind !== 'const') {
                            return "continue";
                        }
                        // pick out the right variable declarator
                        var dec = parent_1.declarations.find(function (d) { return t.isIdentifier(d.id) && d.id.name === k; });
                        // if init is not set, there's nothing to evaluate
                        // TODO: handle spread syntax
                        if (!dec || !dec.init) {
                            return "continue";
                        }
                        // missing start/end will break caching
                        if (typeof dec.id.start !== 'number' || typeof dec.id.end !== 'number') {
                            console.error('dec.id.start/end is not a number');
                            return "continue";
                        }
                        if (!t.isIdentifier(dec.id)) {
                            console.error('dec is not an identifier');
                            return "continue";
                        }
                        var cacheKey = "".concat(dec.id.name, "_").concat(dec.id.start, "-").concat(dec.id.end);
                        // retrieve value from cache
                        if (Object.hasOwnProperty.call(bindingCache, cacheKey)) {
                            ret[k] = bindingCache[cacheKey];
                            return "continue";
                        }
                        // retrieve value from cache
                        if (Object.hasOwnProperty.call(bindingCache, cacheKey)) {
                            ret[k] = bindingCache[cacheKey];
                            return "continue";
                        }
                        // evaluate
                        try {
                            ret[k] = (0, evaluateAstNode_1.evaluateAstNode)(dec.init, undefined, shouldPrintDebug);
                            bindingCache[cacheKey] = ret[k];
                            return "continue";
                        }
                        catch (_g) {
                            // skip
                        }
                    };
                    for (k in bindings) {
                        state_1 = _loop_2(k);
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                    }
                    return [2 /*return*/, ret];
            }
        });
    });
}
