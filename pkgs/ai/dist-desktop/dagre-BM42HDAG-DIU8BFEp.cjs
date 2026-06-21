'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('./index-CLDc7Yq-.cjs');
const graph = require('./graph-DfN_qxaA.cjs');
const layout = require('./layout-DMKBuoWx.cjs');

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return index.baseClone(value, CLONE_SYMBOLS_FLAG);
}

/**
 * @template [GraphLabel=any] - Label of the graph.
 * @template [NodeLabel=any] - Label of a node.
 * @template [EdgeLabel=any] - Label of an edge.
 *
 * @typedef {object} GraphJSON
 * @property {Required<GraphOptions>} options - The options used to create the graph.
 * @property {Array<{ v: NodeID; value?: NodeLabel; parent?: NodeID }>} nodes - The nodes in the graph.
 * @property {Array<EdgeObj & { value?: EdgeLabel }>} edges - The edges in the graph.
 * @property {GraphLabel} [value] - The graph's value, if any.
 */

/**
 * Creates a JSON representation of the graph that can be serialized to a
 * string with
 * [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
 * The graph can later be restored using {@link read}.
 *
 * @example
 *
 * ```js
 * var g = new graphlib.Graph();
 * g.setNode("a", { label: "node a" });
 * g.setNode("b", { label: "node b" });
 * g.setEdge("a", "b", { label: "edge a->b" });
 * graphlib.json.write(g);
 * // Returns the object:
 * //
 * // {
 * //   "options": {
 * //     "directed": true,
 * //     "multigraph": false,
 * //     "compound": false
 * //   },
 * //   "nodes": [
 * //     { "v": "a", "value": { "label": "node a" } },
 * //     { "v": "b", "value": { "label": "node b" } }
 * //   ],
 * //   "edges": [
 * //     { "v": "a", "w": "b", "value": { "label": "edge a->b" } }
 * //   ]
 * // }
 * ```
 *
 * @template [GraphLabel=any] - Label of the graph.
 * @template [NodeLabel=any] - Label of a node.
 * @template [EdgeLabel=any] - Label of an edge.
 * @param {Graph<GraphLabel, NodeLabel, EdgeLabel>} g - The graph to serialize.
 * @returns {GraphJSON<GraphLabel, NodeLabel, EdgeLabel>} The JSON representation of the graph.
 */
function write(g) {
  /** @type {GraphJSON<GraphLabel, NodeLabel, EdgeLabel>} */
  var json = {
    options: {
      directed: g.isDirected(),
      multigraph: g.isMultigraph(),
      compound: g.isCompound(),
    },
    nodes: writeNodes(g),
    edges: writeEdges(g),
  };
  if (!graph.isUndefined(g.graph())) {
    json.value = clone(g.graph());
  }
  return json;
}

/**
 * @template NodeLabel - Label of a node.
 *
 * @param {Graph<unknown, NodeLabel, unknown>} g - The graph to serialize.
 * @returns {Array<{ v: NodeID; value?: NodeLabel; parent?: NodeID }>} The nodes in the graph.
 */
function writeNodes(g) {
  return layout.map(g.nodes(), function (v) {
    var nodeValue = g.node(v);
    var parent = g.parent(v);
    /** @type {{ v: NodeID; value?: NodeLabel; parent?: NodeID }} */
    var node = { v: v };
    if (!graph.isUndefined(nodeValue)) {
      node.value = nodeValue;
    }
    if (!graph.isUndefined(parent)) {
      node.parent = parent;
    }
    return node;
  });
}

/**
 * @template EdgeLabel - Label of a node.
 *
 * @param {Graph<unknown, unknown, EdgeLabel>} g - The graph to serialize.
 * @returns {Array<EdgeObj & { value?: EdgeLabel }>} The edges in the graph.
 */
function writeEdges(g) {
  return layout.map(g.edges(), function (e) {
    var edgeValue = g.edge(e);
    /** @type {EdgeObj & { value?: EdgeLabel }} */
    var edge = { v: e.v, w: e.w };
    if (!graph.isUndefined(e.name)) {
      edge.name = e.name;
    }
    if (!graph.isUndefined(edgeValue)) {
      edge.value = edgeValue;
    }
    return edge;
  });
}

var clusterDb = /* @__PURE__ */ new Map();
var descendants = /* @__PURE__ */ new Map();
var parents = /* @__PURE__ */ new Map();
var clear4 = /* @__PURE__ */ index.__name(() => {
  descendants.clear();
  parents.clear();
  clusterDb.clear();
}, "clear");
var isDescendant = /* @__PURE__ */ index.__name((id, ancestorId) => {
  const ancestorDescendants = descendants.get(ancestorId) || [];
  index.log.trace("In isDescendant", ancestorId, " ", id, " = ", ancestorDescendants.includes(id));
  return ancestorDescendants.includes(id);
}, "isDescendant");
var edgeInCluster = /* @__PURE__ */ index.__name((edge, clusterId) => {
  const clusterDescendants = descendants.get(clusterId) || [];
  index.log.info("Descendants of ", clusterId, " is ", clusterDescendants);
  index.log.info("Edge is ", edge);
  if (edge.v === clusterId || edge.w === clusterId) {
    return false;
  }
  if (!clusterDescendants) {
    index.log.debug("Tilt, ", clusterId, ",not in descendants");
    return false;
  }
  return clusterDescendants.includes(edge.v) || isDescendant(edge.v, clusterId) || isDescendant(edge.w, clusterId) || clusterDescendants.includes(edge.w);
}, "edgeInCluster");
var copy = /* @__PURE__ */ index.__name((clusterId, graph, newGraph, rootId) => {
  index.log.warn(
    "Copying children of ",
    clusterId,
    "root",
    rootId,
    "data",
    graph.node(clusterId),
    rootId
  );
  const nodes = graph.children(clusterId) || [];
  if (clusterId !== rootId) {
    nodes.push(clusterId);
  }
  index.log.warn("Copying (nodes) clusterId", clusterId, "nodes", nodes);
  nodes.forEach((node) => {
    if (graph.children(node).length > 0) {
      copy(node, graph, newGraph, rootId);
    } else {
      const data = graph.node(node);
      index.log.info("cp ", node, " to ", rootId, " with parent ", clusterId);
      newGraph.setNode(node, data);
      if (rootId !== graph.parent(node)) {
        index.log.warn("Setting parent", node, graph.parent(node));
        newGraph.setParent(node, graph.parent(node));
      }
      if (clusterId !== rootId && node !== clusterId) {
        index.log.debug("Setting parent", node, clusterId);
        newGraph.setParent(node, clusterId);
      } else {
        index.log.info("In copy ", clusterId, "root", rootId, "data", graph.node(clusterId), rootId);
        index.log.debug(
          "Not Setting parent for node=",
          node,
          "cluster!==rootId",
          clusterId !== rootId,
          "node!==clusterId",
          node !== clusterId
        );
      }
      const edges = graph.edges(node);
      index.log.debug("Copying Edges", edges);
      edges.forEach((edge) => {
        index.log.info("Edge", edge);
        const data2 = graph.edge(edge.v, edge.w, edge.name);
        index.log.info("Edge data", data2, rootId);
        try {
          if (edgeInCluster(edge, rootId)) {
            index.log.info("Copying as ", edge.v, edge.w, data2, edge.name);
            newGraph.setEdge(edge.v, edge.w, data2, edge.name);
            index.log.info("newGraph edges ", newGraph.edges(), newGraph.edge(newGraph.edges()[0]));
          } else {
            index.log.info(
              "Skipping copy of edge ",
              edge.v,
              "-->",
              edge.w,
              " rootId: ",
              rootId,
              " clusterId:",
              clusterId
            );
          }
        } catch (e) {
          index.log.error(e);
        }
      });
    }
    index.log.debug("Removing node", node);
    graph.removeNode(node);
  });
}, "copy");
var extractDescendants = /* @__PURE__ */ index.__name((id, graph) => {
  const children = graph.children(id);
  let res = [...children];
  for (const child of children) {
    parents.set(child, id);
    res = [...res, ...extractDescendants(child, graph)];
  }
  return res;
}, "extractDescendants");
var findCommonEdges = /* @__PURE__ */ index.__name((graph, id1, id2) => {
  const edges1 = graph.edges().filter((edge) => edge.v === id1 || edge.w === id1);
  const edges2 = graph.edges().filter((edge) => edge.v === id2 || edge.w === id2);
  const edges1Prim = edges1.map((edge) => {
    return { v: edge.v === id1 ? id2 : edge.v, w: edge.w === id1 ? id1 : edge.w };
  });
  const edges2Prim = edges2.map((edge) => {
    return { v: edge.v, w: edge.w };
  });
  const result = edges1Prim.filter((edgeIn1) => {
    return edges2Prim.some((edge) => edgeIn1.v === edge.v && edgeIn1.w === edge.w);
  });
  return result;
}, "findCommonEdges");
var findNonClusterChild = /* @__PURE__ */ index.__name((id, graph, clusterId) => {
  const children = graph.children(id);
  index.log.trace("Searching children of id ", id, children);
  if (children.length < 1) {
    return id;
  }
  let reserve;
  for (const child of children) {
    const _id = findNonClusterChild(child, graph, clusterId);
    const commonEdges = findCommonEdges(graph, clusterId, _id);
    if (_id) {
      if (commonEdges.length > 0) {
        reserve = _id;
      } else {
        return _id;
      }
    }
  }
  return reserve;
}, "findNonClusterChild");
var getAnchorId = /* @__PURE__ */ index.__name((id) => {
  if (!clusterDb.has(id)) {
    return id;
  }
  if (!clusterDb.get(id).externalConnections) {
    return id;
  }
  if (clusterDb.has(id)) {
    return clusterDb.get(id).id;
  }
  return id;
}, "getAnchorId");
var adjustClustersAndEdges = /* @__PURE__ */ index.__name((graph, depth) => {
  if (!graph || depth > 10) {
    index.log.debug("Opting out, no graph ");
    return;
  } else {
    index.log.debug("Opting in, graph ");
  }
  graph.nodes().forEach(function(id) {
    const children = graph.children(id);
    if (children.length > 0) {
      index.log.warn(
        "Cluster identified",
        id,
        " Replacement id in edges: ",
        findNonClusterChild(id, graph, id)
      );
      descendants.set(id, extractDescendants(id, graph));
      clusterDb.set(id, { id: findNonClusterChild(id, graph, id), clusterData: graph.node(id) });
    }
  });
  graph.nodes().forEach(function(id) {
    const children = graph.children(id);
    const edges = graph.edges();
    if (children.length > 0) {
      index.log.debug("Cluster identified", id, descendants);
      edges.forEach((edge) => {
        const d1 = isDescendant(edge.v, id);
        const d2 = isDescendant(edge.w, id);
        if (d1 ^ d2) {
          index.log.warn("Edge: ", edge, " leaves cluster ", id);
          index.log.warn("Descendants of XXX ", id, ": ", descendants.get(id));
          clusterDb.get(id).externalConnections = true;
        }
      });
    } else {
      index.log.debug("Not a cluster ", id, descendants);
    }
  });
  for (let id of clusterDb.keys()) {
    const nonClusterChild = clusterDb.get(id).id;
    const parent = graph.parent(nonClusterChild);
    if (parent !== id && clusterDb.has(parent) && !clusterDb.get(parent).externalConnections) {
      clusterDb.get(id).id = parent;
    }
  }
  graph.edges().forEach(function(e) {
    const edge = graph.edge(e);
    index.log.warn("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(e));
    index.log.warn("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(graph.edge(e)));
    let v = e.v;
    let w = e.w;
    index.log.warn(
      "Fix XXX",
      clusterDb,
      "ids:",
      e.v,
      e.w,
      "Translating: ",
      clusterDb.get(e.v),
      " --- ",
      clusterDb.get(e.w)
    );
    if (clusterDb.get(e.v) || clusterDb.get(e.w)) {
      index.log.warn("Fixing and trying - removing XXX", e.v, e.w, e.name);
      v = getAnchorId(e.v);
      w = getAnchorId(e.w);
      graph.removeEdge(e.v, e.w, e.name);
      if (v !== e.v) {
        const parent = graph.parent(v);
        clusterDb.get(parent).externalConnections = true;
        edge.fromCluster = e.v;
      }
      if (w !== e.w) {
        const parent = graph.parent(w);
        clusterDb.get(parent).externalConnections = true;
        edge.toCluster = e.w;
      }
      index.log.warn("Fix Replacing with XXX", v, w, e.name);
      graph.setEdge(v, w, edge, e.name);
    }
  });
  index.log.warn("Adjusted Graph", write(graph));
  extractor(graph, 0);
  index.log.trace(clusterDb);
}, "adjustClustersAndEdges");
var extractor = /* @__PURE__ */ index.__name((graph$1, depth) => {
  index.log.warn("extractor - ", depth, write(graph$1), graph$1.children("D"));
  if (depth > 10) {
    index.log.error("Bailing out");
    return;
  }
  let nodes = graph$1.nodes();
  let hasChildren = false;
  for (const node of nodes) {
    const children = graph$1.children(node);
    hasChildren = hasChildren || children.length > 0;
  }
  if (!hasChildren) {
    index.log.debug("Done, no node has children", graph$1.nodes());
    return;
  }
  index.log.debug("Nodes = ", nodes, depth);
  for (const node of nodes) {
    index.log.debug(
      "Extracting node",
      node,
      clusterDb,
      clusterDb.has(node) && !clusterDb.get(node).externalConnections,
      !graph$1.parent(node),
      graph$1.node(node),
      graph$1.children("D"),
      " Depth ",
      depth
    );
    if (!clusterDb.has(node)) {
      index.log.debug("Not a cluster", node, depth);
    } else if (!clusterDb.get(node).externalConnections && graph$1.children(node) && graph$1.children(node).length > 0) {
      index.log.warn(
        "Cluster without external connections, without a parent and with children",
        node,
        depth
      );
      const graphSettings = graph$1.graph();
      let dir = graphSettings.rankdir === "TB" ? "LR" : "TB";
      if (clusterDb.get(node)?.clusterData?.dir) {
        dir = clusterDb.get(node).clusterData.dir;
        index.log.warn("Fixing dir", clusterDb.get(node).clusterData.dir, dir);
      }
      const clusterGraph = new graph.Graph({
        multigraph: true,
        compound: true
      }).setGraph({
        rankdir: dir,
        nodesep: 50,
        ranksep: 50,
        marginx: 8,
        marginy: 8
      }).setDefaultEdgeLabel(function() {
        return {};
      });
      index.log.warn("Old graph before copy", write(graph$1));
      copy(node, graph$1, clusterGraph, node);
      graph$1.setNode(node, {
        clusterNode: true,
        id: node,
        clusterData: clusterDb.get(node).clusterData,
        label: clusterDb.get(node).label,
        graph: clusterGraph
      });
      index.log.warn("New graph after copy node: (", node, ")", write(clusterGraph));
      index.log.debug("Old graph after copy", write(graph$1));
    } else {
      index.log.warn(
        "Cluster ** ",
        node,
        " **not meeting the criteria !externalConnections:",
        !clusterDb.get(node).externalConnections,
        " no parent: ",
        !graph$1.parent(node),
        " children ",
        graph$1.children(node) && graph$1.children(node).length > 0,
        graph$1.children("D"),
        depth
      );
      index.log.debug(clusterDb);
    }
  }
  nodes = graph$1.nodes();
  index.log.warn("New list of nodes", nodes);
  for (const node of nodes) {
    const data = graph$1.node(node);
    index.log.warn(" Now next level", node, data);
    if (data?.clusterNode) {
      extractor(data.graph, depth + 1);
    }
  }
}, "extractor");
var sorter = /* @__PURE__ */ index.__name((graph, nodes) => {
  if (nodes.length === 0) {
    return [];
  }
  let result = Object.assign([], nodes);
  nodes.forEach((node) => {
    const children = graph.children(node);
    const sorted = sorter(graph, children);
    result = [...result, ...sorted];
  });
  return result;
}, "sorter");
var sortNodesByHierarchy = /* @__PURE__ */ index.__name((graph) => sorter(graph, graph.children()), "sortNodesByHierarchy");

// src/rendering-util/layout-algorithms/dagre/index.js
var recursiveRender = /* @__PURE__ */ index.__name(async (_elem, graph, diagramType, id, parentCluster, siteConfig) => {
  index.log.warn("Graph in recursive render:XAX", write(graph), parentCluster);
  const dir = graph.graph().rankdir;
  index.log.trace("Dir in recursive render - dir:", dir);
  const elem = _elem.insert("g").attr("class", "root");
  if (!graph.nodes()) {
    index.log.info("No nodes found for", graph);
  } else {
    index.log.info("Recursive render XXX", graph.nodes());
  }
  if (graph.edges().length > 0) {
    index.log.info("Recursive edges", graph.edge(graph.edges()[0]));
  }
  const clusters = elem.insert("g").attr("class", "clusters");
  const edgePaths = elem.insert("g").attr("class", "edgePaths");
  const edgeLabels = elem.insert("g").attr("class", "edgeLabels");
  const nodes = elem.insert("g").attr("class", "nodes");
  await Promise.all(
    graph.nodes().map(async function(v) {
      const node = graph.node(v);
      if (parentCluster !== void 0) {
        const data = JSON.parse(JSON.stringify(parentCluster.clusterData));
        index.log.trace(
          "Setting data for parent cluster XXX\n Node.id = ",
          v,
          "\n data=",
          data.height,
          "\nParent cluster",
          parentCluster.height
        );
        graph.setNode(parentCluster.id, data);
        if (!graph.parent(v)) {
          index.log.trace("Setting parent", v, parentCluster.id);
          graph.setParent(v, parentCluster.id, data);
        }
      }
      index.log.info("(Insert) Node XXX" + v + ": " + JSON.stringify(graph.node(v)));
      if (node?.clusterNode) {
        index.log.info("Cluster identified XBX", v, node.width, graph.node(v));
        const { ranksep, nodesep } = graph.graph();
        node.graph.setGraph({
          ...node.graph.graph(),
          ranksep: ranksep + 25,
          nodesep
        });
        const o = await recursiveRender(
          nodes,
          node.graph,
          diagramType,
          id,
          graph.node(v),
          siteConfig
        );
        const newEl = o.elem;
        index.updateNodeBounds(node, newEl);
        node.diff = o.diff || 0;
        index.log.info(
          "New compound node after recursive render XAX",
          v,
          "width",
          // node,
          node.width,
          "height",
          node.height
          // node.x,
          // node.y
        );
        index.setNodeElem(newEl, node);
      } else {
        if (graph.children(v).length > 0) {
          index.log.trace(
            "Cluster - the non recursive path XBX",
            v,
            node.id,
            node,
            node.width,
            "Graph:",
            graph
          );
          index.log.trace(findNonClusterChild(node.id, graph));
          clusterDb.set(node.id, { id: findNonClusterChild(node.id, graph), node });
        } else {
          index.log.trace("Node - the non recursive path XAX", v, nodes, graph.node(v), dir);
          await index.insertNode(nodes, graph.node(v), { config: siteConfig, dir });
        }
      }
    })
  );
  const processEdges = /* @__PURE__ */ index.__name(async () => {
    const edgePromises = graph.edges().map(async function(e) {
      const edge = graph.edge(e.v, e.w, e.name);
      index.log.info("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(e));
      index.log.info("Edge " + e.v + " -> " + e.w + ": ", e, " ", JSON.stringify(graph.edge(e)));
      index.log.info(
        "Fix",
        clusterDb,
        "ids:",
        e.v,
        e.w,
        "Translating: ",
        clusterDb.get(e.v),
        clusterDb.get(e.w)
      );
      await index.insertEdgeLabel(edgeLabels, edge);
    });
    await Promise.all(edgePromises);
  }, "processEdges");
  await processEdges();
  index.log.info("Graph before layout:", JSON.stringify(write(graph)));
  index.log.info("############################################# XXX");
  index.log.info("###                Layout                 ### XXX");
  index.log.info("############################################# XXX");
  layout.layout(graph);
  index.log.info("Graph after layout:", JSON.stringify(write(graph)));
  let diff = 0;
  let { subGraphTitleTotalMargin } = index.getSubGraphTitleMargins(siteConfig);
  await Promise.all(
    sortNodesByHierarchy(graph).map(async function(v) {
      const node = graph.node(v);
      index.log.info(
        "Position XBX => " + v + ": (" + node.x,
        "," + node.y,
        ") width: ",
        node.width,
        " height: ",
        node.height
      );
      if (node?.clusterNode) {
        node.y += subGraphTitleTotalMargin;
        index.log.info(
          "A tainted cluster node XBX1",
          v,
          node.id,
          node.width,
          node.height,
          node.x,
          node.y,
          graph.parent(v)
        );
        clusterDb.get(node.id).node = node;
        index.positionNode(node);
      } else {
        if (graph.children(v).length > 0) {
          index.log.info(
            "A pure cluster node XBX1",
            v,
            node.id,
            node.x,
            node.y,
            node.width,
            node.height,
            graph.parent(v)
          );
          node.height += subGraphTitleTotalMargin;
          graph.node(node.parentId);
          const halfPadding = node?.padding / 2 || 0;
          const labelHeight = node?.labelBBox?.height || 0;
          const offsetY = labelHeight - halfPadding || 0;
          index.log.debug("OffsetY", offsetY, "labelHeight", labelHeight, "halfPadding", halfPadding);
          await index.insertCluster(clusters, node);
          clusterDb.get(node.id).node = node;
        } else {
          const parent = graph.node(node.parentId);
          node.y += subGraphTitleTotalMargin / 2;
          index.log.info(
            "A regular node XBX1 - using the padding",
            node.id,
            "parent",
            node.parentId,
            node.width,
            node.height,
            node.x,
            node.y,
            "offsetY",
            node.offsetY,
            "parent",
            parent,
            parent?.offsetY,
            node
          );
          index.positionNode(node);
        }
      }
    })
  );
  graph.edges().forEach(function(e) {
    const edge = graph.edge(e);
    index.log.info("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(edge), edge);
    edge.points.forEach((point) => point.y += subGraphTitleTotalMargin / 2);
    const startNode = graph.node(e.v);
    var endNode = graph.node(e.w);
    const paths = index.insertEdge(edgePaths, edge, clusterDb, diagramType, startNode, endNode, id);
    index.positionEdgeLabel(edge, paths);
  });
  graph.nodes().forEach(function(v) {
    const n = graph.node(v);
    index.log.info(v, n.type, n.diff);
    if (n.isGroup) {
      diff = n.diff;
    }
  });
  index.log.warn("Returning from recursive render XAX", elem, diff);
  return { elem, diff };
}, "recursiveRender");
var render = /* @__PURE__ */ index.__name(async (data4Layout, svg) => {
  const graph$1 = new graph.Graph({
    multigraph: true,
    compound: true
  }).setGraph({
    rankdir: data4Layout.direction,
    nodesep: data4Layout.config?.nodeSpacing || data4Layout.config?.flowchart?.nodeSpacing || data4Layout.nodeSpacing,
    ranksep: data4Layout.config?.rankSpacing || data4Layout.config?.flowchart?.rankSpacing || data4Layout.rankSpacing,
    marginx: 8,
    marginy: 8
  }).setDefaultEdgeLabel(function() {
    return {};
  });
  const element = svg.select("g");
  index.markers_default(element, data4Layout.markers, data4Layout.type, data4Layout.diagramId);
  index.clear2();
  index.clear$1();
  index.clear$2();
  clear4();
  data4Layout.nodes.forEach((node) => {
    graph$1.setNode(node.id, { ...node });
    if (node.parentId) {
      graph$1.setParent(node.id, node.parentId);
    }
  });
  index.log.debug("Edges:", data4Layout.edges);
  data4Layout.edges.forEach((edge) => {
    if (edge.start === edge.end) {
      const nodeId = edge.start;
      const specialId1 = nodeId + "---" + nodeId + "---1";
      const specialId2 = nodeId + "---" + nodeId + "---2";
      const node = graph$1.node(nodeId);
      graph$1.setNode(specialId1, {
        domId: specialId1,
        id: specialId1,
        parentId: node.parentId,
        labelStyle: "",
        label: "",
        padding: 0,
        shape: "labelRect",
        // shape: 'rect',
        style: "",
        width: 10,
        height: 10
      });
      graph$1.setParent(specialId1, node.parentId);
      graph$1.setNode(specialId2, {
        domId: specialId2,
        id: specialId2,
        parentId: node.parentId,
        labelStyle: "",
        padding: 0,
        // shape: 'rect',
        shape: "labelRect",
        label: "",
        style: "",
        width: 10,
        height: 10
      });
      graph$1.setParent(specialId2, node.parentId);
      const edge1 = structuredClone(edge);
      const edgeMid = structuredClone(edge);
      const edge2 = structuredClone(edge);
      edge1.label = "";
      edge1.arrowTypeEnd = "none";
      edge1.endLabelLeft = "";
      edge1.endLabelRight = "";
      edge1.startLabelLeft = "";
      edge1.id = nodeId + "-cyclic-special-1";
      edgeMid.startLabelRight = "";
      edgeMid.startLabelLeft = "";
      edgeMid.endLabelLeft = "";
      edgeMid.endLabelRight = "";
      edgeMid.arrowTypeStart = "none";
      edgeMid.arrowTypeEnd = "none";
      edgeMid.id = nodeId + "-cyclic-special-mid";
      edge2.label = "";
      edge2.startLabelRight = "";
      edge2.startLabelLeft = "";
      edge2.arrowTypeStart = "none";
      if (node.isGroup) {
        edge1.fromCluster = nodeId;
        edge2.toCluster = nodeId;
      }
      edge2.id = nodeId + "-cyclic-special-2";
      edge2.arrowTypeStart = "none";
      graph$1.setEdge(nodeId, specialId1, edge1, nodeId + "-cyclic-special-0");
      graph$1.setEdge(specialId1, specialId2, edgeMid, nodeId + "-cyclic-special-1");
      graph$1.setEdge(specialId2, nodeId, edge2, nodeId + "-cyc<lic-special-2");
    } else {
      graph$1.setEdge(edge.start, edge.end, { ...edge }, edge.id);
    }
  });
  index.log.warn("Graph at first:", JSON.stringify(write(graph$1)));
  adjustClustersAndEdges(graph$1);
  index.log.warn("Graph after XAX:", JSON.stringify(write(graph$1)));
  const siteConfig = index.getConfig2();
  await recursiveRender(
    element,
    graph$1,
    data4Layout.type,
    data4Layout.diagramId,
    void 0,
    siteConfig
  );
}, "render");

exports.render = render;
