"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPresence = exports.PresenceContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
exports.PresenceContext = React.createContext(null);
var ResetPresence = function (props) {
    var parent = React.useContext(exports.PresenceContext);
    return ((0, jsx_runtime_1.jsx)(exports.PresenceContext.Provider, { value: props.disable ? parent : null, children: props.children }));
};
exports.ResetPresence = ResetPresence;
