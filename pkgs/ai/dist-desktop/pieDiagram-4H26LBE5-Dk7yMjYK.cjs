'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('./index-DJT7cNZ5.cjs');
const chunk4BX2VUAB = require('./chunk-4BX2VUAB-BX1QhB7A.cjs');
const wardleyL42UT6IY = require('./wardley-L42UT6IY-LWC3cHV5.cjs');
const arc = require('./arc-KFUlnV2q.cjs');
const ordinal = require('./ordinal-C81cuTG8.cjs');

function descending(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

function identity(d) {
  return d;
}

function d3pie() {
  var value = identity,
      sortValues = descending,
      sort = null,
      startAngle = index.constant(0),
      endAngle = index.constant(index.tau),
      padAngle = index.constant(0);

  function pie(data) {
    var i,
        n = (data = index.array(data)).length,
        j,
        k,
        sum = 0,
        index$1 = new Array(n),
        arcs = new Array(n),
        a0 = +startAngle.apply(this, arguments),
        da = Math.min(index.tau, Math.max(-index.tau, endAngle.apply(this, arguments) - a0)),
        a1,
        p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
        pa = p * (da < 0 ? -1 : 1),
        v;

    for (i = 0; i < n; ++i) {
      if ((v = arcs[index$1[i] = i] = +value(data[i], i, data)) > 0) {
        sum += v;
      }
    }

    // Optionally sort the arcs by previously-computed values or by data.
    if (sortValues != null) index$1.sort(function(i, j) { return sortValues(arcs[i], arcs[j]); });
    else if (sort != null) index$1.sort(function(i, j) { return sort(data[i], data[j]); });

    // Compute the arcs! They are stored in the original data's order.
    for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
      j = index$1[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
        data: data[j],
        index: i,
        value: v,
        startAngle: a0,
        endAngle: a1,
        padAngle: p
      };
    }

    return arcs;
  }

  pie.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : index.constant(+_), pie) : value;
  };

  pie.sortValues = function(_) {
    return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
  };

  pie.sort = function(_) {
    return arguments.length ? (sort = _, sortValues = null, pie) : sort;
  };

  pie.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : index.constant(+_), pie) : startAngle;
  };

  pie.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : index.constant(+_), pie) : endAngle;
  };

  pie.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : index.constant(+_), pie) : padAngle;
  };

  return pie;
}

// src/diagrams/pie/pieDb.ts
var DEFAULT_PIE_CONFIG = index.defaultConfig_default.pie;
var DEFAULT_PIE_DB = {
  sections: /* @__PURE__ */ new Map(),
  showData: false};
var sections = DEFAULT_PIE_DB.sections;
var showData = DEFAULT_PIE_DB.showData;
var config = structuredClone(DEFAULT_PIE_CONFIG);
var getConfig2 = /* @__PURE__ */ index.__name(() => structuredClone(config), "getConfig");
var clear2 = /* @__PURE__ */ index.__name(() => {
  sections = /* @__PURE__ */ new Map();
  showData = DEFAULT_PIE_DB.showData;
  index.clear();
}, "clear");
var addSection = /* @__PURE__ */ index.__name(({ label, value }) => {
  if (value < 0) {
    throw new Error(
      `"${label}" has invalid value: ${value}. Negative values are not allowed in pie charts. All slice values must be >= 0.`
    );
  }
  if (!sections.has(label)) {
    sections.set(label, value);
    index.log.debug(`added new section: ${label}, with value: ${value}`);
  }
}, "addSection");
var getSections = /* @__PURE__ */ index.__name(() => sections, "getSections");
var setShowData = /* @__PURE__ */ index.__name((toggle) => {
  showData = toggle;
}, "setShowData");
var getShowData = /* @__PURE__ */ index.__name(() => showData, "getShowData");
var db = {
  getConfig: getConfig2,
  clear: clear2,
  setDiagramTitle: index.setDiagramTitle,
  getDiagramTitle: index.getDiagramTitle,
  setAccTitle: index.setAccTitle,
  getAccTitle: index.getAccTitle,
  setAccDescription: index.setAccDescription,
  getAccDescription: index.getAccDescription,
  addSection,
  getSections,
  setShowData,
  getShowData
};

// src/diagrams/pie/pieParser.ts
var populateDb = /* @__PURE__ */ index.__name((ast, db2) => {
  chunk4BX2VUAB.populateCommonDb(ast, db2);
  db2.setShowData(ast.showData);
  ast.sections.map(db2.addSection);
}, "populateDb");
var parser = {
  parse: /* @__PURE__ */ index.__name(async (input) => {
    const ast = await wardleyL42UT6IY.parse("pie", input);
    index.log.debug(ast);
    populateDb(ast, db);
  }, "parse")
};

// src/diagrams/pie/pieStyles.ts
var getStyles = /* @__PURE__ */ index.__name((options) => `
  .pieCircle{
    stroke: ${options.pieStrokeColor};
    stroke-width : ${options.pieStrokeWidth};
    opacity : ${options.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${options.pieOuterStrokeColor};
    stroke-width: ${options.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${options.pieTitleTextSize};
    fill: ${options.pieTitleTextColor};
    font-family: ${options.fontFamily};
  }
  .slice {
    font-family: ${options.fontFamily};
    fill: ${options.pieSectionTextColor};
    font-size:${options.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${options.pieLegendTextColor};
    font-family: ${options.fontFamily};
    font-size: ${options.pieLegendTextSize};
  }
`, "getStyles");
var pieStyles_default = getStyles;
var createPieArcs = /* @__PURE__ */ index.__name((sections2) => {
  const sum = [...sections2.values()].reduce((acc, val) => acc + val, 0);
  const pieData = [...sections2.entries()].map(([label, value]) => ({ label, value })).filter((d) => d.value / sum * 100 >= 1);
  const pie = d3pie().value((d) => d.value).sort(null);
  return pie(pieData);
}, "createPieArcs");
var draw = /* @__PURE__ */ index.__name((text, id, _version, diagObj) => {
  index.log.debug("rendering pie chart\n" + text);
  const db2 = diagObj.db;
  const globalConfig = index.getConfig2();
  const pieConfig = index.cleanAndMerge(db2.getConfig(), globalConfig.pie);
  const MARGIN = 40;
  const LEGEND_RECT_SIZE = 18;
  const LEGEND_SPACING = 4;
  const height = 450;
  const pieWidth = height;
  const svg = index.selectSvgElement(id);
  const group = svg.append("g");
  group.attr("transform", "translate(" + pieWidth / 2 + "," + height / 2 + ")");
  const { themeVariables } = globalConfig;
  let [outerStrokeWidth] = index.parseFontSize(themeVariables.pieOuterStrokeWidth);
  outerStrokeWidth ??= 2;
  const textPosition = pieConfig.textPosition;
  const radius = Math.min(pieWidth, height) / 2 - MARGIN;
  const arcGenerator = arc.d3arc().innerRadius(0).outerRadius(radius);
  const labelArcGenerator = arc.d3arc().innerRadius(radius * textPosition).outerRadius(radius * textPosition);
  group.append("circle").attr("cx", 0).attr("cy", 0).attr("r", radius + outerStrokeWidth / 2).attr("class", "pieOuterCircle");
  const sections2 = db2.getSections();
  const arcs = createPieArcs(sections2);
  const myGeneratedColors = [
    themeVariables.pie1,
    themeVariables.pie2,
    themeVariables.pie3,
    themeVariables.pie4,
    themeVariables.pie5,
    themeVariables.pie6,
    themeVariables.pie7,
    themeVariables.pie8,
    themeVariables.pie9,
    themeVariables.pie10,
    themeVariables.pie11,
    themeVariables.pie12
  ];
  let sum = 0;
  sections2.forEach((section) => {
    sum += section;
  });
  const filteredArcs = arcs.filter((datum) => (datum.data.value / sum * 100).toFixed(0) !== "0");
  const color = ordinal.ordinal(myGeneratedColors).domain([
    ...sections2.keys()
  ]);
  group.selectAll("mySlices").data(filteredArcs).enter().append("path").attr("d", arcGenerator).attr("fill", (datum) => {
    return color(datum.data.label);
  }).attr("class", "pieCircle");
  group.selectAll("mySlices").data(filteredArcs).enter().append("text").text((datum) => {
    return (datum.data.value / sum * 100).toFixed(0) + "%";
  }).attr("transform", (datum) => {
    return "translate(" + labelArcGenerator.centroid(datum) + ")";
  }).style("text-anchor", "middle").attr("class", "slice");
  const titleText = group.append("text").text(db2.getDiagramTitle()).attr("x", 0).attr("y", -400 / 2).attr("class", "pieTitleText");
  const allSectionData = [...sections2.entries()].map(([label, value]) => ({
    label,
    value
  }));
  const legend = group.selectAll(".legend").data(allSectionData).enter().append("g").attr("class", "legend").attr("transform", (_datum, index) => {
    const height2 = LEGEND_RECT_SIZE + LEGEND_SPACING;
    const offset = height2 * allSectionData.length / 2;
    const horizontal = 12 * LEGEND_RECT_SIZE;
    const vertical = index * height2 - offset;
    return "translate(" + horizontal + "," + vertical + ")";
  });
  legend.append("rect").attr("width", LEGEND_RECT_SIZE).attr("height", LEGEND_RECT_SIZE).style("fill", (d) => color(d.label)).style("stroke", (d) => color(d.label));
  legend.append("text").attr("x", LEGEND_RECT_SIZE + LEGEND_SPACING).attr("y", LEGEND_RECT_SIZE - LEGEND_SPACING).text((d) => {
    if (db2.getShowData()) {
      return `${d.label} [${d.value}]`;
    }
    return d.label;
  });
  const longestTextWidth = Math.max(
    ...legend.selectAll("text").nodes().map((node) => node?.getBoundingClientRect().width ?? 0)
  );
  const chartAndLegendWidth = pieWidth + MARGIN + LEGEND_RECT_SIZE + LEGEND_SPACING + longestTextWidth;
  const titleWidth = titleText.node()?.getBoundingClientRect().width ?? 0;
  const titleLeft = pieWidth / 2 - titleWidth / 2;
  const titleRight = pieWidth / 2 + titleWidth / 2;
  const viewBoxX = Math.min(0, titleLeft);
  const viewBoxRight = Math.max(chartAndLegendWidth, titleRight);
  const totalWidth = viewBoxRight - viewBoxX;
  svg.attr("viewBox", `${viewBoxX} 0 ${totalWidth} ${height}`);
  index.configureSvgSize(svg, height, totalWidth, pieConfig.useMaxWidth);
}, "draw");
var renderer = { draw };

// src/diagrams/pie/pieDiagram.ts
var diagram = {
  parser,
  db,
  renderer,
  styles: pieStyles_default
};

exports.diagram = diagram;
