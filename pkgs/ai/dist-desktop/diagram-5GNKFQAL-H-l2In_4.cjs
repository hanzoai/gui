'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('./index-BYtb79Db.cjs');
const chunk4BX2VUAB = require('./chunk-4BX2VUAB-D277xzS6.cjs');
const chunkQZHKN3VN = require('./chunk-QZHKN3VN-CJ_3nuad.cjs');
const wardleyL42UT6IY = require('./wardley-L42UT6IY-LWC3cHV5.cjs');

// src/diagrams/treeView/db.ts
var state = new chunkQZHKN3VN.ImperativeState(() => ({
  cnt: 1,
  stack: [
    {
      id: 0,
      level: -1,
      name: "/",
      children: []
    }
  ]
}));
var clear2 = /* @__PURE__ */ index.__name(() => {
  state.reset();
  index.clear();
}, "clear");
var getRoot = /* @__PURE__ */ index.__name(() => {
  return state.records.stack[0];
}, "getRoot");
var getCount = /* @__PURE__ */ index.__name(() => state.records.cnt, "getCount");
var defaultConfig = index.defaultConfig_default.treeView;
var getConfig2 = /* @__PURE__ */ index.__name(() => {
  return index.cleanAndMerge(defaultConfig, index.getConfig().treeView);
}, "getConfig");
var addNode = /* @__PURE__ */ index.__name((level, name) => {
  while (level <= state.records.stack[state.records.stack.length - 1].level) {
    state.records.stack.pop();
  }
  const node = {
    id: state.records.cnt++,
    level,
    name,
    children: []
  };
  state.records.stack[state.records.stack.length - 1].children.push(node);
  state.records.stack.push(node);
}, "addNode");
var db = {
  clear: clear2,
  addNode,
  getRoot,
  getCount,
  getConfig: getConfig2,
  getAccTitle: index.getAccTitle,
  getAccDescription: index.getAccDescription,
  getDiagramTitle: index.getDiagramTitle,
  setAccDescription: index.setAccDescription,
  setAccTitle: index.setAccTitle,
  setDiagramTitle: index.setDiagramTitle
};
var db_default = db;
var populate = /* @__PURE__ */ index.__name((ast) => {
  chunk4BX2VUAB.populateCommonDb(ast, db_default);
  ast.nodes.map((node) => db_default.addNode(node.indent ? parseInt(node.indent) : 0, node.name));
}, "populate");
var parser = {
  parse: /* @__PURE__ */ index.__name(async (input) => {
    const ast = await wardleyL42UT6IY.parse("treeView", input);
    index.log.debug(ast);
    populate(ast);
  }, "parse")
};

// src/diagrams/treeView/renderer.ts
var positionLabel = /* @__PURE__ */ index.__name((x, y, node, domElem, config) => {
  const label = domElem.append("text").text(node.name).attr("dominant-baseline", "middle").attr("class", "treeView-node-label");
  const { height: labelHeight, width: labelWidth } = label.node().getBBox();
  const height = labelHeight + config.paddingY * 2;
  const width = labelWidth + config.paddingX * 2;
  label.attr("x", x + config.paddingX);
  label.attr("y", y + height / 2);
  node.BBox = {
    x,
    y,
    width,
    height
  };
}, "positionLabel");
var positionLine = /* @__PURE__ */ index.__name((domElem, x1, y1, x2, y2, lineThickness) => {
  return domElem.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2).attr("stroke-width", lineThickness).attr("class", "treeView-node-line");
}, "positionLine");
var drawTree = /* @__PURE__ */ index.__name((elem, root, config) => {
  let totalHeight = 0;
  let totalWidth = 0;
  const drawNode = /* @__PURE__ */ index.__name((elem2, node, config2, depth) => {
    const indent = depth * (config2.rowIndent + config2.paddingX);
    positionLabel(indent, totalHeight, node, elem2, config2);
    const { height, width } = node.BBox;
    positionLine(
      elem2,
      indent - config2.rowIndent,
      totalHeight + height / 2,
      indent,
      totalHeight + height / 2,
      config2.lineThickness
    );
    totalWidth = Math.max(totalWidth, indent + width);
    totalHeight += height;
  }, "drawNode");
  const processNode = /* @__PURE__ */ index.__name((node, depth = 0) => {
    drawNode(elem, node, config, depth);
    node.children.forEach((child) => {
      processNode(child, depth + 1);
    });
    const { x, y, height } = node.BBox;
    if (node.children.length) {
      const { y: endY, height: endHeight } = node.children[node.children.length - 1].BBox;
      positionLine(
        elem,
        x + config.paddingX,
        y + height,
        x + config.paddingX,
        endY + endHeight / 2 + config.lineThickness / 2,
        config.lineThickness
      );
    }
  }, "processNode");
  processNode(root);
  return { totalHeight, totalWidth };
}, "drawTree");
var draw = /* @__PURE__ */ index.__name((text, id, _ver, diagObj) => {
  index.log.debug("Rendering treeView diagram\n" + text);
  const db2 = diagObj.db;
  const root = db2.getRoot();
  const config = db2.getConfig();
  const svg = index.selectSvgElement(id);
  const treeElem = svg.append("g");
  treeElem.attr("class", "tree-view");
  const { totalHeight, totalWidth } = drawTree(treeElem, root, config);
  svg.attr("viewBox", `-${config.lineThickness / 2} 0 ${totalWidth} ${totalHeight}`);
  index.configureSvgSize(svg, totalHeight, totalWidth, config.useMaxWidth);
}, "draw");
var renderer = {
  draw
};
var renderer_default = renderer;

// src/diagrams/treeView/styles.ts
var defaultTreeViewDiagramStyles = {
  labelFontSize: "16px",
  labelColor: "black",
  lineColor: "black"
};
var styles = /* @__PURE__ */ index.__name(({
  treeView
}) => {
  const { labelFontSize, labelColor, lineColor } = index.cleanAndMerge(
    defaultTreeViewDiagramStyles,
    treeView
  );
  return `
    .treeView-node-label {
        font-size: ${labelFontSize};
        fill: ${labelColor};
    }
    .treeView-node-line {
        stroke: ${lineColor};
    }
    `;
}, "styles");
var styles_default = styles;

// src/diagrams/treeView/diagram.ts
var diagram = {
  db: db_default,
  renderer: renderer_default,
  parser,
  styles: styles_default
};

exports.diagram = diagram;
