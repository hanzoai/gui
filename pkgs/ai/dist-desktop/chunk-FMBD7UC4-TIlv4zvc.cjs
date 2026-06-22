'use strict';

const index = require('./index-BqtStGzd.cjs');

// src/diagrams/globalStyles.ts
var getIconStyles = /* @__PURE__ */ index.__name(() => `
  /* Font Awesome icon styling - consolidated */
  .label-icon {
    display: inline-block;
    height: 1em;
    overflow: visible;
    vertical-align: -0.125em;
  }
  
  .node .label-icon path {
    fill: currentColor;
    stroke: revert;
    stroke-width: revert;
  }
`, "getIconStyles");

exports.getIconStyles = getIconStyles;
