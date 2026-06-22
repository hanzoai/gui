'use strict';

const index = require('./index-BSSKeTjn.cjs');

// src/diagrams/common/populateCommonDb.ts
function populateCommonDb(ast, db) {
  if (ast.accDescr) {
    db.setAccDescription?.(ast.accDescr);
  }
  if (ast.accTitle) {
    db.setAccTitle?.(ast.accTitle);
  }
  if (ast.title) {
    db.setDiagramTitle?.(ast.title);
  }
}
index.__name(populateCommonDb, "populateCommonDb");

exports.populateCommonDb = populateCommonDb;
