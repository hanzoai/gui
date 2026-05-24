"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollection = createCollection;
var jsx_runtime_1 = require("react/jsx-runtime");
var compose_refs_1 = require("@hanzogui/compose-refs");
var constants_1 = require("@hanzogui/constants");
var core_1 = require("@hanzogui/core");
var react_1 = require("react");
// We have resorted to returning slots directly rather than exposing primitives that can then
// be slotted like `<CollectionItem as={Slot}>…</CollectionItem>`.
// This is because we encountered issues with generic types that cannot be statically analysed
// due to creating them dynamically via createCollection.
function createCollection(name) {
    /* -----------------------------------------------------------------------------------------------
     * CollectionProvider
     * ---------------------------------------------------------------------------------------------*/
    var _a = (0, core_1.createStyledContext)({
        collectionRef: { current: undefined },
        itemMap: new Map(),
    }, 'Toast'), CollectionProviderImpl = _a.Provider, useCollectionContext = _a.useStyledContext;
    var CollectionProvider = function (props) {
        var scope = props.scope, children = props.children;
        var ref = react_1.default.useRef(undefined);
        var itemMap = react_1.default.useRef(new Map()).current;
        return ((0, jsx_runtime_1.jsx)(CollectionProviderImpl, { scope: scope, itemMap: itemMap, collectionRef: ref, children: children }));
    };
    CollectionProvider.displayName = 'CollectionProvider';
    /* -----------------------------------------------------------------------------------------------
     * CollectionSlot
     * ---------------------------------------------------------------------------------------------*/
    var COLLECTION_SLOT_NAME = name + 'CollectionSlot';
    var CollectionSlot = react_1.default.forwardRef(function (props, forwardedRef) {
        var scope = props.scope, children = props.children;
        var context = useCollectionContext(scope);
        var composedRefs = (0, compose_refs_1.useComposedRefs)(forwardedRef, context.collectionRef);
        return (0, jsx_runtime_1.jsx)(core_1.Slot, { ref: composedRefs, children: children });
    });
    CollectionSlot.displayName = COLLECTION_SLOT_NAME;
    /* -----------------------------------------------------------------------------------------------
     * CollectionItem
     * ---------------------------------------------------------------------------------------------*/
    var ITEM_SLOT_NAME = name + 'CollectionItemSlot';
    var ITEM_DATA_ATTR = 'data-collection-item';
    var CollectionItemSlot = react_1.default.forwardRef(function (props, forwardedRef) {
        var _a;
        var scope = props.scope, children = props.children, itemData = __rest(props, ["scope", "children"]);
        var ref = react_1.default.useRef(undefined);
        var composedRefs = (0, compose_refs_1.useComposedRefs)(forwardedRef, ref);
        var context = useCollectionContext(scope);
        react_1.default.useEffect(function () {
            context.itemMap.set(ref, __assign({ ref: ref }, itemData));
            return function () { return void context.itemMap.delete(ref); };
        });
        return ((0, jsx_runtime_1.jsx)(core_1.Slot, (_a = {}, _a[ITEM_DATA_ATTR] = '', _a.ref = composedRefs, _a.children = children, _a)));
    });
    CollectionItemSlot.displayName = ITEM_SLOT_NAME;
    /* -----------------------------------------------------------------------------------------------
     * useCollection
     * ---------------------------------------------------------------------------------------------*/
    function useCollection(scope) {
        var context = useCollectionContext(scope);
        var getItems = react_1.default.useCallback(function () {
            if (!constants_1.isWeb) {
                return [];
            }
            var collectionNode = context.collectionRef.current;
            if (!collectionNode)
                return [];
            var orderedNodes = Array.from(collectionNode.querySelectorAll("[".concat(ITEM_DATA_ATTR, "]")));
            var items = Array.from(context.itemMap.values());
            var orderedItems = items.sort(function (a, b) {
                return orderedNodes.indexOf(a.ref.current) -
                    orderedNodes.indexOf(b.ref.current);
            });
            return orderedItems;
        }, [context.collectionRef, context.itemMap]);
        return getItems;
    }
    return [
        { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
        useCollection,
    ];
}
