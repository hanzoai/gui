"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animate = animate;
var cubicBezier_1 = require("./cubicBezier");
function animate(param) {
    var start = null;
    var easing = param.cubicBezier ? cubicBezier_1.bezier.apply(void 0, param.cubicBezier) : function (v) { return v; };
    var _a = param.from, fromX = _a.x, fromY = _a.y, fromScaleX = _a.scaleX, fromScaleY = _a.scaleY;
    var _b = param.to, toX = _b.x, toY = _b.y, toScaleX = _b.scaleX, toScaleY = _b.scaleY;
    function frame(timestamp) {
        if (!start)
            start = timestamp;
        var progress = timestamp - start;
        var x = toX !== undefined
            ? fromX + (toX - fromX) * easing(progress / param.duration)
            : undefined; // apply the easing function to the progress
        var y = toY !== undefined
            ? fromY + (toY - fromY) * easing(progress / param.duration)
            : undefined;
        var scaleX = toScaleX !== undefined
            ? fromScaleX + (toScaleX - fromScaleX) * easing(progress / param.duration)
            : undefined;
        var scaleY = toScaleY !== undefined
            ? fromScaleY + (toScaleY - fromScaleY) * easing(progress / param.duration)
            : undefined;
        param.onUpdate({ x: x, y: y, scaleX: scaleX, scaleY: scaleY });
        if (progress < param.duration) {
            requestAnimationFrame(frame); // continue animating
        }
    }
    requestAnimationFrame(frame);
}
