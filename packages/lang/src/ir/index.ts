import * as R from "ramda";

import traverse from "./traverser";
import validator from "./validator";
import * as context from "./context";
import * as coreOps from "./core_ops";

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

export default (filename, source, ast) => {
  const ctx = context();
  const vldt = validator(filename, source);
  const core = coreOps(vldt);

  const irAst = traverse(ast, vldt, core, ctx);

  return file(ctx, filename, source, irAst);
};
