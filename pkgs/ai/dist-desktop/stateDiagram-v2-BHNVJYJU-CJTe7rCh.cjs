'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const chunkAQP2D5EJ = require('./chunk-AQP2D5EJ-628np0jV.cjs');
const index = require('./index-C2MrPJDk.cjs');

// src/diagrams/state/stateDiagram-v2.ts
var diagram = {
  parser: chunkAQP2D5EJ.stateDiagram_default,
  get db() {
    return new chunkAQP2D5EJ.StateDB(2);
  },
  renderer: chunkAQP2D5EJ.stateRenderer_v3_unified_default,
  styles: chunkAQP2D5EJ.styles_default,
  init: /* @__PURE__ */ index.__name((cnf) => {
    if (!cnf.state) {
      cnf.state = {};
    }
    cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};

exports.diagram = diagram;
