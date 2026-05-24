"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeEventHandlers = composeEventHandlers;
function composeEventHandlers(og, next, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.checkDefaultPrevented, checkDefaultPrevented = _c === void 0 ? true : _c;
    if (!og || !next) {
        return next || og || undefined;
    }
    return function (event) {
        og === null || og === void 0 ? void 0 : og(event);
        if (!event ||
            !(checkDefaultPrevented &&
                typeof event === 'object' &&
                'defaultPrevented' in event) ||
            // @ts-ignore
            ('defaultPrevented' in event && !event.defaultPrevented)) {
            return next === null || next === void 0 ? void 0 : next(event);
        }
    };
}
