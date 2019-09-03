import * as R from "ramda";

import traverse from "./traverser";
import validator from "./validator";
import { Context } from "./context";
import * as coreOps from "./core_ops";

export class File {
  _ctx: any;
  _path: string;
  _program: any;
  _source: string;

  constructor(ctx, path: string, source: string, program) {
    this._ctx = ctx;
    this._path = path;
    this._source = source;
    this._program = program;
  }

  path(): string {
    return this._path;
  }

  name(): string {
    return this._ctx.name();
  }

  deps() {
    return this._ctx.deps();
  }

  program() {
    return this._program;
  }

  definitions() {
    return this._ctx.definitions();
  }
}

export default (filename, source, ast) => {
  const ctx = new Context();
  const vldt = validator(filename, source);
  const core = coreOps.init(vldt);

  const irAst = traverse(ast, vldt, core, ctx);

  return new File(ctx, filename, source, irAst);
};
