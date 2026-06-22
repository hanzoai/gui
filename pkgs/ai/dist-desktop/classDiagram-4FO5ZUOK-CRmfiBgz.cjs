'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const chunk727SXJPM = require('./chunk-727SXJPM-UWjyA4MO.cjs');
const index = require('./index-BSSKeTjn.cjs');

// src/diagrams/class/classDiagram.ts
var diagram = {
  parser: chunk727SXJPM.classDiagram_default,
  get db() {
    return new chunk727SXJPM.ClassDB();
  },
  renderer: chunk727SXJPM.classRenderer_v3_unified_default,
  styles: chunk727SXJPM.styles_default,
  init: /* @__PURE__ */ index.__name((cnf) => {
    if (!cnf.class) {
      cnf.class = {};
    }
    cnf.class.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};

exports.diagram = diagram;
