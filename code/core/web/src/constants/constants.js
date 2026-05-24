"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MISSING_THEME_MESSAGE = exports.FONT_DATA_ATTRIBUTE_NAME = exports.THEME_CLASSNAME_PREFIX = exports.THEME_NAME_SEPARATOR = void 0;
exports.THEME_NAME_SEPARATOR = '_';
exports.THEME_CLASSNAME_PREFIX = 't_';
exports.FONT_DATA_ATTRIBUTE_NAME = 'data-hanzogui-font';
exports.MISSING_THEME_MESSAGE = process.env.NODE_ENV === 'development'
    ? "Can't find Hanzogui configuration.\n    \nMost of the time this is due to having mis-matched versions of Hanzogui dependencies, or bundlers somehow duplicating them.\nFirst step is to ensure every \"hanzogui\" and \"@hanzogui/*\" dependency is on the same version, we have a CLI tool to help: \n\n  npx @hanzogui/cli check\n"
    : "Missing theme.";
