"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useElementLayout = useElementLayout;
var use_element_layout_1 = require("@hanzogui/use-element-layout");
var react_1 = require("react");
function useElementLayout(ref, onLayout) {
    // translates to hanzogui style
    var wrappedRef = (0, react_1.useMemo)(function () {
        return {
            current: {
                get host() {
                    return ref.current;
                },
            },
        };
    }, [ref]);
    (0, react_1.useEffect)(function () {
        (0, use_element_layout_1.enable)();
    }, []);
    return (0, use_element_layout_1.useElementLayout)(wrappedRef, onLayout);
}
