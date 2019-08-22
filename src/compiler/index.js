const fs = require("fs");
const path = require("path");
const babelCore = require("@babel/core");

const ir = require("../ir");
const utils = require("../utils");
const parse = require("../parser");
const traverse = require("./traverser");

const file = (name, path, source, program) => {
  const _name = name;
  const _source = source;
  const _program = program;

  const _requires = {};
  const _definitions = {};

  return {
    name() {
      return _name;
    },
    source() {
      return _source;
    },
    program() {
      return _program;
    },
    requires() {
      return _requires;
    },
    definitions() {
      return _definitions;
    },
    addRequired(name, as, file) {
      _requires[as || name] = {
        name,
        file
      };
    },
    addDefinition() {}
  };
};

module.exports = (filePath, source, config) => {
  try {
    const program = parse(source);
    const name = utils.pathToName(filePath, config, path.sep);
    const intermediate = ir(filePath, source, program);
    const compiled = traverse(intermediate);
    const generated = babelCore.transformFromAst(compiled, null, {
      plugins: ["add-module-exports"],
      presets: ["@babel/preset-env"]
    });

    fs.writeFileSync(
      "/Users/bruno.barreira/git-repo/cris/compiled.js",
      generated.code
    );

    return file(name, filePath, source, intermediate);
  } catch (e) {
    console.log(e);
  }
};
