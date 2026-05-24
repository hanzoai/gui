"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfiguration = exports.ComponentContext = void 0;
var react_1 = require("react");
var createStyledContext_1 = require("../helpers/createStyledContext");
exports.ComponentContext = (0, createStyledContext_1.createStyledContext)({
    disableSSR: undefined,
    inText: false,
    language: null,
    animationDriver: null,
    setParentFocusState: null,
    insets: null,
});
var useConfiguration = function () {
    return (0, react_1.useContext)(exports.ComponentContext);
};
exports.useConfiguration = useConfiguration;
