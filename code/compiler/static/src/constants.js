"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHOULD_DEBUG = exports.FAILED_EVAL = exports.cacheDir = exports.MEDIA_SEP = exports.CSS_FILE_NAME = void 0;
var find_cache_dir_1 = require("find-cache-dir");
exports.CSS_FILE_NAME = '__snack.css';
// ENSURE THIS ISNT THE SAME AS THE SEPARATOR USED FOR STYLE KEYS
exports.MEDIA_SEP = '_';
// ensure cache dir
exports.cacheDir = (0, find_cache_dir_1.default)({ name: 'hanzogui', create: true });
exports.FAILED_EVAL = Symbol('failed_style_eval');
exports.SHOULD_DEBUG = process.env.DEBUG === '*' || ((_a = process.env.DEBUG) === null || _a === void 0 ? void 0 : _a.startsWith('hanzogui'));
