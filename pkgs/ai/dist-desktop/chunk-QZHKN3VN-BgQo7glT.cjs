'use strict';

const index = require('./index-B7qNa0wN.cjs');

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
//# sourceMappingURL=chunk-QZHKN3VN-BgQo7glT.cjs.map
