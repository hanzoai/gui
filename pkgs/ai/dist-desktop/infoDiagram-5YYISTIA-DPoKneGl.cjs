'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('./index-D40WJAeY.cjs');
const wardleyL42UT6IY = require('./wardley-L42UT6IY-LWC3cHV5.cjs');

var parser = {
  parse: /* @__PURE__ */ index.__name(async (input) => {
    const ast = await wardleyL42UT6IY.parse("info", input);
    index.log.debug(ast);
  }, "parse")
};

// src/diagrams/info/infoDb.ts
var DEFAULT_INFO_DB = {
  version: "11.15.0" + ("" )
};
var getVersion = /* @__PURE__ */ index.__name(() => DEFAULT_INFO_DB.version, "getVersion");
var db = {
  getVersion
};

// src/diagrams/info/infoRenderer.ts
var draw = /* @__PURE__ */ index.__name((text, id, version) => {
  index.log.debug("rendering info diagram\n" + text);
  const svg = index.selectSvgElement(id);
  index.configureSvgSize(svg, 100, 400, true);
  const group = svg.append("g");
  group.append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
}, "draw");
var renderer = { draw };

// src/diagrams/info/infoDiagram.ts
var diagram = {
  parser,
  db,
  renderer
};

exports.diagram = diagram;
