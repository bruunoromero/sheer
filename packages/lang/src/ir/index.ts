import * as moment from "moment";
import * as utils from "../utils";
import * as project from "../project";
import { ExFile } from "../expander";
import { IrContext } from "./contex";
import { ExType } from "../expander/types";
import { ExNamespaceNode } from "../expander/ast/namespace";
import { IrTraverser } from "./traverser";
import { Validator } from "../validator";
import { IrNode } from "./ast/node";
import { IrRequireNode } from "./ast/require";
import { IrSymbolNode, IrStringNode } from "./ast/primitives";
import { IrType } from "./types";
import { IrRequireTraverser } from "./traverser/require";

export class IrMeta {
  constructor(
    public readonly createdAt: string,
    public readonly ns: string,
    public readonly path: string,
    public readonly exports: string[],
    public readonly requires: string[]
  ) {}
}

export class IrFile {
  constructor(
    public readonly ns: string | null,
    public readonly path: string,
    public readonly source: string,
    public readonly program: IrNode[],
    public readonly ctx: IrContext
  ) {}

  dependencies() {
    return this.ctx.collectDependencies();
  }

  requires(): [string, IrRequireNode][] {
    return this.dependencies().filter(
      ([_, el]) => el.type === IrType.REQUIRE
    ) as [string, IrRequireNode][];
  }

  privates() {
    return this.ctx.collectPrivates();
  }

  exports() {
    return this.ctx.collectExports().map(([name]) => name);
  }

  meta() {
    return new IrMeta(
      moment().format(),
      this.ns,
      this.path,
      this.exports(),
      this.requires().map(([name]) => name)
    );
  }
}

export const transform = (file: ExFile, config: project.SheerConfig) => {
  const ns: ExNamespaceNode | null =
    file.program[0].type === ExType.NS
      ? (file.program[0] as ExNamespaceNode)
      : null;

  const ctx = new IrContext(null, ns);
  const program = ns ? file.program.slice(1) : file.program;
  const validator = new Validator(file.source, file.path);

  const irProgram = program.map(node =>
    new IrTraverser(validator).traverseAndValidate(ctx, node)
  );

  const errors = validator.errors;

  if (errors) {
    throw errors;
  }

  const requireCore = new IrRequireNode(
    irProgram[0].loc,
    IrSymbolNode.fromIrNode(irProgram[0], "sheer.core"),
    null,
    IrStringNode.fromIrNode(irProgram[0], "all")
  );

  const programWithCore = [requireCore].concat(irProgram as any[]);

  const nsName = ns ? ns.name.value : utils.pathToName(file.path, config);

  ctx.addLocalRequirement("sheer.core", requireCore);
  return new IrFile(nsName, file.path, file.source, programWithCore, ctx);
};
