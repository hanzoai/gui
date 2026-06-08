'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const chunkAQP2D5EJ = require('./chunk-AQP2D5EJ-C0v57VJ2.cjs');
const index = require('./index-gpjSZyfG.cjs');
const graph = require('./graph-wKzzqzYs.cjs');
const layout = require('./layout-DhLqaWJP.cjs');

var drawStartState = /* @__PURE__ */ index.__name((g) => g.append("circle").attr("class", "start-state").attr("r", index.getConfig2().state.sizeUnit).attr("cx", index.getConfig2().state.padding + index.getConfig2().state.sizeUnit).attr("cy", index.getConfig2().state.padding + index.getConfig2().state.sizeUnit), "drawStartState");
var drawDivider = /* @__PURE__ */ index.__name((g) => g.append("line").style("stroke", "grey").style("stroke-dasharray", "3").attr("x1", index.getConfig2().state.textHeight).attr("class", "divider").attr("x2", index.getConfig2().state.textHeight * 2).attr("y1", 0).attr("y2", 0), "drawDivider");
var drawSimpleState = /* @__PURE__ */ index.__name((g, stateDef) => {
  const state = g.append("text").attr("x", 2 * index.getConfig2().state.padding).attr("y", index.getConfig2().state.textHeight + 2 * index.getConfig2().state.padding).attr("font-size", index.getConfig2().state.fontSize).attr("class", "state-title").text(stateDef.id);
  const classBox = state.node().getBBox();
  g.insert("rect", ":first-child").attr("x", index.getConfig2().state.padding).attr("y", index.getConfig2().state.padding).attr("width", classBox.width + 2 * index.getConfig2().state.padding).attr("height", classBox.height + 2 * index.getConfig2().state.padding).attr("rx", index.getConfig2().state.radius);
  return state;
}, "drawSimpleState");
var drawDescrState = /* @__PURE__ */ index.__name((g, stateDef) => {
  const addTspan = /* @__PURE__ */ index.__name(function(textEl, txt, isFirst2) {
    const tSpan = textEl.append("tspan").attr("x", 2 * index.getConfig2().state.padding).text(txt);
    if (!isFirst2) {
      tSpan.attr("dy", index.getConfig2().state.textHeight);
    }
  }, "addTspan");
  const title = g.append("text").attr("x", 2 * index.getConfig2().state.padding).attr("y", index.getConfig2().state.textHeight + 1.3 * index.getConfig2().state.padding).attr("font-size", index.getConfig2().state.fontSize).attr("class", "state-title").text(stateDef.descriptions[0]);
  const titleBox = title.node().getBBox();
  const titleHeight = titleBox.height;
  const description = g.append("text").attr("x", index.getConfig2().state.padding).attr(
    "y",
    titleHeight + index.getConfig2().state.padding * 0.4 + index.getConfig2().state.dividerMargin + index.getConfig2().state.textHeight
  ).attr("class", "state-description");
  let isFirst = true;
  let isSecond = true;
  stateDef.descriptions.forEach(function(descr) {
    if (!isFirst) {
      addTspan(description, descr, isSecond);
      isSecond = false;
    }
    isFirst = false;
  });
  const descrLine = g.append("line").attr("x1", index.getConfig2().state.padding).attr("y1", index.getConfig2().state.padding + titleHeight + index.getConfig2().state.dividerMargin / 2).attr("y2", index.getConfig2().state.padding + titleHeight + index.getConfig2().state.dividerMargin / 2).attr("class", "descr-divider");
  const descrBox = description.node().getBBox();
  const width = Math.max(descrBox.width, titleBox.width);
  descrLine.attr("x2", width + 3 * index.getConfig2().state.padding);
  g.insert("rect", ":first-child").attr("x", index.getConfig2().state.padding).attr("y", index.getConfig2().state.padding).attr("width", width + 2 * index.getConfig2().state.padding).attr("height", descrBox.height + titleHeight + 2 * index.getConfig2().state.padding).attr("rx", index.getConfig2().state.radius);
  return g;
}, "drawDescrState");
var addTitleAndBox = /* @__PURE__ */ index.__name((g, stateDef, altBkg) => {
  const pad = index.getConfig2().state.padding;
  const dblPad = 2 * index.getConfig2().state.padding;
  const orgBox = g.node().getBBox();
  const orgWidth = orgBox.width;
  const orgX = orgBox.x;
  const title = g.append("text").attr("x", 0).attr("y", index.getConfig2().state.titleShift).attr("font-size", index.getConfig2().state.fontSize).attr("class", "state-title").text(stateDef.id);
  const titleBox = title.node().getBBox();
  const titleWidth = titleBox.width + dblPad;
  let width = Math.max(titleWidth, orgWidth);
  if (width === orgWidth) {
    width = width + dblPad;
  }
  let startX;
  const graphBox = g.node().getBBox();
  if (stateDef.doc) ;
  startX = orgX - pad;
  if (titleWidth > orgWidth) {
    startX = (orgWidth - width) / 2 + pad;
  }
  if (Math.abs(orgX - graphBox.x) < pad && titleWidth > orgWidth) {
    startX = orgX - (titleWidth - orgWidth) / 2;
  }
  const lineY = 1 - index.getConfig2().state.textHeight;
  g.insert("rect", ":first-child").attr("x", startX).attr("y", lineY).attr("class", altBkg ? "alt-composit" : "composit").attr("width", width).attr(
    "height",
    graphBox.height + index.getConfig2().state.textHeight + index.getConfig2().state.titleShift + 1
  ).attr("rx", "0");
  title.attr("x", startX + pad);
  if (titleWidth <= orgWidth) {
    title.attr("x", orgX + (width - dblPad) / 2 - titleWidth / 2 + pad);
  }
  g.insert("rect", ":first-child").attr("x", startX).attr(
    "y",
    index.getConfig2().state.titleShift - index.getConfig2().state.textHeight - index.getConfig2().state.padding
  ).attr("width", width).attr("height", index.getConfig2().state.textHeight * 3).attr("rx", index.getConfig2().state.radius);
  g.insert("rect", ":first-child").attr("x", startX).attr(
    "y",
    index.getConfig2().state.titleShift - index.getConfig2().state.textHeight - index.getConfig2().state.padding
  ).attr("width", width).attr("height", graphBox.height + 3 + 2 * index.getConfig2().state.textHeight).attr("rx", index.getConfig2().state.radius);
  return g;
}, "addTitleAndBox");
var drawEndState = /* @__PURE__ */ index.__name((g) => {
  g.append("circle").attr("class", "end-state-outer").attr("r", index.getConfig2().state.sizeUnit + index.getConfig2().state.miniPadding).attr(
    "cx",
    index.getConfig2().state.padding + index.getConfig2().state.sizeUnit + index.getConfig2().state.miniPadding
  ).attr(
    "cy",
    index.getConfig2().state.padding + index.getConfig2().state.sizeUnit + index.getConfig2().state.miniPadding
  );
  return g.append("circle").attr("class", "end-state-inner").attr("r", index.getConfig2().state.sizeUnit).attr("cx", index.getConfig2().state.padding + index.getConfig2().state.sizeUnit + 2).attr("cy", index.getConfig2().state.padding + index.getConfig2().state.sizeUnit + 2);
}, "drawEndState");
var drawForkJoinState = /* @__PURE__ */ index.__name((g, stateDef) => {
  let width = index.getConfig2().state.forkWidth;
  let height = index.getConfig2().state.forkHeight;
  if (stateDef.parentId) {
    let tmp = width;
    width = height;
    height = tmp;
  }
  return g.append("rect").style("stroke", "black").style("fill", "black").attr("width", width).attr("height", height).attr("x", index.getConfig2().state.padding).attr("y", index.getConfig2().state.padding);
}, "drawForkJoinState");
var _drawLongText = /* @__PURE__ */ index.__name((_text, x, y, g) => {
  let textHeight = 0;
  const textElem = g.append("text");
  textElem.style("text-anchor", "start");
  textElem.attr("class", "noteText");
  let text = _text.replace(/\r\n/g, "<br/>");
  text = text.replace(/\n/g, "<br/>");
  const lines = text.split(index.common_default.lineBreakRegex);
  let tHeight = 1.25 * index.getConfig2().state.noteMargin;
  for (const line2 of lines) {
    const txt = line2.trim();
    if (txt.length > 0) {
      const span = textElem.append("tspan");
      span.text(txt);
      if (tHeight === 0) {
        const textBounds = span.node().getBBox();
        tHeight += textBounds.height;
      }
      textHeight += tHeight;
      span.attr("x", x + index.getConfig2().state.noteMargin);
      span.attr("y", y + textHeight + 1.25 * index.getConfig2().state.noteMargin);
    }
  }
  return { textWidth: textElem.node().getBBox().width, textHeight };
}, "_drawLongText");
var drawNote = /* @__PURE__ */ index.__name((text, g) => {
  g.attr("class", "state-note");
  const note = g.append("rect").attr("x", 0).attr("y", index.getConfig2().state.padding);
  const rectElem = g.append("g");
  const { textWidth, textHeight } = _drawLongText(text, 0, 0, rectElem);
  note.attr("height", textHeight + 2 * index.getConfig2().state.noteMargin);
  note.attr("width", textWidth + index.getConfig2().state.noteMargin * 2);
  return note;
}, "drawNote");
var drawState = /* @__PURE__ */ index.__name(function(elem, stateDef) {
  const id = stateDef.id;
  const stateInfo = {
    id,
    label: stateDef.id,
    width: 0,
    height: 0
  };
  const g = elem.append("g").attr("id", id).attr("class", "stateGroup");
  if (stateDef.type === "start") {
    drawStartState(g);
  }
  if (stateDef.type === "end") {
    drawEndState(g);
  }
  if (stateDef.type === "fork" || stateDef.type === "join") {
    drawForkJoinState(g, stateDef);
  }
  if (stateDef.type === "note") {
    drawNote(stateDef.note.text, g);
  }
  if (stateDef.type === "divider") {
    drawDivider(g);
  }
  if (stateDef.type === "default" && stateDef.descriptions.length === 0) {
    drawSimpleState(g, stateDef);
  }
  if (stateDef.type === "default" && stateDef.descriptions.length > 0) {
    drawDescrState(g, stateDef);
  }
  const stateBox = g.node().getBBox();
  stateInfo.width = stateBox.width + 2 * index.getConfig2().state.padding;
  stateInfo.height = stateBox.height + 2 * index.getConfig2().state.padding;
  return stateInfo;
}, "drawState");
var edgeCount = 0;
var drawEdge = /* @__PURE__ */ index.__name(function(elem, path, relation) {
  const getRelationType = /* @__PURE__ */ index.__name(function(type) {
    switch (type) {
      case chunkAQP2D5EJ.StateDB.relationType.AGGREGATION:
        return "aggregation";
      case chunkAQP2D5EJ.StateDB.relationType.EXTENSION:
        return "extension";
      case chunkAQP2D5EJ.StateDB.relationType.COMPOSITION:
        return "composition";
      case chunkAQP2D5EJ.StateDB.relationType.DEPENDENCY:
        return "dependency";
    }
  }, "getRelationType");
  path.points = path.points.filter((p) => !Number.isNaN(p.y));
  const lineData = path.points;
  const lineFunction = index.line().x(function(d) {
    return d.x;
  }).y(function(d) {
    return d.y;
  }).curve(index.curveBasis);
  const svgPath = elem.append("path").attr("d", lineFunction(lineData)).attr("id", "edge" + edgeCount).attr("class", "transition");
  let url = "";
  if (index.getConfig2().state.arrowMarkerAbsolute) {
    url = index.getUrl(true);
  }
  svgPath.attr(
    "marker-end",
    "url(" + url + "#" + getRelationType(chunkAQP2D5EJ.StateDB.relationType.DEPENDENCY) + "End)"
  );
  if (relation.title !== void 0) {
    const label = elem.append("g").attr("class", "stateLabel");
    const { x, y } = index.utils_default.calcLabelPosition(path.points);
    const rows = index.common_default.getRows(relation.title);
    let titleHeight = 0;
    const titleRows = [];
    let maxWidth = 0;
    let minX = 0;
    for (let i = 0; i <= rows.length; i++) {
      const title = label.append("text").attr("text-anchor", "middle").text(rows[i]).attr("x", x).attr("y", y + titleHeight);
      const boundsTmp = title.node().getBBox();
      maxWidth = Math.max(maxWidth, boundsTmp.width);
      minX = Math.min(minX, boundsTmp.x);
      index.log.info(boundsTmp.x, x, y + titleHeight);
      if (titleHeight === 0) {
        const titleBox = title.node().getBBox();
        titleHeight = titleBox.height;
        index.log.info("Title height", titleHeight, y);
      }
      titleRows.push(title);
    }
    let boxHeight = titleHeight * rows.length;
    if (rows.length > 1) {
      const heightAdj = (rows.length - 1) * titleHeight * 0.5;
      titleRows.forEach((title, i) => title.attr("y", y + i * titleHeight - heightAdj));
      boxHeight = titleHeight * rows.length;
    }
    const bounds = label.node().getBBox();
    label.insert("rect", ":first-child").attr("class", "box").attr("x", x - maxWidth / 2 - index.getConfig2().state.padding / 2).attr("y", y - boxHeight / 2 - index.getConfig2().state.padding / 2 - 3.5).attr("width", maxWidth + index.getConfig2().state.padding).attr("height", boxHeight + index.getConfig2().state.padding);
    index.log.info(bounds);
  }
  edgeCount++;
}, "drawEdge");

// src/diagrams/state/stateRenderer.js
var conf;
var transformationLog = {};
var setConf = /* @__PURE__ */ index.__name(function() {
}, "setConf");
var insertMarkers = /* @__PURE__ */ index.__name(function(elem) {
  elem.append("defs").append("marker").attr("id", "dependencyEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 19,7 L9,13 L14,7 L9,1 Z");
}, "insertMarkers");
var draw = /* @__PURE__ */ index.__name(function(text, id, _version, diagObj) {
  conf = index.getConfig2().state;
  const securityLevel = index.getConfig2().securityLevel;
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = index.select("#i" + id);
  }
  const root = securityLevel === "sandbox" ? index.select(sandboxElement.nodes()[0].contentDocument.body) : index.select("body");
  const doc = securityLevel === "sandbox" ? sandboxElement.nodes()[0].contentDocument : document;
  index.log.debug("Rendering diagram " + text);
  const diagram2 = root.select(`[id='${id}']`);
  insertMarkers(diagram2);
  const rootDoc = diagObj.db.getRootDoc();
  const rootG = diagram2.append("g").attr("id", id + "-root");
  renderDoc(rootDoc, rootG, void 0, false, root, doc, diagObj);
  const padding = conf.padding;
  const bounds = diagram2.node().getBBox();
  const width = bounds.width + padding * 2;
  const height = bounds.height + padding * 2;
  const svgWidth = width * 1.75;
  index.configureSvgSize(diagram2, height, svgWidth, conf.useMaxWidth);
  diagram2.attr(
    "viewBox",
    `${bounds.x - conf.padding}  ${bounds.y - conf.padding} ` + width + " " + height
  );
}, "draw");
var getLabelWidth = /* @__PURE__ */ index.__name((text) => {
  return text ? text.length * conf.fontSizeFactor : 1;
}, "getLabelWidth");
var renderDoc = /* @__PURE__ */ index.__name((doc, diagram2, parentId, altBkg, root, domDocument, diagObj) => {
  const graph$1 = new graph.Graph({
    compound: true,
    multigraph: true
  });
  let i;
  let edgeFreeDoc = true;
  for (i = 0; i < doc.length; i++) {
    if (doc[i].stmt === "relation") {
      edgeFreeDoc = false;
      break;
    }
  }
  if (parentId) {
    graph$1.setGraph({
      rankdir: "LR",
      multigraph: true,
      compound: true,
      // acyclicer: 'greedy',
      ranker: "tight-tree",
      ranksep: edgeFreeDoc ? 1 : conf.edgeLengthFactor,
      nodeSep: edgeFreeDoc ? 1 : 50,
      isMultiGraph: true
      // ranksep: 5,
      // nodesep: 1
    });
  } else {
    graph$1.setGraph({
      rankdir: "TB",
      multigraph: true,
      compound: true,
      // isCompound: true,
      // acyclicer: 'greedy',
      // ranker: 'longest-path'
      ranksep: edgeFreeDoc ? 1 : conf.edgeLengthFactor,
      nodeSep: edgeFreeDoc ? 1 : 50,
      ranker: "tight-tree",
      // ranker: 'network-simplex'
      isMultiGraph: true
    });
  }
  graph$1.setDefaultEdgeLabel(function() {
    return {};
  });
  const states = diagObj.db.getStates();
  const relations = diagObj.db.getRelations();
  const keys = Object.keys(states);
  for (const key of keys) {
    const stateDef = states[key];
    if (parentId) {
      stateDef.parentId = parentId;
    }
    let node;
    if (stateDef.doc) {
      let sub = diagram2.append("g").attr("id", stateDef.id).attr("class", "stateGroup");
      node = renderDoc(stateDef.doc, sub, stateDef.id, !altBkg, root, domDocument, diagObj);
      {
        sub = addTitleAndBox(sub, stateDef, altBkg);
        let boxBounds = sub.node().getBBox();
        node.width = boxBounds.width;
        node.height = boxBounds.height + conf.padding / 2;
        transformationLog[stateDef.id] = { y: conf.compositTitleSize };
      }
    } else {
      node = drawState(diagram2, stateDef, graph$1);
    }
    if (stateDef.note) {
      const noteDef = {
        descriptions: [],
        id: stateDef.id + "-note",
        note: stateDef.note,
        type: "note"
      };
      const note = drawState(diagram2, noteDef, graph$1);
      if (stateDef.note.position === "left of") {
        graph$1.setNode(node.id + "-note", note);
        graph$1.setNode(node.id, node);
      } else {
        graph$1.setNode(node.id, node);
        graph$1.setNode(node.id + "-note", note);
      }
      graph$1.setParent(node.id, node.id + "-group");
      graph$1.setParent(node.id + "-note", node.id + "-group");
    } else {
      graph$1.setNode(node.id, node);
    }
  }
  index.log.debug("Count=", graph$1.nodeCount(), graph$1);
  let cnt = 0;
  relations.forEach(function(relation) {
    cnt++;
    index.log.debug("Setting edge", relation);
    graph$1.setEdge(
      relation.id1,
      relation.id2,
      {
        relation,
        width: getLabelWidth(relation.title),
        height: conf.labelHeight * index.common_default.getRows(relation.title).length,
        labelpos: "c"
      },
      "id" + cnt
    );
  });
  layout.layout(graph$1);
  index.log.debug("Graph after layout", graph$1.nodes());
  const svgElem = diagram2.node();
  graph$1.nodes().forEach(function(v) {
    if (v !== void 0 && graph$1.node(v) !== void 0) {
      index.log.warn("Node " + v + ": " + JSON.stringify(graph$1.node(v)));
      root.select("#" + svgElem.id + " #" + v).attr(
        "transform",
        "translate(" + (graph$1.node(v).x - graph$1.node(v).width / 2) + "," + (graph$1.node(v).y + (transformationLog[v] ? transformationLog[v].y : 0) - graph$1.node(v).height / 2) + " )"
      );
      root.select("#" + svgElem.id + " #" + v).attr("data-x-shift", graph$1.node(v).x - graph$1.node(v).width / 2);
      const dividers = domDocument.querySelectorAll("#" + svgElem.id + " #" + v + " .divider");
      dividers.forEach((divider) => {
        const parent = divider.parentElement;
        let pWidth = 0;
        let pShift = 0;
        if (parent) {
          if (parent.parentElement) {
            pWidth = parent.parentElement.getBBox().width;
          }
          pShift = parseInt(parent.getAttribute("data-x-shift"), 10);
          if (Number.isNaN(pShift)) {
            pShift = 0;
          }
        }
        divider.setAttribute("x1", 0 - pShift + 8);
        divider.setAttribute("x2", pWidth - pShift - 8);
      });
    } else {
      index.log.debug("No Node " + v + ": " + JSON.stringify(graph$1.node(v)));
    }
  });
  let stateBox = svgElem.getBBox();
  graph$1.edges().forEach(function(e) {
    if (e !== void 0 && graph$1.edge(e) !== void 0) {
      index.log.debug("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(graph$1.edge(e)));
      drawEdge(diagram2, graph$1.edge(e), graph$1.edge(e).relation);
    }
  });
  stateBox = svgElem.getBBox();
  const stateInfo = {
    id: parentId ? parentId : "root",
    label: parentId ? parentId : "root",
    width: 0,
    height: 0
  };
  stateInfo.width = stateBox.width + 2 * conf.padding;
  stateInfo.height = stateBox.height + 2 * conf.padding;
  index.log.debug("Doc rendered", stateInfo, graph$1);
  return stateInfo;
}, "renderDoc");
var stateRenderer_default = {
  setConf,
  draw
};

// src/diagrams/state/stateDiagram.ts
var diagram = {
  parser: chunkAQP2D5EJ.stateDiagram_default,
  get db() {
    return new chunkAQP2D5EJ.StateDB(1);
  },
  renderer: stateRenderer_default,
  styles: chunkAQP2D5EJ.styles_default,
  init: /* @__PURE__ */ index.__name((cnf) => {
    if (!cnf.state) {
      cnf.state = {};
    }
    cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};

exports.diagram = diagram;
