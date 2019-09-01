const R = require("ramda");

const context = require("./context");
const coreOps = require("./core_ops");
const traverse = require("./traverser");
const validator = require("./validator");

const file = (ctx, path, source, program) => {
  const _name = ctx.name();
  const _deps = ctx.deps();

  const _path = path;
  const _source = source;
  const _program = program;
  const _definitions = ctx.definitions();

  return {
    path() {
      return _path;
    },
    deps() {
      return _deps;
    },
    name() {
      return _name;
    },
    source() {
      return _source;
    },
    program() {
      return _program;
    },
    definitions() {
      return _definitions;
    }
  };
};

module.exports = (filename, source, ast) => {
  const ctx = context();
  const vldt = validator(filename, source);
  const core = coreOps(vldt);

  const irAst = traverse(ast, vldt, core, ctx);

  return file(ctx, filename, source, irAst);
};
