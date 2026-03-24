var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../core/test-design-system/dist/cjs/index.cjs
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = /* @__PURE__ */ __name((target, all) => {
  for (var name in all) __defProp2(target, name, {
    get: all[name],
    enumerable: true
  });
}, "__export");
var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function") for (let key of __getOwnPropNames(from)) !__hasOwnProp.call(to, key) && key !== except && __defProp2(to, key, {
    get: /* @__PURE__ */ __name(() => from[key], "get"),
    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
  });
  return to;
}, "__copyProps");
var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp2({}, "__esModule", {
  value: true
}), mod), "__toCommonJS");
var index_exports = {};
__export(index_exports, {
  MySizableText: /* @__PURE__ */ __name(() => MySizableText, "MySizableText"),
  MyStack: /* @__PURE__ */ __name(() => MyStack, "MyStack")
});
module.exports = __toCommonJS(index_exports);
var import_core = require("@hanzogui/core");
var MyStack = (0, import_core.styled)(import_core.View, {
  backgroundColor: "green"
});
var MySizableText = (0, import_core.styled)(import_core.Text, {
  name: "MySizableText",
  backgroundColor: "green"
});
