"use strict";
// perf sensitive so doing some weird stuff
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatClassName = concatClassName;
function concatClassName(_cn) {
    var args = arguments;
    var usedPrefixes = new Set();
    var final = '';
    var len = args.length;
    var propObjects = null;
    for (var x = len; x >= 0; x--) {
        var cns = args[x];
        if (!cns)
            continue;
        if (!Array.isArray(cns) && typeof cns !== 'string') {
            // is prop object
            propObjects = propObjects || [];
            propObjects.push(cns);
            continue;
        }
        var names = Array.isArray(cns) ? cns : cns.split(' ');
        var numNames = names.length;
        var _loop_1 = function (i) {
            var name_1 = names[i];
            if (!name_1 || name_1 === ' ')
                return "continue";
            if (name_1[0] !== '_') {
                // not snack style (todo slightly stronger heuristic)
                final = name_1 + ' ' + final;
                return "continue";
            }
            var splitIndex = name_1.indexOf('-');
            if (splitIndex < 1) {
                final = name_1 + ' ' + final;
                return "continue";
            }
            var nextChar = name_1[splitIndex + 1];
            // synced to static-ui constants
            // MEDIA_SEP
            var isMediaQuery = nextChar === '_';
            // PSEUDO_SEP
            // commenting out three things to make pseudos override properly
            // (leave in for a bit to see if other bugs pop up later):
            // 1. const isPseudoQuery = nextChar === '0'
            var styleKey = name_1.slice(1, name_1.indexOf('-'));
            // 2. isMediaQuery || isPseudoQuery
            // extract just the media query name (e.g., 'lg' '_pr-_lg_260px')
            // by finding the underscore after the media key name
            var mediaStart = splitIndex + 2;
            var mediaEnd = name_1.indexOf('_', mediaStart);
            var mediaKey = isMediaQuery && mediaEnd > mediaStart ? name_1.slice(mediaStart, mediaEnd) : null;
            var uid = mediaKey ? styleKey + mediaKey : styleKey;
            // 3. && !isPseudoQuery
            if (usedPrefixes.has(uid)) {
                return "continue";
            }
            usedPrefixes.add(uid);
            // overrides for full safety
            var propName = styleKey;
            if (propName && propObjects) {
                if (propObjects.some(function (po) {
                    if (mediaKey) {
                        var propKey = pseudoInvert[mediaKey];
                        return po && po[propKey] && propName in po[propKey] && po[propKey] !== null;
                    }
                    var res = po && propName in po && po[propName] !== null;
                    return res;
                })) {
                    return "continue";
                }
            }
            final = name_1 + ' ' + final;
        };
        for (var i = numNames - 1; i >= 0; i--) {
            _loop_1(i);
        }
    }
    return final.trim();
}
var pseudoInvert = {
    hover: 'hoverStyle',
    focus: 'focusStyle',
    press: 'pressStyle',
    focusVisible: 'focusVisibleStyle',
    focusWithin: 'focusWithinStyle',
    disabled: 'disabledStyle',
};
