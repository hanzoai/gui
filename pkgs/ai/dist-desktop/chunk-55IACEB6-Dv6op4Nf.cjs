'use strict';

const index = require('./index-DKX_wW-G.cjs');

var getDiagramElement = /* @__PURE__ */ index.__name((id, securityLevel) => {
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = index.select("#i" + id);
  }
  const root = securityLevel === "sandbox" ? index.select(sandboxElement.nodes()[0].contentDocument.body) : index.select("body");
  const svg = root.select(`[id="${id}"]`);
  return svg;
}, "getDiagramElement");

exports.getDiagramElement = getDiagramElement;
