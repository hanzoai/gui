'use strict';

const index = require('./index-BTVYz8LN.cjs');

// src/utils/imperativeState.ts
var ImperativeState = class {
  /**
   * @param init - Function that creates the default state.
   */
  constructor(init) {
    this.init = init;
    this.records = this.init();
  }
  static {
    index.__name(this, "ImperativeState");
  }
  reset() {
    this.records = this.init();
  }
};

exports.ImperativeState = ImperativeState;
