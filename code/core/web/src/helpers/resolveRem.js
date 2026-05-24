"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRem = resolveRem;
exports.isRemValue = isRemValue;
/**
 * Resolves rem values on web platforms.
 * On web, browsers handle rem natively, so we just return the value as-is.
 *
 * @param value - A string value containing rem units
 * @returns The same string value (browsers handle rem natively)
 */
function resolveRem(value) {
    return value;
}
/**
 * Checks if a value is a rem string
 */
function isRemValue(value) {
    return typeof value === 'string' && value.includes('rem');
}
