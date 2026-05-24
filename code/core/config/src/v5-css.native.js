"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animations = void 0;
// css animations don't work on native, fall back to react-native
var animationsReactNative_1 = require("./animationsReactNative");
Object.defineProperty(exports, "animations", { enumerable: true, get: function () { return animationsReactNative_1.animationsReactNative; } });
