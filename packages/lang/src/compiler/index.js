const fs = require("fs");
const path = require("path");
const babelCore = require("@babel/core");

const ir = require("../ir");
const utils = require("../utils");
const parse = require("../parser");
const preset = require("./preset");
const traverse = require("./traverser");

module.exports = (file, config) => {
  const generated = babelCore.transformFromAst(
    traverse(file.program(), config),
    null,
    {
      presets: [preset]
    }
  );

  return { file, compiled: generated };
};
