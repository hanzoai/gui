"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUid = generateUid;
var t = require("@babel/types");
// A clone of path.scope.generateUid that doesn't prepend underscores
function generateUid(scope, name) {
    if (!(typeof scope === 'object'))
        throw 'generateUid expects a scope object as its first parameter';
    if (!(typeof name === 'string' && name !== ''))
        throw 'generateUid expects a valid name as its second parameter';
    name = t
        .toIdentifier(name)
        .replace(/^_+/, '')
        .replace(/[0-9]+$/g, '');
    var uid;
    var i = 0;
    do {
        if (i > 1) {
            uid = name + i;
        }
        else {
            uid = name;
        }
        i++;
    } while (scope.hasLabel(uid) ||
        scope.hasBinding(uid) ||
        scope.hasGlobal(uid) ||
        scope.hasReference(uid));
    var program = scope.getProgramParent();
    program.references[uid] = true;
    program.uids[uid] = true;
    return uid;
}
